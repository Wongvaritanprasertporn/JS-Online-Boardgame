const Xiangqi = require('./xiangqi');

class Janggi extends Xiangqi {
  constructor(state = null) {
    super(state);
    if (!state) {
      this.currentPlayer = 'blue';
      this.board = Array.from({ length: 10 }, () => Array(9).fill(null));
      this.setupJanggi();
    }
  }

  setupJanggi() {
    const back = ['chariot', 'horse', 'elephant', 'advisor', 'general', 'advisor', 'elephant', 'horse', 'chariot'];
    back.forEach((type, col) => {
      this.board[0][col] = { color: 'blue', type };
      this.board[9][col] = { color: 'red', type };
    });
    [1, 7].forEach((col) => {
      this.board[2][col] = { color: 'blue', type: 'cannon' };
      this.board[7][col] = { color: 'red', type: 'cannon' };
    });
    [0, 2, 4, 6, 8].forEach((col) => {
      this.board[3][col] = { color: 'blue', type: 'soldier' };
      this.board[6][col] = { color: 'red', type: 'soldier' };
    });
  }

  palace(row, col) {
    return col >= 3 && col <= 5 && (row <= 2 || row >= 7);
  }

  elephantMoves(fromRow, fromCol, toRow, toCol) {
    const patterns = [
      [-1, -2], [-1, 2], [1, -2], [1, 2],
      [-2, -1], [-2, 1], [2, -1], [2, 1]
    ];
    if (!patterns.some(([row, col]) => row === toRow - fromRow && col === toCol - fromCol)) return false;
    const rowStep = Math.sign(toRow - fromRow);
    const colStep = Math.sign(toCol - fromCol);
    const first = [fromRow + rowStep, fromCol];
    const second = [fromRow + rowStep * 2, fromCol + colStep];
    return !this.board[first[0]][first[1]] && !this.board[second[0]][second[1]];
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

    if (piece.type === 'general' || piece.type === 'advisor') {
      return this.palace(toRow, toCol) && adr <= 1 && adc <= 1 && adr + adc > 0;
    }
    if (piece.type === 'elephant') return this.elephantMoves(fromRow, fromCol, toRow, toCol);
    if (piece.type === 'horse') {
      if (!((adr === 2 && adc === 1) || (adr === 1 && adc === 2))) return false;
      const legRow = adr === 2 ? fromRow + dr / 2 : fromRow;
      const legCol = adc === 2 ? fromCol + dc / 2 : fromCol;
      return !this.board[legRow][legCol];
    }
    if (piece.type === 'chariot') return (dr === 0 || dc === 0) && this.pathClear(fromRow, fromCol, toRow, toCol);
    if (piece.type === 'cannon') {
      if (dr !== 0 && dc !== 0 || target?.type === 'cannon') return false;
      return this.countBetween(fromRow, fromCol, toRow, toCol) === 1;
    }
    const forward = piece.color === 'red' ? -1 : 1;
    const inEnemyPalace = piece.color === 'red' ? toRow <= 2 : toRow >= 7;
    return (dr === forward && dc === 0) || (dr === 0 && adc === 1) || (inEnemyPalace && dr === forward && adc === 1);
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
      this.currentPlayer = this.currentPlayer === 'red' ? 'blue' : 'red';
    }
    return { success: true, captured };
  }

  toState() {
    return { board: this.board.map((row) => row.slice()), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner };
  }

  static fromState(state) { return state ? new Janggi(state) : new Janggi(); }
}

module.exports = Janggi;
