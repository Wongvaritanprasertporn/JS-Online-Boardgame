const BaghBandi = require('./bagh-bandi');

class SherBakar extends BaghBandi {
  constructor(state = null) { super(state); }
  setup() { this.board[10] = this.board[14] = { type: 'tiger', count: 1 }; for (const [index, count] of [[6,5],[18,5],[8,5],[20,4]]) this.board[index] = { type: 'goat', count }; }
  static fromState(state) { return state ? new SherBakar(state) : new SherBakar(); }
}
module.exports = SherBakar;
