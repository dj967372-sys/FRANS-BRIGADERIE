/* =====================================
   PRI DA FRAN'S BRIGADERIE
   JAVASCRIPT PRINCIPAL
===================================== */

/* CONFIGURAÇÃO DO WHATSAPP */
const numeroWhatsApp = "557991922183";

/* CARRINHO */
let carrinho = [];

/* FORMATAÇÃO DE PREÇO */
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

/* =====================================
   ADICIONAR PRODUTOS
===================================== */
function adicionarCarrinho(id, nome, preco) {
    const produtoExistente = carrinho.find(produto => produto.id === id);

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({
            id: id,
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    atualizarCarrinho();
    alert(nome + " foi adicionado ao carrinho!");
}

/* =====================================
   ATUALIZAR CARRINHO
===================================== */
function atualizarCarrinho() {
    const contador = document.getElementById("contador-carrinho");
    const itens = document.getElementById("itens-carrinho");
    const totalElemento = document.getElementById("valor-total");

    let quantidadeTotal = 0;
    let valorTotal = 0;

    itens.innerHTML = "";

    carrinho.forEach((produto, index) => {
        quantidadeTotal += produto.quantidade;
        const subtotal = produto.preco * produto.quantidade;
        valorTotal += subtotal;

        const item = document.createElement("div");
        item.className = "item-carrinho";
        item.innerHTML = `
            <div class="informacoes-produto">
                <h3>${produto.nome}</h3>
                <p>${formatarPreco(produto.preco)}</p>
                <strong>Subtotal: ${formatarPreco(subtotal)}</strong>
            </div>

            <div class="controle-quantidade">
                <button onclick="diminuirQuantidade(${index})">-</button>
                <span>${produto.quantidade}</span>
                <button onclick="aumentarQuantidade(${index})">+</button>
                <button class="remover" onclick="removerProduto(${index})">🗑️</button>
            </div>
        `;

        itens.appendChild(item);
    });

    if (carrinho.length === 0) {
        itens.innerHTML = `<p>Seu carrinho está vazio. ❤️</p>`;
    }

    contador.textContent = quantidadeTotal;
    totalElemento.textContent = formatarPreco(valorTotal);
}

/* =====================================
   AUMENTAR / DIMINUIR / REMOVER
===================================== */
function aumentarQuantidade(index) {
    carrinho[index].quantidade++;
    atualizarCarrinho();
}

function diminuirQuantidade(index) {
    carrinho[index].quantidade--;
    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }
    atualizarCarrinho();
}

function removerProduto(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

/* =====================================
   ABRIR E FECHAR CARRINHO
===================================== */
function abrirCarrinho() {
    const modal = document.getElementById("modal-carrinho");
    modal.style.display = "flex";
    atualizarCarrinho();
}

function fecharCarrinho() {
    const modal = document.getElementById("modal-carrinho");
    modal.style.display = "none";
}

document.getElementById("modal-carrinho").addEventListener("click", function(event) {
    if (event.target === this) {
        fecharCarrinho();
    }
});

/* =====================================
   FILTRAR PRODUTOS
===================================== */
function filtrarProdutos(categoria, botao) {
    const produtos = document.querySelectorAll(".produto");
    const botoes = document.querySelectorAll(".categoria");

    botoes.forEach(elemento => elemento.classList.remove("ativa"));
    botao.classList.add("ativa");

    produtos.forEach(produto => {
        const categoriaProduto = produto.dataset.categoria;
        if (categoria === "Todos" || categoriaProduto === categoria) {
            produto.classList.remove("escondido");
        } else {
            produto.classList.add("escondido");
        }
    });
}

/* =====================================
   MENU PARA CELULAR
===================================== */
function abrirMenu() {
    const menu = document.querySelector(".menu");
    menu.classList.toggle("aberto");
}

document.querySelectorAll(".menu a").forEach(link => {
    link.addEventListener("click", function() {
        document.querySelector(".menu").classList.remove("aberto");
    });
});

/* =====================================
   FINALIZAR PEDIDO (COM SABORES)
===================================== */
function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const nomeCliente = document.getElementById("nome-cliente").value.trim();
    const observacoes = document.getElementById("observacoes-pedido").value.trim();

    if (nomeCliente === "") {
        alert("Por favor, informe seu nome!");
        return;
    }

    let valorTotal = 0;
    let mensagem = "";

    mensagem += "Olá! Quero fazer um pedido na Pri da Fran's Brigaderie. ❤️\n\n";
    mensagem += "👤 Cliente: " + nomeCliente + "\n\n";
    mensagem += "🍫 MEU PEDIDO:\n\n";

    carrinho.forEach(produto => {
        const subtotal = produto.preco * produto.quantidade;
        valorTotal += subtotal;

        mensagem += produto.quantidade + "x " + produto.nome + "\n";
        mensagem += "Valor: " + formatarPreco(subtotal) + "\n\n";
    });

    if (observacoes !== "") {
        mensagem += "📝 Sabores / Observações:\n" + observacoes + "\n\n";
    }

    mensagem += "--------------------------\n";
    mensagem += "💰 TOTAL: " + formatarPreco(valorTotal) + "\n\n";
    mensagem += "Gostaria de confirmar meu pedido e saber as opções de entrega, retirada e pagamento. Obrigado(a)! ❤️";

    const mensagemCodificada = encodeURIComponent(mensagem);
    const linkWhatsApp = "https://wa.me/" + numeroWhatsApp + "?text=" + mensagemCodificada;

    window.open(linkWhatsApp, "_blank");
}

/* =====================================
   CONFIGURAÇÃO E INTEGRAÇÃO SUPABASE
===================================== */
const SUPABASE_URL = 'https://zayyoomqxamctnekdxcz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheXlvb21xeGFtY3RuZWtkeGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5OTA4MzgsImV4cCI6MjEwOTU2NjgzOH0.pykO6wcCVgarjnSfdvgfJnpBBEXK8S1IcSllMb4wops';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Carregar avaliações
async function carregarAvaliacoes() {
    const container = document.querySelector('.avaliacoes-container');
    if (!container) return;

    const { data, error } = await supabaseClient
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar avaliações:', error);
        return;
    }

    container.innerHTML = '';

    if (!data || data.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888;">Ainda não há avaliações. Sê o primeiro a avaliar! ❤️</p>';
        return;
    }

    data.forEach(rev => {
        const estrelas = '★'.repeat(rev.nota) + '☆'.repeat(5 - rev.nota);
        const card = document.createElement('div');
        card.className = 'card-avaliacao';
        card.style.cssText = "background: white; padding: 20px; border-radius: 15px; margin: 15px auto; max-width: 500px; border: 1px solid #f1dce6;";
        
        card.innerHTML = `
            <h4 style="margin: 0 0 5px 0; color: #d63384;">${rev.nome_cliente}</h4>
            <div style="color: #f39c12; margin-bottom: 8px;">${estrelas}</div>
            <p style="margin: 0; color: #555;">${rev.comentario}</p>
        `;
        container.appendChild(card);
    });
}

// Enviar nova avaliação
async function enviarNovaAvaliacao() {
    const nome = document.getElementById('nome-avaliador').value.trim();
    const nota = parseInt(document.getElementById('nota-avaliador').value);
    const comentario = document.getElementById('comentario-avaliador').value.trim();

    if (!nome || !comentario) {
        alert('Por favor, preenche o teu nome e o comentário!');
        return;
    }

    const { error } = await supabaseClient
        .from('reviews')
        .insert([
            {
                item_id: 'geral',
                nome_cliente: nome,
                nota: nota,
                comentario: comentario
            }
        ]);

    if (error) {
        console.error('Erro ao enviar:', error);
        alert('Erro ao enviar avaliação. Tenta novamente.');
    } else {
        alert('Avaliação enviada com sucesso! ❤️');
        document.getElementById('nome-avaliador').value = '';
        document.getElementById('comentario-avaliador').value = '';
        carregarAvaliacoes();
    }
}

// CARREGAR SABORES NA TELA DO CLIENTE
async function carregarSaboresNaTela() {
    const container = document.getElementById('container-sabores');
    if (!container) return;

    const { data: sabores, error } = await supabaseClient
        .from('flavors')
        .select('*')
        .order('destaque', { ascending: false });

    if (error) {
        console.error('Erro ao carregar sabores:', error);
        return;
    }

    container.innerHTML = '';

    if (!sabores || sabores.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1/-1;">Nenhum sabor cadastrado no momento.</p>';
        return;
    }

    sabores.forEach(sabor => {
        const isDisponivel = sabor.status === 'disponivel';
        const card = document.createElement('div');
        card.style.cssText = `
            background: white; 
            padding: 20px; 
            border-radius: 15px; 
            border: 1px solid #f1dce6; 
            position: relative;
            opacity: ${isDisponivel ? '1' : '0.6'};
            box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        `;

        let selo = '';
        if (sabor.destaque) {
            selo = `<span style="position: absolute; top: 10px; right: 10px; background: #ffc107; color: #333; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 10px;">⭐ Mais Vendido</span>`;
        }

        const statusTag = isDisponivel 
            ? `<span style="color: #28a745; font-size: 12px; font-weight: bold;">● Disponível</span>`
            : `<span style="color: #dc3545; font-size: 12px; font-weight: bold;">✕ Esgotado hoje</span>`;

        card.innerHTML = `
            ${selo}
            <span style="font-size: 12px; color: #999; text-transform: uppercase;">${sabor.categoria}</span>
            <h3 style="margin: 5px 0 10px 0; color: #d63384; font-size: 1.2rem;">${sabor.nome}</h3>
            <div>${statusTag}</div>
        `;

        container.appendChild(card);
    });
}

/* =====================================
   INICIALIZAÇÃO
===================================== */
document.addEventListener('DOMContentLoaded', () => {
    atualizarCarrinho();
    carregarAvaliacoes();
    carregarSaboresNaTela();
    console.log("Pri da Fran's Brigaderie carregada com sucesso! ❤️");
});
// CARREGAR SABORES NA TELA DO CLIENTE (COM PREÇO)
async function carregarSaboresNaTela() {
    const container = document.getElementById('container-sabores');
    if (!container) return;

    const { data: sabores, error } = await supabaseClient
        .from('flavors')
        .select('*')
        .order('destaque', { ascending: false });

    if (error) {
        console.error('Erro ao carregar sabores:', error);
        return;
    }

    container.innerHTML = '';

    if (!sabores || sabores.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1/-1;">Nenhum sabor cadastrado no momento.</p>';
        return;
    }

    sabores.forEach(sabor => {
        const isDisponivel = sabor.status === 'disponivel';
        const card = document.createElement('div');
        card.style.cssText = `
            background: white; 
            padding: 20px; 
            border-radius: 15px; 
            border: 1px solid #f1dce6; 
            position: relative;
            opacity: ${isDisponivel ? '1' : '0.6'};
            box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        `;

        let selo = '';
        if (sabor.destaque) {
            selo = `<span style="position: absolute; top: 10px; right: 10px; background: #ffc107; color: #333; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 10px;">⭐ Mais Vendido</span>`;
        }

        const statusTag = isDisponivel 
            ? `<span style="color: #28a745; font-size: 12px; font-weight: bold;">● Disponível</span>`
            : `<span style="color: #dc3545; font-size: 12px; font-weight: bold;">✕ Esgotado hoje</span>`;

        const precoTexto = sabor.preco ? formatarPreco(sabor.preco) : '';

        card.innerHTML = `
            ${selo}
            <span style="font-size: 12px; color: #999; text-transform: uppercase;">${sabor.categoria}</span>
            <h3 style="margin: 5px 0 5px 0; color: #d63384; font-size: 1.2rem;">${sabor.nome}</h3>
            <p style="font-weight: bold; color: #333; margin-bottom: 8px;">${precoTexto}</p>
            <div>${statusTag}</div>
        `;

        container.appendChild(card);
    });
}
// CARREGAR SABORES NA TELA DO CLIENTE
async function carregarSaboresNaTela() {
    const container = document.getElementById('container-sabores');
    if (!container) return;

    // Busca todos os sabores sem restrição de cache
    const { data: sabores, error } = await supabaseClient
        .from('flavors')
        .select('*')
        .order('destaque', { ascending: false });

    if (error) {
        console.error('Erro ao carregar sabores:', error);
        return;
    }

    container.innerHTML = '';

    // Filtra apenas os que estão como disponíveis
    const saboresDisponiveis = sabores ? sabores.filter(s => s.status === 'disponivel') : [];

    if (saboresDisponiveis.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1/-1;">Nenhum sabor disponível no momento. ❤️</p>';
        return;
    }

    saboresDisponiveis.forEach(sabor => {
        const card = document.createElement('div');
        card.style.cssText = `
            background: white; 
            padding: 20px; 
            border-radius: 15px; 
            border: 1px solid #f1dce6; 
            position: relative;
            box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        `;

        let selo = '';
        if (sabor.destaque) {
            selo = `<span style="position: absolute; top: 10px; right: 10px; background: #ffc107; color: #333; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 10px;">⭐ Destaque</span>`;
        }

        const precoTexto = (sabor.preco !== undefined && sabor.preco !== null && sabor.preco > 0) 
            ? formatarPreco(sabor.preco) 
            : '';

        card.innerHTML = `
            ${selo}
            <span style="font-size: 12px; color: #999; text-transform: uppercase;">${sabor.categoria}</span>
            <h3 style="margin: 5px 0 5px 0; color: #d63384; font-size: 1.2rem;">${sabor.nome}</h3>
            <p style="font-weight: bold; color: #333; margin-bottom: 8px;">${precoTexto}</p>
            <div><span style="color: #28a745; font-size: 12px; font-weight: bold;">● Disponível</span></div>
        `;

        container.appendChild(card);
    });
}
    // ==========================================
// FUNÇÕES DE PAGAMENTO PIX E WHATSAPP
// ==========================================

function mostrarAreaPix() {
    // Verifica se o carrinho não está vazio (ajuste o nome da variável 'carrinho' se no seu código tiver outro nome)
    if (typeof carrinho !== 'undefined' && carrinho.length === 0) {
        alert('Seu carrinho está vazio! Adicione alguns doces primeiro. ❤️');
        return;
    }

    const areaPix = document.getElementById('area-pix');
    const totalElemento = document.getElementById('valor-pix-total');
    
    // Pega o valor total exibido no carrinho (ajuste o ID se o seu total tiver outro nome)
    const totalCarrinhoTexto = document.getElementById('cart-total')?.innerText || document.getElementById('total-carrinho')?.innerText || '';
    if (totalElemento && totalCarrinhoTexto) {
        totalElemento.innerText = totalCarrinhoTexto;
    }

    // Mostra ou esconde a área do Pix
    areaPix.style.display = areaPix.style.display === 'none' ? 'block' : 'none';
}

function copiarCodigoPix() {
    const inputPix = document.getElementById('codigo-pix-input');
    const btnCopiar = document.getElementById('btn-copiar-pix');

    inputPix.select();
    inputPix.setSelectionRange(0, 99999); // Para celulares

    navigator.clipboard.writeText(inputPix.value).then(() => {
        btnCopiar.innerText = '✅ Código Pix Copiado!';
        btnCopiar.style.background = '#28a745';
        
        setTimeout(() => {
            btnCopiar.innerText = '📋 Copiar Código Pix';
            btnCopiar.style.background = '#17a2b8';
        }, 3000);
    }).catch(() => {
        // Fallback caso o navegador bloqueie o clipboard moderno
        document.execCommand('copy');
        alert('Código Pix copiado! Abra o app do seu banco e escolha "Pix Copia e Cola".');
    });
}

function finalizarNoWhatsApp(tipoPagamento) {
    // COLOQUE AQUI O NÚMERO DE WHATSAPP DA LOJA (com 55 + DDD + Número)
    const numeroWhatsApp = "5579999999999"; 

    // Pega os itens do carrinho (ajuste conforme a estrutura do seu carrinho atual)
    if (typeof carrinho !== 'undefined' && carrinho.length === 0) {
        alert('Adicione itens ao carrinho antes de finalizar!');
        return;
    }

    let textoItens = "";
    let total = 0;

    if (typeof carrinho !== 'undefined') {
        carrinho.forEach(item => {
            const subtotal = item.preco * item.quantidade;
            total += subtotal;
            textoItens += `• ${item.quantidade}x ${item.nome} - R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
        });
    }

    const totalFormatado = `R$ ${total.toFixed(2).replace('.', ',')}`;
    let cabecalhoPagamento = "";

    if (tipoPagamento === 'pix') {
        cabecalhoPagamento = `*Forma de Pagamento:* 💠 Pix Online (Vou enviar o comprovante a seguir!)`;
    } else {
        cabecalhoPagamento = `*Forma de Pagamento:* 💬 Combinar com a vendedora (Dinheiro / Cartão / Entrega)`;
    }

    const mensagem = `Olá, Fran's Brigaderie! 🍫✨ Gostaria de fazer um pedido:\n\n` +
                     `*Resumo do Pedido:*\n` +
                     `${textoItens}\n` +
                     `*Total:* ${totalFormatado}\n` +
                     `${cabecalhoPagamento}\n\n` +
                     `Aguardo confirmação! ❤️`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}
