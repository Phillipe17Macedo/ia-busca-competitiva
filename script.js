const rows = 7;
const columns = 8;
let board;
let currentPlayer = "player1";
let plyDepth = 2;
let aiAlgorithm = "minimax";
const stateCache = {};

document.getElementById("play-button").addEventListener("click", () => {
  document.getElementById("home-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
});

function initializeBoard() {
  board = Array.from({ length: rows }, () => Array(columns).fill(null));
  renderBoard();
  displayMessage("Escolha um modo de jogo e uma profundidade para começar!");
}

function renderBoard() {
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (board[i][j] === "player1") cell.classList.add("player1");
      if (board[i][j] === "player2") cell.classList.add("player2");
      cell.onclick = () => makeMove(j);
      boardElement.appendChild(cell);
    }
  }
}

function makeMove(column) {
  const row = getAvailableRow(column);
  if (row === -1) return;

  board[row][column] = currentPlayer;
  renderBoard();

  if (checkVictory(row, column, currentPlayer)) {
    displayMessage(
      `${currentPlayer === "player1" ? "Vermelho" : "Amarelo"} venceu!`
    );
    setTimeout(() => initializeBoard(), 3000);
    return;
  }
  currentPlayer = currentPlayer === "player1" ? "player2" : "player1";

  if (currentPlayer === "player2") playAI();
}

function getAvailableRow(column) {
  for (let i = rows - 1; i >= 0; i--) {
    if (!board[i][column]) return i;
  }
  return -1;
}

function checkVictory(row, col, player) {
  return (
    checkDirection(row, col, player, 1, 0) ||
    checkDirection(row, col, player, 0, 1) ||
    checkDirection(row, col, player, 1, 1) ||
    checkDirection(row, col, player, 1, -1)
  );
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
  currentPlayer = "player1";
  plyDepth = parseInt(document.getElementById("ply-depth").value, 10) || 2;
  aiAlgorithm = algorithm;
  initializeBoard();
  displayMessage(
    `Modo de jogo: ${
      algorithm === "minimax" ? "Minimax" : "Alfa-Beta"
    } - Profundidade: ${plyDepth}`
  );
}

function playAI() {
  const startTime = performance.now();
  setTimeout(() => {
    const column =
      aiAlgorithm === "minimax" ? minimaxDecision() : alphaBetaDecision();
    const endTime = performance.now();
    const execTime = (endTime - startTime).toFixed(2);
    displayMessage(`Tempo de execução: ${execTime} ms`);
    makeMove(column);
  }, 500);
}

function minimaxDecision() {
  let bestScore = -Infinity;
  let bestColumn = 0;
  for (let col = 0; col < columns; col++) {
    const row = getAvailableRow(col);
    if (row === -1) continue;
    board[row][col] = "player2";
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
  const cacheKey = JSON.stringify(board);
  if (stateCache[cacheKey] !== undefined) return stateCache[cacheKey];

  const winner = getWinner();
  if (winner === "player1") return -100;
  if (winner === "player2") return 100;
  if (depth === 0 || isBoardFull()) return evaluateBoard();

  let bestScore = isMaximizing ? -Infinity : Infinity;
  for (let col = 0; col < columns; col++) {
    const row = getAvailableRow(col);
    if (row === -1) continue;

    board[row][col] = isMaximizing ? "player2" : "player1";
    const score = minimax(board, depth - 1, !isMaximizing);
    board[row][col] = null;

    bestScore = isMaximizing
      ? Math.max(score, bestScore)
      : Math.min(score, bestScore);
  }

  stateCache[cacheKey] = bestScore;
  return bestScore;
}

function alphaBetaDecision() {
  let bestScore = -Infinity;
  let bestColumn = 0;
  for (let col = 0; col < columns; col++) {
    const row = getAvailableRow(col);
    if (row === -1) continue;
    board[row][col] = "player2";
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
  const cacheKey = JSON.stringify(board);
  if (stateCache[cacheKey] !== undefined) return stateCache[cacheKey];

  const winner = getWinner();
  if (winner === "player1") return -100;
  if (winner === "player2") return 100;
  if (depth === 0 || isBoardFull()) return evaluateBoard();

  let bestScore = isMaximizing ? -Infinity : Infinity;
  for (let col = 0; col < columns; col++) {
    const row = getAvailableRow(col);
    if (row === -1) continue;

    board[row][col] = isMaximizing ? "player2" : "player1";
    const score = alphaBeta(board, depth - 1, alpha, beta, !isMaximizing);
    board[row][col] = null;

    if (isMaximizing) {
      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, bestScore);
    } else {
      bestScore = Math.min(bestScore, score);
      beta = Math.min(beta, bestScore);
    }
    if (beta <= alpha) break;
  }

  stateCache[cacheKey] = bestScore;
  return bestScore;
}

function evaluateBoard() {
  return 0;
}

function getWinner() {
  return null;
}

function isBoardFull() {
  return board.every((row) => row.every((cell) => cell !== null));
}

function displayMessage(message) {
  document.getElementById("message").textContent = message;
}

initializeBoard();
