const RimauRimau = require('./rimau-rimau');

class Meurimueng extends RimauRimau {
  constructor(state = null) {
    super(state);
    if (!state) {
      this.board.fill(null);
      this.board[24] = 'tiger';
      [16,17,18,23,25,30,31,32].forEach((index) => { this.board[index] = 'man'; });
      this.placed = 8;
    }
  }
  toState() { return { ...super.toState(), variant: 'meurimueng' }; }
  static fromState(state) { return state ? new Meurimueng(state) : new Meurimueng(); }
}
module.exports = Meurimueng;
