const rows = 7;
const columns = 8;
let board;
let currentPlayer = 'player1';
let plyDepth = 2;

function initializeBoard() {
    board = Array.from({ length: rows }, () => Array(columns).fill(null));
    renderBoard();
}

function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = ''; // Limpar tabuleiro
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[i][j] === 'player1') cell.classList.add('player1');
            if (board[i][j] === 'player2') cell.classList.add('player2');
            cell.onclick = () => makeMove(j);
            boardElement.appendChild(cell);
        }
    }
}

function makeMove(column) {
    const row = getAvailableRow(column);
    if (row === -1) return; // Coluna cheia

    board[row][column] = currentPlayer;
    if (checkVictory(row, column, currentPlayer)) {
        alert(`${currentPlayer === 'player1' ? 'Vermelho' : 'Amarelo'} venceu!`);
        initializeBoard();
        return;
    }
    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
    renderBoard();

    if (currentPlayer === 'player2') playAI();
}

function getAvailableRow(column) {
    for (let i = rows - 1; i >= 0; i--) {
        if (!board[i][column]) return i;
    }
    return -1;
}

function checkVictory(row, col, player) {
    return checkDirection(row, col, player, 1, 0) ||
           checkDirection(row, col, player, 0, 1) ||
           checkDirection(row, col, player, 1, 1) ||
           checkDirection(row, col, player, 1, -1);
}

function checkDirection(row, col, player, rowDir, colDir) {
    let count = 0;
    for (let i = -3; i <= 3; i++) {
        const r = row + i * rowDir;
        const c = col + i * colDir;
        if (r >= 0 && r < rows && c >= 0 && c < columns && board[r][c] === player) {
            count++;
            if (count >= 4) return true;
        } else {
            count = 0;
        }
    }
    return false;
}

function startGame(algorithm) {
    currentPlayer = 'player1';
    plyDepth = parseInt(document.getElementById('ply-depth').value, 10) || 2;
    initializeBoard();
    aiAlgorithm = algorithm;
}

function playAI() {
    const column = aiAlgorithm === 'minimax' ? minimaxDecision() : alphaBetaDecision();
    makeMove(column);
}

function minimaxDecision() {
    let bestScore = -Infinity;
    let bestColumn = 0;
    for (let col = 0; col < columns; col++) {
        const row = getAvailableRow(col);
        if (row === -1) continue;
        board[row][col] = 'player2';
        const score = minimax(board, plyDepth - 1, false);
        board[row][col] = null;
        if (score > bestScore) {
            bestScore = score;
            bestColumn = col;
        }
    }
    return bestColumn;
}

function minimax(board, depth, isMaximizing) {
    const winner = getWinner(board);
    if (winner === 'player1') return -100;
    if (winner === 'player2') return 100;
    if (depth === 0 || isBoardFull()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let col = 0; col < columns; col++) {
            const row = getAvailableRow(col);
            if (row === -1) continue;
            board[row][col] = 'player2';
            const score = minimax(board, depth - 1, false);
            board[row][col] = null;
            bestScore = Math.max(score, bestScore);
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let col = 0; col < columns; col++) {
            const row = getAvailableRow(col);
            if (row === -1) continue;
            board[row][col] = 'player1';
            const score = minimax(board, depth - 1, true);
            board[row][col] = null;
            bestScore = Math.min(score, bestScore);
        }
        return bestScore;
    }
}

function alphaBetaDecision() {
    let bestScore = -Infinity;
    let bestColumn = 0;
    for (let col = 0; col < columns; col++) {
        const row = getAvailableRow(col);
        if (row === -1) continue;
        board[row][col] = 'player2';
        const score = alphaBeta(board, plyDepth - 1, -Infinity, Infinity, false);
        board[row][col] = null;
        if (score > bestScore) {
            bestScore = score;
            bestColumn = col;
        }
    }
    return bestColumn;
}

function alphaBeta(board, depth, alpha, beta, isMaximizing) {
    const winner = getWinner(board);
    if (winner === 'player1') return -100;
    if (winner === 'player2') return 100;
    if (depth === 0 || isBoardFull()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let col = 0; col < columns; col++) {
            const row = getAvailableRow(col);
            if (row === -1) continue;
            board[row][col] = 'player2';
            const score = alphaBeta(board, depth - 1, alpha, beta, false);
            board[row][col] = null;
            bestScore = Math.max(score, bestScore);
            alpha = Math.max(alpha, bestScore);
            if (beta <= alpha) break;
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let col = 0; col < columns; col++) {
            const row = getAvailableRow(col);
            if (row === -1) continue;
            board[row][col] = 'player1';
            const score = alphaBeta(board, depth - 1, alpha, beta, true);
            board[row][col] = null;
            bestScore = Math.min(score, bestScore);
            beta = Math.min(beta, bestScore);
            if (beta <= alpha) break;
        }
        return bestScore;
    }
}

function getWinner(board) {
    // Função que verifica se há um vencedor no tabuleiro atual
    return null; // Implementar lógica de vitória para identificar ganhador
}

function isBoardFull() {
    return board.every(row => row.every(cell => cell !== null));
}

// Inicializar o tabuleiro ao carregar a página
initializeBoard();
