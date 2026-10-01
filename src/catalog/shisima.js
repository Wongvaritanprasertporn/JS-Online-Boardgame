class Shisima {
  constructor(state=null){if(state){Object.assign(this,state);this.board=state.board.slice();return;}this.board=Array(9).fill(null);this.board[0]=this.board[1]=this.board[2]='black';this.board[6]=this.board[7]=this.board[8]='white';this.currentPlayer='black';this.isGameOver=false;this.winner=null;}
  adjacent(i){return {0:[1,3,4],1:[0,2,4],2:[1,4,5],3:[0,4,6],4:[0,1,2,3,5,6,7,8],5:[2,4,8],6:[3,4,7],7:[4,6,8],8:[4,5,7]}[i]||[];}
  mill(p){return [[0,4,5],[1,4,6],[2,4,7],[3,4,8]].some(line=>line.every(i=>this.board[i]===p));}
  move(from,to){if(this.isGameOver||this.board[from]!==this.currentPlayer||this.board[to]||!this.adjacent(from).includes(to))return{success:false,error:'Invalid move.'};this.board[from]=null;this.board[to]=this.currentPlayer;if(this.mill(this.currentPlayer)){this.isGameOver=true;this.winner=this.currentPlayer;}else this.currentPlayer=this.currentPlayer==='black'?'white':'black';return{success:true};}
  toState(){return{board:this.board.slice(),currentPlayer:this.currentPlayer,isGameOver:this.isGameOver,winner:this.winner};}static fromState(s){return s?new Shisima(s):new Shisima();}
}
module.exports=Shisima;
