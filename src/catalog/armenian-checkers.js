const SIZE = 8;
class ArmenianCheckers {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = Array(64).fill(null); for (let row = 1; row <= 2; row++) for (let col = 0; col < SIZE; col++) this.board[row * SIZE + col] = { color: 'black', king: false }; for (let row = 5; row <= 6; row++) for (let col = 0; col < SIZE; col++) this.board[row * SIZE + col] = { color: 'white', king: false };
    this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null;
  }
  row(index) { return Math.floor(index / SIZE); }
  col(index) { return index % SIZE; }
  directions(piece, capture = false) { if (piece.king) return capture ? [[-1, 0], [1, 0], [0, -1], [0, 1]] : [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]; const forward = piece.color === 'black' ? 1 : -1; return capture ? [[forward, 0], [0, -1], [0, 1]] : [[forward, 0], [forward, -1], [forward, 1], [0, -1], [0, 1]]; }
  captures(from) { const piece = this.board[from]; if (!piece) return []; const result = []; for (const [dr, dc] of this.directions(piece, true)) { let row = this.row(from) + dr; let col = this.col(from) + dc; while (row >= 0 && row < SIZE && col >= 0 && col < SIZE) { const index = row * SIZE + col; if (!this.board[index]) { if (piece.king && result.some((move) => move.over === index - dr * SIZE - dc)) result.push({ to: index, over: index - dr * SIZE - dc }); row += dr; col += dc; continue; } if (this.board[index].color === piece.color) break; let landingRow = row + dr; let landingCol = col + dc; while (piece.king && landingRow >= 0 && landingRow < SIZE && landingCol >= 0 && landingCol < SIZE && !this.board[landingRow * SIZE + landingCol]) { result.push({ to: landingRow * SIZE + landingCol, over: index }); landingRow += dr; landingCol += dc; } if (!piece.king && landingRow >= 0 && landingRow < SIZE && landingCol >= 0 && landingCol < SIZE && !this.board[landingRow * SIZE + landingCol]) result.push({ to: landingRow * SIZE + landingCol, over: index }); break; } } return result; }
  moves(from, color = this.currentPlayer) { const piece = this.board[from]; if (!piece || piece.color !== color) return []; const allCaptures = this.board.flatMap((entry, index) => entry?.color === color ? this.captures(index).map((move) => ({ from: index, ...move })) : []); if (allCaptures.length) return allCaptures.filter((move) => move.from === from); const result = []; for (const [dr, dc] of this.directions(piece)) { const row = this.row(from) + dr; const col = this.col(from) + dc; if (row >= 0 && row < SIZE && col >= 0 && col < SIZE && !this.board[row * SIZE + col]) result.push({ from, to: row * SIZE + col }); } return result; }
  move(from, to) {
    const move = this.moves(from).find((candidate) => candidate.to === to); if (this.isGameOver || !move) return { success: false, error: 'Invalid Armenian Checkers move.' };
    const piece = this.board[from]; this.board[to] = piece; this.board[from] = null; if (move.over !== undefined) this.board[move.over] = null; if ((piece.color === 'black' && this.row(to) === 7) || (piece.color === 'white' && this.row(to) === 0)) piece.king = true;
    const opponent = this.currentPlayer === 'black' ? 'white' : 'black'; if (!this.board.some((entry) => entry?.color === opponent) || !this.board.some((entry, index) => entry?.color === opponent && this.moves(index, opponent).length)) { this.isGameOver = true; this.winner = this.currentPlayer; } else this.currentPlayer = opponent; return { success: true, captured: move.over !== undefined };
  }
  toState() { return { board: this.board.map((piece) => piece && { ...piece }), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new ArmenianCheckers(state) : new ArmenianCheckers(); }
}
module.exports = ArmenianCheckers;
