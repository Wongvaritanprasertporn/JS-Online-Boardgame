const SIZE=4;
class JulGonu{
 constructor(state=null){if(state){Object.assign(this,state);return;}this.board=Array.from({length:16},(_,i)=>i<4?'black':i>=12?'white':null);this.currentPlayer='black';this.lastMove=null;this.isGameOver=false;this.winner=null;}
 row(i){return Math.floor(i/SIZE);}col(i){return i%SIZE;}
 neighbors(i){const result=[];for(const[dr,dc]of[[-1,0],[1,0],[0,-1],[0,1]]){const row=this.row(i)+dr,col=this.col(i)+dc;if(row>=0&&row<SIZE&&col>=0&&col<SIZE)result.push(row*SIZE+col);}return result;}
 move(from,to){const piece=this.board[from];if(this.isGameOver||piece!==this.currentPlayer||!this.neighbors(from).includes(to)||this.board[to]||to===this.lastMove)return{success:false,error:'Invalid Jul-gonu move.'};this.board[to]=piece;this.board[from]=null;const opponent=this.currentPlayer==='black'?'white':'black';for(const[dr,dc]of[[-1,0],[1,0],[0,-1],[0,1]]){const middleRow=this.row(to)+dr,middleCol=this.col(to)+dc,beyondRow=this.row(to)+dr*2,beyondCol=this.col(to)+dc*2;if(middleRow>=0&&middleRow<SIZE&&middleCol>=0&&middleCol<SIZE&&beyondRow>=0&&beyondRow<SIZE&&beyondCol>=0&&beyondCol<SIZE){const middle=middleRow*SIZE+middleCol,beyond=beyondRow*SIZE+beyondCol;if(this.board[middle]===opponent&&this.board[beyond]===this.currentPlayer)this.board[middle]=null;}}if(this.board.filter((entry)=>entry===opponent).length<=1||!this.hasMove(opponent)){this.isGameOver=true;this.winner=this.currentPlayer;}else{this.lastMove=from;this.currentPlayer=opponent;}return{success:true};}
 hasMove(color){return this.board.some((piece,index)=>piece===color&&this.neighbors(index).some((to)=>!this.board[to]&&to!==this.lastMove));}
 toState(){return{board:this.board.slice(),currentPlayer:this.currentPlayer,lastMove:this.lastMove,isGameOver:this.isGameOver,winner:this.winner};}
 static fromState(state){return state?new JulGonu(state):new JulGonu();}
}
module.exports=JulGonu;
