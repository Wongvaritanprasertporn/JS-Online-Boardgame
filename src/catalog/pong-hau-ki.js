const EDGES = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 2], [2, 4], [0, 4]];
class PongHauKi {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = ['black', 'white', null, 'white', 'black'];
    this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null; this.history = {};
  }
  neighbors(index) { return EDGES.flatMap(([from, to]) => from === index ? [to] : to === index ? [from] : []); }
  legalMoves(color = this.currentPlayer) { const moves = []; this.board.forEach((piece, from) => { if (piece !== color) return; this.neighbors(from).filter((to) => this.board[to] === null).forEach((to) => moves.push({ from, to })); }); return moves; }
  move(from, to) {
    if (this.isGameOver || !this.legalMoves().some((move) => move.from === from && move.to === to)) return { success: false, error: 'Invalid Pong Hau K’i move.' };
    this.board[to] = this.currentPlayer; this.board[from] = null;
    const next = this.currentPlayer === 'black' ? 'white' : 'black'; this.currentPlayer = next;
    const position = `${this.board.join(',')}:${this.currentPlayer}`; this.history[position] = (this.history[position] || 0) + 1;
    if (!this.legalMoves().length) { this.isGameOver = true; this.winner = this.currentPlayer === 'black' ? 'white' : 'black'; }
    else if (this.history[position] >= 3) { this.isGameOver = true; this.winner = 'draw'; }
    return { success: true };
  }
  toState() { return { board: this.board.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner, history: { ...this.history } }; }
  static fromState(state) { return state ? new PongHauKi(state) : new PongHauKi(); }
}
module.exports = PongHauKi;
