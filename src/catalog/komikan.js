const HuntGame = require('./hunt-game');

class Komikan extends HuntGame {
  constructor(state = null) { super(state, 'adugo'); if (!state) { this.tigerCount = 1; this.goatCount = 12; this.captureGoal = 6; this.board = Array(25).fill(null); this.board[12] = 'tiger'; } }
  static fromState(state) { return state ? new Komikan(state, 'adugo') : new Komikan(); }
}
module.exports = Komikan;
