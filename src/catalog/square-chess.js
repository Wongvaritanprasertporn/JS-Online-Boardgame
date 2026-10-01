const ROWS = 8;
const COLS = 7;
class SquareChess {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = Array(ROWS * COLS).fill(null); this.currentPlayer = 'black'; this.phase = 'placement'; this.placed = 0; this.squares = { black: 0, white: 0 }; this.pendingRemoval = false; this.isGameOver = false; this.winner = null;
  }
  row(index) { return Math.floor(index / COLS); }
  col(index) { return index % COLS; }
  inBounds(row, col) { return row >= 0 && row < ROWS && col >= 0 && col < COLS; }
  formsSquare(index, color) {
    const row = this.row(index); const col = this.col(index);
    for (const dr of [-1, 0]) for (const dc of [-1, 0]) {
      const top = row + dr; const left = col + dc;
      if (top < 0 || left < 0 || top + 1 >= ROWS || left + 1 >= COLS) continue;
      if ([top * COLS + left, top * COLS + left + 1, (top + 1) * COLS + left, (top + 1) * COLS + left + 1].every((point) => this.board[point] === color)) return true;
    }
    return false;
  }
  protected(index) { const piece = this.board[index]; return piece && this.formsSquare(index, piece); }
  removable(color) { return this.board.map((piece, index) => piece === color && !this.protected(index) ? index : -1).filter((index) => index >= 0); }
  move(from, to) {
    if (this.isGameOver) return { success: false, error: 'Game over.' };
    if (this.pendingRemoval) {
      if (this.board[to] !== (this.currentPlayer === 'black' ? 'white' : 'black') || !this.removable(this.board[to]).includes(to)) return { success: false, error: 'Choose an unprotected opponent stone.' };
      this.board[to] = null; this.pendingRemoval = false; this.finishTurn(); return { success: true };
    }
    if (this.phase === 'placement') {
      if (!Number.isInteger(to) || to < 0 || to >= this.board.length || this.board[to]) return { success: false, error: 'Choose an empty intersection.' };
      this.board[to] = this.currentPlayer; this.placed++;
      if (this.formsSquare(to, this.currentPlayer)) { this.squares[this.currentPlayer]++; this.pendingRemoval = true; }
      else this.finishTurn();
      if (this.placed === this.board.length) this.phase = 'movement';
      return { success: true };
    }
    if (!Number.isInteger(from) || !Number.isInteger(to) || this.board[from] !== this.currentPlayer || this.board[to] || this.row(from) !== this.row(to) && this.col(from) !== this.col(to)) return { success: false, error: 'Invalid sliding move.' };
    const step = this.row(from) === this.row(to) ? Math.sign(to - from) : Math.sign(to - from) * COLS; for (let point = from + step; point !== to; point += step) if (this.board[point]) return { success: false, error: 'The path is blocked.' };
    this.board[to] = this.currentPlayer; this.board[from] = null;
    if (this.formsSquare(to, this.currentPlayer)) { this.squares[this.currentPlayer]++; this.pendingRemoval = true; }
    else this.finishTurn();
    return { success: true };
  }
  finishTurn() { const opponent = this.currentPlayer === 'black' ? 'white' : 'black'; if (this.phase === 'movement' && !this.board.includes(opponent)) { this.isGameOver = true; this.winner = this.currentPlayer; return; } this.currentPlayer = opponent; }
  toState() { return { board: this.board.slice(), currentPlayer: this.currentPlayer, phase: this.phase, placed: this.placed, squares: { ...this.squares }, pendingRemoval: this.pendingRemoval, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new SquareChess(state) : new SquareChess(); }
}
module.exports = SquareChess;
