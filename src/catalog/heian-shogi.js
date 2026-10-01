class HeianShogi {
  constructor(state = null) {
    if (state) { this.board = state.board.map((row) => row.map((piece) => piece && { ...piece })); this.currentPlayer = state.currentPlayer; this.isGameOver = state.isGameOver; this.winner = state.winner; return; }
    this.board = Array.from({ length: 8 }, () => Array(9).fill(null)); this.currentPlayer = 'black'; this.isGameOver = false; this.winner = null; this.setup();
  }
  setup() { const back=['lance','knight','silver','gold','king','gold','silver','knight','lance']; back.forEach((type,c)=>{this.board[0][c]={color:'white',type};this.board[7][c]={color:'black',type};this.board[2][c]={color:'white',type:'pawn'};this.board[5][c]={color:'black',type:'pawn'};}); }
  inBounds(r,c){return r>=0&&r<8&&c>=0&&c<9;}
  forward(p){return p.color==='black'?-1:1;}
  pathClear(fr,fc,tr,tc){const sr=Math.sign(tr-fr),sc=Math.sign(tc-fc);let r=fr+sr,c=fc+sc;while(r!==tr||c!==tc){if(this.board[r][c])return false;r+=sr;c+=sc;}return true;}
  isValidMove(fr,fc,tr,tc){if(this.isGameOver||!this.inBounds(fr,fc)||!this.inBounds(tr,tc))return false;const p=this.board[fr][fc],t=this.board[tr][tc];if(!p||p.color!==this.currentPlayer||t?.color===p.color)return false;const dr=tr-fr,dc=tc-fc,ar=Math.abs(dr),ac=Math.abs(dc),f=this.forward(p),type=p.promoted?'gold':p.type;if(type==='king')return ar<=1&&ac<=1&&ar+ac>0;if(type==='gold')return(dr===f&&ac<=1)||(dr===0&&ac===1)||(dr===-f&&dc===0);if(type==='silver')return(dr===f&&ac<=1)||(dr===-f&&ac===1);if(type==='knight')return dr===f*2&&ac===1;if(type==='lance')return dc===0&&dr*f>0&&this.pathClear(fr,fc,tr,tc);return dr===f&&dc===0;}
  getValidMoves(r,c){const m=[];for(let tr=0;tr<8;tr++)for(let tc=0;tc<9;tc++)if(this.isValidMove(r,c,tr,tc))m.push({row:tr,col:tc});return m;}
  move(fr,fc,tr,tc,promote=false){if(!this.isValidMove(fr,fc,tr,tc))return{success:false,error:'Invalid move.'};const p=this.board[fr][fc],captured=this.board[tr][tc];this.board[tr][tc]=p;this.board[fr][fc]=null;const inZone=p.color==='black'?tr<=2:tr>=5;if(p.type!=='king'&&p.type!=='gold'&&(promote||inZone))p.promoted=true;if(captured?.type==='king'){this.isGameOver=true;this.winner=p.color;}else this.currentPlayer=this.currentPlayer==='black'?'white':'black';return{success:true,captured};}
  toState(){return{board:this.board.map(row=>row.map(p=>p&&{...p})),currentPlayer:this.currentPlayer,isGameOver:this.isGameOver,winner:this.winner};}
  static fromState(state){return state?new HeianShogi(state):new HeianShogi();}
}
module.exports=HeianShogi;
