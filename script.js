document.addEventListener('DOMContentLoaded', () => {
  const board = document.querySelectorAll('.cell');
  const resetButton = document.getElementById('reset-button');
  const playerXScore = document.getElementById('player-x-score');
  const playerOScore = document.getElementById('player-o-score');
  const drawScore = document.getElementById('draw-score');
  const modal = document.getElementById('modal');
  const modalMessage = document.getElementById('modal-message');

  let gameBoard = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let scores = {
    X: parseInt(localStorage.getItem('playerX')) || 0,
    O: parseInt(localStorage.getItem('playerO')) || 0,
    draw: parseInt(localStorage.getItem('draw')) || 0
  };
  let gameOver = false;
  let difficulty = 'easy';

  board.forEach(cell => cell.addEventListener('click', handleClick));
  resetButton.addEventListener('click', resetGame);

  // ✅ Botão de zerar placar (agora corretamente fechado)
  document.getElementById('reset-score').addEventListener('click', () => {
    scores = { X: 0, O: 0, draw: 0 };
    saveScores();
    updateScore();
  });

  // ✅ Seletor de dificuldade
  document.getElementById('difficulty').addEventListener('change', e => {
    difficulty = e.target.value;
  });

  updateScore();

  function handleClick(e) {
    const index = e.target.dataset.index;
    if (gameBoard[index] || gameOver) return;

    makeMove(index, currentPlayer);
    if (!gameOver && currentPlayer === 'O') setTimeout(computerMove, 400);
  }

  function makeMove(index, player) {
    gameBoard[index] = player;
    board[index].textContent = player;
    board[index].classList.add(player);

    if (checkWin(player)) {
      showModal(`${player} venceu!`);
      scores[player]++;
      updateScore();
      saveScores();
      gameOver = true;
    } else if (gameBoard.every(cell => cell !== '')) {
      showModal('Empate!');
      scores.draw++;
      updateScore();
      saveScores();
      gameOver = true;
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  function checkWin(player) {
    const winCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    return winCombos.some(combo => combo.every(i => gameBoard[i] === player));
  }

  function computerMove() {
    if (difficulty === 'hard') return minimaxMove();
    const emptyIndices = gameBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    const index = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    makeMove(index, 'O');
  }

  function updateScore() {
    playerXScore.textContent = scores.X;
    playerOScore.textContent = scores.O;
    drawScore.textContent = scores.draw;
  }

  function saveScores() {
    localStorage.setItem('playerX', scores.X);
    localStorage.setItem('playerO', scores.O);
    localStorage.setItem('draw', scores.draw);
  }

  function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    board.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('X', 'O');
    });
    currentPlayer = 'X';
    gameOver = false;
    hideModal();
  }

  function showModal(message) {
    let emoji = message.includes('X') ? '❌' : message.includes('O') ? '🤖' : '🤝';
    modalMessage.textContent = `${emoji} ${message}`;
    modal.classList.add('show');
    setTimeout(() => {
      hideModal();
      resetGame();
    }, 2000);
  }

  function hideModal() {
    modal.classList.remove('show');
  }

  function minimaxMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      if (gameBoard[i] === '') {
        gameBoard[i] = 'O';
        let score = minimax(gameBoard, 0, false);
        gameBoard[i] = '';
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    makeMove(move, 'O');
  }

  function minimax(board, depth, isMaximizing) {
    if (checkWin('O')) return 10 - depth;
    if (checkWin('X')) return depth - 10;
    if (board.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'O';
          let score = minimax(board, depth + 1, false);
          board[i] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'X';
          let score = minimax(board, depth + 1, true);
          board[i] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  const themeSwitch = document.getElementById('theme-switch');
  themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('light');
  });
});
