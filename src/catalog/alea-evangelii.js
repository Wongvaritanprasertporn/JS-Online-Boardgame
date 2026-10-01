const SIZE = 19;

class AleaEvangelii {
  constructor(state = null) {
    if (state) {
      this.board = state.board.map((row) => row.slice ? row.slice() : row);
      this.currentPlayer = state.currentPlayer || 'attackers';
      this.isGameOver = !!state.isGameOver;
      this.winner = state.winner || null;
      return;
    }

    this.board = Array(SIZE * SIZE).fill(null);
    this.currentPlayer = 'attackers';
    this.isGameOver = false;
    this.winner = null;
    this.setup();
  }

  setup() {
    const kingIndex = 9 * SIZE + 9;
    this.board[kingIndex] = { color: 'defenders', type: 'king' };

    const defenderPositions = [
      [8, 8], [8, 9], [8, 10], [9, 8], [9, 10], [10, 8], [10, 9], [10, 10],
      [7, 9], [9, 7], [11, 9], [9, 11], [8, 7], [7, 8], [8, 11], [11, 8],
      [10, 7], [7, 10], [10, 11], [11, 10], [7, 7], [7, 11], [11, 7], [11, 11]
    ];

    defenderPositions.forEach(([row, col]) => {
      this.board[row * SIZE + col] = { color: 'defenders', type: 'defender' };
    });

    const attackerPositions = [];
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if ((row === 9 && col === 9) || (row >= 7 && row <= 11 && col >= 7 && col <= 11)) {
          continue;
        }
        if ((row === 0 || row === SIZE - 1 || col === 0 || col === SIZE - 1) ||
            (row === 3 || row === 15 || col === 3 || col === 15)) {
          attackerPositions.push([row, col]);
        }
      }
    }

    attackerPositions.forEach(([row, col]) => {
      if (!this.board[row * SIZE + col]) {
        this.board[row * SIZE + col] = { color: 'attackers', type: 'attacker' };
      }
    });

    // Keep the known 2:1 attacker/defender proportion by ensuring it is not overfilled.
    const totalAttackers = attackerPositions.filter(([row, col]) => !this.board[row * SIZE + col] || this.board[row * SIZE + col].color === 'attackers').length;
    if (totalAttackers < 48) {
      const fallback = [
        [0, 3], [0, 4], [0, 5], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5],
        [16, 3], [16, 4], [16, 5], [17, 3], [17, 4], [17, 5], [18, 3], [18, 4], [18, 5],
        [3, 0], [4, 0], [5, 0], [3, 1], [4, 1], [5, 1], [3, 2], [4, 2], [5, 2],
        [3, 16], [4, 16], [5, 16], [3, 17], [4, 17], [5, 17], [3, 18], [4, 18], [5, 18],
        [16, 15], [16, 16], [16, 17], [15, 15], [15, 16], [15, 17], [14, 15], [14, 16], [14, 17],
        [15, 3], [16, 3], [17, 3], [15, 4], [16, 4], [17, 4], [15, 5], [16, 5], [17, 5]
      ];
      fallback.forEach(([row, col]) => {
        const idx = row * SIZE + col;
        if (!this.board[idx]) {
          this.board[idx] = { color: 'attackers', type: 'attacker' };
        }
      });
    }
  }

  inBounds(row, col) {
    return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
  }

  getPiece(row, col) {
    if (!this.inBounds(row, col)) return null;
    return this.board[row * SIZE + col];
  }

  isEdge(row, col) {
    return row === 0 || row === SIZE - 1 || col === 0 || col === SIZE - 1;
  }

  lineClear(fr, fc, tr, tc) {
    const dr = Math.sign(tr - fr);
    const dc = Math.sign(tc - fc);
    let row = fr + dr;
    let col = fc + dc;

    while (row !== tr || col !== tc) {
      if (this.getPiece(row, col)) return false;
      row += dr;
      col += dc;
    }
    return true;
  }

  getValidMoves(row, col) {
    const piece = this.getPiece(row, col);
    if (!piece || piece.color !== this.currentPlayer) return [];

    const moves = [];
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      let r = row + dr;
      let c = col + dc;
      while (this.inBounds(r, c) && !this.getPiece(r, c)) {
        moves.push({ row: r, col: c });
        r += dr;
        c += dc;
      }
    }
    return moves;
  }

  move(from, to, maybeToCol, maybeToRow) {
    let fr;
    let fc;
    let tr;
    let tc;

    if (typeof from === 'object' && from !== null) {
      fr = from.row;
      fc = from.col;
      tr = to.row;
      tc = to.col;
    } else if (typeof from === 'number' && typeof to === 'number' && typeof maybeToCol === 'number') {
      fr = from;
      fc = maybeToCol;
      tr = to;
      tc = maybeToRow;
    } else {
      fr = from;
      fc = to;
      tr = maybeToCol;
      tc = maybeToRow;
    }

    const piece = this.getPiece(fr, fc);
    if (!piece || piece.color !== this.currentPlayer) {
      return { success: false, error: 'Invalid Alea Evangelii piece selection.' };
    }

    if (!this.inBounds(fr, fc) || !this.inBounds(tr, tc) || (fr === tr && fc === tc)) {
      return { success: false, error: 'Invalid Alea Evangelii move.' };
    }

    if (fr !== tr && fc !== tc) {
      return { success: false, error: 'Alea Evangelii moves orthogonally.' };
    }

    if (this.getPiece(tr, tc)) {
      return { success: false, error: 'Destination must be empty.' };
    }

    const dr = Math.sign(tr - fr);
    const dc = Math.sign(tc - fc);
    let row = fr + dr;
    let col = fc + dc;
    while (row !== tr || col !== tc) {
      if (this.getPiece(row, col)) {
        return { success: false, error: 'Pieces cannot jump over occupied cells.' };
      }
      row += dr;
      col += dc;
    }

    this.board[fr * SIZE + fc] = null;
    this.board[tr * SIZE + tc] = piece;

    const king = this.board.findIndex((cell) => cell && cell.type === 'king');
    const kingRow = Math.floor(king / SIZE);
    const kingCol = king % SIZE;
    if (piece.type === 'king' && this.isEdge(tr, tc)) {
      this.isGameOver = true;
      this.winner = 'defenders';
      return { success: true };
    }

    if (king !== -1) {
      const adjacentAttackers = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([drn, dcn]) => {
        const r = kingRow + drn;
        const c = kingCol + dcn;
        const target = this.getPiece(r, c);
        return target && target.color === 'attackers';
      }).length;

      if (adjacentAttackers >= 2) {
        this.isGameOver = true;
        this.winner = 'attackers';
        return { success: true };
      }
    }

    this.currentPlayer = this.currentPlayer === 'attackers' ? 'defenders' : 'attackers';
    return { success: true };
  }

  toState() {
    return {
      board: this.board.map((cell) => cell ? { ...cell } : null),
      currentPlayer: this.currentPlayer,
      isGameOver: this.isGameOver,
      winner: this.winner
    };
  }

  static fromState(state) {
    return state ? new AleaEvangelii(state) : new AleaEvangelii();
  }
}

module.exports = AleaEvangelii;
