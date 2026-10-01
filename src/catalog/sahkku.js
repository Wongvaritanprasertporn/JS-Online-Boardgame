const TRACK_LENGTH = 15;
class Sahkku {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = Array.from({ length: TRACK_LENGTH * 3 }, () => null);
    for (let index = 0; index < TRACK_LENGTH; index++) this.board[index] = { color: 'black', active: false };
    for (let index = 2 * TRACK_LENGTH; index < 3 * TRACK_LENGTH; index++) this.board[index] = { color: 'white', active: false };
    this.king = { position: TRACK_LENGTH + 7, controller: null };
    this.currentPlayer = 'black'; this.roll = null; this.hasRolled = false; this.isGameOver = false; this.winner = null;
  }
  movablePositions(color) { return this.board.map((piece, index) => piece?.color === color ? index : -1).filter((index) => index >= 0); }
  rollDice(value = null) {
    if (this.isGameOver || this.hasRolled) return { success: false, error: 'Roll only once per turn.' };
    const result = Number.isInteger(value) && value >= 1 && value <= 3 ? value : 1 + Math.floor(Math.random() * 3);
    this.roll = result; this.hasRolled = true; return { success: true, roll: result };
  }
  move(from, to) {
    if (this.isGameOver || !this.hasRolled || this.roll === null) return { success: false, error: 'Roll before moving.' };
    const piece = this.board[from];
    if (!piece || piece.color !== this.currentPlayer || !piece.active) return { success: false, error: 'Activate this soldier first.' };
    const direction = this.currentPlayer === 'black' ? 1 : -1;
    if (to !== from + direction * this.roll || to < TRACK_LENGTH || to >= TRACK_LENGTH * 2 || this.board[to]) return { success: false, error: 'Invalid Sáhkku move.' };
    this.board[to] = piece; this.board[from] = null;
    if (to === this.king.position) this.king.controller = this.currentPlayer;
    this.finishTurn(); return { success: true };
  }
  activate(index) {
    const piece = this.board[index];
    if (this.isGameOver || !this.hasRolled || !piece || piece.color !== this.currentPlayer || piece.active) return { success: false, error: 'Invalid activation.' };
    piece.active = true; this.finishTurn(); return { success: true };
  }
  finishTurn() {
    const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
    if (!this.board.some((piece) => piece?.color === opponent)) { this.isGameOver = true; this.winner = this.currentPlayer; return; }
    this.currentPlayer = opponent; this.roll = null; this.hasRolled = false;
  }
  toState() { return { board: this.board.map((piece) => piece && { ...piece }), king: { ...this.king }, currentPlayer: this.currentPlayer, roll: this.roll, hasRolled: this.hasRolled, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new Sahkku(state) : new Sahkku(); }
}
module.exports = Sahkku;
