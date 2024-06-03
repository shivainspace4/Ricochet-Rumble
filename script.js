const board = document.getElementById('gameBoard');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const resetBtn = document.getElementById('resetBtn');
const player1Timer = document.getElementById('player1Timer');
const player2Timer = document.getElementById('player2Timer');

const initialBoardConfig = [
    ['titan', null, null, null, null, null, null, 'titan'],
    ['tank', null, null, null, null, null, null, 'tank'],
    ['ricochet', null, null, null, null, null, null, 'ricochet'],
    ['semi-ricochet', null, null, null, null, null, null, 'semi-ricochet'],
    ['cannon', 'cannon', 'cannon', 'cannon', 'cannon', 'cannon', 'cannon', 'cannon'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
];

let gameState = JSON.parse(JSON.stringify(initialBoardConfig));
let currentPlayer = 1;
let player1Time = 300;
let player2Time = 300;
let gamePaused = false;
let timerInterval;

let selectedPiece = null;

function createBoard() {
    board.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.row = row;
            tile.dataset.col = col;
            const piece = gameState[row][col];
            if (piece) {
                const pieceDiv = document.createElement('div');
                pieceDiv.classList.add('piece', piece);
                tile.appendChild(pieceDiv);
            }
            tile.addEventListener('click', () => handleTileClick(row, col));
            board.appendChild(tile);
        }
    }
}

function handleTileClick(row, col) {
    if (gamePaused) return;

    if (selectedPiece) {
        // Attempt to move the piece to the clicked tile
        if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
            movePiece(selectedPiece.row, selectedPiece.col, row, col);
            selectedPiece = null;
            switchPlayer();
        } else {
            // Invalid move, deselect the piece
            selectedPiece = null;
        }
    } else if (gameState[row][col]) {
        // Select a piece
        selectedPiece = { row, col, piece: gameState[row][col] };
    }
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = gameState[fromRow][fromCol];
    const validPieces = ['titan', 'tank', 'ricochet', 'semi-ricochet', 'cannon'];
    if (!validPieces.includes(piece)) return false;

    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    // Allow only one tile movement or rotation
    return (rowDiff <= 1 && colDiff <= 1) && !gameState[toRow][toCol];
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = gameState[fromRow][fromCol];
    gameState[toRow][toCol] = piece;
    gameState[fromRow][fromCol] = null;
    createBoard();
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function updateTimers() {
    player1Timer.textContent = `Player 1: ${player1Time}`;
    player2Timer.textContent = `Player 2: ${player2Time}`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (!gamePaused) {
            if (currentPlayer === 1) {
                player1Time--;
                if (player1Time === 0) endGame(2);
            } else {
                player2Time--;
                if (player2Time === 0) endGame(1);
            }
            updateTimers();
        }
    }, 1000);
}

function endGame(winner) {
    clearInterval(timerInterval);
    alert(`Player ${winner} wins!`);
}

pauseBtn.addEventListener('click', () => {
    gamePaused = true;
});

resumeBtn.addEventListener('click', () => {
    gamePaused = false;
});

resetBtn.addEventListener('click', () => {
    gameState = JSON.parse(JSON.stringify(initialBoardConfig));
    currentPlayer = 1;
    player1Time = 300;
    player2Time = 300;
    gamePaused = false;
    clearInterval(timerInterval);
    createBoard();
    startTimer();
});

createBoard();
startTimer();
