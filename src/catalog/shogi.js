const PIECES = ['king', 'rook', 'bishop', 'gold', 'gold', 'silver', 'silver', 'knight', 'knight', 'lance', 'lance', ...Array(9).fill('pawn')];

class Shogi {
  constructor(state = null) {
    if (state) {
      this.board = state.board.map((row) => row.map((piece) => piece && { ...piece }));
      this.hands = { black: { ...state.hands.black }, white: { ...state.hands.white } };
      this.currentPlayer = state.currentPlayer; this.isGameOver = state.isGameOver; this.winner = state.winner; return;
    }
    this.board = Array.from({ length: 9 }, () => Array(9).fill(null));
    this.hands = { black: {}, white: {} }; this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null; this.setup();
  }

  setup() {
    const back = ['lance', 'knight', 'silver', 'gold', 'king', 'gold', 'silver', 'knight', 'lance'];
    back.forEach((type, col) => { this.board[0][col] = { color: 'white', type }; this.board[8][col] = { color: 'black', type }; });
    this.board[1][1] = { color: 'white', type: 'rook' }; this.board[1][7] = { color: 'white', type: 'bishop' };
    this.board[7][1] = { color: 'black', type: 'bishop' }; this.board[7][7] = { color: 'black', type: 'rook' };
    for (let col = 0; col < 9; col++) { this.board[2][col] = { color: 'white', type: 'pawn' }; this.board[6][col] = { color: 'black', type: 'pawn' }; }
  }

  inBounds(row, col) { return row >= 0 && row < 9 && col >= 0 && col < 9; }
  forward(piece) { return piece.color === 'black' ? -1 : 1; }
  promotedType(piece) { return piece.promoted ? 'gold' : piece.type; }
  pathClear(fr, fc, tr, tc) { const sr = Math.sign(tr - fr), sc = Math.sign(tc - fc); let r = fr + sr, c = fc + sc; while (r !== tr || c !== tc) { if (this.board[r][c]) return false; r += sr; c += sc; } return true; }
  inZone(color, row) { return color === 'black' ? row <= 2 : row >= 6; }

  isValidMove(fr, fc, tr, tc) {
    if (this.isGameOver || !this.inBounds(fr, fc) || !this.inBounds(tr, tc)) return false;
    const piece = this.board[fr][fc], target = this.board[tr][tc]; if (!piece || piece.color !== this.currentPlayer || target?.color === piece.color) return false;
    const dr = tr - fr, dc = tc - fc, ar = Math.abs(dr), ac = Math.abs(dc), f = this.forward(piece), type = this.promotedType(piece);
    if (type === 'king') return ar <= 1 && ac <= 1 && ar + ac > 0;
    if (type === 'gold') return (dr === f && ac <= 1) || (dr === 0 && ac === 1) || (dr === -f && dc === 0);
    if (type === 'silver') return (dr === f && ac <= 1) || (dr === -f && ac === 1);
    if (type === 'knight') return dr === f * 2 && ac === 1;
    if (type === 'lance') return dc === 0 && dr * f > 0 && this.pathClear(fr, fc, tr, tc);
    if (type === 'rook' || type === 'dragon') return (dr === 0 || dc === 0) && this.pathClear(fr, fc, tr, tc) || type === 'dragon' && ar === 1 && ac === 1;
    if (type === 'bishop' || type === 'horse') return ar === ac && this.pathClear(fr, fc, tr, tc) || type === 'horse' && ar <= 1 && ac <= 1 && ar + ac > 0;
    return dr === f && dc === 0;
  }

  canDrop(type, row, col) {
    if (this.board[row][col] || !this.hands[this.currentPlayer][type]) return false;
    if ((type === 'pawn' || type === 'lance') && (this.currentPlayer === 'black' ? row === 0 : row === 8)) return false;
    if (type === 'knight' && (this.currentPlayer === 'black' ? row <= 1 : row >= 7)) return false;
    if (type === 'pawn' && this.board.some((line) => line[col]?.color === this.currentPlayer && line[col].type === 'pawn' && !line[col].promoted)) return false;
    return true;
  }

  getValidMoves(row, col) {
    const moves = []; for (let tr = 0; tr < 9; tr++) for (let tc = 0; tc < 9; tc++) if (this.isValidMove(row, col, tr, tc)) moves.push({ row: tr, col: tc }); return moves;
  }

  move(fr, fc, tr, tc, promote = false) {
    if (!this.isValidMove(fr, fc, tr, tc)) return { success: false, error: 'Invalid move.' };
    const piece = this.board[fr][fc], captured = this.board[tr][tc]; if (captured) { const type = captured.type; this.hands[this.currentPlayer][type] = (this.hands[this.currentPlayer][type] || 0) + 1; }
    const mustPromote = (piece.type === 'pawn' || piece.type === 'lance') && (this.currentPlayer === 'black' ? tr === 0 : tr === 8) || piece.type === 'knight' && (this.currentPlayer === 'black' ? tr <= 1 : tr >= 7);
    piece.promoted = piece.promoted || promote || mustPromote; this.board[tr][tc] = piece; this.board[fr][fc] = null;
    if (captured?.type === 'king') { this.isGameOver = true; this.winner = this.currentPlayer; } else this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    return { success: true, captured };
  }

  drop(type, row, col) { if (!this.canDrop(type, row, col)) return { success: false, error: 'Invalid drop.' }; this.board[row][col] = { color: this.currentPlayer, type }; this.hands[this.currentPlayer][type]--; this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black'; return { success: true }; }
  toState() { return { board: this.board.map((row) => row.map((piece) => piece && { ...piece })), hands: this.hands, currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new Shogi(state) : new Shogi(); }
}
module.exports = Shogi;
