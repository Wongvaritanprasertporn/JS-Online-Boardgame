const SIZE=6;
const OUTER=[0,1,2,3,4,5,11,17,23,29,35,34,33,32,31,30,24,18,12,6];
const INNER=[7,8,9,10,16,22,28,27,26,25,19,13];
class Surakarta{
 constructor(state=null){if(state){Object.assign(this,state);return;}this.board=Array(36).fill(null);for(let row=0;row<2;row++)for(let col=0;col<SIZE;col++)this.board[row*SIZE+col]='black';for(let row=4;row<6;row++)for(let col=0;col<SIZE;col++)this.board[row*SIZE+col]='white';this.currentPlayer='black';this.isGameOver=false;this.winner=null;}
 row(i){return Math.floor(i/SIZE);}col(i){return i%SIZE;}
 neighbors(i){const result=[];for(const[dr,dc]of[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]){const row=this.row(i)+dr,col=this.col(i)+dc;if(row>=0&&row<SIZE&&col>=0&&col<SIZE)result.push(row*SIZE+col);}return result;}
 circuitCapture(from,to,loop){const start=loop.indexOf(from),end=loop.indexOf(to);if(start<0||end<0)return false;for(const direction of[-1,1]){let position=(start+direction+loop.length)%loop.length;while(position!==end){if(this.board[loop[position]])break;position=(position+direction+loop.length)%loop.length;}if(position===end)return true;}return false;}
 canCapture(from,to){const opponent=this.currentPlayer==='black'?'white':'black';return this.board[to]===opponent&&[OUTER,INNER].some((loop)=>this.circuitCapture(from,to,loop));}
 move(from,to){const piece=this.board[from],capture=this.canCapture(from,to),adjacent=this.neighbors(from).includes(to)&&!this.board[to];if(this.isGameOver||piece!==this.currentPlayer||(!adjacent&&!capture))return{success:false,error:'Invalid Surakarta move.'};this.board[to]=piece;this.board[from]=null;if(capture)this.board[to]=this.currentPlayer;const opponent=this.currentPlayer==='black'?'white':'black';if(!this.board.includes(opponent)){this.isGameOver=true;this.winner=this.currentPlayer;}else this.currentPlayer=opponent;return{success:true,captured:capture};}
 toState(){return{board:this.board.slice(),currentPlayer:this.currentPlayer,isGameOver:this.isGameOver,winner:this.winner};}
 static fromState(state){return state?new Surakarta(state):new Surakarta();}
}
module.exports=Surakarta;
