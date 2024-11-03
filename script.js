const board = document.getElementById('aether-board');
const ROWS = 6;
const COLS = 7;
let currentPlayer = 'fire';
let gameState = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let isGameActive = true;

for (let row = 0; row < ROWS; row++) {
	for (let col = 0; col < COLS; col++) {
		const cell = document.createElement('div');
		cell.classList.add('ethereal-cell');
		cell.dataset.row = row;
		cell.dataset.col = col;
		cell.id = `nexus-${row}-${col}`;

		const token = document.createElement('div');
		token.classList.add('token');
		cell.appendChild(token);

		cell.addEventListener('click', onCellClick);
		board.appendChild(cell);
	}
}

function onCellClick(e) {
	if (!isGameActive) return;

	const col = parseInt(e.currentTarget.dataset.col);
	let placedRow = null;

	for (let row = ROWS - 1; row >= 0; row--) {
		if (!gameState[row][col]) {
			placedRow = row;
			gameState[row][col] = currentPlayer;
			const cell = document.getElementById(`nexus-${row}-${col}`);
			const token = cell.querySelector('.token');
			token.classList.add(currentPlayer, 'active');

			if (checkVictory(placedRow, col)) {
				isGameActive = false;
				highlightWinningCells(placedRow, col);
				setTimeout(() => alert(`Player ${currentPlayer.toUpperCase()} wins!`), 200);
				return;
			} else if (isBoardFull()) {
				isGameActive = false;
				setTimeout(() => alert(`It's a draw!`), 200);
				return;
			} else {
				currentPlayer = currentPlayer === 'fire' ? 'water' : 'fire';
			}
			break;
		}
	}
}

function checkVictory(row, col) {
	return (
		checkDirection(row, col, 0, 1) + checkDirection(row, col, 0, -1) >= 3 ||
		checkDirection(row, col, 1, 0) >= 3 ||
		checkDirection(row, col, 1, 1) + checkDirection(row, col, -1, -1) >= 3 ||
		checkDirection(row, col, 1, -1) + checkDirection(row, col, -1, 1) >= 3
	);
}

function checkDirection(row, col, rowDir, colDir) {
	let count = 0;
	let r = row + rowDir;
	let c = col + colDir;

	while (
		r >= 0 &&
		r < ROWS &&
		c >= 0 &&
		c < COLS &&
		gameState[r][c] === currentPlayer
	) {
		count++;
		r += rowDir;
		c += colDir;
	}
	return count;
}

function highlightWinningCells(row, col) {
	const winningCells = [];

	function collectWinningCells(row, col, rowDir, colDir) {
		const cells = [{ row, col }];
		let r = row + rowDir;
		let c = col + colDir;

		while (
			r >= 0 &&
			r < ROWS &&
			c >= 0 &&
			c < COLS &&
			gameState[r][c] === currentPlayer
		) {
			cells.push({ row: r, col: c });
			r += rowDir;
			c += colDir;
		}
		return cells;
	}

	const directions = [
		{ rowDir: 0, colDir: 1 },
		{ rowDir: 1, colDir: 0 },
		{ rowDir: 1, colDir: 1 },
		{ rowDir: 1, colDir: -1 }
	];

	for (const { rowDir, colDir } of directions) {
		const positive = collectWinningCells(row, col, rowDir, colDir);
		const negative = collectWinningCells(row, col, -rowDir, -colDir);
		const line = [...negative.slice(1).reverse(), ...positive];

		if (line.length >= 4) {
			winningCells.push(...line);
		}
	}

	winningCells.forEach(({ row, col }) => {
		const cell = document.getElementById(`nexus-${row}-${col}`);
		const token = cell.querySelector('.token');
		token.classList.add('winning');
	});
}

function isBoardFull() {
	return gameState.every(row => row.every(cell => cell !== null));
}

function resetGame() {
	gameState = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
	const tokens = document.querySelectorAll('.token');
	tokens.forEach(token => {
		token.className = 'token';
	});
	currentPlayer = 'fire';
	isGameActive = true;
}
