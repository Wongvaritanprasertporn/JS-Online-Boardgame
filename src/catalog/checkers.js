const SIZE = 8;

class Checkers {
	constructor(state = null) {
		if (state) {
			Object.assign(this, state);
			return;
		}
		this.board = Array(SIZE * SIZE).fill(null);
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < SIZE; col++) {
				if ((row + col) % 2 === 1) this.board[row * SIZE + col] = 'black';
			}
		}
		for (let row = 5; row < SIZE; row++) {
			for (let col = 0; col < SIZE; col++) {
				if ((row + col) % 2 === 1) this.board[row * SIZE + col] = 'white';
			}
		}
		this.currentPlayer = 'black';
		this.isGameOver = false;
		this.winner = null;
	}

	coordinates(index) { return [Math.floor(index / SIZE), index % SIZE]; }
	index(row, col) { return row * SIZE + col; }

	capturesAvailable() {
		return this.board.some((piece, from) => piece && piece.startsWith(this.currentPlayer) && this.captureTargets(from).length);
	}

	captureTargets(from) {
		const piece = this.board[from];
		if (!piece) return [];
		const [row, col] = this.coordinates(from);
		const targets = [];
		for (const [rowDelta, colDelta] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
			const middleRow = row + rowDelta;
			const middleCol = col + colDelta;
			const targetRow = row + rowDelta * 2;
			const targetCol = col + colDelta * 2;
			if (targetRow < 0 || targetRow >= SIZE || targetCol < 0 || targetCol >= SIZE || middleRow < 0 || middleRow >= SIZE || middleCol < 0 || middleCol >= SIZE) continue;
			const middle = this.board[this.index(middleRow, middleCol)];
			if (middle && !middle.startsWith(this.currentPlayer) && !this.board[this.index(targetRow, targetCol)]) targets.push(this.index(targetRow, targetCol));
		}
		return targets;
	}

	move(from, to) {
		if (this.isGameOver || !Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0 || from >= this.board.length || to >= this.board.length) return { success: false, error: 'Choose two valid squares.' };
		const piece = this.board[from];
		if (!piece || !piece.startsWith(this.currentPlayer) || this.board[to]) return { success: false, error: 'Choose one of your pieces and an empty square.' };
		const [fromRow, fromCol] = this.coordinates(from);
		const [toRow, toCol] = this.coordinates(to);
		const rowDelta = toRow - fromRow;
		const colDelta = toCol - fromCol;
		const isKing = piece.endsWith('-king');
		const forward = this.currentPlayer === 'black' ? 1 : -1;
		const captures = this.capturesAvailable();
		let captured = null;
		if (Math.abs(rowDelta) === 2 && Math.abs(colDelta) === 2) {
			if (!this.captureTargets(from).includes(to)) return { success: false, error: 'That capture is not legal.' };
			captured = this.index(fromRow + rowDelta / 2, fromCol + colDelta / 2);
		} else if (captures || Math.abs(rowDelta) !== 1 || Math.abs(colDelta) !== 1 || (!isKing && rowDelta !== forward)) {
			return { success: false, error: 'A capture is required or the move is illegal.' };
		}
		this.board[from] = null;
		this.board[to] = piece;
		if (captured !== null) this.board[captured] = null;
		if ((this.currentPlayer === 'black' && toRow === SIZE - 1) || (this.currentPlayer === 'white' && toRow === 0)) this.board[to] = `${this.currentPlayer}-king`;
		const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
		if (!this.board.some((value) => value && value.startsWith(opponent))) {
			this.isGameOver = true;
			this.winner = this.currentPlayer;
		} else this.currentPlayer = opponent;
		return { success: true, captured: captured !== null };
	}

	toState() { return { board: this.board.slice(), currentPlayer: this.currentPlayer, isGameOver: this.isGameOver, winner: this.winner }; }
	static fromState(state) { return state ? new Checkers(state) : new Checkers(); }
}

module.exports = Checkers;