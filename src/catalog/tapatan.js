const MorrisVariant = require('./morris-variants');

class Tapatan extends MorrisVariant {
  constructor(state = null) { super(state, 'three'); }
  static fromState(state) { return state ? new Tapatan(state) : new Tapatan(); }
}
module.exports = Tapatan;
