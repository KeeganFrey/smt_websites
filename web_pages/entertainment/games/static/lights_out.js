// Game constants and state
const gridSize = 5;
let board = [];
let gridContainer; // Will be assigned in DOMContentLoaded
let resetButton; // Will be assigned in DOMContentLoaded

// Core game logic functions
function initializeBoard(makeSolvable = true) {
    board = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
    if (makeSolvable) {
        const randomClicks = Math.floor(Math.random() * 10) + 5;
        for (let i = 0; i < randomClicks; i++) {
            const r = Math.floor(Math.random() * gridSize);
            const c = Math.floor(Math.random() * gridSize);
            // Directly call the core toggle logic, not handleCellClick, to avoid rendering during setup
             const coordsToToggle = [
                [r, c], [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
            ];
            coordsToToggle.forEach(([row, col]) => {
                if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
                    board[row][col] = !board[row][col];
                }
            });
        }
        if (checkWinCondition()) {
            // Ensure not all are off initially if makeSolvable is true
            const r = Math.floor(Math.random() * gridSize);
            const c = Math.floor(Math.random() * gridSize);
            const coordsToToggle = [
                [r, c], [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
            ];
            coordsToToggle.forEach(([row, col]) => {
                if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
                    board[row][col] = !board[row][col];
                }
            });
        }
    }
}

function renderBoard() {
    if (!gridContainer) return; // Guard if called before DOM is ready
    gridContainer.innerHTML = '';
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const cell = document.createElement('div');
            cell.classList.add('light-cell');
            if (board[r][c]) {
                cell.classList.add('light-on');
            }
            cell.dataset.row = r;
            cell.dataset.col = c;
            // Event listener is attached here, calling the global handleCellClick
            cell.addEventListener('click', () => handleCellClick(r, c));
            gridContainer.appendChild(cell);
        }
    }
}

// Renamed from the original toggleLights to avoid confusion with the new exposed toggleLights function for testing.
// This function contains the actual logic for toggling a cell and its neighbors.
function applyToggleToBoard(r, c) {
    const coords = [
        [r, c], // Clicked cell
        [r - 1, c], // Up
        [r + 1, c], // Down
        [r, c - 1], // Left
        [r, c + 1]  // Right
    ];

    coords.forEach(([row, col]) => {
        if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
            board[row][col] = !board[row][col];
        }
    });
}

function handleCellClick(r, c) {
    applyToggleToBoard(r, c);
    renderBoard(); // Re-render after internal board state changes
    if (checkWinCondition()) {
        setTimeout(() => {
            alert('Congratulations! You won!');
            resetGame(); // resetGame will call initializeBoard and renderBoard
        }, 100);
    }
}

function checkWinCondition() {
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (board[r][c]) {
                return false;
            }
        }
    }
    return true;
}

function resetGame() {
    initializeBoard(true); // Pass true to ensure solvable board for actual gameplay
    renderBoard();
}

// Functions for testing
function getBoard() {
    return board;
}

function setBoard(newBoard) {
    if (newBoard && newBoard.length === gridSize && newBoard[0].length === gridSize) {
        board = newBoard.map(row => [...row]); // Create a deep copy
    } else {
        console.error("Invalid board dimensions for setBoard");
    }
}

// Expose functions needed for testing
// Note: renderBoard and handleCellClick are not directly exposed if they rely on DOM elements
// from their closure, but their core logic (applyToggleToBoard) is.
if (typeof window !== 'undefined') { // Ensure window exists (for non-browser environments if any)
    window.gridSize = gridSize;
    window.initializeBoard = initializeBoard;
    window.getBoard = getBoard;
    window.setBoard = setBoard;
    window.toggleLights = applyToggleToBoard; // Expose the core logic for testing
    window.checkWinCondition = checkWinCondition;
    // Exposing resetGame for convenience if needed, though it also calls renderBoard
    window.resetGame = resetGame;
}

// DOM specific setup
document.addEventListener('DOMContentLoaded', () => {
    gridContainer = document.getElementById('lights-out-grid');
    resetButton = document.getElementById('lights-out-reset-button');

    if (!gridContainer) {
        console.error("Lights Out: Could not find 'lights-out-grid' element.");
        return;
    }
    if (!resetButton) {
        console.error("Lights Out: Could not find 'lights-out-reset-button' element.");
        // Not returning, game can still be played if grid exists
    } else {
        resetButton.addEventListener('click', resetGame);
    }

    // Initial game setup
    resetGame();
});
