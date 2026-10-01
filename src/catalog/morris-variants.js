class MorrisVariant {
  constructor(state = null, variant = 'nine') {
    this.variant = variant;
    this.size = variant === 'three' ? 9 : 24;
    this.piecesPerPlayer = variant === 'three' ? 3 : variant === 'six' ? 6 : 9;
    this.board = state ? state.board.slice() : Array(this.size).fill(null);
    this.currentPlayer = state?.currentPlayer || 'black';
    this.phase = state?.phase || 'placement';
    this.placed = state?.placed || { black: 0, white: 0 };
    this.isGameOver = state?.isGameOver || false;
    this.winner = state?.winner || null;
  }
  getAdjacent(position) {
    if (this.variant === 'three') return { 0:[1,3,4], 1:[0,2,4], 2:[1,4,5], 3:[0,4,6], 4:[0,1,2,3,5,6,7,8], 5:[2,4,8], 6:[3,4,7], 7:[4,6,8], 8:[4,5,7] }[position] || [];
    return {0:[1,9],1:[0,2,4],2:[1,3],3:[2,4,10],4:[1,3,5,7],5:[4,6],6:[5,7,13],7:[4,6,8],8:[7,12],9:[0,10,21],10:[3,9,11,19],11:[10,12,18],12:[8,11,13],13:[6,12,14],14:[13,15,23],15:[14,16,22],16:[15,17,19],17:[16,18],18:[11,17,20],19:[10,16,20],20:[18,19],21:[9,22],22:[15,21,23],23:[14,22]}[position] || [];
  }
  getMills() { return this.variant === 'three' ? [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]] : [[0,1,2],[3,4,5],[6,7,8],[9,10,11],[12,13,14],[15,16,17],[18,19,20],[21,22,23],[0,9,21],[2,11,18],[6,13,23],[8,12,17],[1,4,7],[16,19,22],[3,10,19],[5,14,20]]; }
  inMill(position) { return this.getMills().some((mill) => mill.includes(position) && mill.every((index) => this.board[index] === this.board[position])); }
  place(position) { if (this.phase !== 'placement' || this.board[position] !== null || this.placed[this.currentPlayer] >= this.piecesPerPlayer) return { success:false,error:'Invalid placement.' }; this.board[position]=this.currentPlayer; this.placed[this.currentPlayer]++; const mill=this.inMill(position); if(this.placed.black===this.piecesPerPlayer&&this.placed.white===this.piecesPerPlayer)this.phase='movement'; if(!mill)this.currentPlayer=this.currentPlayer==='black'?'white':'black'; return {success:true,mill}; }
  move(from,to) { if(this.phase==='placement'||this.board[from]!==this.currentPlayer||this.board[to]!==null)return{success:false,error:'Invalid move.'}; const count=this.board.filter((piece)=>piece===this.currentPlayer).length; if(count>3&&!this.getAdjacent(from).includes(to))return{success:false,error:'Move must be adjacent.'}; this.board[from]=null;this.board[to]=this.currentPlayer;const mill=this.inMill(to);if(!mill)this.currentPlayer=this.currentPlayer==='black'?'white':'black';return{success:true,mill}; }
  capture(position) { const opponent=this.currentPlayer==='black'?'white':'black'; if(this.board[position]!==opponent||this.inMill(position)&&this.board.filter((piece)=>piece===opponent&&!this.inMill(this.board.indexOf(piece))).length>0)return{success:false,error:'Invalid capture.'};this.board[position]=null;if(this.board.filter((piece)=>piece===opponent).length<3){this.isGameOver=true;this.winner=this.currentPlayer;}this.currentPlayer=this.currentPlayer==='black'?'white':'black';return{success:true}; }
  getValidMoves(position){if(this.board[position]!==this.currentPlayer)return[];const count=this.board.filter((piece)=>piece===this.currentPlayer).length;return this.board.map((piece,index)=>piece===null&&(count===3||this.getAdjacent(position).includes(index))?index:null).filter((index)=>index!==null);}
  toState(){return{board:this.board.slice(),currentPlayer:this.currentPlayer,phase:this.phase,placed:{...this.placed},isGameOver:this.isGameOver,winner:this.winner};}
  static fromState(state,variant){return new MorrisVariant(state,variant);}
}
module.exports=MorrisVariant;
