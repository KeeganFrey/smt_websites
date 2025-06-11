// Assume runTest and assert are available (e.g., from test_runner.html or a shared test library)

// Helper function to create a board state for testing
function createTestBoard(size, fillValue = false) {
    let board = [];
    for (let r = 0; r < size; r++) {
        board[r] = [];
        for (let c = 0; c < size; c++) {
            board[r][c] = fillValue;
        }
    }
    return board;
}

// Helper to compare boards
function boardsAreEqual(board1, board2) {
    if (!board1 || !board2 || board1.length !== board2.length) {
        return false;
    }
    for (let i = 0; i < board1.length; i++) {
        if (board1[i].length !== board2[i].length) {
            return false;
        }
        for (let j = 0; j < board1[i].length; j++) {
            if (board1[i][j] !== board2[i][j]) {
                return false;
            }
        }
    }
    return true;
}


runTest("Lights Out: Initialize Board", () => {
    // This test relies on initializeBoard being callable and gridSize being accessible.
    // Assumes lights_out.js exposes `initializeBoard` and `getBoard` or similar.
    // For simplicity, we'll assume `initializeBoard` sets a global `board`
    // and `gridSize` is a global constant or accessible.

    // If lights_out.js wraps everything in DOMContentLoaded, these will need to be exposed.
    // Example: window.initializeBoard = initializeBoard; window.getBoard = () => board;
    if (typeof initializeBoard !== 'function' || typeof getBoard !== 'function' || typeof gridSize === 'undefined') {
        console.error("Test 'Initialize Board' requires initializeBoard(), getBoard(), and gridSize to be globally accessible from lights_out.js");
        assert(false, "Missing global functions/variables from lights_out.js for testing initializeBoard");
        return;
    }

    initializeBoard(false); // Pass false to prevent random clicks for predictable test
    const currentBoard = getBoard();
    assert(currentBoard.length === gridSize, `Board should have ${gridSize} rows`);
    assert(currentBoard[0].length === gridSize, `Board should have ${gridSize} columns`);
});

runTest("Lights Out: Toggle Lights Logic", () => {
    if (typeof initializeBoard !== 'function' ||
        typeof getBoard !== 'function' ||
        typeof toggleLights !== 'function' || // Assuming toggleLights is the core logic
        typeof gridSize === 'undefined') {
        console.error("Test 'Toggle Lights Logic' requires initializeBoard(), getBoard(), toggleLights(), and gridSize.");
        assert(false, "Missing global functions/variables from lights_out.js for testing toggleLights");
        return;
    }

    initializeBoard(false); // Start with a clean, all-off board for predictability

    // Test case 1: Toggle center (2,2) on a 5x5 all-off board
    // Direct call to toggleLights, assuming it's exposed and modifies the internal board
    toggleLights(2, 2);
    let currentBoard = getBoard();
    let expectedBoard = createTestBoard(gridSize, false);
    expectedBoard[2][2] = true; // Center
    expectedBoard[1][2] = true; // Up
    expectedBoard[3][2] = true; // Down
    expectedBoard[2][1] = true; // Left
    expectedBoard[2][3] = true; // Right
    assert(boardsAreEqual(currentBoard, expectedBoard), "Toggle (2,2) on empty board failed.");

    // Test case 2: Toggle corner (0,0)
    initializeBoard(false); // Reset board
    toggleLights(0, 0);
    currentBoard = getBoard();
    expectedBoard = createTestBoard(gridSize, false);
    expectedBoard[0][0] = true; // Clicked
    expectedBoard[0][1] = true; // Right
    expectedBoard[1][0] = true; // Down
    assert(boardsAreEqual(currentBoard, expectedBoard), "Toggle (0,0) on empty board failed.");

    // Test case 3: Toggle an already 'on' light and its neighbors (effectively toggling them off)
    initializeBoard(false);
    // Manually set up a state (e.g., (2,2) and neighbors are on)
    // This requires a way to set the board state, e.g., a setBoard() function.
    // For now, we'll toggle (2,2) twice.
    toggleLights(2,2); // First toggle (as in test 1)
    toggleLights(2,2); // Second toggle (should revert to all off)
    currentBoard = getBoard();
    expectedBoard = createTestBoard(gridSize, false); // Should be all off again
    assert(boardsAreEqual(currentBoard, expectedBoard), "Toggling (2,2) twice should revert to original state.");
});

runTest("Lights Out: Check Win Condition - All Off", () => {
    if (typeof initializeBoard !== 'function' ||
        typeof checkWinCondition !== 'function' ||
        typeof setBoard !== 'function' || // Need to set board state
        typeof gridSize === 'undefined') {
        console.error("Test 'Check Win Condition - All Off' requires initializeBoard(), checkWinCondition(), setBoard(), gridSize.");
        assert(false, "Missing global functions/variables for testing checkWinCondition (All Off)");
        return;
    }
    const allOffBoard = createTestBoard(gridSize, false);
    setBoard(allOffBoard); // Assumes setBoard is exposed from lights_out.js
    assert(checkWinCondition() === true, "Should win when all lights are off");
});

runTest("Lights Out: Check Win Condition - One On", () => {
     if (typeof initializeBoard !== 'function' ||
        typeof checkWinCondition !== 'function' ||
        typeof setBoard !== 'function' ||
        typeof gridSize === 'undefined') {
        console.error("Test 'Check Win Condition - One On' requires initializeBoard(), checkWinCondition(), setBoard(), gridSize.");
        assert(false, "Missing global functions/variables for testing checkWinCondition (One On)");
        return;
    }
    const oneOnBoard = createTestBoard(gridSize, false);
    oneOnBoard[2][2] = true; // One light on
    setBoard(oneOnBoard); // Assumes setBoard is exposed
    assert(checkWinCondition() === false, "Should not win when one light is on");
});

// Note: These tests assume that functions like `initializeBoard`, `getBoard`, `toggleLights`,
// `checkWinCondition`, and `setBoard` and the variable `gridSize` are made globally accessible
// from `lights_out.js`. This might require refactoring `lights_out.js`
// e.g. window.initializeBoard = initializeBoard;
// window.getBoard = () => board; // If board is a local variable
// window.toggleLights = toggleLights;
// window.checkWinCondition = checkWinCondition;
// window.setBoard = (newBoard) => { board = newBoard; }; // Example
// window.gridSize = gridSize; // If gridSize is a local const/let
// The DOMContentLoaded wrapper in lights_out.js will likely need to be adjusted.
