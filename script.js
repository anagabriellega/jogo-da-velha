// Função para criar o jogo da velha
function createGame() {
    const cells = document.querySelectorAll('.cell');
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameOver = false;
    let playerXScore = 0;
    let playerOScore = 0;
    let drawScore = 0;

    const resetButton = document.getElementById('reset-button');
    const playerXScoreDisplay = document.getElementById('player-x-score');
    const playerOScoreDisplay = document.getElementById('player-o-score');
    const drawScoreDisplay = document.getElementById('draw-score');

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            if (!gameOver && !gameBoard[index]) {
                makeMove(index, currentPlayer);
            }
        });
    });

    resetButton.addEventListener('click', resetGame);

    function makeMove(index, player) {
        gameBoard[index] = player;
        cells[index].textContent = player;
        cells[index].classList.add(player);

        if (checkWin(player)) {
            gameOver = true;
            updateScore(player);
            setTimeout(() => {
                alert(`${player} ganhou!`);
            }, 10);
        } else if (gameBoard.every((cell) => cell !== '')) {
            gameOver = true;
            drawScore++;
            drawScoreDisplay.textContent = drawScore;
            setTimeout(() => {
                alert('Empate!');
            }, 10);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O') {
                setTimeout(computerMove, 500);
            }
        }
    }

    function checkWin(player) {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winningCombos.some((combo) => {
            return combo.every((index) => gameBoard[index] === player);
        });
    }

    function resetGame() {
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('X', 'O');
        });

        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameOver = false;
        currentPlayer = 'X';
    }

    function updateScore(player) {
        if (player === 'X') {
            playerXScore++;
            playerXScoreDisplay.textContent = playerXScore;
        } else if (player === 'O') {
            playerOScore++;
            playerOScoreDisplay.textContent = playerOScore;
        }
    }

    function computerMove() {
        const availableMoves = gameBoard.reduce((acc, cell, index) => {
            if (cell === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const computerChoice = availableMoves[randomIndex];
        makeMove(computerChoice, currentPlayer);
    }
}

// Iniciar o jogo quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', createGame);

// Função minimax
function minimax(board, depth, isMaximizing) {
    const scores = {
        X: -1,
        O: 1,
        tie: 0
    };

    const winner = checkWinner(board);
    if (winner !== null) {
        return scores[winner];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                const score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                const score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Modifique a função computerMove para usar o Minimax
function computerMove() {
    const availableMoves = gameBoard.reduce((acc, cell, index) => {
        if (cell === '') {
            acc.push(index);
        }
        return acc;
    }, []);

    let bestMove;
    let bestScore = -Infinity;

    for (let i = 0; i < availableMoves.length; i++) {
        const index = availableMoves[i];
        const tempBoard = [...gameBoard];
        tempBoard[index] = 'O';

        // Priorize o centro do tabuleiro, se disponível
        if (index === 4) {
            bestMove = index;
            break;
        }

        // Verifique se o movimento atual leva à vitória do computador
        if (checkWin('O', tempBoard)) {
            bestMove = index;
            break;
        }

        // Verifique se o movimento atual bloqueia uma vitória do jogador
        if (checkBlockingMove('X', tempBoard)) {
            bestMove = index;
            break;
        }

        // Caso contrário, utilize a busca Minimax para calcular a pontuação
        const score = minimax(tempBoard, 0, false, 8);
        if (score > bestScore) {
            bestScore = score;
            bestMove = index;
        }
    }

    makeMove(bestMove, 'O');
}

function checkBlockingMove(player, board) {
    // Verifique se o jogador pode ganhar no próximo movimento
    for (let i = 0; i < winningCombos.length; i++) {
        const combo = winningCombos[i];
        const [a, b, c] = combo;
        if (
            board[a] === player && board[b] === player &&
            board[c] === ''
        ) {
            return true;
        }
    }
    return false;
}


