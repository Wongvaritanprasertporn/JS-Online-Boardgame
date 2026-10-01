const SIZE = 7;
class Gala {
  constructor(state = null) { if (state) { Object.assign(this, state); return; } this.board = Array(49).fill(null); this.currentPlayer = 'black'; this.phase = 'placement'; this.placed = { black: 1, white: 0 }; this.board[24] = 'black'; this.isGameOver = false; this.winner = null; }
  row(index) { return Math.floor(index / SIZE); }
  col(index) { return index % SIZE; }
  neighbors(index) { const result=[]; for(const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]){const row=this.row(index)+dr,col=this.col(index)+dc;if(row>=0&&row<SIZE&&col>=0&&col<SIZE)result.push(row*SIZE+col);} return result; }
  lineClear(from,to) { const rowStep=Math.sign(this.row(to)-this.row(from)); const colStep=Math.sign(this.col(to)-this.col(from)); let row=this.row(from)+rowStep,col=this.col(from)+colStep; while(row!==this.row(to)||col!==this.col(to)){if(this.board[row*SIZE+col])return false;row+=rowStep;col+=colStep;} return true; }
  legalMove(from,to) { return this.board[from]===this.currentPlayer&&!this.board[to]&&(this.row(from)===this.row(to)||this.col(from)===this.col(to))&&this.lineClear(from,to); }
  place(index) { const limit=this.currentPlayer==='black'?10:13; const row=this.row(index); const validHalf=this.currentPlayer==='black'?row<3:row>3; if(this.phase!=='placement'||this.placed[this.currentPlayer]>=limit||this.board[index]||!validHalf)return{success:false,error:'Invalid Gala placement.'}; this.board[index]=this.currentPlayer; this.placed[this.currentPlayer]++; if(this.placed.black>=10&&this.placed.white>=13)this.phase='movement'; else this.currentPlayer=this.currentPlayer==='black'?'white':'black'; return{success:true}; }
  move(from,to) { if(this.phase==='placement')return this.place(to); if(this.isGameOver||!this.legalMove(from,to))return{success:false,error:'Invalid Gala move.'}; this.board[to]=this.currentPlayer;this.board[from]=null;const opponent=this.currentPlayer==='black'?'white':'black'; for(const target of [...this.board.keys()])if(this.board[target]===opponent){const ns=this.neighbors(target);const horizontal=ns.includes(target-1)&&ns.includes(target+1)&&this.board[target-1]===this.currentPlayer&&this.board[target+1]===this.currentPlayer;const vertical=ns.includes(target-SIZE)&&ns.includes(target+SIZE)&&this.board[target-SIZE]===this.currentPlayer&&this.board[target+SIZE]===this.currentPlayer;if(horizontal||vertical)this.board[target]=null;} if(!this.hasMove(opponent)){this.isGameOver=true;this.winner=this.currentPlayer;}else this.currentPlayer=opponent;return{success:true}; }
  hasMove(color){return this.board.some((piece,index)=>piece===color&&this.neighbors(index).some((to)=>!this.board[to])||piece===color&&this.board.some((target, to)=>!target&&this.legalFor(index,to,color)));}
  legalFor(from,to,color){return(this.row(from)===this.row(to)||this.col(from)===this.col(to))&&this.lineClear(from,to);}
  toState(){return{board:this.board.slice(),currentPlayer:this.currentPlayer,phase:this.phase,placed:{...this.placed},isGameOver:this.isGameOver,winner:this.winner};}
  static fromState(state){return state?new Gala(state):new Gala();}
}
module.exports=Gala;
