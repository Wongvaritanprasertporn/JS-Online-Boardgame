class Shatra {
  constructor(state = null) {
    this.nodes = Shatra.createNodes();
    if (state) {
      this.board = state.board.map((piece) => piece && { ...piece });
      this.currentPlayer = state.currentPlayer;
      this.isGameOver = state.isGameOver;
      this.winner = state.winner;
      return;
    }
    this.board = Array(62).fill(null);
    this.currentPlayer = 'white';
    this.isGameOver = false;
    this.winner = null;
    this.setup();
  }

  static createNodes() {
    const nodes = [];
    for (let row = 0; row < 6; row++) for (let col = 0; col < 7; col++) nodes.push({ row: row + 3, col });
    for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) nodes.push({ row, col });
    nodes.push({ row: 2, col: 3 }, { row: 9, col: 3 });
    for (let row = 10; row < 13; row++) for (let col = 4; col < 7; col++) nodes.push({ row, col });
    return nodes;
  }

  setup() {
    const types = ['king', 'queen', 'rook', 'rook', 'bishop', 'bishop', ...Array(11).fill('pawn')];
    types.forEach((type, index) => {
      const blackIndex = index < 9 ? 42 + index : 18 + index - 9;
      const whiteIndex = index < 9 ? 53 + index : 34 + index - 9;
      this.board[blackIndex] = { color: 'black', type, reserve: index < 9 };
      this.board[whiteIndex] = { color: 'white', type, reserve: index < 9 };
    });
  }

  distance(from, to) { return { row: this.nodes[to].row - this.nodes[from].row, col: this.nodes[to].col - this.nodes[from].col }; }
  nodeAt(row, col) { return this.nodes.findIndex((node) => node.row === row && node.col === col); }
  pathClear(from, to) {
    const delta = this.distance(from, to); const stepRow = Math.sign(delta.row); const stepCol = Math.sign(delta.col);
    let row = this.nodes[from].row + stepRow; let col = this.nodes[from].col + stepCol;
    while (row !== this.nodes[to].row || col !== this.nodes[to].col) { if (this.board[this.nodeAt(row, col)]) return false; row += stepRow; col += stepCol; }
    return true;
  }

  normalMove(from, to) {
    const piece = this.board[from]; const target = this.board[to]; const { row, col } = this.distance(from, to); const ar = Math.abs(row); const ac = Math.abs(col);
    if (!piece || target?.color === piece.color || piece.reserve) return false;
    if (piece.type === 'king') return ar <= 1 && ac <= 1 && ar + ac > 0;
    if (piece.type === 'pawn') { const forward = piece.color === 'white' ? -1 : 1; return row === forward && col === 0 && !target; }
    if (piece.type === 'bishop') return ar === ac && this.pathClear(from, to);
    if (piece.type === 'rook') return (row === 0 || col === 0) && this.pathClear(from, to);
    if (piece.type === 'queen') return (row === 0 || col === 0 || ar === ac) && this.pathClear(from, to);
    return false;
  }

  leapCapture(from, to) {
    const piece = this.board[from]; if (!piece || piece.reserve || piece.type === 'king' || this.board[to]) return false;
    const delta = this.distance(from, to); const rowStep = Math.sign(delta.row); const colStep = Math.sign(delta.col);
    if (!rowStep && !colStep) return false;
    const middle = this.nodeAt(this.nodes[from].row + rowStep, this.nodes[from].col + colStep);
    return middle >= 0 && this.board[middle]?.color !== piece.color && Boolean(this.board[middle]);
  }

  capturesFor(color) {
    const captures = [];
    this.board.forEach((piece, from) => { if (piece?.color === color) for (let to = 0; to < 62; to++) if (this.leapCapture(from, to)) captures.push({ from, to }); });
    return captures;
  }

  getValidMoves(from) {
    if (!this.board[from] || this.board[from].color !== this.currentPlayer) return [];
    const forced = this.capturesFor(this.currentPlayer);
    if (this.board[from].reserve && !forced.length) {
      const rows = this.currentPlayer === 'white' ? [6, 7, 8] : [3, 4, 5];
      return this.nodes.map((node, index) => ({ index, node })).filter(({ index, node }) => rows.includes(node.row) && !this.board[index]).map(({ index }) => ({ index }));
    }
    const candidates = forced.length ? forced.filter((move) => move.from === from).map((move) => move.to) : Array.from({ length: 62 }, (_, to) => to).filter((to) => this.normalMove(from, to));
    return candidates.map((index) => ({ index }));
  }

  move(from, to) {
    if (!this.getValidMoves(from).some((move) => move.index === to)) return { success: false, error: 'Invalid move.' };
    const capturedIndex = this.leapCapture(from, to) ? this.nodeAt(this.nodes[from].row + Math.sign(this.nodes[to].row - this.nodes[from].row), this.nodes[from].col + Math.sign(this.nodes[to].col - this.nodes[from].col)) : -1;
    const captured = capturedIndex >= 0 ? this.board[capturedIndex] : this.board[to];
    if (capturedIndex >= 0) this.board[capturedIndex] = null;
    this.board[to] = { ...this.board[from], reserve: false }; this.board[from] = null;
    if (captured?.type === 'king') { this.isGameOver = true; this.winner = this.currentPlayer; }
    else this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    return { success: true, captured };
  }

  toState() { return { board: this.board.map((piece) => piece && { ...piece }), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new Shatra(state) : new Shatra(); }
}

module.exports = Shatra;
