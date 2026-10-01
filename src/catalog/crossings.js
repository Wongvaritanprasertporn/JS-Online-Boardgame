class Crossings {
  constructor(state = null) {
    if (state) {
      Object.assign(this, state);
      if (!this.board) this.board = Array(64).fill(null);
      return;
    }
    this.board = Array(64).fill(null);
    this.currentPlayer = 'black';
    this.isGameOver = false;
    this.winner = null;
    this.setup();
  }

  setup() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 0 && row < 2) this.board[row * 8 + col] = 'black';
        if ((row + col) % 2 === 1 && row > 5) this.board[row * 8 + col] = 'white';
      }
    }
  }

  indexToRowCol(index) {
    return { row: Math.floor(index / 8), col: index % 8 };
  }

  isEmpty(index) {
    return index >= 0 && index < 64 && !this.board[index];
  }

  groupSize(index) {
    const color = this.board[index];
    if (!color) return 0;
    const seen = new Set([index]);
    const queue = [index];
    while (queue.length) {
      const cur = queue.shift();
      const { row, col } = this.indexToRowCol(cur);
      for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]) {
        const rr = row + dr;
        const cc = col + dc;
        if (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) {
          const next = rr * 8 + cc;
          if (this.board[next] === color && !seen.has(next)) {
            seen.add(next);
            queue.push(next);
          }
        }
      }
    }
    return seen.size;
  }

  move(from, to) {
    if (this.isGameOver || !this.board[from] || this.board[from] !== this.currentPlayer) {
      return { success: false, error: 'Invalid piece.' };
    }
    if (this.board[to]) {
      return { success: false, error: 'Destination occupied.' };
    }

    const fromPos = this.indexToRowCol(from);
    const toPos = this.indexToRowCol(to);
    const rowDiff = toPos.row - fromPos.row;
    const colDiff = toPos.col - fromPos.col;
    const sameLine = rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff);
    if (!sameLine) return { success: false, error: 'Crossings moves on a straight line.' };

    const stepRow = Math.sign(rowDiff) || 0;
    const stepCol = Math.sign(colDiff) || 0;
    let row = fromPos.row + stepRow;
    let col = fromPos.col + stepCol;
    let clear = true;
    let distance = 0;
    while (row !== toPos.row || col !== toPos.col) {
      distance += 1;
      if (this.board[row * 8 + col]) clear = false;
      row += stepRow;
      col += stepCol;
    }
    if (!clear) return { success: false, error: 'Blocked path.' };

    const size = this.groupSize(from);
    if (distance > size) return { success: false, error: 'Group too large for this move.' };

    this.board[to] = this.board[from];
    this.board[from] = null;
    this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    return { success: true };
  }

  toState() {
    return { board: this.board.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner };
  }

  static fromState(state) {
    return state ? new Crossings(state) : new Crossings();
  }
}

module.exports = Crossings;
