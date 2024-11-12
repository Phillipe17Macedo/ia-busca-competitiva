const rows = 7;
const columns = 8;
let board;
let currentPlayer = "player1";
let plyDepth = 2;
let aiAlgorithm = "minimax";
const stateCache = {};

// Variárveis do Contador
let playerWins = 0;
let aiWins = 0;

const coinSound = new Audio("/assets/coin-point.mp3");
const gameOverSound = new Audio("/assets/game-over.mp3");
const redPlayerWinner = new Audio("/assets/red-player.mp3");
const startGameSound = new Audio("/assets/start-game.mp3");

startGameSound.loop = true;
startGameSound.play();
startGameSound.volume = 0.3;

document.getElementById("play-button").addEventListener("click", () => {
  document.getElementById("home-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  startGameSound.pause();
  startGameSound.currentTime = 0;
});

function updateWinCounters() {
  document.getElementById(
    "player-wins"
  ).textContent = `Vitórias do Jogador: ${playerWins}`;
  document.getElementById("ai-wins").textContent = `Vitórias da IA: ${aiWins}`;
}

function restartGame() {
  initializeBoard();
  displayMessage("Jogo reiniciado! Escolha uma profundidade e o modo de jogo.");
}

function initializeBoard() {
  board = Array.from({ length: rows }, () => Array(columns).fill(null));
  renderBoard();
  displayMessage("Escolha um modo de jogo e uma profundidade para começar!");
  updateWinCounters();
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
  if (row === -1) return; // Coluna cheia

  // Atribui a jogada ao board e renderiza o tabuleiro
  board[row][column] = currentPlayer;
  renderBoard();

  // Adiciona a animação de queda na célula da jogada
  addDropAnimation(row, column, currentPlayer);

  if (checkVictory(row, column, currentPlayer)) {
    if (currentPlayer === "player1") {
      playerWins++;
      displayMessage("Vermelho venceu!");
      redPlayerWinner.play();
    } else {
      aiWins++;
      displayMessage("Amarelo venceu!");
      gameOverSound.play();
    }

    // Atualiza o contador na tela
    updateWinCounters();

    // Reinicia o jogo se um jogador tiver 3 vitórias
    if (playerWins === 3 || aiWins === 3) {
      playerWins = 0;
      aiWins = 0;
      displayMessage("Um dos jogadores alcançou 3 vitórias! Reiniciando...");
      setTimeout(() => initializeBoard(), 4000); // Reinicia o jogo
    } else {
      setTimeout(() => initializeBoard(), 4000); // Reinicia o jogo normalmente
    }
    return;
  }

  // Alterna para o próximo jogador
  currentPlayer = currentPlayer === "player1" ? "player2" : "player1";

  // Se for a vez da IA, executa o movimento da IA
  if (currentPlayer === "player2") playAI();
}

function addDropAnimation(row, column, player) {
  const boardElement = document.getElementById("board");
  const cellIndex = row * columns + column; // Calcula o índice da célula no grid
  const cell = boardElement.children[cellIndex];

  // Toca o som para cada peça adicionada
  coinSound.play();

  // Adiciona a classe do jogador com a animação
  cell.classList.add(player, "drop-animation");

  // Remove a classe de animação após a animação terminar
  cell.addEventListener(
    "animationend",
    () => {
      cell.classList.remove("drop-animation");
    },
    { once: true }
  );
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

// Otimização da poda Alfa-Beta com priorização das colunas centrais
function alphaBetaDecision() {
  let bestScore = -Infinity;
  let bestColumn = 0;
  const columnsOrder = [3, 4, 2, 5, 1, 6, 0, 7]; // Avaliar colunas do centro para as bordas

  for (const col of columnsOrder) {
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
  // Função de avaliação mais detalhada para pontuar o tabuleiro
  let score = 0;

  // Pontuação para peças consecutivas (exemplo, ajuste conforme necessário)
  const patterns = [
    { player: "player2", count: 2, score: 10 },
    { player: "player2", count: 3, score: 100 },
    { player: "player2", count: 4, score: 1000 },
    { player: "player1", count: 2, score: -10 },
    { player: "player1", count: 3, score: -100 },
    { player: "player1", count: 4, score: -1000 },
  ];

  for (const pattern of patterns) {
    score += countConsecutive(pattern.player, pattern.count) * pattern.score;
  }

  return score;
}

function countConsecutive(player, count) {
  let total = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      total += countPattern(row, col, player, 1, 0, count); // horizontal
      total += countPattern(row, col, player, 0, 1, count); // vertical
      total += countPattern(row, col, player, 1, 1, count); // diagonal /
      total += countPattern(row, col, player, 1, -1, count); // diagonal \
    }
  }
  return total;
}

function countPattern(row, col, player, rowDir, colDir, length) {
  let count = 0;
  for (let i = 0; i < length; i++) {
    const r = row + i * rowDir;
    const c = col + i * colDir;
    if (r >= 0 && r < rows && c >= 0 && c < columns && board[r][c] === player) {
      count++;
    } else {
      return 0;
    }
  }
  return count === length ? 1 : 0;
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
