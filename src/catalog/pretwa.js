const EDGES=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,17],[17,18],[0,6],[2,8],[4,10],[6,12],[8,14],[10,16],[12,18]];
class Pretwa{
 constructor(state=null){if(state){Object.assign(this,state);return;}this.board=Array(19).fill(null);for(let i=0;i<9;i++)this.board[i]='black';for(let i=10;i<19;i++)this.board[i]='white';this.currentPlayer='black';this.isGameOver=false;this.winner=null;}
 neighbors(i){return EDGES.flatMap(([from,to])=>from===i?[to]:to===i?[from]:[]);}
 jumps(from){const result=[],opponent=this.currentPlayer==='black'?'white':'black';for(const middle of this.neighbors(from))for(const to of this.neighbors(middle))if(to!==from&&this.board[middle]===opponent&&!this.board[to])result.push({to,over:middle});return result;}
 move(from,to){const captures=this.board.flatMap((piece,index)=>piece===this.currentPlayer?this.jumps(index).map((jump)=>({from:index,...jump})):[]);const capture=captures.find((entry)=>entry.from===from&&entry.to===to);const adjacent=this.neighbors(from).includes(to)&&!this.board[to];if(this.isGameOver||this.board[from]!==this.currentPlayer||(captures.length?!capture:!adjacent))return{success:false,error:'Invalid Pretwa move.'};this.board[to]=this.currentPlayer;this.board[from]=null;if(capture)this.board[capture.over]=null;const opponent=this.currentPlayer==='black'?'white':'black';if(!this.board.includes(opponent)){this.isGameOver=true;this.winner=this.currentPlayer;}else this.currentPlayer=opponent;return{success:true,captured:Boolean(capture)};}
 toState(){return{board:this.board.slice(),currentPlayer:this.currentPlayer,isGameOver:this.isGameOver,winner:this.winner};}
 static fromState(state){return state?new Pretwa(state):new Pretwa();}
}
module.exports=Pretwa;
