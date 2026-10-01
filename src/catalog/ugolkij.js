const SIZE = 8;
const CAMPS = { black: new Set(), white: new Set() };
for (let row = 0; row < 3; row++) for (let col = 0; col < 4; col++) { CAMPS.black.add(row * SIZE + col); CAMPS.white.add((7 - row) * SIZE + (7 - col)); }
class Ugolkij {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = Array(64).fill(null); CAMPS.black.forEach((index) => { this.board[index] = 'black'; }); CAMPS.white.forEach((index) => { this.board[index] = 'white'; });
    this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null;
  }
  row(index) { return Math.floor(index / SIZE); }
  col(index) { return index % SIZE; }
  inBounds(row, col) { return row >= 0 && row < SIZE && col >= 0 && col < SIZE; }
  canStep(from, to) { return Math.abs(this.row(from) - this.row(to)) + Math.abs(this.col(from) - this.col(to)) === 1 && !this.board[to]; }
  jumpTargets(from) {
    const targets = []; const row = this.row(from); const col = this.col(from);
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { const middleRow = row + dr; const middleCol = col + dc; const targetRow = row + dr * 2; const targetCol = col + dc * 2; if (this.inBounds(targetRow, targetCol) && this.board[middleRow * SIZE + middleCol] && !this.board[targetRow * SIZE + targetCol]) targets.push(targetRow * SIZE + targetCol); }
    return targets;
  }
  reachable(from) { const seen = new Set([from]); const queue = [from]; while (queue.length) { const current = queue.shift(); for (const target of this.jumpTargets(current)) if (!seen.has(target)) { seen.add(target); queue.push(target); } } seen.delete(from); return [...seen]; }
  move(from, to) {
    if (this.isGameOver || this.board[from] !== this.currentPlayer || (!this.canStep(from, to) && !this.reachable(from).includes(to))) return { success: false, error: 'Invalid Ugolkij move.' };
    this.board[to] = this.currentPlayer; this.board[from] = null;
    const camp = this.currentPlayer === 'black' ? CAMPS.white : CAMPS.black;
    if ([...camp].every((index) => this.board[index] === this.currentPlayer)) { this.isGameOver = true; this.winner = this.currentPlayer; } else this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    return { success: true };
  }
  toState() { return { board: this.board.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new Ugolkij(state) : new Ugolkij(); }
}
module.exports = Ugolkij;
