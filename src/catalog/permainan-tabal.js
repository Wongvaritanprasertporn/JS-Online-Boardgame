const SIZE = 8;
class PermainanTabal {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = Array(64).fill(null); for (let index = 0; index < 16; index++) this.board[index] = { color: 'black', king: false }; for (let index = 48; index < 64; index++) this.board[index] = { color: 'white', king: false };
    this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null;
  }
  row(index) { return Math.floor(index / SIZE); }
  col(index) { return index % SIZE; }
  directions(piece, capture = false) { if (piece.king) return [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]; const forward = piece.color === 'black' ? 1 : -1; return capture ? [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]] : [[forward, 0], [forward, -1], [forward, 1], [0, -1], [0, 1]]; }
  captures(from) { const piece = this.board[from]; const opponent = this.currentPlayer === 'black' ? 'white' : 'black'; const result = []; for (const [dr, dc] of this.directions(piece, true)) { let row = this.row(from) + dr; let col = this.col(from) + dc; let found = false; while (row >= 0 && row < SIZE && col >= 0 && col < SIZE) { const index = row * SIZE + col; if (this.board[index]) { if (found || this.board[index].color !== opponent) break; found = true; } else if (found) result.push({ to: index, over: row * SIZE + col - dr * SIZE - dc }); else if (!piece.king) break; row += dr; col += dc; } } return result; }
  moves(from) { const piece = this.board[from]; if (!piece || piece.color !== this.currentPlayer) return []; const captures = this.board.flatMap((entry, index) => entry?.color === this.currentPlayer ? this.captures(index).map((move) => ({ from: index, ...move })) : []); if (captures.length) return captures.filter((move) => move.from === from); const result = []; for (const [dr, dc] of this.directions(piece)) { let row = this.row(from) + dr; let col = this.col(from) + dc; while (row >= 0 && row < SIZE && col >= 0 && col < SIZE && !this.board[row * SIZE + col]) { result.push({ from, to: row * SIZE + col }); if (!piece.king) break; row += dr; col += dc; } } return result; }
  move(from, to) { const candidate = this.moves(from).find((move) => move.to === to); if (this.isGameOver || !candidate) return { success: false, error: 'Invalid Permainan-Tabal move.' }; const piece = this.board[from]; this.board[to] = piece; this.board[from] = null; if (candidate.over !== undefined) this.board[candidate.over] = null; if ((piece.color === 'black' && this.row(to) === 7) || (piece.color === 'white' && this.row(to) === 0)) piece.king = true; const opponent = this.currentPlayer === 'black' ? 'white' : 'black'; if (!this.board.some((entry) => entry?.color === opponent)) { this.isGameOver = true; this.winner = this.currentPlayer; } else this.currentPlayer = opponent; return { success: true, captured: candidate.over !== undefined }; }
  toState() { return { board: this.board.map((piece) => piece && { ...piece }), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new PermainanTabal(state) : new PermainanTabal(); }
}
module.exports = PermainanTabal;
