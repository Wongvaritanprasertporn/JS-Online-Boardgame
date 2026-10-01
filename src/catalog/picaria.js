const Achi = require('./achi');

class Picaria extends Achi {
  constructor(state = null) { super(state); }

  move(from, to) {
    if (this.phase === 'placement' && to === 4 && (this.placed.black === 0 || this.placed.white === 0)) {
      return { success: false, error: 'The center cannot be used until both players place a piece.' };
    }
    return super.move(from, to);
  }

  static fromState(state) { return state ? new Picaria(state) : new Picaria(); }
}

module.exports = Picaria;
