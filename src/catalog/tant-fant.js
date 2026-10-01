class TantFant {
  constructor(state=null){if(state){Object.assign(this,state);this.board=state.board.slice();return;}this.board=['black','black','black',null,null,null,'white','white','white'];this.currentPlayer='black';this.isGameOver=false;this.winner=null;}
  adjacent(i){return {0:[1,3,4],1:[0,2,4],2:[1,4,5],3:[0,4,6],4:[0,1,2,3,5,6,7,8],5:[2,4,8],6:[3,4,7],7:[4,6,8],8:[4,5,7]}[i]||[];}
  wins(color){return [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].some(line=>line[0]!== (color==='black'?0:6)&&line.every(i=>this.board[i]===color));}
  move(from,to){if(this.isGameOver||this.board[from]!==this.currentPlayer||this.board[to]||!this.adjacent(from).includes(to))return{success:false,error:'Invalid move.'};this.board[from]=null;this.board[to]=this.currentPlayer;if(this.wins(this.currentPlayer)){this.isGameOver=true;this.winner=this.currentPlayer;}else this.currentPlayer=this.currentPlayer==='black'?'white':'black';return{success:true};}
  toState(){return{board:this.board.slice(),currentPlayer:this.currentPlayer,isGameOver:this.isGameOver,winner:this.winner};}static fromState(s){return s?new TantFant(s):new TantFant();}
}
module.exports=TantFant;
