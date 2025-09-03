document.addEventListener("DOMContentLoaded", () => {
    const btnConfirma = document.getElementById("btnConfirma");
    const produtosContainer = document.getElementById("produtosContainer");
    const carrinho = document.getElementById("carrinho");
    const subtotalEl = document.getElementById("subtotal");

    let listaProduto = [
        { id: 1, nome: "Produto 1", img: "https://images.tcdn.com.br/img/img_prod/829162/produto_teste_nao_compre_81_1_2d7f0b8fa031db8286665740dd8de217.jpg", estoque: 10, adicionada: 0, preco: 20 },
        { id: 2, nome: "Produto 2", img: "https://images.tcdn.com.br/img/img_prod/829162/produto_teste_nao_compre_81_1_2d7f0b8fa031db8286665740dd8de217.jpg", estoque: 5, adicionada: 0, preco: 35 },
        { id: 3, nome: "Produto 3", img: "https://images.tcdn.com.br/img/img_prod/829162/produto_teste_nao_compre_81_1_2d7f0b8fa031db8286665740dd8de217.jpg", estoque: 8, adicionada: 0, preco: 15 }
    ];

    function renderizarProdutos() {
        produtosContainer.innerHTML = "";
        listaProduto.forEach(produto => {
            produtosContainer.innerHTML += `
              <div class="bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center">
                <img src="${produto.img}" alt="${produto.nome}" class="w-32 h-32 object-cover rounded-lg">
                <h2 class="text-lg font-bold mt-2">${produto.nome}</h2>
                <p class="text-sm text-gray-500">Estoque: <span id="estoqueProduto${produto.id}">${produto.estoque}</span></p>
                <p class="text-sm text-gray-700 font-semibold">R$ ${produto.preco.toFixed(2)}</p>

                <div class="flex items-center gap-3 mt-3">
                  <button data-id="${produto.id}" class="btn-diminuir bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">-</button>
                  <span id="qtdProduto${produto.id}" class="text-lg font-semibold">0</span>
                  <button data-id="${produto.id}" class="btn-aumentar bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">+</button>
                </div>
              </div>
            `;
        });

        document.querySelectorAll(".btn-aumentar").forEach(btn => {
            btn.addEventListener("click", () => aumentarQuantidade(Number(btn.dataset.id)));
        });
        document.querySelectorAll(".btn-diminuir").forEach(btn => {
            btn.addEventListener("click", () => diminuirQuantidade(Number(btn.dataset.id)));
        });
    }

    function atualizarTela() {
        listaProduto.forEach(produto => {
            const qtdEl = document.getElementById("qtdProduto" + produto.id);
            if (qtdEl) qtdEl.textContent = produto.adicionada;
        });

        carrinho.innerHTML = "";
        const produtosNoCarrinho = listaProduto.filter(p => p.adicionada > 0);

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

        const subtotal = produtosNoCarrinho.reduce((acc, p) => acc + p.adicionada * p.preco, 0);
        subtotalEl.textContent = subtotal.toFixed(2);
    }

    function aumentarQuantidade(idProduto) {
        const produto = listaProduto.find(p => p.id === idProduto);
        if (produto && produto.adicionada < produto.estoque) {
            produto.adicionada++;
        } else {
            alert("Estoque insuficiente!");
        }
        atualizarTela();
    }

    function diminuirQuantidade(idProduto) {
        const produto = listaProduto.find(p => p.id === idProduto);
        if (produto && produto.adicionada > 0) {
            produto.adicionada--;
        }
        atualizarTela();
    }

    btnConfirma.addEventListener("click", () => {
        const produtosComprados = listaProduto.filter(p => p.adicionada > 0);

        if (produtosComprados.length === 0) {
            alert("Nenhum produto no carrinho!");
            return;
        }

        const resumoCompra = produtosComprados.map(p => ({
            id: p.id,
            nome: p.nome,
            quantidadeComprada: p.adicionada,
            precoUnitario: p.preco,
            total: p.adicionada * p.preco
        }));

        produtosComprados.forEach(produto => {
            produto.estoque -= produto.adicionada;
            produto.adicionada = 0;
        });

        console.log("Resumo da compra:");
        console.table(resumoCompra);

        console.log("Lista de produtos atualizada:");
        console.table(listaProduto);

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Resumo da Compra", 20, 20);

        let y = 30;
        resumoCompra.forEach(prod => {
            doc.setFontSize(12);
            doc.text(`${prod.nome} | Qtde: ${prod.quantidadeComprada} | R$ ${prod.precoUnitario.toFixed(2)} | Total: R$ ${prod.total.toFixed(2)}`, 20, y);
            y += 10;
        });

        const subtotal = resumoCompra.reduce((acc, p) => acc + p.total, 0);
        doc.setFontSize(14);
        doc.text(`Subtotal: R$ ${subtotal.toFixed(2)}`, 20, y + 10);

        doc.save("resumo_compra.pdf"); 

        alert("Compra confirmada! Estoque atualizado e PDF gerado.");

        renderizarProdutos();
        atualizarTela();
    });

    renderizarProdutos();
    atualizarTela();
});