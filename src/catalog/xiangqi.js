const ROWS = 10;
const COLS = 9;
const COLORS = ['red', 'black'];

class Xiangqi {
  constructor(state = null) {
    if (state) {
      this.board = state.board.map((row) => row.slice());
      this.currentPlayer = state.currentPlayer;
      this.isGameOver = state.isGameOver;
      this.winner = state.winner;
      return;
    }

    this.board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    this.currentPlayer = 'red';
    this.isGameOver = false;
    this.winner = null;
    this.setup();
  }

  setup() {
    const back = ['chariot', 'horse', 'elephant', 'advisor', 'general', 'advisor', 'elephant', 'horse', 'chariot'];
    back.forEach((type, col) => {
      this.board[0][col] = { color: 'black', type };
      this.board[9][col] = { color: 'red', type };
    });
    [1, 7].forEach((col) => {
      this.board[2][col] = { color: 'black', type: 'cannon' };
      this.board[7][col] = { color: 'red', type: 'cannon' };
    });
    [0, 2, 4, 6, 8].forEach((col) => {
      this.board[3][col] = { color: 'black', type: 'soldier' };
      this.board[6][col] = { color: 'red', type: 'soldier' };
    });
  }

  inBounds(row, col) { return row >= 0 && row < ROWS && col >= 0 && col < COLS; }
  enemy(piece, target) { return target && target.color !== piece.color; }
  palace(row, col, color) {
    return col >= 3 && col <= 5 && (color === 'red' ? row >= 7 : row <= 2);
  }

  pathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = Math.sign(toRow - fromRow);
    const colStep = Math.sign(toCol - fromCol);
    let row = fromRow + rowStep;
    let col = fromCol + colStep;
    while (row !== toRow || col !== toCol) {
      if (this.board[row][col]) return false;
      row += rowStep;
      col += colStep;
    }
    return true;
  }

  countBetween(fromRow, fromCol, toRow, toCol) {
    const rowStep = Math.sign(toRow - fromRow);
    const colStep = Math.sign(toCol - fromCol);
    let count = 0;
    let row = fromRow + rowStep;
    let col = fromCol + colStep;
    while (row !== toRow || col !== toCol) {
      if (this.board[row][col]) count++;
      row += rowStep;
      col += colStep;
    }
    return count;
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    if (this.isGameOver || !this.inBounds(fromRow, fromCol) || !this.inBounds(toRow, toCol)) return false;
    const piece = this.board[fromRow][fromCol];
    const target = this.board[toRow][toCol];
    if (!piece || piece.color !== this.currentPlayer || target?.color === piece.color) return false;
    const dr = toRow - fromRow;
    const dc = toCol - fromCol;
    const adr = Math.abs(dr);
    const adc = Math.abs(dc);

    if (piece.type === 'general') {
      return this.palace(toRow, toCol, piece.color) && adr + adc === 1;
    }
    if (piece.type === 'advisor') {
      return this.palace(toRow, toCol, piece.color) && adr === 1 && adc === 1;
    }
    if (piece.type === 'elephant') {
      const middleRow = fromRow + dr / 2;
      const middleCol = fromCol + dc / 2;
      return adr === 2 && adc === 2 && piece.color === 'red' ? toRow >= 5 && !this.board[middleRow][middleCol] : adr === 2 && adc === 2 && toRow <= 4 && !this.board[middleRow][middleCol];
    }
    if (piece.type === 'horse') {
      if (!((adr === 2 && adc === 1) || (adr === 1 && adc === 2))) return false;
      const legRow = adr === 2 ? fromRow + dr / 2 : fromRow;
      const legCol = adc === 2 ? fromCol + dc / 2 : fromCol;
      return !this.board[legRow][legCol];
    }
    if (piece.type === 'chariot') {
      return (dr === 0 || dc === 0) && this.pathClear(fromRow, fromCol, toRow, toCol);
    }
    if (piece.type === 'cannon') {
      if (dr !== 0 && dc !== 0) return false;
      const screens = this.countBetween(fromRow, fromCol, toRow, toCol);
      return target ? screens === 1 : screens === 0;
    }
    const forward = piece.color === 'red' ? -1 : 1;
    const crossed = piece.color === 'red' ? fromRow <= 4 : fromRow >= 5;
    return (dr === forward && dc === 0) || (crossed && dr === 0 && adc === 1);
  }

  getValidMoves(row, col) {
    const moves = [];
    for (let targetRow = 0; targetRow < ROWS; targetRow++) {
      for (let targetCol = 0; targetCol < COLS; targetCol++) {
        if (this.isValidMove(row, col, targetRow, targetCol)) moves.push({ row: targetRow, col: targetCol });
      }
    }
    return moves;
  }

  move(fromRow, fromCol, toRow, toCol) {
    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) return { success: false, error: 'Invalid move.' };
    const piece = this.board[fromRow][fromCol];
    const captured = this.board[toRow][toCol];
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
    if (captured?.type === 'general') {
      this.isGameOver = true;
      this.winner = piece.color;
    } else {
      this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
    }
    return { success: true, captured };
  }

  toState() {
    return { board: this.board.map((row) => row.slice()), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner };
  }

  static fromState(state) { return state ? new Xiangqi(state) : new Xiangqi(); }
}

module.exports = Xiangqi;
