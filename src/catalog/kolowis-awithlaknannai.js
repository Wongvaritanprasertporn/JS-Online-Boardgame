const ROWS=3;const COLS=16;
class KolowisAwithlaknannai{
 constructor(state=null){if(state){Object.assign(this,state);return;}this.board=Array(48).fill(null);for(let i=0;i<23;i++)this.board[i]={color:'black'};for(let i=25;i<48;i++)this.board[i]={color:'white'};this.board[24]=null;this.currentPlayer='black';this.isGameOver=false;this.winner=null;}
 row(i){return Math.floor(i/COLS);}col(i){return i%COLS;}
 neighbors(i){const result=[];const row=this.row(i),col=this.col(i);for(const[dr,dc]of[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]){const r=row+dr,c=col+dc;if(r>=0&&r<ROWS&&c>=0&&c<COLS)result.push({index:r*COLS+c,dr,dc});}return result;}
 jumps(from){const result=[],opponent=this.currentPlayer==='black'?'white':'black';for(const neighbor of this.neighbors(from)){const r=this.row(from)+neighbor.dr*2,c=this.col(from)+neighbor.dc*2,to=r*COLS+c;if(r>=0&&r<ROWS&&c>=0&&c<COLS&&this.board[neighbor.index]?.color===opponent&&!this.board[to])result.push({to,over:neighbor.index});}return result;}
 move(from,to){const captures=this.board.flatMap((piece,index)=>piece?.color===this.currentPlayer?this.jumps(index).map((jump)=>({from:index,...jump})):[]);const capture=captures.find((entry)=>entry.from===from&&entry.to===to);const adjacent=this.neighbors(from).some((entry)=>entry.index===to)&&!this.board[to];if(this.isGameOver||this.board[from]?.color!==this.currentPlayer||(captures.length?!capture:!adjacent))return{success:false,error:'Invalid Kolowis Awithlaknannai move.'};const piece=this.board[from];this.board[to]=piece;this.board[from]=null;if(capture)this.board[capture.over]=null;const opponent=this.currentPlayer==='black'?'white':'black';if(!this.board.some((entry)=>entry?.color===opponent)){this.isGameOver=true;this.winner=this.currentPlayer;}else this.currentPlayer=opponent;return{success:true,captured:Boolean(capture)};}
 toState(){return{board:this.board.map((piece)=>piece&&{...piece}),currentPlayer:this.currentPlayer,isGameOver:this.isGameOver,winner:this.winner};}
 static fromState(state){return state?new KolowisAwithlaknannai(state):new KolowisAwithlaknannai();}
}
module.exports=KolowisAwithlaknannai;
