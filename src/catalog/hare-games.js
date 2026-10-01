const SIZE = 8;
class HareGames {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = Array(64).fill(null); [0, 2, 4].forEach((index) => { this.board[index] = 'hounds'; }); this.board[57] = 'hare';
    this.currentPlayer = 'hounds'; this.isGameOver = false; this.winner = null; this.sidewaysMoves = 0;
  }
  playable(index) { return (Math.floor(index / SIZE) + index % SIZE) % 2 === 0; }
  row(index) { return Math.floor(index / SIZE); }
  col(index) { return index % SIZE; }
  legalMoves() { const moves = []; this.board.forEach((piece, from) => { if (piece !== this.currentPlayer) return; const deltas = piece === 'hare' ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : [[1, -1], [1, 1], [0, -1], [0, 1]]; deltas.forEach(([deltaRow, deltaCol]) => { const row = this.row(from) + deltaRow; const col = this.col(from) + deltaCol; const to = row * SIZE + col; if (row >= 0 && row < SIZE && col >= 0 && col < SIZE && this.playable(to) && !this.board[to]) moves.push({ from, to }); }); }); return moves; }
  move(from, to) {
    if (this.isGameOver || !this.legalMoves().some((move) => move.from === from && move.to === to)) return { success: false, error: 'Invalid hare game move.' };
    const piece = this.currentPlayer; this.board[to] = piece; this.board[from] = null;
    if (piece === 'hare' && this.row(to) === 0) { this.isGameOver = true; this.winner = 'hare'; return { success: true }; }
    this.sidewaysMoves = piece === 'hounds' && this.row(from) === this.row(to) ? this.sidewaysMoves + 1 : 0;
    if (this.sidewaysMoves >= 10) { this.isGameOver = true; this.winner = 'hare'; return { success: true }; }
    this.currentPlayer = piece === 'hounds' ? 'hare' : 'hounds';
    if (!this.legalMoves().length) { this.isGameOver = true; this.winner = this.currentPlayer === 'hare' ? 'hounds' : 'hare'; }
    return { success: true };
  }
  toState() { return { board: this.board.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner, sidewaysMoves: this.sidewaysMoves }; }
  static fromState(state) { return state ? new HareGames(state) : new HareGames(); }
}
module.exports = HareGames;
