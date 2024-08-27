document.querySelectorAll('.gallery-container img').forEach(image => {
    image.addEventListener('click', () => {
        const src = image.getAttribute('src');
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        document.body.appendChild(lightbox);
        const img = document.createElement('img');
        img.src = src;
        lightbox.appendChild(img);
        lightbox.addEventListener('click', () => {
            document.body.removeChild(lightbox);
        });
    });
});

document.querySelectorAll('.thumbnail').forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        const mainImage = document.getElementById('main-image');
        mainImage.src = thumbnail.style.backgroundImage.slice(5, -2);
    });
});

const videoContainer = document.querySelector('.video-container');

videoContainer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        videoContainer.scrollBy({ left: 300, behavior: 'smooth' });
    } else if (event.key === 'ArrowLeft') {
        videoContainer.scrollBy({ left: -300, behavior: 'smooth' });
    }
});

// Function to create a heart element with random color and rotation
function createHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    // Random color generation
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    heart.style.filter = `drop-shadow(0 0 5px ${randomColor})`;

    // Random rotation
    const randomRotation = Math.floor(Math.random() * 360);
    heart.style.transform = `rotate(${randomRotation}deg)`;

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 2000); // Heart disappears after 2 seconds
}

// Event listener for clicks
document.addEventListener('click', (e) => {
    createHeart(e.pageX, e.pageY);
});

// Event listener for arrow keys
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        createHeart(x, y);
    }
});

const rows = 10;
const cols = 10;
const totalBombs = 15;
let gameGrid;

function initGame() {
    gameGrid = Array.from({ length: rows }, () => Array(cols).fill(0));
    const minesweeperGame = document.getElementById('minesweeper-game');
    minesweeperGame.innerHTML = '';

    placeBombs();
    calculateNumbers();

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.row = r;
            tile.dataset.col = c;
            tile.addEventListener('click', revealTile);
            tile.addEventListener('contextmenu', flagTile);
            minesweeperGame.appendChild(tile);
        }
    }
}

function placeBombs() {
    let bombsPlaced = 0;
    while (bombsPlaced < totalBombs) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (gameGrid[row][col] === 0) {
            gameGrid[row][col] = 'B'; // B for Bomb
            bombsPlaced++;
        }
    }
}

function calculateNumbers() {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],        [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (gameGrid[r][c] === 'B') continue;

            let bombCount = 0;
            for (let [dr, dc] of directions) {
                const newRow = r + dr;
                const newCol = c + dc;
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                    if (gameGrid[newRow][newCol] === 'B') bombCount++;
                }
            }
            gameGrid[r][c] = bombCount;
        }
    }
}

function revealTile(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);

    if (e.target.classList.contains('revealed') || e.target.classList.contains('flag')) return;

    e.target.classList.add('revealed');

    if (gameGrid[row][col] === 'B') {
        e.target.classList.add('bomb');
        alert('Boom! Game over.');
        revealAllBombs();
    } else {
        e.target.textContent = gameGrid[row][col] > 0 ? gameGrid[row][col] : '';
        if (gameGrid[row][col] === 0) revealAdjacentTiles(row, col);
    }
}

function revealAdjacentTiles(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],        [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (let [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            const tile = document.querySelector(`.tile[data-row="${newRow}"][data-col="${newCol}"]`);
            if (!tile.classList.contains('revealed')) {
                tile.click();
            }
        }
    }
}

function revealAllBombs() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (gameGrid[r][c] === 'B') {
                const tile = document.querySelector(`.tile[data-row="${r}"][data-col="${c}"]`);
                tile.classList.add('bomb');
            }
        }
    }
}

function flagTile(e) {
    e.preventDefault();
    if (e.target.classList.contains('revealed')) return;
    e.target.classList.toggle('flag');
}

// Initialize the game on page load
window.onload = initGame;




