class Chopsticks {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.hands = { black: [1, 1], white: [1, 1] }; this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null;
  }
  move(type, from, to, amount) {
    if (this.isGameOver) return { success: false, error: 'Game over.' };
    const player = this.hands[this.currentPlayer]; const opponentColor = this.currentPlayer === 'black' ? 'white' : 'black'; const opponent = this.hands[opponentColor];
    if (type === 'attack') {
      if (![0,1].includes(from) || ![0,1].includes(to) || player[from] === 0 || opponent[to] === 0) return { success: false, error: 'Invalid attack.' };
      opponent[to] = (opponent[to] + player[from]) % 5;
    } else if (type === 'split') {
      if (![0,1].includes(from) || player[from] === 0 || amount < 0 || amount > 4) return { success: false, error: 'Invalid split.' };
      const total = player[0] + player[1]; if (amount + (total - amount) > 4 || amount === player[0]) return { success: false, error: 'Invalid split.' };
      player[0] = amount; player[1] = total - amount;
    } else return { success: false, error: 'Unknown move.' };
    if (opponent[0] === 0 && opponent[1] === 0) { this.isGameOver = true; this.winner = this.currentPlayer; }
    else this.currentPlayer = opponentColor;
    return { success: true };
  }
  toState() { return { hands: { black: [...this.hands.black], white: [...this.hands.white] }, currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new Chopsticks(state) : new Chopsticks(); }
}
module.exports = Chopsticks;
