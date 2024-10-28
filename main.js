const canvas = document.getElementById('game'); 
const ctx = canvas.getContext('2d');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restartButton');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let cellSize;

// адаптация под экран
function canvasSize() {
    if (window.innerWidth < 600) {
        canvas.width = canvas.height = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9);
    } else {
        canvas.width = canvas.height = 400;
    }
    cellSize = canvas.width / 3;
    drawBoard();
    drawSymbols();
}
canvasSize();

// сетка
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000';

    // вертикальные линий
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo((canvas.width / 3) * i, 0);
        ctx.lineTo((canvas.width / 3) * i, canvas.height);
        ctx.stroke();
    }

    // горизонтальные линии
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (canvas.height / 3) * i);
        ctx.lineTo(canvas.width, (canvas.height / 3) * i);
        ctx.stroke();
    }
}

// рисуем КН
function drawSymbols() {
    for (let i = 0; i < board.length; i++) {
        const symbol = board[i];
        if (symbol) {
            const x = (i % 3) * cellSize;
            const y = Math.floor(i / 3) * cellSize;

            ctx.font = `${cellSize * 0.6}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(symbol, x + cellSize / 2, y + cellSize / 2);
        }
    }
}

// клик/касание
function handleCanvasClick(e) {
    if (gameOver) return;

    let mouseX, mouseY;
    if (e.type === 'touchstart') {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    } else {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = mouseX - rect.left;
    const y = mouseY - rect.top;

    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    const cellIndex = cellY * 3 + cellX;

    // проверяем пустоту ячейки
    if (cellIndex >= 0 && cellIndex < 9 && !board[cellIndex]) {
        board[cellIndex] = currentPlayer;
        drawBoard();
        drawSymbols();

        // проверяем на победитель
        if (checkWinner()) {
            statusDisplay.innerText = `Победитель: ${currentPlayer}`;
            gameOver = true;
        } else if (board.every(cell => cell)) {
            statusDisplay.innerText = 'Ничья';
            gameOver = true;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusDisplay.innerText = `Текущий ход: ${currentPlayer}`;
        }
    }
}

// победные комбинаций
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонтальные
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикальные
        [0, 4, 8], [2, 4, 6]  // диагональные
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            drawWinningLine(pattern);  // рисуем линию по победе
            return true;
        }
    }
    return false;
}

// функция для рисования линии по победе
function drawWinningLine(pattern) {
    const [start, , end] = pattern;

    const startX = (start % 3) * cellSize + cellSize / 2;
    const startY = Math.floor(start / 3) * cellSize + cellSize / 2;
    const endX = (end % 3) * cellSize + cellSize / 2;
    const endY = Math.floor(end / 3) * cellSize + cellSize / 2;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

// перезапуск
function restartGame() {
    board.fill('');
    currentPlayer = 'X';
    gameOver = false;
    statusDisplay.innerText = `Текущий ход: ${currentPlayer}`;
    drawBoard();
    drawSymbols();
}

canvas.addEventListener('click', handleCanvasClick);
canvas.addEventListener('touchstart', handleCanvasClick);
restartButton.addEventListener('click', restartGame);

window.addEventListener('resize', () => {
    canvasSize();
    drawBoard();
    drawSymbols();
});

drawBoard();
