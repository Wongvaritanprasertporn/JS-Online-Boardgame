class Hnefatafl {
  constructor(state = null) {
    if (state) { this.board = state.board.map((row) => row.slice()); this.currentPlayer = state.currentPlayer; this.isGameOver = state.isGameOver; this.winner = state.winner; return; }
    this.board = Array.from({ length: 11 }, () => Array(11).fill(null)); this.currentPlayer = 'attackers'; this.isGameOver = false; this.winner = null; this.setup();
  }
  setup() {
    const attackerSquares = [[0,3],[0,4],[0,5],[1,5],[3,0],[4,0],[5,0],[5,1],[5,9],[5,10],[4,10],[3,10],[10,3],[10,4],[10,5],[9,5],[1,5],[9,5],[5,1],[5,9],[1,4],[1,6],[9,4],[9,6]];
    attackerSquares.push([0, 2], [0, 6], [10, 2], [10, 6]);
    const unique = [...new Map(attackerSquares.map((point) => [point.join(','), point])).values()];
    unique.forEach(([row, col]) => { this.board[row][col] = { color: 'attackers', type: 'attacker' }; });
    [[5,5,'king'],[4,5,'defender'],[5,4,'defender'],[5,6,'defender'],[6,5,'defender'],[4,4,'defender'],[4,6,'defender'],[6,4,'defender'],[6,6,'defender'],[3,5,'defender'],[7,5,'defender'],[5,3,'defender'],[5,7,'defender']].forEach(([row,col,type]) => { this.board[row][col] = { color: 'defenders', type }; });
  }
  inBounds(row, col) { return row >= 0 && row < 11 && col >= 0 && col < 11; }
  isThrone(row, col) { return row === 5 && col === 5; }
  isCorner(row, col) { return [[0,0],[0,10],[10,0],[10,10]].some(([r,c]) => r === row && c === col); }
  pathClear(fr, fc, tr, tc) { const sr = Math.sign(tr-fr), sc = Math.sign(tc-fc); let r=fr+sr,c=fc+sc; while(r!==tr||c!==tc){if(this.board[r][c])return false;r+=sr;c+=sc;} return true; }
  isValidMove(fr, fc, tr, tc) { const piece=this.board[fr]?.[fc], target=this.board[tr]?.[tc]; return piece && piece.color===this.currentPlayer && this.inBounds(tr,tc) && !target && (fr===tr||fc===tc) && this.pathClear(fr,fc,tr,tc) && !this.isThrone(tr,tc) && !this.isCorner(tr,tc); }
  getValidMoves(row,col){const moves=[];for(let r=0;r<11;r++)for(let c=0;c<11;c++)if(this.isValidMove(row,col,r,c))moves.push({row:r,col:c});return moves;}
  hostile(row,col,color){return !this.inBounds(row,col)||this.isThrone(row,col)||this.isCorner(row,col)||this.board[row][col]?.color===color;}
  captureAround(row,col,color){for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){const ar=row+dr,ac=col+dc,br=row+dr*2,bc=col+dc*2;const enemy=this.board[ar]?.[ac];if(enemy&&enemy.color!==color&&enemy.type!=='king'&&this.hostile(br,bc,color))this.board[ar][ac]=null;}}
  move(fr,fc,tr,tc){if(!this.isValidMove(fr,fc,tr,tc))return{success:false,error:'Invalid move.'};const piece=this.board[fr][fc];this.board[tr][tc]=piece;this.board[fr][fc]=null;if(piece.type==='king'&&this.isCorner(tr,tc)){this.isGameOver=true;this.winner='defenders';}this.captureAround(tr,tc,piece.color);const king=this.board.flat().find((item)=>item?.type==='king');if(!king){this.isGameOver=true;this.winner='attackers';}else if(!this.isGameOver)this.currentPlayer=this.currentPlayer==='attackers'?'defenders':'attackers';return{success:true};}
  toState(){return{board:this.board.map((row)=>row.slice()),currentPlayer:this.currentPlayer,isGameOver:this.isGameOver,winner:this.winner};}
  static fromState(state){return state?new Hnefatafl(state):new Hnefatafl();}
}
module.exports=Hnefatafl;
