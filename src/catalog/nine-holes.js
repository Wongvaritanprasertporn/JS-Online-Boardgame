const MorrisVariant = require('./morris-variants');

class NineHoles extends MorrisVariant {
  constructor(state = null) { super(state, 'three'); }
  move(from, to) {
    if (this.phase === 'movement' && this.board[from] === this.currentPlayer && this.board[to] === null) {
      this.board[from] = null; this.board[to] = this.currentPlayer;
      if (this.getMills().some((mill) => mill.every((index) => this.board[index] === this.currentPlayer))) { this.isGameOver = true; this.winner = this.currentPlayer; }
      else this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
      return { success: true };
    }
    return super.move(from, to);
  }
  static fromState(state) { return state ? new NineHoles(state) : new NineHoles(); }
}
module.exports = NineHoles;
