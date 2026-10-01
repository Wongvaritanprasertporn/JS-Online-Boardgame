const ROWS = 9;
const COLS = 7;
const WATER = new Set([22, 23, 25, 26, 29, 30, 32, 33, 36, 37, 39, 40, 43, 44, 46, 47]);
const DENS = { black: 3, white: 59 };
const TRAPS = { black: new Set([2, 4, 10]), white: new Set([52, 58, 60]) };
const RANKS = { rat: 1, cat: 2, dog: 3, wolf: 4, leopard: 5, tiger: 6, lion: 7, elephant: 8 };
const SETUP = [
  [1, 'lion'], [7, 'tiger'], [9, 'dog'], [15, 'cat'], [3, 'rat'], [5, 'leopard'], [13, 'wolf'], [17, 'elephant'],
  [61, 'lion'], [55, 'tiger'], [53, 'dog'], [47, 'cat'], [59, 'rat'], [57, 'leopard'], [49, 'wolf'], [45, 'elephant']
];

class Jungle {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = Array(ROWS * COLS).fill(null);
    this.currentPlayer = 'black';
    this.isGameOver = false;
    this.winner = null;
    SETUP.forEach(([index, type], setupIndex) => { this.board[index] = { color: setupIndex < 8 ? 'black' : 'white', type }; });
  }
  row(index) { return Math.floor(index / COLS); }
  col(index) { return index % COLS; }
  index(row, col) { return row * COLS + col; }
  inBounds(row, col) { return row >= 0 && row < ROWS && col >= 0 && col < COLS; }
  isWater(index) { return WATER.has(index); }
  isDen(index, color) { return DENS[color] === index; }
  canCapture(piece, target, targetIndex) {
    if (!target || target.color === piece.color) return false;
    if (TRAPS[target.color].has(targetIndex)) return true;
    if (piece.type === 'rat' && target.type === 'elephant') return true;
    return RANKS[piece.type] >= RANKS[target.type];
  }
  isValidMove(from, to) {
    if (this.isGameOver || !Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0 || from >= this.board.length || to >= this.board.length) return false;
    const piece = this.board[from]; const target = this.board[to];
    if (!piece || piece.color !== this.currentPlayer || this.isDen(to, piece.color) || target?.color === piece.color || (target && !this.canCapture(piece, target, to))) return false;
    const rowDelta = this.row(to) - this.row(from); const colDelta = this.col(to) - this.col(from);
    if (Math.abs(rowDelta) + Math.abs(colDelta) === 1) return piece.type === 'rat' ? !this.board[to] : !this.isWater(to) && !this.isWater(from);
    if (piece.type !== 'rat' || (rowDelta !== 0 && colDelta !== 0) || (!this.isWater(from) && !this.isWater(to))) return false;
    const stepRow = Math.sign(rowDelta); const stepCol = Math.sign(colDelta); let row = this.row(from) + stepRow; let col = this.col(from) + stepCol;
    while (row !== this.row(to) || col !== this.col(to)) { if (!this.isWater(this.index(row, col)) || this.board[this.index(row, col)]) return false; row += stepRow; col += stepCol; }
    return true;
  }
  move(from, to) {
    if (!this.isValidMove(from, to)) return { success: false, error: 'Invalid Jungle move.' };
    const piece = this.board[from]; const captured = this.board[to];
    this.board[to] = piece; this.board[from] = null;
    const opponent = piece.color === 'black' ? 'white' : 'black';
    if (this.isDen(to, opponent)) { this.isGameOver = true; this.winner = piece.color; }
    else this.currentPlayer = piece.color === 'black' ? 'white' : 'black';
    return { success: true, captured };
  }
  toState() { return { board: this.board.map((piece) => piece && { ...piece }), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new Jungle(state) : new Jungle(); }
}
module.exports = Jungle;
