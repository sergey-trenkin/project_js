const tetrisField = document.getElementById('tetris-field');
const canvas = document.createElement('canvas');
canvas.width = 240;
canvas.height = 400;
tetrisField.appendChild(canvas);

const context = canvas.getContext('2d');
context.scale(20, 20)

const arena = createMatrix(12, 20);

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

const player = {
    pos: { x: 5, y: 0 },
    matrix: null
};

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0))
    }
    return matrix;
}

const colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors.value;
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            };
        });
    });
}

function draw() {
    context.fillStyle = '#000'
    context.fillRect(0, 0, canvas.width, canvas.height)
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos)
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            };
        });
    });
}

function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] &&
                    arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function playerReset() {
    const pieces = 'TJLOSZI';
    player.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
    player.pos.y = 0;
    player.pos.x = Math.floor(arena[0].length / 2) - Math.floor(player.matrix[0].length / 2);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
    }
}

function arenaSweep() {
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
    }
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
    }
    dropCounter = 0;
}

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}


playerReset()
update()
