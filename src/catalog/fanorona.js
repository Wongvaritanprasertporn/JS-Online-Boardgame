const ROWS = 5;
const COLS = 9;

class Fanorona {
  constructor(state = null) {
    if (state) {
      Object.assign(this, state);
      return;
    }
    this.board = Array(ROWS * COLS).fill(null);
    for (let index = 0; index < this.board.length; index++) {
      const row = Math.floor(index / COLS);
      if (row < 2) this.board[index] = 'black';
      else if (row > 2) this.board[index] = 'white';
      else if (index % 2 === 0) this.board[index] = 'black';
    }
    this.board[22] = null;
    this.currentPlayer = 'black';
    this.isGameOver = false;
    this.winner = null;
  }

  coordinates(index) { return [Math.floor(index / COLS), index % COLS]; }
  index(row, col) { return row * COLS + col; }

  directions(from, to) {
    const [fromRow, fromCol] = this.coordinates(from);
    const [toRow, toCol] = this.coordinates(to);
    const rowDelta = Math.sign(toRow - fromRow);
    const colDelta = Math.sign(toCol - fromCol);
    if (Math.abs(toRow - fromRow) > 1 || Math.abs(toCol - fromCol) > 1 || (!rowDelta && !colDelta)) return null;
    return [rowDelta, colDelta];
  }

  move(from, to) {
    if (this.isGameOver || !Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0 || from >= this.board.length || to >= this.board.length) return { success: false, error: 'Choose two valid points.' };
    if (this.board[from] !== this.currentPlayer || this.board[to]) return { success: false, error: 'Choose one of your pieces and an empty adjacent point.' };
    const direction = this.directions(from, to);
    if (!direction) return { success: false, error: 'Fanorona pieces move to adjacent points.' };
    this.board[to] = this.currentPlayer;
    this.board[from] = null;
    const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
    const [rowDelta, colDelta] = direction;
    const [toRow, toCol] = this.coordinates(to);
    const [fromRow, fromCol] = this.coordinates(from);
    const approach = this.captureLine(toRow + rowDelta, toCol + colDelta, rowDelta, colDelta, opponent);
    const withdraw = this.captureLine(fromRow - rowDelta, fromCol - colDelta, -rowDelta, -colDelta, opponent);
    let captured = 0;
    for (const point of [...approach, ...withdraw]) {
      if (this.board[point] === opponent) {
        this.board[point] = null;
        captured++;
      }
    }
    if (!this.board.includes(opponent)) {
      this.isGameOver = true;
      this.winner = this.currentPlayer;
    } else this.currentPlayer = opponent;
    return { success: true, captured };
  }

  captureLine(row, col, rowDelta, colDelta, opponent) {
    const captured = [];
    while (row >= 0 && row < ROWS && col >= 0 && col < COLS && this.board[this.index(row, col)] === opponent) {
      captured.push(this.index(row, col));
      row += rowDelta;
      col += colDelta;
    }
    return captured;
  }

  toState() { return { board: this.board.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new Fanorona(state) : new Fanorona(); }
}

module.exports = Fanorona;
