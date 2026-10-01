const SIZE = 3;
class BearGame {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = Array(9).fill(null); this.board[4] = 'bear'; this.board[0] = 'hunters'; this.board[1] = 'hunters'; this.board[2] = 'hunters';
    this.currentPlayer = 'hunters'; this.moves = 0; this.isGameOver = false; this.winner = null;
  }
  neighbors(index) { const row = Math.floor(index / SIZE); const col = index % SIZE; const result = []; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { if (!dr && !dc) continue; const nextRow = row + dr; const nextCol = col + dc; if (nextRow >= 0 && nextRow < SIZE && nextCol >= 0 && nextCol < SIZE) result.push(nextRow * SIZE + nextCol); } return result; }
  legalMoves() { const moves = []; this.board.forEach((piece, from) => { if (piece !== this.currentPlayer) return; this.neighbors(from).filter((to) => this.board[to] === null).forEach((to) => moves.push({ from, to })); }); return moves; }
  move(from, to) {
    if (this.isGameOver || !this.legalMoves().some((move) => move.from === from && move.to === to)) return { success: false, error: 'Invalid bear game move.' };
    this.board[to] = this.currentPlayer; this.board[from] = null; this.moves++;
    this.currentPlayer = this.currentPlayer === 'hunters' ? 'bear' : 'hunters';
    if (!this.legalMoves().length) { this.isGameOver = true; this.winner = this.currentPlayer === 'bear' ? 'hunters' : 'bear'; }
    else if (this.currentPlayer === 'bear' && this.moves >= 40) { this.isGameOver = true; this.winner = 'bear'; }
    return { success: true };
  }
  toState() { return { board: this.board.slice(), currentPlayer: this.currentPlayer, moves: this.moves, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new BearGame(state) : new BearGame(); }
}
module.exports = BearGame;
