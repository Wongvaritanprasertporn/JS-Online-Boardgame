const TwelveMensMorris = require('./twelve-mens-morris');

class Shax extends TwelveMensMorris {
  constructor(state = null) { super(state); }
  static fromState(state) { return state ? new Shax(state) : new Shax(); }
}
module.exports = Shax;
