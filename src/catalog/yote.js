const ROWS = 5;
const COLS = 6;
class Yote {
  constructor(state = null) { if (state) { Object.assign(this, state); return; } this.board = Array(ROWS * COLS).fill(null); this.reserve = { black: 12, white: 12 }; this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null; }
  row(index) { return Math.floor(index / COLS); }
  col(index) { return index % COLS; }
  neighbors(index) { const result=[]; for(const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]){const row=this.row(index)+dr,col=this.col(index)+dc;if(row>=0&&row<ROWS&&col>=0&&col<COLS)result.push({index:row*COLS+col,dr,dc});} return result; }
  captures(from) { const result=[]; const opponent=this.currentPlayer==='black'?'white':'black'; for(const neighbor of this.neighbors(from)){const row=this.row(from)+neighbor.dr*2,col=this.col(from)+neighbor.dc*2,to=row*COLS+col;if(row>=0&&row<ROWS&&col>=0&&col<COLS&&this.board[neighbor.index]===opponent&&!this.board[to])result.push({to,over:neighbor.index});} return result; }
  move(from,to,remove=null) { const opponent=this.currentPlayer==='black'?'white':'black'; let capture=null; if(from===null||from===undefined){if(this.reserve[this.currentPlayer]<=0||this.board[to])return{success:false,error:'Invalid Yote placement.'};this.board[to]=this.currentPlayer;this.reserve[this.currentPlayer]--;}else{const piece=this.board[from];capture=this.captures(from).find((entry)=>entry.to===to);const adjacent=this.neighbors(from).some((entry)=>entry.index===to)&&!this.board[to];if(this.isGameOver||piece!==this.currentPlayer||(!adjacent&&!capture))return{success:false,error:'Invalid Yote move.'};this.board[to]=piece;this.board[from]=null;if(capture)this.board[capture.over]=null;}if(capture){const candidates=this.board.map((piece,index)=>piece===opponent?index:-1).filter((index)=>index>=0);const removal=candidates.includes(remove)?remove:candidates[0];if(removal!==undefined)this.board[removal]=null;}if(!this.board.includes(opponent)&&this.reserve[opponent]===0){this.isGameOver=true;this.winner=this.currentPlayer;}else this.currentPlayer=opponent;return{success:true,captured:Boolean(capture)};}
  toState(){return{board:this.board.slice(),reserve:{...this.reserve},currentPlayer:this.currentPlayer,isGameOver:this.isGameOver,winner:this.winner};}
  static fromState(state){return state?new Yote(state):new Yote();}
}
module.exports=Yote;
