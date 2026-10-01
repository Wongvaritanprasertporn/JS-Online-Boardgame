const Dara = require('./dara');

class Dala extends Dara {
  constructor(state = null) { super(state); }

  isCentral(position) {
    const row = Math.floor(position / 6);
    const col = position % 6;
    return row >= 2 && row <= 3 && col >= 2 && col <= 3;
  }

  move(from, to) {
    if (this.phase === 'placement') {
      if (!this.isCentral(to) && this.board.some((piece, index) => this.isCentral(index) && !piece)) {
        return { success: false, error: 'The central four squares must be filled first.' };
      }
      if (this.board[to] !== null || this.placed[this.currentPlayer] >= 12) {
        return { success: false, error: 'Invalid placement.' };
      }
      this.board[to] = this.currentPlayer;
      this.placed[this.currentPlayer]++;
      if (this.placed.black === 12 && this.placed.white === 12) this.phase = 'movement';
      this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
      return { success: true };
    }

    if (this.board[from] !== this.currentPlayer || this.board[to] || !this.adjacent(from).includes(to)) {
      return { success: false, error: 'Invalid move.' };
    }
    this.board[from] = null;
    this.board[to] = this.currentPlayer;
    if (this.hasExactMill(to, this.currentPlayer)) {
      const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
      const target = this.board.findIndex((piece) => piece === opponent);
      if (target >= 0) this.board[target] = null;
    }
    if (this.board.filter((piece) => piece === 'black').length < 3 || this.board.filter((piece) => piece === 'white').length < 3) {
      this.isGameOver = true;
      this.winner = this.board.filter((piece) => piece === 'black').length < 3 ? 'white' : 'black';
    } else {
      this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    }
    return { success: true };
  }

  hasExactMill(position, color) {
    return this.linesAt(position).some((line) => line.every((index) => this.board[index] === color));
  }

  static fromState(state) { return state ? new Dala(state) : new Dala(); }
}

module.exports = Dala;
