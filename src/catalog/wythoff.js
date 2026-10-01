class Wythoff {
  constructor(state = null) { if (state) { Object.assign(this, state); return; } this.piles = [10, 10]; this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null; }
  move(removeA, removeB) {
    if (this.isGameOver || removeA < 0 || removeB < 0 || removeA > this.piles[0] || removeB > this.piles[1] || (!removeA && !removeB) || (removeA && removeB && removeA !== removeB)) return { success: false, error: 'Invalid move.' };
    this.piles[0] -= removeA; this.piles[1] -= removeB;
    if (this.piles[0] === 0 && this.piles[1] === 0) { this.isGameOver = true; this.winner = this.currentPlayer; }
    else this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    return { success: true };
  }
  toState() { return { piles: this.piles.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new Wythoff(state) : new Wythoff(); }
}
module.exports = Wythoff;
