const OUTER = [1, 2, 3, 4, 5, 6, 7, 8];
class MuTorere {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = Array(9).fill(null); [1, 2, 3, 4].forEach((index) => { this.board[index] = 'black'; }); [5, 6, 7, 8].forEach((index) => { this.board[index] = 'white'; });
    this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null;
  }
  neighbors(index) { if (index === 0) return OUTER; if (!OUTER.includes(index)) return []; return [0, index === 1 ? 8 : index - 1, index === 8 ? 1 : index + 1]; }
  legalMoves(index) {
    if (this.board[index] !== this.currentPlayer) return [];
    return this.neighbors(index).filter((target) => !this.board[target] && (target !== 0 || this.neighbors(index).some((neighbor) => this.board[neighbor] && this.board[neighbor] !== this.currentPlayer)));
  }
  move(from, to) {
    if (this.isGameOver || !this.legalMoves(from).includes(to)) return { success: false, error: 'Invalid Mū tōrere move.' };
    this.board[to] = this.currentPlayer; this.board[from] = null;
    const opponent = this.currentPlayer === 'black' ? 'white' : 'black'; this.currentPlayer = opponent;
    const blocked = this.board.some((piece, index) => piece === opponent && this.legalMovesFor(index, opponent).length);
    if (!blocked) { this.isGameOver = true; this.winner = this.currentPlayer === 'black' ? 'white' : 'black'; }
    return { success: true };
  }
  legalMovesFor(index, color) {
    if (this.board[index] !== color) return [];
    return this.neighbors(index).filter((target) => !this.board[target] && (target !== 0 || this.neighbors(index).some((neighbor) => this.board[neighbor] && this.board[neighbor] !== color)));
  }
  toState() { return { board: this.board.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new MuTorere(state) : new MuTorere(); }
}
module.exports = MuTorere;
