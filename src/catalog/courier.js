class Courier {
  constructor(state = null) {
    if (state) { this.board = state.board.map((row) => row.map((piece) => piece && { ...piece })); this.currentPlayer = state.currentPlayer; this.isGameOver = state.isGameOver; this.winner = state.winner; return; }
    this.board = Array.from({ length: 8 }, () => Array(12).fill(null)); this.currentPlayer = 'white'; this.isGameOver = false; this.winner = null; this.setup();
  }
  setup() {
    const back = ['rook', 'knight', 'alfil', 'courier', 'sage', 'king', 'ferz', 'fool', 'courier', 'alfil', 'knight', 'rook'];
    back.forEach((type, col) => { this.board[0][col] = { color: 'black', type }; this.board[7][col] = { color: 'white', type }; this.board[1][col] = { color: 'black', type: 'pawn' }; this.board[6][col] = { color: 'white', type: 'pawn' }; });
  }
  inBounds(row, col) { return row >= 0 && row < 8 && col >= 0 && col < 12; }
  pathClear(fr, fc, tr, tc) { const sr = Math.sign(tr - fr), sc = Math.sign(tc - fc); let r = fr + sr, c = fc + sc; while (r !== tr || c !== tc) { if (this.board[r][c]) return false; r += sr; c += sc; } return true; }
  isValidMove(fr, fc, tr, tc) {
    if (this.isGameOver || !this.inBounds(fr, fc) || !this.inBounds(tr, tc)) return false;
    const piece = this.board[fr][fc], target = this.board[tr][tc]; if (!piece || piece.color !== this.currentPlayer || target?.color === piece.color) return false;
    const dr = tr - fr, dc = tc - fc, ar = Math.abs(dr), ac = Math.abs(dc), f = piece.color === 'white' ? -1 : 1;
    if (piece.type === 'king' || piece.type === 'sage') return ar <= 1 && ac <= 1 && ar + ac > 0;
    if (piece.type === 'ferz' || piece.type === 'fool') return piece.type === 'ferz' ? ar === 1 && ac === 1 : ar + ac === 1;
    if (piece.type === 'knight') return (ar === 2 && ac === 1) || (ar === 1 && ac === 2);
    if (piece.type === 'alfil') return ar === 2 && ac === 2;
    if (piece.type === 'courier') return ar === ac && this.pathClear(fr, fc, tr, tc);
    if (piece.type === 'rook') return (dr === 0 || dc === 0) && this.pathClear(fr, fc, tr, tc);
    return (dr === f && dc === 0 && !target) || (dr === f && ac === 1 && Boolean(target));
  }
  getValidMoves(row, col) { const moves = []; for (let tr = 0; tr < 8; tr++) for (let tc = 0; tc < 12; tc++) if (this.isValidMove(row, col, tr, tc)) moves.push({ row: tr, col: tc }); return moves; }
  move(fr, fc, tr, tc) {
    if (!this.isValidMove(fr, fc, tr, tc)) return { success: false, error: 'Invalid move.' };
    const piece = this.board[fr][fc], captured = this.board[tr][tc]; this.board[tr][tc] = piece; this.board[fr][fc] = null;
    if (piece.type === 'pawn' && (tr === 0 || tr === 7)) piece.type = 'ferz';
    if (captured?.type === 'king') { this.isGameOver = true; this.winner = piece.color; } else this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    return { success: true, captured };
  }
  toState() { return { board: this.board.map((row) => row.map((piece) => piece && { ...piece })), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new Courier(state) : new Courier(); }
}
module.exports = Courier;
