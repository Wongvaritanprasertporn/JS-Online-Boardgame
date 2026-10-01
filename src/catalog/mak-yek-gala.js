class MakYekGala {
  constructor(state = null) {
    if (state) {
      Object.assign(this, state);
      return;
    }
    this.board = Array(49).fill(null);
    this.currentPlayer = 'black';
    this.reserve = { black: 12, white: 12 };
    this.isGameOver = false;
    this.winner = null;
  }

  row(index) { return Math.floor(index / 7); }
  col(index) { return index % 7; }

  neighbors(index) {
    const row = this.row(index);
    const col = this.col(index);
    const result = [];
    for (const [rowDelta, colDelta] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nextRow = row + rowDelta;
      const nextCol = col + colDelta;
      if (nextRow >= 0 && nextRow < 7 && nextCol >= 0 && nextCol < 7) result.push(nextRow * 7 + nextCol);
    }
    return result;
  }

  move(from, to) {
    if (this.isGameOver || !Number.isInteger(to) || to < 0 || to >= this.board.length) return { success: false, error: 'Invalid move.' };
    if (from === null || from === undefined) {
      if (this.board[to] || this.reserve[this.currentPlayer] <= 0) return { success: false, error: 'That position cannot receive a piece.' };
      this.board[to] = this.currentPlayer;
      this.reserve[this.currentPlayer]--;
    } else {
      if (!Number.isInteger(from) || from < 0 || from >= this.board.length || this.board[from] !== this.currentPlayer) return { success: false, error: 'That piece is not yours.' };
      if (this.board[to] || !this.neighbors(from).includes(to)) return { success: false, error: 'Pieces move one orthogonal space.' };
      this.board[to] = this.currentPlayer;
      this.board[from] = null;
    }
    const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
    if (!this.board.includes(opponent) && this.reserve[opponent] === 0) {
      this.isGameOver = true;
      this.winner = this.currentPlayer;
    } else {
      this.currentPlayer = opponent;
    }
    return { success: true };
  }

  toState() {
    return { board: this.board.slice(), currentPlayer: this.currentPlayer, reserve: { ...this.reserve }, isGameOver: this.isGameOver, winner: this.winner };
  }

  static fromState(state) { return state ? new MakYekGala(state) : new MakYekGala(); }
}

module.exports = MakYekGala;
