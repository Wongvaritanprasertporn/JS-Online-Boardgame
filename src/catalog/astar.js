const SIZE = 8;
class Astar {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = Array(64).fill(null); for (let col = 0; col < SIZE; col++) { this.board[col] = 'black'; this.board[SIZE + col] = 'black'; this.board[48 + col] = 'white'; this.board[56 + col] = 'white'; }
    this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null;
  }
  row(index) { return Math.floor(index / SIZE); }
  col(index) { return index % SIZE; }
  inBounds(row, col) { return row >= 0 && row < SIZE && col >= 0 && col < SIZE; }
  jumps(from) { const result = []; const row = this.row(from); const col = this.col(from); for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { const middleRow = row + dr; const middleCol = col + dc; const targetRow = row + dr * 2; const targetCol = col + dc * 2; if (this.inBounds(targetRow, targetCol) && this.board[middleRow * SIZE + middleCol] && this.board[middleRow * SIZE + middleCol] !== this.currentPlayer && !this.board[targetRow * SIZE + targetCol]) result.push({ to: targetRow * SIZE + targetCol, over: middleRow * SIZE + middleCol }); } return result; }
  reachableJumps(from) { const result = []; const queue = [{ index: from, captured: [] }]; const visited = new Set([from]); while (queue.length) { const current = queue.shift(); for (const jump of this.jumps(current.index)) if (!visited.has(jump.to)) { visited.add(jump.to); result.push({ ...jump, from }); queue.push({ index: jump.to, captured: [...current.captured, jump.over] }); } } return result; }
  move(from, to) {
    const piece = this.board[from]; if (this.isGameOver || piece !== this.currentPlayer) return { success: false, error: 'Invalid Astar piece.' };
    const rowDelta = Math.abs(this.row(from) - this.row(to)); const colDelta = Math.abs(this.col(from) - this.col(to)); const adjacent = rowDelta + colDelta === 1 && !this.board[to]; const jump = this.reachableJumps(from).find((candidate) => candidate.to === to);
    if (!adjacent && !jump) return { success: false, error: 'Invalid Astar move.' };
    this.board[to] = piece; this.board[from] = null; if (jump) this.board[jump.over] = null;
    const opponent = this.currentPlayer === 'black' ? 'white' : 'black'; if (!this.board.includes(opponent)) { this.isGameOver = true; this.winner = this.currentPlayer; } else this.currentPlayer = opponent;
    return { success: true, captured: Boolean(jump) };
  }
  toState() { return { board: this.board.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new Astar(state) : new Astar(); }
}
module.exports = Astar;
