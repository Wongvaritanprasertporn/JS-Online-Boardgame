const SIZE = 9;
class Bizingo {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = Array(81).fill(null); for (let col = 0; col < SIZE; col++) this.board[col] = { color: 'black', captain: col === 1 || col === 7 }; for (let col = 0; col < SIZE; col++) this.board[SIZE + col] = { color: 'black', captain: false }; for (let col = 0; col < SIZE; col++) this.board[7 * SIZE + col] = { color: 'white', captain: col === 1 || col === 7 }; for (let col = 0; col < SIZE; col++) this.board[8 * SIZE + col] = { color: 'white', captain: false };
    this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null;
  }
  row(index) { return Math.floor(index / SIZE); }
  col(index) { return index % SIZE; }
  cellColor(index) { return (this.row(index) + this.col(index)) % 2; }
  neighbors(index) { const row = this.row(index); const col = this.col(index); const parity = row % 2; const result = [[0,-1],[0,1],[-1,parity ? 0 : -1],[-1,parity ? 1 : 0],[1,parity ? 0 : -1],[1,parity ? 1 : 0]]; return result.map(([dr,dc]) => [row + dr, col + dc]).filter(([nextRow,nextCol]) => nextRow >= 0 && nextRow < SIZE && nextCol >= 0 && nextCol < SIZE).map(([nextRow,nextCol]) => nextRow * SIZE + nextCol); }
  move(from, to) { const piece = this.board[from]; if (this.isGameOver || !piece || piece.color !== this.currentPlayer || this.board[to] || !this.neighbors(from).includes(to) || this.cellColor(from) !== this.cellColor(to)) return { success: false, error: 'Invalid Bizingo move.' }; this.board[to] = piece; this.board[from] = null; const opponent = this.currentPlayer === 'black' ? 'white' : 'black'; for (const target of [...this.board.keys()]) { const enemy = this.board[target]; if (!enemy || enemy.color !== opponent) continue; const surrounding = this.neighbors(target).map((index) => this.board[index]).filter(Boolean); const hostile = surrounding.filter((entry) => entry.color === this.currentPlayer); const capturable = hostile.length >= 3 && (!enemy.captain || hostile.some((entry) => entry.captain)); if (capturable) this.board[target] = null; } if (this.board.filter((entry) => entry?.color === opponent).length <= 2) { this.isGameOver = true; this.winner = this.currentPlayer; } else this.currentPlayer = opponent; return { success: true }; }
  toState() { return { board: this.board.map((piece) => piece && { ...piece }), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new Bizingo(state) : new Bizingo(); }
}
module.exports = Bizingo;
