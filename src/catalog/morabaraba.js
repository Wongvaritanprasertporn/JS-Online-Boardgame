const TwelveMensMorris = require('./twelve-mens-morris');

class Morabaraba extends TwelveMensMorris {
  constructor(state = null) { super(state); }
  static fromState(state) { return state ? new Morabaraba(state) : new Morabaraba(); }
}
module.exports = Morabaraba;
