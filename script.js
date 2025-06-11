const grid = document.getElementById('tetris');
const scoreDisplay = document.getElementById('score');
const width = 10;
const height = 20;
const cells = Array.from({ length: width * height }, () => document.createElement('div'));

cells.forEach(cell => {
  cell.classList.add('cell');
  grid.appendChild(cell);
});

const tetrominoes = [
  { rotations: [[1, width + 1, width * 2 + 1, 2], [width, width + 1, width + 2, width * 2 + 2], [1, width + 1, width * 2 + 1, width * 2], [width, width * 2, width * 2 + 1, width * 2 + 2]], color: '#f00' },
  { rotations: [[0, width, width + 1, width * 2 + 1], [width + 1, width + 2, width * 2, width * 2 + 1], [0, width, width + 1, width * 2 + 1], [width + 1, width + 2, width * 2, width * 2 + 1]], color: '#0f0' },
  { rotations: [[1, width, width + 1, width + 2], [1, width + 1, width + 2, width * 2 + 1], [width, width + 1, width + 2, width * 2 + 1], [1, width, width + 1, width * 2 + 1]], color: '#00f' },
  { rotations: [[0, 1, width, width + 1]], color: '#ff0' },
  { rotations: [[1, width + 1, width * 2 + 1, width * 2], [width, width + 1, width + 2, 2], [1, width + 1, width * 2 + 1, width * 2 + 2], [width, width + 1, width + 2, width * 2 + 2]], color: '#f0f' },
  { rotations: [[0, 1, 2, 3], [1, width + 1, width * 2 + 1, width * 3 + 1], [width * 2, width * 2 + 1, width * 2 + 2, width * 2 + 3], [2, width + 2, width * 2 + 2, width * 3 + 2]], color: '#0ff' },
  { rotations: [[1, width, width + 1, width * 2], [0, 1, width + 1, width + 2], [1, width, width + 1, width * 2], [0, 1, width + 1, width + 2]], color: '#f80' }
];

let currentPosition = 4;
let currentRotation = 0;
let currentTetromino = randomTetromino();
let score = 0;
let intervalTime = 800;
let timerId = setInterval(moveDown, intervalTime);

function randomTetromino() {
  return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
}

function draw() {
  currentTetromino.rotations[currentRotation].forEach(index => {
    cells[currentPosition + index].style.backgroundColor = currentTetromino.color;
    cells[currentPosition + index].classList.add('filled');
  });
}

function undraw() {
  currentTetromino.rotations[currentRotation].forEach(index => {
    cells[currentPosition + index].style.backgroundColor = '';
    cells[currentPosition + index].classList.remove('filled');
  });
}

function moveDown() {
  undraw();
  currentPosition += width;
  if (checkCollision()) {
    currentPosition -= width;
    draw();
    freeze();
    return;
  }
  draw();
}

function moveLeft() {
  undraw();
  if (!isAtEdge(-1) && !checkCollision(-1)) currentPosition -= 1;
  draw();
}

function moveRight() {
  undraw();
  if (!isAtEdge(1) && !checkCollision(1)) currentPosition += 1;
  draw();
}

function rotate() {
  undraw();
  const nextRotation = (currentRotation + 1) % currentTetromino.rotations.length;
  const nextIndices = currentTetromino.rotations[nextRotation].map(index => currentPosition + index);
  if (nextIndices.every(i => i >= 0 && i < width * height && !cells[i].classList.contains('filled') && i % width >= 0 && i % width < width)) {
    currentRotation = nextRotation;
  }
  draw();
}

function isAtEdge(dir) {
  return currentTetromino.rotations[currentRotation].some(index => (currentPosition + index) % width === (dir === -1 ? 0 : width - 1));
}

function checkCollision(offset = width) {
  return currentTetromino.rotations[currentRotation].some(index => {
    const next = currentPosition + index + offset;
    return next >= width * height || (next >= 0 && cells[next].classList.contains('taken'));
  });
}

function freeze() {
  currentTetromino.rotations[currentRotation].forEach(index => {
    cells[currentPosition + index].classList.add('taken');
  });
  clearLines();
  currentTetromino = randomTetromino();
  currentRotation = 0;
  currentPosition = 4;
  if (checkCollision(0)) {
    clearInterval(timerId);
    alert('Game Over');
  }
}

function clearLines() {
  for (let row = 0; row < height; row++) {
    const start = row * width;
    const rowCells = cells.slice(start, start + width);
    if (rowCells.every(cell => cell.classList.contains('taken'))) {
      rowCells.forEach(cell => {
        cell.classList.remove('taken', 'filled');
        cell.style.backgroundColor = '';
      });
      const removed = cells.splice(start, width);
      removed.forEach(cell => cells.unshift(cell));
      cells.forEach(cell => grid.appendChild(cell));
      score += 10;
      scoreDisplay.textContent = `Pontos: ${score}`;
      if (intervalTime > 100) {
        intervalTime -= 20;
        clearInterval(timerId);
        timerId = setInterval(moveDown, intervalTime);
      }
    }
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') moveLeft();
  if (e.key === 'ArrowRight') moveRight();
  if (e.key === 'ArrowDown') moveDown();
  if (e.key === 'ArrowUp') rotate();
});

draw();
