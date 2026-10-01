const SIZE = 8;
class Terhuchu {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = Array(64).fill(null); for (let index = 0; index < 10; index++) this.board[index] = 'black'; for (let index = 54; index < 64; index++) this.board[index] = 'white';
    this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null;
  }
  row(index) { return Math.floor(index / SIZE); }
  col(index) { return index % SIZE; }
  directions(index) { const result = []; for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]) { const row = this.row(index) + dr; const col = this.col(index) + dc; if (row >= 0 && row < SIZE && col >= 0 && col < SIZE) result.push({ index: row * SIZE + col, dr, dc }); } return result; }
  captures(from) { const result = []; const opponent = this.currentPlayer === 'black' ? 'white' : 'black'; for (const neighbor of this.directions(from)) { const row = this.row(from) + neighbor.dr * 2; const col = this.col(from) + neighbor.dc * 2; const to = row * SIZE + col; if (row >= 0 && row < SIZE && col >= 0 && col < SIZE && this.board[neighbor.index] === opponent && !this.board[to]) result.push({ to, over: neighbor.index }); } return result; }
  move(from, to) { const piece = this.board[from]; const capture = this.captures(from).find((candidate) => candidate.to === to); const adjacent = this.directions(from).some((neighbor) => neighbor.index === to) && !this.board[to]; if (this.isGameOver || piece !== this.currentPlayer || (!adjacent && !capture)) return { success: false, error: 'Invalid Terhuchu move.' }; this.board[to] = piece; this.board[from] = null; if (capture) this.board[capture.over] = null; const opponent = this.currentPlayer === 'black' ? 'white' : 'black'; if (!this.board.includes(opponent)) { this.isGameOver = true; this.winner = this.currentPlayer; } else this.currentPlayer = opponent; return { success: true, captured: Boolean(capture) }; }
  toState() { return { board: this.board.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new Terhuchu(state) : new Terhuchu(); }
}
module.exports = Terhuchu;
