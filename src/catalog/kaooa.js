const STAR_POINTS = [
  0, 1, 2, 3, 4,
  5, 6, 7, 8, 9,
  10, 11, 12, 13, 14,
  15, 16, 17, 18, 19,
  20, 21, 22, 23, 24
];

class Kaooa {
  constructor(state = null) {
    if (state) {
      Object.assign(this, state);
      if (!this.board) this.board = Array(25).fill(null);
      return;
    }
    this.board = Array(25).fill(null);
    this.currentPlayer = 'crows';
    this.isGameOver = false;
    this.winner = null;
    this.setup();
  }

  setup() {
    this.board[0] = 'vulture';
    for (let i = 1; i <= 7; i++) this.board[i] = 'crow';
  }

  neighbors(index) {
    const lines = {
      0: [1, 5, 9], 1: [0, 2, 6], 2: [1, 3, 7], 3: [2, 4, 8], 4: [3, 9, 1],
      5: [0, 6, 10], 6: [1, 5, 7, 11], 7: [2, 6, 8, 12], 8: [3, 7, 9, 13], 9: [0, 4, 8, 14],
      10: [5, 11, 15], 11: [6, 10, 12, 16], 12: [7, 11, 13, 17], 13: [8, 12, 14, 18], 14: [9, 13, 19],
      15: [10, 16, 20], 16: [11, 15, 17, 21], 17: [12, 16, 18, 22], 18: [13, 17, 19, 23], 19: [14, 18, 24],
      20: [15, 21], 21: [16, 20, 22], 22: [17, 21, 23], 23: [18, 22, 24], 24: [19, 23]
    };
    return lines[index] || [];
  }

  move(from, to) {
    if (this.isGameOver || !this.board[from]) return { success: false, error: 'Piece missing.' };
    if (this.board[from] !== this.currentPlayer && !(this.currentPlayer === 'crows' && this.board[from] === 'crow')) {
      return { success: false, error: 'It is not your turn.' };
    }
    if (this.board[to]) return { success: false, error: 'Destination occupied.' };
    if (!this.neighbors(from).includes(to)) {
      const captureTarget = this.neighbors(from).find((index) => this.board[index] && this.board[index] !== this.currentPlayer && this.neighbors(index).includes(to));
      if (!captureTarget) return { success: false, error: 'Illegal Kaooa move.' };
      this.board[to] = this.board[from];
      this.board[from] = null;
      this.board[captureTarget] = null;
    } else {
      this.board[to] = this.board[from];
      this.board[from] = null;
    }

    if (this.currentPlayer === 'crows') this.currentPlayer = 'vulture';
    else this.currentPlayer = 'crows';
    return { success: true };
  }

  toState() {
    return { board: this.board.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner };
  }

  static fromState(state) {
    return state ? new Kaooa(state) : new Kaooa();
  }
}

module.exports = Kaooa;
