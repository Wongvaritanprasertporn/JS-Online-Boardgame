const RimauRimau = require('./rimau-rimau');

class MainMachan extends RimauRimau {
  constructor(state = null) { super(state); if (!state) { this.board.fill(null); this.board[17] = this.board[31] = 'tiger'; this.board[16] = this.board[18] = this.board[22] = this.board[26] = this.board[30] = this.board[32] = this.board[24] = this.board[10] = 'man'; this.placed = 8; } }
  toState() { return { ...super.toState(), variant: 'mainmachan' }; }
  static fromState(state) { return state ? new MainMachan(state) : new MainMachan(); }
}
module.exports = MainMachan;
