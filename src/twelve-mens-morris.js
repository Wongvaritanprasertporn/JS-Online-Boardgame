class TwelveMensMorris {
  constructor(state = null) {
    if (state) {
      this.board = state.board.slice();
      this.currentPlayer = state.currentPlayer;
      this.phase = state.phase; // 'placement', 'movement', 'flying'
      this.phaseComplete = state.phaseComplete;
      this.isGameOver = state.isGameOver;
      this.winner = state.winner;
      return;
    }

    // Initialize empty board (24 positions)
    this.board = new Array(24).fill(null);
    this.currentPlayer = 'black';
    this.phase = 'placement'; // placement phase
    this.phaseComplete = { black: false, white: false };
    this.isGameOver = false;
    this.winner = null;
  }

  // Board connectivity - which positions are adjacent
  getAdjacentPositions(position) {
    const adjacency = {
      0: [1, 9],
      1: [0, 2, 4],
      2: [1, 3],
      3: [4, 10],
      4: [1, 3, 5, 7],
      5: [4, 6],
      6: [5, 7, 13],
      7: [4, 6, 8],
      8: [7, 12],
      9: [0, 10, 21],
      10: [3, 9, 11, 19],
      11: [10, 12, 18],
      12: [8, 11, 13],
      13: [6, 12, 14],
      14: [13, 15, 23],
      15: [14, 16, 22],
      16: [15, 17, 19],
      17: [16, 18],
      18: [11, 17, 20],
      19: [10, 16, 20],
      20: [18, 19],
      21: [9, 22],
      22: [15, 21, 23],
      23: [14, 22]
    };
    return adjacency[position] || [];
  }

  // Define all mills (3-in-a-row combinations)
  getMills() {
    return [
      // Horizontal and vertical lines
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [9, 10, 11], [15, 16, 17], [18, 19, 20],
      [21, 22, 23], [12, 13, 14],
      // Diagonal lines
      [0, 9, 21], [3, 10, 19], [6, 13, 23],
      [1, 4, 7], [16, 19, 22], [8, 12, 17],
      [5, 14, 20], [2, 11, 18]
    ];
  }

  // Check if a position is part of a completed mill
  isInMill(position, board = null) {
    board = board || this.board;
    const player = board[position];
    if (!player) return false;

    const mills = this.getMills();
    for (const mill of mills) {
      if (mill.includes(position)) {
        // Check if all three positions in this mill are occupied by the same player
        if (mill.every((pos) => board[pos] === player)) {
          return true;
        }
      }
    }
    return false;
  }

  // Placement phase: place a piece
  placePiece(position) {
    if (this.phase !== 'placement') {
      return { success: false, error: 'Not in placement phase' };
    }

    if (this.board[position] !== null) {
      return { success: false, error: 'Position already occupied' };
    }

    this.board[position] = this.currentPlayer;

    // Check for mill
    const madeMill = this.isInMill(position);

    // Check if placement phase is complete for current player
    const piecesPlaced = this.board.filter((p) => p === this.currentPlayer).length;
    if (piecesPlaced === 12) {
      this.phaseComplete[this.currentPlayer] = true;
    }

    // Check if both players have placed all pieces
    if (this.phaseComplete.black && this.phaseComplete.white) {
      this.phase = 'movement';
    }

    // Switch turn only if no mill was made (or after capture)
    if (!madeMill) {
      this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    }

    return { success: true, madeMill };
  }

  // Capture opponent piece
  capturePiece(position) {
    const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
    if (this.board[position] !== opponent) {
      return { success: false, error: 'Invalid target' };
    }

    if (this.isInMill(position)) {
      return { success: false, error: 'Cannot capture piece in a mill' };
    }

    this.board[position] = null;

    // Check win condition
    const opponentCount = this.board.filter((p) => p === opponent).length;
    if (opponentCount < 3) {
      this.isGameOver = true;
      this.winner = this.currentPlayer;
    }

    // Switch turn after capture
    this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';

    return { success: true };
  }

  // Movement phase: move a piece
  movePiece(from, to) {
    if (this.phase === 'placement') {
      return { success: false, error: 'Still in placement phase' };
    }

    if (this.board[from] !== this.currentPlayer) {
      return { success: false, error: 'Invalid piece' };
    }

    if (this.board[to] !== null) {
      return { success: false, error: 'Target position occupied' };
    }

    // Check if player is in flying phase (3 pieces)
    const playerPieces = this.board.filter((p) => p === this.currentPlayer).length;
    const canFly = playerPieces === 3;

    if (!canFly) {
      // Normal move: must be adjacent
      const adjacent = this.getAdjacentPositions(from);
      if (!adjacent.includes(to)) {
        return { success: false, error: 'Target not adjacent' };
      }
    }

    this.board[from] = null;
    this.board[to] = this.currentPlayer;

    // Check for mill
    const madeMill = this.isInMill(to);

    // Switch turn only if no mill was made (or after capture)
    if (!madeMill) {
      this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    }

    return { success: true, madeMill };
  }

  // Convert game state to JSON-serializable format
  toState() {
    return {
      board: this.board.slice(),
      currentPlayer: this.currentPlayer,
      phase: this.phase,
      phaseComplete: { ...this.phaseComplete },
      isGameOver: this.isGameOver,
      winner: this.winner
    };
  }

  // Create game instance from saved state
  static fromState(state) {
    if (!state) return new TwelveMensMorris();
    return new TwelveMensMorris(state);
  }

  // Get current piece counts
  getPieceCount(player) {
    return this.board.filter((p) => p === player).length;
  }

  // Get valid positions for placement
  getValidPlacementPositions() {
    return this.board
      .map((piece, idx) => (piece === null ? idx : null))
      .filter((idx) => idx !== null);
  }

  // Get valid moves for a position
  getValidMoves(position) {
    if (this.board[position] !== this.currentPlayer) return [];

    const playerPieces = this.getPieceCount(this.currentPlayer);
    const canFly = playerPieces === 3;

    const validMoves = [];
    for (let i = 0; i < 24; i++) {
      if (this.board[i] === null) {
        if (canFly || this.getAdjacentPositions(position).includes(i)) {
          validMoves.push(i);
        }
      }
    }
    return validMoves;
  }

  // Get valid capture targets
  getValidCaptureTargets() {
    const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
    return this.board
      .map((piece, idx) => {
        if (piece === opponent && !this.isInMill(idx)) {
          return idx;
        }
        return null;
      })
      .filter((idx) => idx !== null);
  }
}

module.exports = TwelveMensMorris;
