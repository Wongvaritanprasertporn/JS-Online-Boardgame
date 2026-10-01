const EDGES = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,17],[17,18],[18,19],[19,20],[20,21],[21,22],[2,11],[4,11],[6,11],[8,11],[13,11],[15,11],[17,11],[19,11],[0,11],[22,11]];
class EgaraGuti {
  constructor(state = null) { if (state) { Object.assign(this, state); return; } this.board = Array(23).fill(null); for (let index = 0; index < 11; index++) this.board[index] = 'black'; for (let index = 12; index < 23; index++) this.board[index] = 'white'; this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null; }
  neighbors(index) { return EDGES.flatMap(([from,to]) => from === index ? [to] : to === index ? [from] : []); }
  jumps(from) { const result = []; const opponent = this.currentPlayer === 'black' ? 'white' : 'black'; for (const middle of this.neighbors(from)) for (const to of this.neighbors(middle)) if (to !== from && this.board[middle] === opponent && !this.board[to]) result.push({ to, over: middle }); return result; }
  allCaptures() { return this.board.flatMap((piece,index) => piece === this.currentPlayer ? this.jumps(index).map((jump) => ({ from:index, ...jump })) : []); }
  hasLegalMove(color) { return this.board.some((piece,index) => piece === color && (this.neighbors(index).some((to) => !this.board[to]) || this.jumps(index).length)); }
  move(from, to) { const captures = this.allCaptures(); const capture = captures.find((entry) => entry.from === from && entry.to === to); const adjacent = this.neighbors(from).includes(to) && !this.board[to]; if (this.isGameOver || this.board[from] !== this.currentPlayer || (captures.length ? !capture : !adjacent)) return { success: false, error: 'Invalid Egara-guti move.' }; this.board[to] = this.currentPlayer; this.board[from] = null; if (capture) this.board[capture.over] = null; const opponent = this.currentPlayer === 'black' ? 'white' : 'black'; if (!this.board.includes(opponent) || !this.hasLegalMove(opponent)) { this.isGameOver = true; this.winner = this.currentPlayer; } else this.currentPlayer = opponent; return { success: true, captured: Boolean(capture) }; }
  toState() { return { board: this.board.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
  static fromState(state) { return state ? new EgaraGuti(state) : new EgaraGuti(); }
}
module.exports = EgaraGuti;
