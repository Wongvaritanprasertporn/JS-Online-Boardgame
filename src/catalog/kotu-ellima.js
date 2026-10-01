const SIZE = 8;
class KotuEllima {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = Array(64).fill(null); for (let index = 0; index < 32; index++) this.board[index] = 'black'; for (let index = 32; index < 64; index++) this.board[index] = 'white'; this.board[27] = null;
    this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null;
  }
  row(index) { return Math.floor(index / SIZE); }
  col(index) { return index % SIZE; }
  neighbors(index) { const result = []; for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]) { const row = this.row(index) + dr; const col = this.col(index) + dc; if (row >= 0 && row < SIZE && col >= 0 && col < SIZE) result.push({ index: row * SIZE + col, dr, dc }); } return result; }
  captures(from) { const result = []; const opponent = this.currentPlayer === 'black' ? 'white' : 'black'; for (const neighbor of this.neighbors(from)) { const landingRow = this.row(from) + neighbor.dr * 2; const landingCol = this.col(from) + neighbor.dc * 2; const landing = landingRow * SIZE + landingCol; if (landingRow >= 0 && landingRow < SIZE && landingCol >= 0 && this.board[neighbor.index] === opponent && !this.board[landing]) result.push({ to: landing, over: neighbor.index }); } return result; }
  move(from, to) {
    const piece = this.board[from]; const capture = this.captures(from).find((candidate) => candidate.to === to); const adjacent = this.neighbors(from).some((neighbor) => neighbor.index === to) && !this.board[to]; if (this.isGameOver || piece !== this.currentPlayer || (!adjacent && !capture)) return { success: false, error: 'Invalid Kotu Ellima move.' };
    this.board[to] = piece; this.board[from] = null; if (capture) this.board[capture.over] = null; const opponent = this.currentPlayer === 'black' ? 'white' : 'black'; if (!this.board.includes(opponent)) { this.isGameOver = true; this.winner = this.currentPlayer; } else this.currentPlayer = opponent; return { success: true, captured: Boolean(capture) };
  }
  toState() { return { board: this.board.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new KotuEllima(state) : new KotuEllima(); }
}
module.exports = KotuEllima;
