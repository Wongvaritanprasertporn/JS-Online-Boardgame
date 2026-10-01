const socket = io();
const gameType = document.body.dataset.game;
const title = gameType.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const isPallanguzhi = gameType === 'pallanguzhi';
const isCheckers = gameType === 'checkers';
const board = document.getElementById('board');
const status = document.getElementById('status');
let state;
let selected = null;
document.getElementById('title').textContent = title;
document.documentElement.style.setProperty('--columns', isCheckers ? 8 : 7);
socket.on('connect', () => socket.emit('queue', gameType));
socket.on('queueWaiting', (data) => { status.textContent = data.message; });
socket.on('roomFound', (data) => { state = data.gameState; render(); });
socket.on('updateGame', (data) => { state = data.gameState; render(); });
socket.on('errorMessage', (message) => { status.textContent = message; });
function render() {
  board.innerHTML = '';
  state.board.forEach((piece, index) => {
    const cell = document.createElement('button');
    cell.textContent = isPallanguzhi ? piece : piece && piece.startsWith('black') ? (isCheckers && piece.endsWith('-king') ? 'K' : '●') : piece && piece.startsWith('white') ? (isCheckers && piece.endsWith('-king') ? 'K' : '○') : '';
    cell.setAttribute('aria-label', `Position ${index + 1}`);
    cell.onclick = () => {
      if (isPallanguzhi) {
        socket.emit('move', { from: index, to: index });
      } else if (selected === null) {
        if (piece && piece.startsWith(state.currentPlayer)) selected = index;
        else if (!piece) socket.emit('move', { from: null, to: index });
      } else {
        socket.emit('move', { from: selected, to: index });
        selected = null;
      }
    };
    board.appendChild(cell);
  });
  status.textContent = state.isGameOver ? `Winner: ${state.winner}` : `Turn: ${state.currentPlayer}`;
}
