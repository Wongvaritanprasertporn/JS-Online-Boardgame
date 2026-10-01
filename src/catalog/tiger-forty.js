const SIZE=9;
class TigerForty{
 constructor(state=null){if(state){Object.assign(this,state);return;}this.board=Array(81).fill(null);for(let index=0;index<40;index++)this.board[index]='black';for(let index=41;index<81;index++)this.board[index]='white';this.board[40]=null;this.currentPlayer='black';this.isGameOver=false;this.winner=null;}
 row(i){return Math.floor(i/SIZE);}col(i){return i%SIZE;}
 neighbors(i){const result=[];for(const[dr,dc]of[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]){const row=this.row(i)+dr,col=this.col(i)+dc;if(row>=0&&row<SIZE&&col>=0&&col<SIZE)result.push({index:row*SIZE+col,dr,dc});}return result;}
 jumps(from){const result=[],opponent=this.currentPlayer==='black'?'white':'black';for(const neighbor of this.neighbors(from)){const row=this.row(from)+neighbor.dr*2,col=this.col(from)+neighbor.dc*2,to=row*SIZE+col;if(row>=0&&row<SIZE&&col>=0&&col<SIZE&&this.board[neighbor.index]===opponent&&!this.board[to])result.push({to,over:neighbor.index});}return result;}
 reachable(from){const result=[],queue=[from],seen=new Set([from]);while(queue.length){const current=queue.shift();for(const jump of this.jumps(current))if(!seen.has(jump.to)){seen.add(jump.to);result.push(jump);queue.push(jump.to);}}return result;}
 move(from,to){const piece=this.board[from],capture=this.reachable(from).find((entry)=>entry.to===to),adjacent=this.neighbors(from).some((entry)=>entry.index===to)&&!this.board[to];if(this.isGameOver||piece!==this.currentPlayer||(!adjacent&&!capture))return{success:false,error:'Invalid Tiger Forty move.'};this.board[to]=piece;this.board[from]=null;if(capture)this.board[capture.over]=null;const opponent=this.currentPlayer==='black'?'white':'black';if(!this.board.includes(opponent)){this.isGameOver=true;this.winner=this.currentPlayer;}else this.currentPlayer=opponent;return{success:true,captured:Boolean(capture)};}
 toState(){return{board:this.board.slice(),currentPlayer:this.currentPlayer,isGameOver:this.isGameOver,winner:this.winner};}
 static fromState(state){return state?new TigerForty(state):new TigerForty();}
}
module.exports=TigerForty;
