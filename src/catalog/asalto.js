const SIZE=6;
class Asalto{
 constructor(state=null){if(state){Object.assign(this,state);return;}this.board=Array(36).fill(null);for(let row=2;row<6;row++)for(let col=0;col<SIZE;col++)this.board[row*SIZE+col]='rebels';this.board[0]='officer';this.board[5]='officer';this.currentPlayer='rebels';this.isGameOver=false;this.winner=null;}
 row(i){return Math.floor(i/SIZE);}col(i){return i%SIZE;}
 neighbors(i){const result=[];for(const[dr,dc]of[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]){const row=this.row(i)+dr,col=this.col(i)+dc;if(row>=0&&row<SIZE&&col>=0&&col<SIZE)result.push({index:row*SIZE+col,dr,dc});}return result;}
 move(from,to){const piece=this.board[from];if(this.isGameOver||piece!==this.currentPlayer||this.board[to])return{success:false,error:'Invalid Asalto move.'};if(piece==='rebels'){if(this.row(to)>=this.row(from)||!this.neighbors(from).some((entry)=>entry.index===to))return{success:false,error:'Rebels advance toward the fortress.'};this.board[to]='rebels';this.board[from]=null;}else{const jump=this.officerJumps(from).find((entry)=>entry.to===to);const adjacent=this.neighbors(from).some((entry)=>entry.index===to);if(!jump&&!adjacent)return{success:false,error:'Invalid officer move.'};this.board[to]='officer';this.board[from]=null;if(jump)this.board[jump.over]=null;}if(!this.board.includes('officer')||[0,1,2,3,4,5].every((index)=>this.board[index]==='rebels')){this.isGameOver=true;this.winner='rebels';}else if(this.board.filter((entry)=>entry==='rebels').length<4){this.isGameOver=true;this.winner='officers';}else this.currentPlayer=this.currentPlayer==='rebels'?'officers':'rebels';return{success:true};}
 officerJumps(from){const result=[];for(const neighbor of this.neighbors(from)){const row=this.row(from)+neighbor.dr*2,col=this.col(from)+neighbor.dc*2,to=row*SIZE+col;if(row>=0&&row<SIZE&&col>=0&&col<SIZE&&this.board[neighbor.index]==='rebels'&&!this.board[to])result.push({to,over:neighbor.index});}return result;}
 toState(){return{board:this.board.slice(),currentPlayer:this.currentPlayer,isGameOver:this.isGameOver,winner:this.winner};}
 static fromState(state){return state?new Asalto(state):new Asalto();}
}
module.exports=Asalto;
