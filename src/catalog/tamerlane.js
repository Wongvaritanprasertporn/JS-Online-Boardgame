class Tamerlane {
  constructor(state = null) {
    if (state) { this.board = state.board.map((row) => row.map((piece) => piece && { ...piece })); this.currentPlayer = state.currentPlayer; this.isGameOver = state.isGameOver; this.winner = state.winner; return; }
    this.board = Array.from({ length: 11 }, () => Array(10).fill(null)); this.currentPlayer = 'white'; this.isGameOver = false; this.winner = null; this.setup();
  }
  setup() {
    const back = ['elephant','camel','dabbaba','elephant','knight','rook','general','king','giraffe','camel'];
    back.forEach((type,col)=>{this.board[0][col]={color:'black',type};this.board[10][col]={color:'white',type};this.board[1][col]={color:'black',type:'pawn',pawnOf:type};this.board[9][col]={color:'white',type:'pawn',pawnOf:type};});
  }
  inBounds(r,c){return r>=0&&r<11&&c>=0&&c<10;}
  pathClear(fr,fc,tr,tc){const sr=Math.sign(tr-fr),sc=Math.sign(tc-fc);let r=fr+sr,c=fc+sc;while(r!==tr||c!==tc){if(this.board[r][c])return false;r+=sr;c+=sc;}return true;}
  isValidMove(fr,fc,tr,tc){
    if(this.isGameOver||!this.inBounds(fr,fc)||!this.inBounds(tr,tc))return false;const p=this.board[fr][fc],t=this.board[tr][tc];if(!p||p.color!==this.currentPlayer||t?.color===p.color)return false;const dr=tr-fr,dc=tc-fc,ar=Math.abs(dr),ac=Math.abs(dc),f=p.color==='white'?-1:1;
    if(p.type==='king'||p.type==='general')return ar<=1&&ac<=1&&ar+ac>0;
    if(p.type==='rook')return(dr===0||dc===0)&&this.pathClear(fr,fc,tr,tc);
    if(p.type==='giraffe')return((ar===1&&ac>=3)||(ac===1&&ar>=3))&&this.pathClear(fr,fc,tr,tc);
    if(p.type==='camel')return(ar===3&&ac===1)||(ar===1&&ac===3);
    if(p.type==='elephant')return ar===2&&ac===2;
    if(p.type==='dabbaba')return(ar===2&&ac===0)||(ar===0&&ac===2);
    if(p.type==='knight')return(ar===2&&ac===1)||(ar===1&&ac===2);
    return(dr===f&&dc===0&&!t)||(dr===f&&ac===1&&Boolean(t));
  }
  getValidMoves(r,c){const m=[];for(let tr=0;tr<11;tr++)for(let tc=0;tc<10;tc++)if(this.isValidMove(r,c,tr,tc))m.push({row:tr,col:tc});return m;}
  move(fr,fc,tr,tc){if(!this.isValidMove(fr,fc,tr,tc))return{success:false,error:'Invalid move.'};const p=this.board[fr][fc],captured=this.board[tr][tc];this.board[tr][tc]=p;this.board[fr][fc]=null;if(p.type==='pawn'&&(tr===0||tr===10))p.type=p.pawnOf==='king'?'general':p.pawnOf;if(captured?.type==='king'){this.isGameOver=true;this.winner=p.color;}else this.currentPlayer=this.currentPlayer==='white'?'black':'white';return{success:true,captured};}
  toState(){return{board:this.board.map(row=>row.map(p=>p&&{...p})),currentPlayer:this.currentPlayer,isGameOver:this.isGameOver,winner:this.winner};}
  static fromState(state){return state?new Tamerlane(state):new Tamerlane();}
}
module.exports=Tamerlane;
