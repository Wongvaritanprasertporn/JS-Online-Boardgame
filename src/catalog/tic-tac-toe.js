class TicTacToe {
  constructor(state = null) {
    if (state) { this.board = state.board.slice(); this.currentPlayer = state.currentPlayer; this.isGameOver = state.isGameOver; this.winner = state.winner; return; }
    this.board = Array(9).fill(null); this.currentPlayer = 'x'; this.isGameOver = false; this.winner = null;
  }
  move(position) {
    if (this.isGameOver || position < 0 || position > 8 || this.board[position]) return { success: false, error: 'Invalid move.' };
    this.board[position] = this.currentPlayer;
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    if (lines.some((line) => line.every((index) => this.board[index] === this.currentPlayer))) { this.isGameOver = true; this.winner = this.currentPlayer; }
    else if (this.board.every(Boolean)) { this.isGameOver = true; this.winner = 'draw'; }
    else this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
    return { success: true };
  }
  toState() { return { board: this.board.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new TicTacToe(state) : new TicTacToe(); }
}
module.exports = TicTacToe;
