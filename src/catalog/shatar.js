class Shatar {
  constructor(state = null) {
    if (state) {
      this.board = state.board.map((row) => row.slice());
      this.currentPlayer = state.currentPlayer;
      this.isGameOver = state.isGameOver;
      this.winner = state.winner;
      return;
    }
    this.board = Array.from({ length: 8 }, () => Array(8).fill(null));
    this.currentPlayer = 'white';
    this.isGameOver = false;
    this.winner = null;
    this.setup();
  }

  setup() {
    const back = ['rook', 'horse', 'bishop', 'baras', 'king', 'bishop', 'horse', 'rook'];
    back.forEach((type, col) => {
      this.board[0][col] = { color: 'black', type };
      this.board[7][col] = { color: 'white', type };
    });
    for (let col = 0; col < 8; col++) {
      this.board[1][col] = { color: 'black', type: 'pawn', moved: false };
      this.board[6][col] = { color: 'white', type: 'pawn', moved: false };
    }
  }

  inBounds(row, col) { return row >= 0 && row < 8 && col >= 0 && col < 8; }
  pathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = Math.sign(toRow - fromRow); const colStep = Math.sign(toCol - fromCol);
    let row = fromRow + rowStep; let col = fromCol + colStep;
    while (row !== toRow || col !== toCol) { if (this.board[row][col]) return false; row += rowStep; col += colStep; }
    return true;
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    if (this.isGameOver || !this.inBounds(fromRow, fromCol) || !this.inBounds(toRow, toCol)) return false;
    const piece = this.board[fromRow][fromCol]; const target = this.board[toRow][toCol];
    if (!piece || piece.color !== this.currentPlayer || target?.color === piece.color) return false;
    const dr = toRow - fromRow; const dc = toCol - fromCol; const adr = Math.abs(dr); const adc = Math.abs(dc);
    if (piece.type === 'king') return adr <= 1 && adc <= 1 && adr + adc > 0;
    if (piece.type === 'baras') return (dr === 0 || dc === 0 || adr === adc) && this.pathClear(fromRow, fromCol, toRow, toCol);
    if (piece.type === 'bishop') return adr === adc && this.pathClear(fromRow, fromCol, toRow, toCol);
    if (piece.type === 'rook') return (dr === 0 || dc === 0) && this.pathClear(fromRow, fromCol, toRow, toCol);
    if (piece.type === 'horse') return (adr === 2 && adc === 1) || (adr === 1 && adc === 2);
    const forward = piece.color === 'white' ? -1 : 1;
    const single = dr === forward && dc === 0 && !target;
    const capture = dr === forward && adc === 1 && Boolean(target);
    const double = !piece.moved && (piece.color === 'white' ? fromRow === 6 : fromRow === 1) && [3, 4].includes(fromCol) && dc === 0 && dr === forward * 2 && !target && !this.board[fromRow + forward][fromCol];
    return single || capture || double;
  }

  getValidMoves(row, col) {
    const moves = [];
    for (let targetRow = 0; targetRow < 8; targetRow++) for (let targetCol = 0; targetCol < 8; targetCol++) if (this.isValidMove(row, col, targetRow, targetCol)) moves.push({ row: targetRow, col: targetCol });
    return moves;
  }

  move(fromRow, fromCol, toRow, toCol) {
    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) return { success: false, error: 'Invalid move.' };
    const piece = this.board[fromRow][fromCol]; const captured = this.board[toRow][toCol];
    this.board[toRow][toCol] = piece; this.board[fromRow][fromCol] = null; piece.moved = true;
    if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) piece.type = 'baras';
    if (captured?.type === 'king') { this.isGameOver = true; this.winner = piece.color; }
    else this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    return { success: true, captured };
  }

  toState() { return { board: this.board.map((row) => row.slice()), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new Shatar(state) : new Shatar(); }
}

module.exports = Shatar;
