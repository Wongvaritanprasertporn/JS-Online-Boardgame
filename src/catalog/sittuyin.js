class Sittuyin {
  constructor(state = null) {
    if (state) {
      this.board = state.board.map((row) => row.slice());
      this.currentPlayer = state.currentPlayer;
      this.phase = state.phase;
      this.deployed = { ...state.deployed };
      this.isGameOver = state.isGameOver;
      this.winner = state.winner;
      return;
    }
    this.board = Array.from({ length: 8 }, () => Array(8).fill(null));
    this.currentPlayer = 'red';
    this.phase = 'deployment';
    this.deployed = { red: [], black: [] };
    this.isGameOver = false;
    this.winner = null;
    for (let col = 0; col < 8; col++) {
      this.board[1][col] = { color: 'black', type: 'pawn' };
      this.board[6][col] = { color: 'red', type: 'pawn' };
    }
  }

  inBounds(row, col) { return row >= 0 && row < 8 && col >= 0 && col < 8; }
  ownHalf(row, color) { return color === 'red' ? row >= 4 : row <= 3; }
  pathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = Math.sign(toRow - fromRow); const colStep = Math.sign(toCol - fromCol);
    let row = fromRow + rowStep; let col = fromCol + colStep;
    while (row !== toRow || col !== toCol) { if (this.board[row][col]) return false; row += rowStep; col += colStep; }
    return true;
  }

  deploy(type, row, col) {
    const pieces = ['king', 'general', 'elephant', 'elephant', 'horse', 'horse', 'chariot', 'chariot'];
    if (this.phase !== 'deployment' || !this.inBounds(row, col) || !this.ownHalf(row, this.currentPlayer) || this.board[row][col]) return { success: false, error: 'Invalid deployment square.' };
    if (!pieces.includes(type) || this.deployed[this.currentPlayer].filter((item) => item === type).length >= pieces.filter((item) => item === type).length) return { success: false, error: 'That piece is unavailable.' };
    this.board[row][col] = { color: this.currentPlayer, type };
    this.deployed[this.currentPlayer].push(type);
    if (this.deployed.red.length === 8 && this.deployed.black.length === 8) this.phase = 'play';
    else this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
    return { success: true };
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    if (this.phase !== 'play' || this.isGameOver || !this.inBounds(fromRow, fromCol) || !this.inBounds(toRow, toCol)) return false;
    const piece = this.board[fromRow][fromCol]; const target = this.board[toRow][toCol];
    if (!piece || piece.color !== this.currentPlayer || target?.color === piece.color) return false;
    const dr = toRow - fromRow; const dc = toCol - fromCol; const adr = Math.abs(dr); const adc = Math.abs(dc);
    if (piece.type === 'king') return adr <= 1 && adc <= 1 && adr + adc > 0;
    if (piece.type === 'general') return adr === 1 && adc === 1;
    if (piece.type === 'horse') return (adr === 2 && adc === 1) || (adr === 1 && adc === 2);
    if (piece.type === 'elephant') return (adr === 1 && adc === 1) || (dr === (piece.color === 'red' ? -1 : 1) && dc === 0);
    if (piece.type === 'chariot') return (dr === 0 || dc === 0) && this.pathClear(fromRow, fromCol, toRow, toCol);
    const forward = piece.color === 'red' ? -1 : 1;
    return (dr === forward && dc === 0) || (dr === forward && adc === 1 && Boolean(target));
  }

  getValidMoves(row, col) {
    const moves = [];
    for (let targetRow = 0; targetRow < 8; targetRow++) for (let targetCol = 0; targetCol < 8; targetCol++) if (this.isValidMove(row, col, targetRow, targetCol)) moves.push({ row: targetRow, col: targetCol });
    return moves;
  }

  move(fromRow, fromCol, toRow, toCol) {
    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) return { success: false, error: 'Invalid move.' };
    const piece = this.board[fromRow][fromCol]; const captured = this.board[toRow][toCol];
    this.board[toRow][toCol] = piece; this.board[fromRow][fromCol] = null;
    if (captured?.type === 'king') { this.isGameOver = true; this.winner = piece.color; }
    else this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
    return { success: true, captured };
  }

  toState() { return { board: this.board.map((row) => row.slice()), currentPlayer: this.currentPlayer, phase: this.phase, deployed: { red: [...this.deployed.red], black: [...this.deployed.black] }, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new Sittuyin(state) : new Sittuyin(); }
}

module.exports = Sittuyin;
