const AncientChess = require('./ancient-chess');

class Shatranj extends AncientChess {
  constructor(state = null) { super(state, 'shatranj'); }
  static fromState(state) { return state ? new Shatranj(state) : new Shatranj(); }
}

module.exports = Shatranj;
