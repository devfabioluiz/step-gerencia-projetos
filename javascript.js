document.addEventListener("DOMContentLoaded", () => {
    const btnConfirma = document.getElementById("btnConfirma");
    const produtosContainer = document.getElementById("produtosContainer");
    const carrinho = document.getElementById("carrinho");
    const subtotalEl = document.getElementById("subtotal");

    let listaProduto = [
        { id: 1, nome: "Produto 1", img: "https://images.tcdn.com.br/img/img_prod/829162/produto_teste_nao_compre_81_1_2d7f0b8fa031db8286665740dd8de217.jpg", quantidade: 10, adicionada: 0, preco: 20 },
        { id: 2, nome: "Produto 2", img: "https://images.tcdn.com.br/img/img_prod/829162/produto_teste_nao_compre_81_1_2d7f0b8fa031db8286665740dd8de217.jpg", quantidade: 5, adicionada: 0, preco: 35 },
        { id: 3, nome: "Produto 3", img: "https://images.tcdn.com.br/img/img_prod/829162/produto_teste_nao_compre_81_1_2d7f0b8fa031db8286665740dd8de217.jpg", quantidade: 8, adicionada: 0, preco: 15 }
    ];

    function renderizarProdutos() {
        produtosContainer.innerHTML = "";
        listaProduto.forEach(produto => {
            produtosContainer.innerHTML += `
              <div class="bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center">
                <img src="${produto.img}" alt="${produto.nome}" class="w-32 h-32 object-cover rounded-lg">
                <h2 class="text-lg font-bold mt-2">${produto.nome}</h2>
                <p class="text-sm text-gray-500">Estoque: <span id="estoqueProduto${produto.id}">${produto.quantidade}</span></p>
                <p class="text-sm text-gray-700 font-semibold">R$ ${produto.preco.toFixed(2)}</p>

                <div class="flex items-center gap-3 mt-3">
                  <button onclick="diminuirQuantidade(${produto.id})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">-</button>
                  <span id="qtdProduto${produto.id}" class="text-lg font-semibold">0</span>
                  <button onclick="aumentarQuantidade(${produto.id})" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">+</button>
                </div>
              </div>
            `;
        });
    }

    function atualizarTela() {
        listaProduto.forEach(produto => {
            let qtdEl = document.getElementById("qtdProduto" + produto.id);
            if (qtdEl) qtdEl.textContent = produto.adicionada;
        });

        carrinho.innerHTML = "";
        let produtosNoCarrinho = listaProduto.filter(p => p.adicionada > 0);

        if (produtosNoCarrinho.length === 0) {
            carrinho.innerHTML = `<li class="text-gray-600">Nenhum produto adicionado</li>`;
        } else {
            produtosNoCarrinho.forEach(produto => {
                carrinho.innerHTML += `
                  <li class="flex justify-between items-center text-gray-800">
                    <span>${produto.nome} x${produto.adicionada}</span>
                    <span>R$ ${(produto.adicionada * produto.preco).toFixed(2)}</span>
                  </li>
                `;
            });
        }

        let subtotal = produtosNoCarrinho.reduce((acc, p) => acc + p.adicionada * p.preco, 0);
        subtotalEl.textContent = subtotal.toFixed(2);
    }

    function aumentarQuantidade(idProduto) {
        let produto = listaProduto.find(p => p.id === idProduto);
        if (produto && produto.adicionada < produto.quantidade) {
            produto.adicionada++;
        } else {
            alert("Estoque insuficiente!");
        }
        atualizarTela();
    }

    function diminuirQuantidade(idProduto) {
        let produto = listaProduto.find(p => p.id === idProduto);
        if (produto && produto.adicionada > 0) {
            produto.adicionada--;
        }
        atualizarTela();
    }

    btnConfirma.addEventListener("click", () => {
        console.log("Resumo da compra:");
        console.table(listaProduto.filter(p => p.adicionada > 0));
        alert("Compra confirmada! Veja o resumo no console.");
    });

    window.aumentarQuantidade = aumentarQuantidade;
    window.diminuirQuantidade = diminuirQuantidade;

    renderizarProdutos();
    atualizarTela();
});