class FiveFieldKono {
  constructor(state = null) {
    if (state) {
      this.board = state.board.slice();
      this.currentPlayer = state.currentPlayer;
      this.isGameOver = state.isGameOver;
      this.winner = state.winner;
      return;
    }

    // 5-field board: center + 4 corners arranged in a cross
    // Positions: 0=center, 1=top, 2=right, 3=bottom, 4=left
    this.board = [null, 'black', null, 'white', null];
    // Black at top (position 1), white at bottom (position 3)
    this.currentPlayer = 'black';
    this.isGameOver = false;
    this.winner = null;
  }

  // Board layout:
  //       1(black)
  //        |
  // 4 --- 0(center) --- 2
  //        |
  //       3(white)

  // Adjacent positions for each field
  getAdjacentPositions(position) {
    const adjacency = {
      0: [1, 2, 3, 4],  // center connects to all
      1: [0, 2, 4],      // top connects to center, right, left
      2: [0, 1, 3],      // right connects to center, top, bottom
      3: [0, 2, 4],      // bottom connects to center, right, left
      4: [0, 1, 3]       // left connects to center, top, bottom
    };
    return adjacency[position] || [];
  }

  // Check if a move is valid (move or jump)
  isValidMove(from, to) {
    if (this.board[from] !== this.currentPlayer) {
      return false;
    }
    if (this.board[to] !== null) {
      return false;
    }

    const adjacent = this.getAdjacentPositions(from);
    
    // Simple move to adjacent empty field
    if (adjacent.includes(to)) {
      return true;
    }

    // Check for jump move (jump over opponent to capture)
    for (let mid of adjacent) {
      const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
      if (this.board[mid] === opponent) {
        // Check if position on opposite side is empty and in adjacency
        const midAdjacent = this.getAdjacentPositions(mid);
        if (midAdjacent.includes(to) && this.board[to] === null) {
          return true;
        }
      }
    }

    return false;
  }

  // Get valid moves for a position
  getValidMoves(from) {
    const validMoves = [];
    for (let i = 0; i < 5; i++) {
      if (i !== from && this.isValidMove(from, i)) {
        validMoves.push(i);
      }
    }
    return validMoves;
  }

  // Execute a move
  handleMove(from, to) {
    if (!this.isValidMove(from, to)) {
      return { success: false, error: 'Invalid move' };
    }

    const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
    const adjacent = this.getAdjacentPositions(from);
    let captured = false;

    // Check if this is a jump (capture)
    for (let mid of adjacent) {
      if (this.board[mid] === opponent) {
        const midAdjacent = this.getAdjacentPositions(mid);
        if (midAdjacent.includes(to) && this.board[to] === null) {
          // This is a capture move
          this.board[from] = null;
          this.board[mid] = null;  // Remove captured piece
          this.board[to] = this.currentPlayer;
          captured = true;
          break;
        }
      }
    }

    // If not a capture, it's a simple move
    if (!captured) {
      this.board[from] = null;
      this.board[to] = this.currentPlayer;
    }

    // Check win conditions
    this.checkGameOver();

    // Switch turn
    this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';

    return { success: true, captured };
  }

  // Check if game is over
  checkGameOver() {
    const blackCount = this.board.filter(p => p === 'black').length;
    const whiteCount = this.board.filter(p => p === 'white').length;

    // Win if opponent has no pieces
    if (blackCount === 0) {
      this.isGameOver = true;
      this.winner = 'white';
      return;
    }
    if (whiteCount === 0) {
      this.isGameOver = true;
      this.winner = 'black';
      return;
    }

    // Check for stalemate (no valid moves for current player)
    let hasValidMove = false;
    for (let i = 0; i < 5; i++) {
      if (this.board[i] === this.currentPlayer) {
        if (this.getValidMoves(i).length > 0) {
          hasValidMove = true;
          break;
        }
      }
    }

    if (!hasValidMove) {
      // If blocked, switch to other player
      const other = this.currentPlayer === 'black' ? 'white' : 'black';
      this.currentPlayer = other;
      
      // Check if other player also has no moves (draw)
      let otherHasMove = false;
      for (let i = 0; i < 5; i++) {
        if (this.board[i] === other) {
          if (this.getValidMoves(i).length > 0) {
            otherHasMove = true;
            break;
          }
        }
      }

      if (!otherHasMove) {
        this.isGameOver = true;
        this.winner = null; // Draw
      }
    }
  }

  // Get piece count
  getPieceCount(player) {
    return this.board.filter(p => p === player).length;
  }

  // Get valid positions for a player's pieces
  getPlayerPieces(player) {
    const pieces = [];
    for (let i = 0; i < 5; i++) {
      if (this.board[i] === player) {
        pieces.push(i);
      }
    }
    return pieces;
  }

  // Serialize to state
  toState() {
    return {
      board: this.board.slice(),
      currentPlayer: this.currentPlayer,
      isGameOver: this.isGameOver,
      winner: this.winner
    };
  }

  // Create from state
  static fromState(state) {
    if (!state) return new FiveFieldKono();
    return new FiveFieldKono(state);
  }
}

module.exports = FiveFieldKono;
