const SIZE = 4;
class FourFieldKono {
  constructor(state = null) { if (state) { Object.assign(this, state); return; } this.board = Array.from({ length: 16 }, (_, index) => index < 8 ? 'black' : 'white'); this.currentPlayer = 'black'; this.firstMove = true; this.isGameOver = false; this.winner = null; }
  row(index) { return Math.floor(index / SIZE); }
  col(index) { return index % SIZE; }
  neighbors(index) { const result = []; for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) { const row=this.row(index)+dr; const col=this.col(index)+dc; if(row>=0&&row<SIZE&&col>=0&&col<SIZE) result.push({ index:row*SIZE+col, dr, dc }); } return result; }
  captures(from) { const result=[]; const own=this.currentPlayer; const opponent=own==='black'?'white':'black'; for(const neighbor of this.neighbors(from)){ const row=this.row(from)+neighbor.dr*2; const col=this.col(from)+neighbor.dc*2; const to=row*SIZE+col; if(row>=0&&row<SIZE&&col>=0&&col<SIZE&&this.board[neighbor.index]===own&&this.board[to]===opponent) result.push({to,over:neighbor.index}); } return result; }
  move(from,to) { const piece=this.board[from]; const capture=this.captures(from).find((entry)=>entry.to===to); const adjacent=this.neighbors(from).some((entry)=>entry.index===to)&&!this.board[to]; if(this.isGameOver||piece!==this.currentPlayer||(this.firstMove&&!capture)||(!capture&&!adjacent)) return {success:false,error:'Invalid Four-field Kono move.'}; this.board[to]=piece; this.board[from]=null; if(capture)this.board[capture.over]=null; this.firstMove=false; const opponent=this.currentPlayer==='black'?'white':'black'; const count=this.board.filter((entry)=>entry===opponent).length; if(count<=1||!this.board.some((entry,index)=>entry===opponent&&(this.neighbors(index).some((neighbor)=>!this.board[neighbor.index])||this.capturesFor(index,opponent).length))){this.isGameOver=true;this.winner=this.currentPlayer;}else this.currentPlayer=opponent; return {success:true,captured:Boolean(capture)}; }
  capturesFor(from,color){const previous=this.currentPlayer;this.currentPlayer=color;const result=this.captures(from);this.currentPlayer=previous;return result;}
  toState(){return{board:this.board.slice(),currentPlayer:this.currentPlayer,firstMove:this.firstMove,isGameOver:this.isGameOver,winner:this.winner};}
  static fromState(state){return state?new FourFieldKono(state):new FourFieldKono();}
}
module.exports=FourFieldKono;
