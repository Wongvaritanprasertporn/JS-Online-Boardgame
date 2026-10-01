const SIZE=5;
class CatchTheHare{
 constructor(state=null){if(state){Object.assign(this,state);return;}this.board=Array(25).fill(null);for(let i=0;i<10;i++)this.board[i]='hunters';this.board[12]='hare';this.currentPlayer='hunters';this.isGameOver=false;this.winner=null;}
 row(i){return Math.floor(i/SIZE);}col(i){return i%SIZE;}
 neighbors(i){const result=[];for(const[dr,dc]of[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]){const row=this.row(i)+dr,col=this.col(i)+dc;if(row>=0&&row<SIZE&&col>=0&&col<SIZE)result.push({index:row*SIZE+col,dr,dc});}return result;}
 jumps(from){const result=[];for(const neighbor of this.neighbors(from)){const row=this.row(from)+neighbor.dr*2,col=this.col(from)+neighbor.dc*2,to=row*SIZE+col;if(row>=0&&row<SIZE&&col>=0&&col<SIZE&&this.board[neighbor.index]==='hunters'&&!this.board[to])result.push({to,over:neighbor.index});}return result;}
 move(from,to){const piece=this.board[from];if(this.isGameOver||piece!==this.currentPlayer)return{success:false,error:'Invalid Catch the Hare piece.'};if(piece==='hare'){const capture=this.jumps(from).find((entry)=>entry.to===to),adjacent=this.neighbors(from).some((entry)=>entry.index===to)&&!this.board[to];if(!capture&&!adjacent)return{success:false,error:'Invalid hare move.'};this.board[to]='hare';this.board[from]=null;if(capture)this.board[capture.over]=null;this.currentPlayer='hunters';}else{if(!this.neighbors(from).some((entry)=>entry.index===to)||this.board[to])return{success:false,error:'Hunters move one step.'};this.board[to]='hunters';this.board[from]=null;this.currentPlayer='hare';}if(!this.neighbors(this.board.indexOf('hare')).some((entry)=>!this.board[entry.index])&&!this.jumps(this.board.indexOf('hare')).length){this.isGameOver=true;this.winner='hunters';}else if(this.board.filter((entry)=>entry==='hunters').length<=3){this.isGameOver=true;this.winner='hare';}return{success:true};}
 toState(){return{board:this.board.slice(),currentPlayer:this.currentPlayer,isGameOver:this.isGameOver,winner:this.winner};}
 static fromState(state){return state?new CatchTheHare(state):new CatchTheHare();}
}
module.exports=CatchTheHare;
