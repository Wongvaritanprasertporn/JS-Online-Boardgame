const SIZE = 8;
class FoxAndHounds {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = Array(64).fill(null); [0, 2, 4, 6].forEach((col) => { this.board[col] = 'hounds'; }); this.board[57] = 'fox';
    this.currentPlayer = 'fox'; this.isGameOver = false; this.winner = null;
  }
  playable(index) { return Math.floor(index / SIZE) % 2 === this.col(index) % 2; }
  row(index) { return Math.floor(index / SIZE); }
  col(index) { return index % SIZE; }
  legalMoves() { const moves = []; this.board.forEach((piece, from) => { if (piece !== this.currentPlayer) return; const direction = piece === 'hounds' ? 1 : 0; for (const deltaRow of piece === 'fox' ? [-1, 1] : [1]) for (const deltaCol of [-1, 1]) { const row = this.row(from) + deltaRow; const col = this.col(from) + deltaCol; const to = row * SIZE + col; if (row >= 0 && row < SIZE && col >= 0 && col < SIZE && this.playable(to) && !this.board[to] && (!direction || deltaRow === direction)) moves.push({ from, to }); } }); return moves; }
  move(from, to) {
    if (this.isGameOver || !this.legalMoves().some((move) => move.from === from && move.to === to)) return { success: false, error: 'Invalid fox and hounds move.' };
    this.board[to] = this.currentPlayer; this.board[from] = null;
    if (this.currentPlayer === 'fox' && this.row(to) === 0) { this.isGameOver = true; this.winner = 'fox'; return { success: true }; }
    this.currentPlayer = this.currentPlayer === 'fox' ? 'hounds' : 'fox';
    if (!this.legalMoves().length) { this.isGameOver = true; this.winner = this.currentPlayer === 'fox' ? 'hounds' : 'fox'; }
    return { success: true };
  }
  toState() { return { board: this.board.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new FoxAndHounds(state) : new FoxAndHounds(); }
}
module.exports = FoxAndHounds;
