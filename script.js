let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let produtoSelecionado = null;
let precoSelecionado = 0;
let tamanhoSelecionado = null;

// Abre modal com produto e preço
function abrirModalTamanho(nome, preco) {
  produtoSelecionado = nome;
  precoSelecionado = preco;
  tamanhoSelecionado = null; // limpa seleção anterior

  const modal = document.getElementById('modal-tamanho');
  if (modal) {
    modal.style.display = 'flex';

    const modalTitulo = document.getElementById('modal-produto-nome');
    if (modalTitulo) modalTitulo.innerText = `Selecionar Tamanho - ${nome}`;

    // Limpa cores dos botões
    const botoes = document.querySelectorAll('.modal-conteudo .tamanhos button');
    botoes.forEach(btn => btn.classList.remove('selecionado'));
  }
}

// Fecha modal
function fecharModalTamanho() {
  const modal = document.getElementById('modal-tamanho');
  if (modal) modal.style.display = 'none';
}

// Seleciona tamanho
function selecionarTamanho(tamanho) {
  tamanhoSelecionado = tamanho;

  const botoes = document.querySelectorAll('.modal-conteudo .tamanhos button');
  botoes.forEach(btn => btn.classList.remove('selecionado'));

  const btnSelecionado = document.querySelector(`.modal-conteudo .tamanhos button[data-tamanho="${tamanho}"]`);
  if (btnSelecionado) btnSelecionado.classList.add('selecionado');
}

// Confirma tamanho e adiciona ao carrinho
function confirmarTamanho() {
  if (!tamanhoSelecionado) {
    alert('Por favor, selecione um tamanho!');
    return;
  }

  const itemExistente = carrinho.find(item => item.nome === produtoSelecionado && item.tamanho === tamanhoSelecionado);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ nome: produtoSelecionado, preco: precoSelecionado, quantidade: 1, tamanho: tamanhoSelecionado });
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinhoLateral();
  alert(`${produtoSelecionado} (${tamanhoSelecionado}) adicionado ao carrinho.`);

  produtoSelecionado = null;
  precoSelecionado = 0;
  tamanhoSelecionado = null;

  fecharModalTamanho();
}

// Atualiza carrinho lateral
function atualizarCarrinhoLateral() {
  const container = document.getElementById('carrinho-itens');
  const totalSpan = document.getElementById('total');

  if (!container || !totalSpan) return;

  container.innerHTML = '';
  let total = 0;

  if (carrinho.length === 0) {
    container.innerHTML = '<p>Seu carrinho está vazio.</p>';
  } else {
    carrinho.forEach(item => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.alignItems = 'center';
      div.style.padding = '5px 0';

      const texto = document.createElement('span');
      texto.innerText = `${item.nome} (${item.tamanho}) x${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}`;

      const botaoRemover = document.createElement('button');
      botaoRemover.innerText = 'X';
      botaoRemover.style.background = 'transparent';
      botaoRemover.style.border = 'none';
      botaoRemover.style.color = 'red';
      botaoRemover.style.cursor = 'pointer';
      botaoRemover.style.fontWeight = 'bold';
      botaoRemover.onclick = () => removerDoCarrinho(item.nome, item.tamanho);

      div.appendChild(texto);
      div.appendChild(botaoRemover);
      container.appendChild(div);

      total += item.preco * item.quantidade;
    });
  }

  totalSpan.innerText = total.toFixed(2);
}

// Funções do carrinho lateral
function abrirCarrinho() {
  atualizarCarrinhoLateral();
  document.getElementById('carrinho-lateral')?.classList.add('aberto');
}

function fecharCarrinho() {
  document.getElementById('carrinho-lateral')?.classList.remove('aberto');
}

function removerDoCarrinho(nome, tamanho) {
  carrinho = carrinho.filter(item => !(item.nome === nome && item.tamanho === tamanho));
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinhoLateral();
}

// Finalizar pedido via WhatsApp
function finalizarWhatsApp() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let mensagem = "*Olá! Gostaria de finalizar o seguinte pedido:*\n\n";
  let total = 0;

  carrinho.forEach(item => {
    mensagem += `- ${item.nome} (${item.tamanho}) x${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    total += item.preco * item.quantidade;
  });

  mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

  const numero = "5599999999999";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');

  carrinho = [];
  localStorage.removeItem('carrinho');
  fecharCarrinho();
}
