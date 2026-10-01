const AncientChess = require('./ancient-chess');

class Chaturanga extends AncientChess {
  constructor(state = null) { super(state, 'chaturanga'); }
  static fromState(state) { return state ? new Chaturanga(state) : new Chaturanga(); }
}

module.exports = Chaturanga;
