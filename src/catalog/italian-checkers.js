const SIZE = 8;
class ItalianCheckers {
  constructor(state = null) {
    if (state) { Object.assign(this, state); return; }
    this.board = Array(64).fill(null);
    for (let row = 0; row < 3; row++) for (let col = 0; col < SIZE; col++) if ((row + col) % 2 === 1) this.board[row * SIZE + col] = { color: 'black', king: false };
    for (let row = 5; row < 8; row++) for (let col = 0; col < SIZE; col++) if ((row + col) % 2 === 1) this.board[row * SIZE + col] = { color: 'white', king: false };
    this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null;
  }
  row(index) { return Math.floor(index / SIZE); }
  col(index) { return index % SIZE; }
  directions(piece, capture = false) { if (piece.king) return [[-1,-1],[-1,1],[1,-1],[1,1]]; const forward = piece.color === 'black' ? 1 : -1; return capture ? [[-1,-1],[-1,1],[1,-1],[1,1]] : [[forward,-1],[forward,1]]; }
  captures(from) { const piece = this.board[from]; const opponent = this.currentPlayer === 'black' ? 'white' : 'black'; return this.directions(piece, true).map(([dr,dc]) => { const row=this.row(from)+dr, col=this.col(from)+dc, toRow=row+dr, toCol=col+dc; if(row<0||row>=SIZE||col<0||col>=SIZE||toRow<0||toRow>=SIZE||toCol<0||toCol>=SIZE)return null; const over=row*SIZE+col,to=toRow*SIZE+toCol; return this.board[over]?.color===opponent&&!this.board[to]?{to,over}:null; }).filter(Boolean); }
  moves(from) { const piece=this.board[from]; if(!piece||piece.color!==this.currentPlayer)return[]; const captures=this.board.flatMap((entry,index)=>entry?.color===this.currentPlayer?this.captures(index).map((move)=>({from:index,...move})):[]); if(captures.length)return captures.filter((move)=>move.from===from); return this.directions(piece).map(([dr,dc])=>[this.row(from)+dr,this.col(from)+dc]).filter(([row,col])=>row>=0&&row<SIZE&&col>=0&&col<SIZE&&!this.board[row*SIZE+col]).map(([row,col])=>({from,to:row*SIZE+col})); }
  move(from,to) { const candidate=this.moves(from).find((move)=>move.to===to); if(this.isGameOver||!candidate)return{success:false,error:'Invalid Italian Checkers move.'}; const piece=this.board[from]; this.board[to]=piece;this.board[from]=null;if(candidate.over!==undefined)this.board[candidate.over]=null;if((piece.color==='black'&&this.row(to)===7)||(piece.color==='white'&&this.row(to)===0))piece.king=true;const opponent=this.currentPlayer==='black'?'white':'black';if(!this.board.some((entry)=>entry?.color===opponent)){this.isGameOver=true;this.winner=this.currentPlayer;}else this.currentPlayer=opponent;return{success:true,captured:candidate.over!==undefined}; }
  toState(){return{board:this.board.map((piece)=>piece&&{...piece}),currentPlayer:this.currentPlayer,isGameOver:this.isGameOver,winner:this.winner};}
  static fromState(state){return state?new ItalianCheckers(state):new ItalianCheckers();}
}
module.exports=ItalianCheckers;
