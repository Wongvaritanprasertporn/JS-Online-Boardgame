class Choko {
  constructor(state = null) {
    if (state) {
      Object.assign(this, state);
      if (!this.board) this.board = Array(25).fill(null);
      return;
    }
    this.board = Array(25).fill(null);
    this.currentPlayer = 'black';
    this.isGameOver = false;
    this.winner = null;
  }

  inBounds(index) {
    return index >= 0 && index < this.board.length;
  }

  row(index) { return Math.floor(index / 5); }
  col(index) { return index % 5; }

  adjacent(index) {
    const r = this.row(index);
    const c = this.col(index);
    const out = [];
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const rr = r + dr;
      const cc = c + dc;
      if (rr >= 0 && rr < 5 && cc >= 0 && cc < 5) out.push(rr * 5 + cc);
    }
    return out;
  }

  move(from, to) {
    if (this.isGameOver || !this.inBounds(from) || !this.inBounds(to)) {
      return { success: false, error: 'Invalid position.' };
    }
    if (this.board[from] !== this.currentPlayer) {
      return { success: false, error: 'It is not your turn or piece is not yours.' };
    }
    if (this.board[to]) {
      return { success: false, error: 'Destination occupied.' };
    }
    if (!this.adjacent(from).includes(to)) {
      return { success: false, error: 'Choko pieces move one orthogonal step.' };
    }

    this.board[to] = this.currentPlayer;
    this.board[from] = null;
    this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    return { success: true };
  }

  toState() {
    return { board: this.board.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner };
  }

  static fromState(state) {
    return state ? new Choko(state) : new Choko();
  }
}

module.exports = Choko;
