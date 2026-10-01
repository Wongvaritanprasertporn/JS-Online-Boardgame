class HuntGame {
  constructor(state = null, variant = 'baghchal') {
    this.variant = variant;
    this.tigerCount = variant === 'adugo' ? 1 : variant === 'aadupuli' ? 3 : 4;
    this.goatCount = variant === 'adugo' ? 14 : variant === 'aadupuli' ? 15 : 20;
    this.captureGoal = variant === 'adugo' ? 5 : 5;
    this.board = state ? state.board.slice() : Array(25).fill(null);
    this.currentPlayer = state?.currentPlayer || 'goats';
    this.phase = state?.phase || 'placement';
    this.goatsPlaced = state?.goatsPlaced || 0;
    this.captured = state?.captured || 0;
    this.isGameOver = state?.isGameOver || false;
    this.winner = state?.winner || null;
    if (!state) this.setup();
  }
  setup() {
    const tigers = this.tigerCount === 1 ? [12] : this.tigerCount === 3 ? [0, 4, 12] : [0, 4, 20, 24];
    tigers.forEach((index) => { this.board[index] = 'tiger'; });
  }
  adjacent(index) {
    const row = Math.floor(index / 5); const col = index % 5; const moves = [];
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]) {
      const nextRow = row + dr; const nextCol = col + dc;
      if (nextRow >= 0 && nextRow < 5 && nextCol >= 0 && nextCol < 5) moves.push(nextRow * 5 + nextCol);
    }
    return moves;
  }
  move(from, to) {
    if (this.isGameOver) return { success: false, error: 'Game over.' };
    if (this.currentPlayer === 'goats' && this.phase === 'placement') {
      if (this.goatsPlaced >= this.goatCount || this.board[to]) return { success: false, error: 'Invalid goat placement.' };
      this.board[to] = 'goat'; this.goatsPlaced++;
      if (this.goatsPlaced >= this.goatCount) this.phase = 'movement';
      this.currentPlayer = 'tigers'; return { success: true };
    }
    const piece = this.board[from];
    if (piece !== this.currentPlayer.slice(0, -1) || this.board[to]) return { success: false, error: 'Invalid piece.' };
    if (this.currentPlayer === 'goats') {
      if (!this.board.includes('goat') || !this.adjacent(from).includes(to)) return { success: false, error: 'Goats move one step.' };
      this.board[from] = null; this.board[to] = 'goat'; this.currentPlayer = 'tigers'; return { success: true };
    }
    const adjacent = this.adjacent(from);
    if (adjacent.includes(to)) { this.board[from] = null; this.board[to] = 'tiger'; this.currentPlayer = 'goats'; return { success: true }; }
    const midRow = Math.floor(from / 5) + Math.sign(Math.floor(to / 5) - Math.floor(from / 5));
    const midCol = from % 5 + Math.sign(to % 5 - from % 5); const middle = midRow * 5 + midCol;
    if (this.board[middle] !== 'goat' || !this.adjacent(middle).includes(to)) return { success: false, error: 'Invalid tiger move.' };
    this.board[from] = null; this.board[middle] = null; this.board[to] = 'tiger'; this.captured++;
    if (this.captured >= this.captureGoal) { this.isGameOver = true; this.winner = 'tigers'; } else this.currentPlayer = 'goats';
    return { success: true };
  }
  toState() { return { board: this.board.slice(), currentPlayer: this.currentPlayer, phase: this.phase, goatsPlaced: this.goatsPlaced, captured: this.captured, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state, variant) { return state ? new HuntGame(state, variant) : new HuntGame(null, variant); }
}
module.exports = HuntGame;
