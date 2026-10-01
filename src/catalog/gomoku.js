class Gomoku {
  constructor(state = null) {
    if (state) { this.board = state.board.map((row) => row.slice()); this.currentPlayer = state.currentPlayer; this.isGameOver = state.isGameOver; this.winner = state.winner; return; }
    this.board = Array.from({ length: 15 }, () => Array(15).fill(null)); this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null;
  }
  inBounds(r,c){return r>=0&&r<15&&c>=0&&c<15;}
  isValidMove(row,col){return !this.isGameOver&&this.inBounds(row,col)&&!this.board[row][col];}
  count(row,col,dr,dc,color){let total=0,r=row+dr,c=col+dc;while(this.inBounds(r,c)&&this.board[r][c]===color){total++;r+=dr;c+=dc;}return total;}
  move(row,col){if(!this.isValidMove(row,col))return{success:false,error:'Invalid move.'};const color=this.currentPlayer;this.board[row][col]=color;const directions=[[1,0],[0,1],[1,1],[1,-1]];if(directions.some(([dr,dc])=>1+this.count(row,col,dr,dc,color)+this.count(row,col,-dr,-dc,color)>=5)){this.isGameOver=true;this.winner=color;}else if(this.board.every((line)=>line.every(Boolean))){this.isGameOver=true;this.winner='draw';}else this.currentPlayer=color==='black'?'white':'black';return{success:true};}
  getValidMoves(){const moves=[];for(let row=0;row<15;row++)for(let col=0;col<15;col++)if(!this.board[row][col])moves.push({row,col});return moves;}
  toState(){return{board:this.board.map((row)=>row.slice()),currentPlayer:this.currentPlayer,isGameOver:this.isGameOver,winner:this.winner};}
  static fromState(state){return state?new Gomoku(state):new Gomoku();}
}
module.exports=Gomoku;
