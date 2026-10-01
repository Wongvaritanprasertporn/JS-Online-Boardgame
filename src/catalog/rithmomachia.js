class Rithmomachia {
  constructor(state=null){if(state){Object.assign(this,state);this.board=state.board.map(row=>row.map(p=>p&&{...p}));return;}this.board=Array.from({length:8},()=>Array(16).fill(null));this.currentPlayer='white';this.isGameOver=false;this.winner=null;this.setup();}
  setup(){for(let c=0;c<16;c+=2){this.board[0][c]={color:'black',shape:c%4===0?'round':'triangle',value:c+1};this.board[7][c]={color:'white',shape:c%4===0?'round':'triangle',value:c+2};this.board[1][c]={color:'black',shape:'square',value:c+4};this.board[6][c]={color:'white',shape:'square',value:c+5};}}
  inBounds(r,c){return r>=0&&r<8&&c>=0&&c<16;}
  pathClear(fr,fc,tr,tc){const sr=Math.sign(tr-fr),sc=Math.sign(tc-fc);let r=fr+sr,c=fc+sc;while(r!==tr||c!==tc){if(this.board[r][c])return false;r+=sr;c+=sc;}return true;}
  valid(fr,fc,tr,tc){const p=this.board[fr]?.[fc],target=this.board[tr]?.[tc];if(!p||p.color!==this.currentPlayer||!this.inBounds(tr,tc)||target?.color===p.color)return false;const dr=tr-fr,dc=tc-fc,ar=Math.abs(dr),ac=Math.abs(dc);if(p.shape==='round')return ar===1&&ac===1;if(p.shape==='triangle')return(ar===2&&ac===0)||(ar===0&&ac===2);if(p.shape==='square')return(ar===3&&ac===0)||(ar===0&&ac===3);return false;}
  move(fr,fc,tr,tc){if(!this.valid(fr,fc,tr,tc))return{success:false,error:'Invalid move.'};const p=this.board[fr][fc],target=this.board[tr][tc];this.board[fr][fc]=null;this.board[tr][tc]=p;if(target){if(target.value===p.value||target.value%p.value===0||p.value%target.value===0){this.board[tr][tc]=p;}else{this.board[fr][fc]=p;this.board[tr][tc]=target;return{success:false,error:'Numbers do not permit capture.'};}}this.currentPlayer=this.currentPlayer==='white'?'black':'white';return{success:true};}
  toState(){return{board:this.board.map(row=>row.map(p=>p&&{...p})),currentPlayer:this.currentPlayer,isGameOver:this.isGameOver,winner:this.winner};}static fromState(s){return s?new Rithmomachia(s):new Rithmomachia();}
}
module.exports=Rithmomachia;
