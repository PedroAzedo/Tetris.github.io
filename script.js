const grade = document.getElementById('tetris');
const displayPontuacao = document.getElementById('pontuacao');
const largura = 10;
const altura = 20;
const celulas = Array.from({ length: largura * altura }, () => document.createElement('div'));

celulas.forEach(celula => {
  celula.classList.add('celula');
  grade.appendChild(celula);
});

const pecas = [
  { rotacoes: [[1, largura + 1, largura * 2 + 1, 2], [largura, largura + 1, largura + 2, largura * 2 + 2], [1, largura + 1, largura * 2 + 1, largura * 2], [largura, largura * 2, largura * 2 + 1, largura * 2 + 2]], cor: '#f00' },
  { rotacoes: [[0, largura, largura + 1, largura * 2 + 1], [largura + 1, largura + 2, largura * 2, largura * 2 + 1]], cor: '#0f0' },
  { rotacoes: [[1, largura, largura + 1, largura + 2], [1, largura + 1, largura + 2, largura * 2 + 1]], cor: '#00f' },
  { rotacoes: [[0, 1, largura, largura + 1]], cor: '#ff0' },
  { rotacoes: [[1, largura + 1, largura * 2 + 1, largura * 2], [largura, largura + 1, largura + 2, 2]], cor: '#f0f' },
  { rotacoes: [[0, 1, 2, 3], [1, largura + 1, largura * 2 + 1, largura * 3 + 1]], cor: '#0ff' },
  { rotacoes: [[1, largura, largura + 1, largura * 2], [0, 1, largura + 1, largura + 2]], cor: '#f80' }
];

let posicaoAtual = 4;
let rotacaoAtual = 0;
let pecaAtual = novaPeca();
let pontuacao = 0;
let tempoIntervalo = 800;
let idIntervalo = setInterval(abaixar, tempoIntervalo);

function novaPeca() {
  return pecas[Math.floor(Math.random() * pecas.length)];
}

function desenhar() {
  pecaAtual.rotacoes[rotacaoAtual].forEach(i => {
    celulas[posicaoAtual + i].style.backgroundColor = pecaAtual.cor;
    celulas[posicaoAtual + i].classList.add('preechida');
  });
}

function apagar() {
  pecaAtual.rotacoes[rotacaoAtual].forEach(i => {
    celulas[posicaoAtual + i].style.backgroundColor = '';
    celulas[posicaoAtual + i].classList.remove('preechida');
  });
}

function abaixar() {
  apagar();
  posicaoAtual += largura;
  if (colisao()) {
    posicaoAtual -= largura;
    desenhar();
    travar();
    return;
  }
  desenhar();
}

function moverEsquerda() {
  apagar();
  if (!naBorda(-1) && !colisao(-1)) posicaoAtual -= 1;
  desenhar();
}

function moverDireita() {
  apagar();
  if (!naBorda(1) && !colisao(1)) posicaoAtual += 1;
  desenhar();
}

function girar() {
  apagar();
  const proxRotacao = (rotacaoAtual + 1) % pecaAtual.rotacoes.length;
  const indicesProx = pecaAtual.rotacoes[proxRotacao].map(i => posicaoAtual + i);
  if (indicesProx.every(i => i >= 0 && i < largura * altura && !celulas[i].classList.contains('ocupada') && i % largura >= 0 && i % largura < largura)) {
    rotacaoAtual = proxRotacao;
  }
  desenhar();
}

function naBorda(direcao) {
  return pecaAtual.rotacoes[rotacaoAtual].some(i => (posicaoAtual + i) % largura === (direcao === -1 ? 0 : largura - 1));
}

function colisao(offset = largura) {
  return pecaAtual.rotacoes[rotacaoAtual].some(i => {
    const proxima = posicaoAtual + i + offset;
    return proxima >= largura * altura || (proxima >= 0 && celulas[proxima].classList.contains('ocupada'));
  });
}

function travar() {
  pecaAtual.rotacoes[rotacaoAtual].forEach(i => celulas[posicaoAtual + i].classList.add('ocupada'));
  limparLinhas();
  pecaAtual = novaPeca();
  rotacaoAtual = 0;
  posicaoAtual = 4;
  if (colisao(0)) {
    clearInterval(idIntervalo);
    alert('Fim de Jogo');
  }
}

function limparLinhas() {
  for (let linha = 0; linha < altura; linha++) {
    const inicio = linha * largura;
    const linhaCelulas = celulas.slice(inicio, inicio + largura);
    if (linhaCelulas.every(cel => cel.classList.contains('ocupada'))) {
      linhaCelulas.forEach(cel => {
        cel.classList.remove('ocupada', 'preechida');
        cel.style.backgroundColor = '';
      });
      const removidas = celulas.splice(inicio, largura);
      removidas.forEach(c => celulas.unshift(c));
      celulas.forEach(c => grade.appendChild(c));
      pontuacao += 10;
      displayPontuacao.textContent = `Pontos: ${pontuacao}`;
      if (tempoIntervalo > 100) {
        tempoIntervalo -= 20;
        clearInterval(idIntervalo);
        idIntervalo = setInterval(abaixar, tempoIntervalo);
      }
    }
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') moverEsquerda();
  if (e.key === 'ArrowRight') moverDireita();
  if (e.key === 'ArrowDown') abaixar();
  if (e.key === 'ArrowUp') girar();
});

desenhar();
