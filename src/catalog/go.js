const SIZE = 7;

class Go {
  constructor(state = null) {
    if (state) {
      Object.assign(this, state);
      return;
    }
    this.board = Array(SIZE * SIZE).fill(null);
    this.currentPlayer = 'black';
    this.isGameOver = false;
    this.winner = null;
    this.passes = 0;
  }

  neighbors(index) {
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const result = [];
    for (const [rowDelta, colDelta] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nextRow = row + rowDelta;
      const nextCol = col + colDelta;
      if (nextRow >= 0 && nextRow < SIZE && nextCol >= 0 && nextCol < SIZE) result.push(nextRow * SIZE + nextCol);
    }
    return result;
  }

  group(start) {
    const color = this.board[start];
    const stones = new Set([start]);
    const liberties = new Set();
    const queue = [start];
    while (queue.length) {
      const index = queue.pop();
      for (const neighbor of this.neighbors(index)) {
        if (this.board[neighbor] === null) liberties.add(neighbor);
        else if (this.board[neighbor] === color && !stones.has(neighbor)) {
          stones.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return { stones, liberties };
  }

  move(from, to) {
    if (this.isGameOver || (from !== null && from !== undefined) || !Number.isInteger(to) || to < 0 || to >= this.board.length || this.board[to]) {
      return { success: false, error: 'Go stones are placed on empty intersections.' };
    }
    this.board[to] = this.currentPlayer;
    const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
    let captured = 0;
    for (const neighbor of this.neighbors(to)) {
      if (this.board[neighbor] === opponent) {
        const group = this.group(neighbor);
        if (!group.liberties.size) {
          for (const stone of group.stones) this.board[stone] = null;
          captured += group.stones.size;
        }
      }
    }
    if (!this.group(to).liberties.size && captured === 0) {
      this.board[to] = null;
      return { success: false, error: 'Suicide is not allowed.' };
    }
    this.passes = 0;
    this.currentPlayer = opponent;
    return { success: true, captured };
  }

  pass() {
    if (this.isGameOver) return { success: false, error: 'The game has ended.' };
    this.passes++;
    if (this.passes >= 2) {
      this.isGameOver = true;
      this.winner = 'score by territory';
    } else {
      this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    }
    return { success: true };
  }

  toState() {
    return { board: this.board.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner, passes: this.passes };
  }

  static fromState(state) { return state ? new Go(state) : new Go(); }
}

module.exports = Go;
