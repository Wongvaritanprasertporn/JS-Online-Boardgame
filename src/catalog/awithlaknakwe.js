const SIZE = 12;
class Awithlaknakwe {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = Array(144).fill(null); for (let col = 3; col < 9; col++) this.board[col] = { color: 'black', type: 'warrior' }; for (let col = 3; col < 9; col++) this.board[132 + col] = { color: 'white', type: 'warrior' };
    this.priestInPlay = { black: false, white: false }; this.captureCounts = { black: 0, white: 0 }; this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null;
  }
  row(index) { return Math.floor(index / SIZE); }
  col(index) { return index % SIZE; }
  neighbors(index) { const result = []; const row = this.row(index); const col = this.col(index); for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]) { const nextRow = row + dr; const nextCol = col + dc; if (nextRow >= 0 && nextRow < SIZE && nextCol >= 0 && nextCol < SIZE) result.push({ index: nextRow * SIZE + nextCol, dr, dc }); } return result; }
  canMove(piece, from, to) { const neighbor = this.neighbors(from).find((entry) => entry.index === to); if (!neighbor || this.board[to]) return false; const forward = piece.color === 'black' ? 1 : -1; return piece.type === 'priest' ? (neighbor.dr === 0 || neighbor.dr === forward) : neighbor.dr === forward && Math.abs(neighbor.dc) === 1; }
  captures(from) { const result = []; const piece = this.board[from]; for (const neighbor of this.neighbors(from)) { const row = this.row(from) + neighbor.dr * 2; const col = this.col(from) + neighbor.dc * 2; const to = row * SIZE + col; if (row >= 0 && row < SIZE && col >= 0 && col < SIZE && this.board[neighbor.index]?.color !== piece.color && this.board[neighbor.index] && !this.board[to]) result.push({ to, over: neighbor.index }); } return result; }
  move(from, to) { const piece = this.board[from]; if (this.isGameOver || !piece || piece.color !== this.currentPlayer) return { success: false, error: 'Invalid Awithlaknakwe piece.' }; const capture = this.captures(from).find((entry) => entry.to === to); if (!capture && !this.canMove(piece, from, to)) return { success: false, error: 'Invalid Awithlaknakwe move.' }; this.board[to] = piece; this.board[from] = null; if (capture) { const removed = this.board[capture.over]; this.board[capture.over] = null; this.captureCounts[this.currentPlayer]++; if (removed.type === 'warrior' && !this.priestInPlay[this.currentPlayer]) { this.priestInPlay[this.currentPlayer] = true; this.board[(this.currentPlayer === 'black' ? 0 : 132) + 6] = { color: this.currentPlayer, type: 'priest' }; } } const opponent = this.currentPlayer === 'black' ? 'white' : 'black'; if (!this.board.some((entry) => entry?.color === opponent) || (piece.type === 'warrior' && ((piece.color === 'black' && this.row(to) === 11) || (piece.color === 'white' && this.row(to) === 0)))) { this.isGameOver = true; this.winner = this.currentPlayer; } else this.currentPlayer = opponent; return { success: true, captured: Boolean(capture) }; }
  toState() { return { board: this.board.map((piece) => piece && { ...piece }), priestInPlay: { ...this.priestInPlay }, captureCounts: { ...this.captureCounts }, currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new Awithlaknakwe(state) : new Awithlaknakwe(); }
}
module.exports = Awithlaknakwe;
