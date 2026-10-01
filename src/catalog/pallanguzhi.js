class Pallanguzhi {
	constructor(state = null) {
		if (state) {
			Object.assign(this, state);
			return;
		}
		this.board = Array(14).fill(5);
		this.currentPlayer = 'black';
		this.scores = { black: 0, white: 0 };
		this.isGameOver = false;
		this.winner = null;
	}

	pitBelongsToPlayer(pit) { return this.currentPlayer === 'black' ? pit < 7 : pit >= 7; }

	move(from) {
		if (this.isGameOver || !Number.isInteger(from) || from < 0 || from >= this.board.length) return { success: false, error: 'Choose a valid pit.' };
		if (!this.pitBelongsToPlayer(from) || this.board[from] <= 0) return { success: false, error: 'Choose a non-empty pit on your side.' };
		let seeds = this.board[from];
		this.board[from] = 0;
		let pit = from;
		while (seeds > 0) {
			pit = (pit + 1) % this.board.length;
			this.board[pit]++;
			seeds--;
		}
		const oppositePit = pit < 7 ? pit + 7 : pit - 7;
		if (this.board[pit] === 1 && this.board[oppositePit] > 0) {
			this.scores[this.currentPlayer] += this.board[oppositePit] + 1;
			this.board[oppositePit] = 0;
			this.board[pit] = 0;
		}
		const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
		const opponentStart = opponent === 'black' ? 0 : 7;
		if (!this.board.slice(opponentStart, opponentStart + 7).some((count) => count > 0)) {
			this.isGameOver = true;
			this.winner = this.scores.black === this.scores.white ? 'draw' : this.scores.black > this.scores.white ? 'black' : 'white';
		} else this.currentPlayer = opponent;
		return { success: true };
	}

	toState() { return { board: this.board.slice(), currentPlayer: this.currentPlayer, scores: { ...this.scores }, isGameOver: this.isGameOver, winner: this.winner }; }
	static fromState(state) { return state ? new Pallanguzhi(state) : new Pallanguzhi(); }
}

module.exports = Pallanguzhi;