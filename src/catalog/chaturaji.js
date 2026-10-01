const BOARD_SIZE = 8;
const PLAYERS = ['red', 'blue', 'yellow', 'green'];
const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
const PIECE_VALUES = { pawn: 1, boat: 2, horse: 3, elephant: 4, king: 5 };

class Chaturaji {
  constructor(state = null) {
    if (state) {
      Object.assign(this, state);
      this.board = state.board.map((row) => row.slice());
      return;
    }

    this.board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
    this.currentPlayer = PLAYERS[0];
    this.players = PLAYERS.map((color) => ({ color, score: 0, active: true }));
    this.isGameOver = false;
    this.winner = null;
    this.setupBoard();
  }

  setupBoard() {
    const armies = [
      { color: 'red', row: 0, pawnRow: 1, pieces: ['boat', 'horse', 'elephant', 'king'] },
      { color: 'blue', row: 7, pawnRow: 6, pieces: ['king', 'elephant', 'horse', 'boat'] },
      { color: 'yellow', col: 0, pawnCol: 1, pieces: ['boat', 'horse', 'elephant', 'king'] },
      { color: 'green', col: 7, pawnCol: 6, pieces: ['king', 'elephant', 'horse', 'boat'] }
    ];

    for (const army of armies) {
      army.pieces.forEach((type, index) => {
        const position = army.row !== undefined ? [army.row, index + 2] : [index + 2, army.col];
        const pawn = army.row !== undefined ? [army.pawnRow, index + 2] : [index + 2, army.pawnCol];
        this.board[position[0]][position[1]] = { color: army.color, type };
        this.board[pawn[0]][pawn[1]] = { color: army.color, type: 'pawn' };
      });
    }
  }

  inBounds(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  }

  getValidMoves(fromRow, fromCol) {
    const piece = this.board[fromRow]?.[fromCol];
    if (!piece || piece.color !== this.currentPlayer) return [];
    const moves = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (this.isValidMove(fromRow, fromCol, row, col)) moves.push({ row, col });
      }
    }
    return moves;
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    if (this.isGameOver || !this.inBounds(fromRow, fromCol) || !this.inBounds(toRow, toCol)) return false;
    const piece = this.board[fromRow][fromCol];
    const target = this.board[toRow][toCol];
    if (!piece || piece.color !== this.currentPlayer || target?.color === piece.color) return false;
    const rowDelta = toRow - fromRow;
    const colDelta = toCol - fromCol;
    const absoluteRow = Math.abs(rowDelta);
    const absoluteCol = Math.abs(colDelta);

    if (piece.type === 'king') return absoluteRow <= 1 && absoluteCol <= 1 && (absoluteRow + absoluteCol > 0);
    if (piece.type === 'horse') return (absoluteRow === 2 && absoluteCol === 1) || (absoluteRow === 1 && absoluteCol === 2);
    if (piece.type === 'boat') return absoluteRow === 2 && absoluteCol === 2;
    if (piece.type === 'pawn') {
      const direction = piece.color === 'red' ? 1 : piece.color === 'blue' ? -1 : piece.color === 'yellow' ? 0 : 0;
      const sideDirection = piece.color === 'yellow' ? 1 : piece.color === 'green' ? -1 : 0;
      const forward = (direction && colDelta === 0 && rowDelta === direction && !target) || (sideDirection && rowDelta === 0 && colDelta === sideDirection && !target);
      const capture = piece.color === 'red' || piece.color === 'blue'
        ? rowDelta === direction && absoluteCol === 1 && Boolean(target)
        : colDelta === sideDirection && absoluteRow === 1 && Boolean(target);
      return forward || capture;
    }

    if (piece.type === 'elephant') {
      if (rowDelta !== 0 && colDelta !== 0) return false;
      const stepRow = Math.sign(rowDelta);
      const stepCol = Math.sign(colDelta);
      let row = fromRow + stepRow;
      let col = fromCol + stepCol;
      while (row !== toRow || col !== toCol) {
        if (this.board[row][col]) return false;
        row += stepRow;
        col += stepCol;
      }
      return true;
    }
    return false;
  }

  move(fromRow, fromCol, toRow, toCol) {
    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) return { success: false, error: 'Invalid move.' };
    const piece = this.board[fromRow][fromCol];
    const captured = this.board[toRow][toCol];
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
    if (captured) {
      const player = this.players.find((entry) => entry.color === this.currentPlayer);
      player.score += PIECE_VALUES[captured.type] || 0;
      if (captured.type === 'king') {
        const defeated = this.players.find((entry) => entry.color === captured.color);
        defeated.active = false;
      }
    }
    this.advanceTurn();
    return { success: true, captured };
  }

  advanceTurn() {
    const start = PLAYERS.indexOf(this.currentPlayer);
    for (let offset = 1; offset <= PLAYERS.length; offset++) {
      const next = PLAYERS[(start + offset) % PLAYERS.length];
      if (this.players.find((entry) => entry.color === next).active) {
        this.currentPlayer = next;
        break;
      }
    }
    const active = this.players.filter((entry) => entry.active);
    if (active.length <= 1) {
      this.isGameOver = true;
      this.winner = active[0]?.color || null;
    }
  }

  toState() {
    return {
      board: this.board.map((row) => row.slice()),
      currentPlayer: this.currentPlayer,
      players: this.players.map((player) => ({ ...player })),
      isGameOver: this.isGameOver,
      winner: this.winner
    };
  }

  static fromState(state) {
    return state ? new Chaturaji(state) : new Chaturaji();
  }
}

module.exports = Chaturaji;
