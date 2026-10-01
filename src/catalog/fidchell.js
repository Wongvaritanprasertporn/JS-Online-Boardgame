const SIZE = 7;
class Fidchell {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = Array(49).fill(null); for (let col = 1; col < 6; col++) { this.board[col] = 'black'; this.board[42 + col] = 'white'; } this.board[24] = 'black';
    this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null;
  }
  row(index) { return Math.floor(index / SIZE); }
  col(index) { return index % SIZE; }
  inBounds(row, col) { return row >= 0 && row < SIZE && col >= 0 && col < SIZE; }
  pathClear(from, to) { const rowStep = Math.sign(this.row(to) - this.row(from)); const colStep = Math.sign(this.col(to) - this.col(from)); let row = this.row(from) + rowStep; let col = this.col(from) + colStep; while (row !== this.row(to) || col !== this.col(to)) { if (this.board[row * SIZE + col]) return false; row += rowStep; col += colStep; } return true; }
  validMove(from, to) { return this.board[from] === this.currentPlayer && !this.board[to] && (this.row(from) === this.row(to) || this.col(from) === this.col(to)) && this.pathClear(from, to); }
  move(from, to) {
    if (this.isGameOver || !this.validMove(from, to)) return { success: false, error: 'Invalid Fidchell move.' };
    const opponent = this.currentPlayer === 'black' ? 'white' : 'black'; this.board[to] = this.currentPlayer; this.board[from] = null;
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { const row = this.row(to) + dr; const col = this.col(to) + dc; const beyondRow = row + dr; const beyondCol = col + dc; if (this.inBounds(beyondRow, beyondCol) && this.board[row * SIZE + col] === opponent && this.board[beyondRow * SIZE + beyondCol] === this.currentPlayer) this.board[row * SIZE + col] = null; }
    if (!this.board.includes(opponent)) { this.isGameOver = true; this.winner = this.currentPlayer; } else this.currentPlayer = opponent;
    return { success: true };
  }
  toState() { return { board: this.board.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new Fidchell(state) : new Fidchell(); }
}
module.exports = Fidchell;
