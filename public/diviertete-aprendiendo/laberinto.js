const MAZE_SIZE = 13;
const MAZE_SEED = 2026071802;
const BEST_KEY = "diviertete-laberinto-humedal-best-v1";
const COMPLETE_KEY = "diviertete-laberinto-humedal-complete-v1";

const DIRECTIONS = {
  up: { row: -1, col: 0, wall: "top", opposite: "bottom" },
  right: { row: 0, col: 1, wall: "right", opposite: "left" },
  down: { row: 1, col: 0, wall: "bottom", opposite: "top" },
  left: { row: 0, col: -1, wall: "left", opposite: "right" },
};

const canvas = document.querySelector("#maze-canvas");
const context = canvas.getContext("2d");
const feedback = document.querySelector("#maze-feedback");
const stepCount = document.querySelector("#step-count");
const timeCount = document.querySelector("#time-count");
const bestCount = document.querySelector("#best-count");
const progressLabel = document.querySelector("#maze-progress-label");
const progressBar = document.querySelector("#maze-progress-bar");
const percentLabel = document.querySelector("#maze-percent");
const completion = document.querySelector("#maze-completion");
const result = document.querySelector("#maze-result");

function seededRandom(initialSeed) {
  let seed = initialSeed >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function shuffled(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function createMaze() {
  const random = seededRandom(MAZE_SEED);
  const cells = Array.from({ length: MAZE_SIZE }, (_, row) =>
    Array.from({ length: MAZE_SIZE }, (_, col) => ({
      row,
      col,
      visited: false,
      walls: { top: true, right: true, bottom: true, left: true },
    })),
  );
  const stack = [cells[0][0]];
  cells[0][0].visited = true;

  while (stack.length) {
    const current = stack[stack.length - 1];
    const options = shuffled(Object.entries(DIRECTIONS), random).filter(([, direction]) => {
      const row = current.row + direction.row;
      const col = current.col + direction.col;
      return row >= 0 && row < MAZE_SIZE && col >= 0 && col < MAZE_SIZE && !cells[row][col].visited;
    });

    if (!options.length) {
      stack.pop();
      continue;
    }

    const [, direction] = options[0];
    const next = cells[current.row + direction.row][current.col + direction.col];
    current.walls[direction.wall] = false;
    next.walls[direction.opposite] = false;
    next.visited = true;
    stack.push(next);
  }
  return cells;
}

const maze = createMaze();
const goal = { row: MAZE_SIZE - 1, col: MAZE_SIZE - 1 };
let player = { row: 0, col: 0 };
let steps = 0;
let seconds = 0;
let timer = null;
let started = false;
let solved = false;
let hintCell = null;
let hintTimeout = null;
let pointerStart = null;

function positionKey(position) {
  return `${position.row}-${position.col}`;
}

function getNeighbors(position) {
  const cell = maze[position.row][position.col];
  return Object.entries(DIRECTIONS)
    .filter(([, direction]) => !cell.walls[direction.wall])
    .map(([name, direction]) => ({
      name,
      row: position.row + direction.row,
      col: position.col + direction.col,
    }));
}

function findPath(start) {
  const queue = [start];
  const previous = new Map([[positionKey(start), null]]);

  while (queue.length) {
    const current = queue.shift();
    if (current.row === goal.row && current.col === goal.col) break;
    getNeighbors(current).forEach((neighbor) => {
      const key = positionKey(neighbor);
      if (previous.has(key)) return;
      previous.set(key, current);
      queue.push({ row: neighbor.row, col: neighbor.col });
    });
  }

  const path = [];
  let cursor = goal;
  while (cursor) {
    path.unshift(cursor);
    cursor = previous.get(positionKey(cursor));
  }
  return path[0]?.row === start.row && path[0]?.col === start.col ? path : [];
}

const initialDistance = findPath({ row: 0, col: 0 }).length - 1;

function formatTime(value) {
  const minutes = Math.floor(value / 60).toString().padStart(2, "0");
  const remainingSeconds = (value % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function startTimer() {
  if (started) return;
  started = true;
  timer = window.setInterval(() => {
    seconds += 1;
    timeCount.textContent = formatTime(seconds);
  }, 1000);
}

function updateProgress() {
  const remaining = Math.max(0, findPath(player).length - 1);
  const percent = Math.max(0, Math.min(100, Math.round(((initialDistance - remaining) / initialDistance) * 100)));
  percentLabel.textContent = String(percent);
  progressLabel.textContent = percent === 100 ? "Humedal alcanzado" : percent === 0 ? "Inicio de la ruta" : `${percent}% del camino`;
  progressBar.style.width = `${percent}%`;
  stepCount.textContent = String(steps);
}

function setFeedback(message) {
  feedback.textContent = message;
}

function drawRoundedRect(x, y, width, height, radius) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function drawGoal(centerX, centerY, radius) {
  context.save();
  context.fillStyle = "#71b7b4";
  context.beginPath();
  context.arc(centerX, centerY, radius * .75, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#769342";
  context.beginPath();
  context.arc(centerX, centerY, radius * .42, .25, Math.PI * 1.9);
  context.lineTo(centerX, centerY);
  context.fill();
  context.restore();
}

function drawFrog(centerX, centerY, radius) {
  context.save();
  context.fillStyle = "#6f9a3e";
  context.beginPath();
  context.ellipse(centerX, centerY + radius * .12, radius * .62, radius * .5, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#8bb84f";
  context.beginPath();
  context.arc(centerX - radius * .38, centerY - radius * .32, radius * .28, 0, Math.PI * 2);
  context.arc(centerX + radius * .38, centerY - radius * .32, radius * .28, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#fff9dc";
  context.beginPath();
  context.arc(centerX - radius * .38, centerY - radius * .35, radius * .14, 0, Math.PI * 2);
  context.arc(centerX + radius * .38, centerY - radius * .35, radius * .14, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#1f3521";
  context.beginPath();
  context.arc(centerX - radius * .38, centerY - radius * .35, radius * .07, 0, Math.PI * 2);
  context.arc(centerX + radius * .38, centerY - radius * .35, radius * .07, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawMaze() {
  const width = canvas.width;
  const padding = 24;
  const gameSize = width - padding * 2;
  const cellSize = gameSize / MAZE_SIZE;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(255, 252, 240, .84)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (hintCell) {
    context.fillStyle = "rgba(221, 166, 75, .48)";
    drawRoundedRect(
      padding + hintCell.col * cellSize + 5,
      padding + hintCell.row * cellSize + 5,
      cellSize - 10,
      cellSize - 10,
      10,
    );
    context.fill();
  }

  drawGoal(
    padding + (goal.col + .5) * cellSize,
    padding + (goal.row + .5) * cellSize,
    cellSize * .52,
  );

  context.strokeStyle = "#3b5b38";
  context.lineWidth = 4;
  context.lineCap = "round";
  maze.flat().forEach((cell) => {
    const x = padding + cell.col * cellSize;
    const y = padding + cell.row * cellSize;
    context.beginPath();
    if (cell.walls.top) { context.moveTo(x, y); context.lineTo(x + cellSize, y); }
    if (cell.walls.right) { context.moveTo(x + cellSize, y); context.lineTo(x + cellSize, y + cellSize); }
    if (cell.walls.bottom) { context.moveTo(x, y + cellSize); context.lineTo(x + cellSize, y + cellSize); }
    if (cell.walls.left) { context.moveTo(x, y); context.lineTo(x, y + cellSize); }
    context.stroke();
  });

  drawFrog(
    padding + (player.col + .5) * cellSize,
    padding + (player.row + .5) * cellSize,
    cellSize * .48,
  );
}

function finishMaze() {
  solved = true;
  window.clearInterval(timer);
  const previousBest = Number(localStorage.getItem(BEST_KEY)) || 0;
  if (!previousBest || steps < previousBest) localStorage.setItem(BEST_KEY, String(steps));
  localStorage.setItem(COMPLETE_KEY, "true");
  bestCount.textContent = String(Math.min(previousBest || steps, steps));
  result.textContent = `Llegaste en ${steps} pasos y ${formatTime(seconds)}.`;
  setFeedback("¡Llegaste al humedal!");
  updateProgress();
  window.setTimeout(() => { completion.hidden = false; }, 250);
}

function move(directionName) {
  if (solved) return;
  const direction = DIRECTIONS[directionName];
  const currentCell = maze[player.row][player.col];
  startTimer();

  if (currentCell.walls[direction.wall]) {
    setFeedback("La vegetación cierra ese paso. Prueba otra dirección.");
    return;
  }

  player = { row: player.row + direction.row, col: player.col + direction.col };
  steps += 1;
  setFeedback("Sigue las rutas abiertas hacia el agua.");
  updateProgress();
  drawMaze();
  if (player.row === goal.row && player.col === goal.col) finishMaze();
}

function showHint() {
  if (solved) return;
  const path = findPath(player);
  if (path.length < 2) return;
  window.clearTimeout(hintTimeout);
  hintCell = path[1];
  drawMaze();
  setFeedback("La casilla iluminada marca el siguiente paso.");
  hintTimeout = window.setTimeout(() => {
    hintCell = null;
    drawMaze();
  }, 1800);
}

function resetMaze() {
  window.clearInterval(timer);
  window.clearTimeout(hintTimeout);
  player = { row: 0, col: 0 };
  steps = 0;
  seconds = 0;
  started = false;
  solved = false;
  hintCell = null;
  completion.hidden = true;
  timeCount.textContent = "00:00";
  setFeedback("La rana está lista para comenzar la ruta.");
  updateProgress();
  drawMaze();
  canvas.focus();
}

document.addEventListener("keydown", (event) => {
  const keyMap = {
    ArrowUp: "up", w: "up", W: "up",
    ArrowRight: "right", d: "right", D: "right",
    ArrowDown: "down", s: "down", S: "down",
    ArrowLeft: "left", a: "left", A: "left",
  };
  const direction = keyMap[event.key];
  if (!direction) return;
  event.preventDefault();
  move(direction);
});

canvas.addEventListener("pointerdown", (event) => {
  pointerStart = { x: event.clientX, y: event.clientY };
  canvas.focus();
});

canvas.addEventListener("pointerup", (event) => {
  if (!pointerStart) return;
  const deltaX = event.clientX - pointerStart.x;
  const deltaY = event.clientY - pointerStart.y;
  pointerStart = null;
  if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 18) return;
  move(Math.abs(deltaX) > Math.abs(deltaY) ? (deltaX > 0 ? "right" : "left") : (deltaY > 0 ? "down" : "up"));
});

document.querySelectorAll("[data-direction]").forEach((button) => {
  button.addEventListener("click", () => move(button.dataset.direction));
});
document.querySelector("#maze-hint").addEventListener("click", showHint);
document.querySelector("#maze-reset").addEventListener("click", resetMaze);
document.querySelector("#maze-again").addEventListener("click", resetMaze);

const savedBest = Number(localStorage.getItem(BEST_KEY));
bestCount.textContent = savedBest ? String(savedBest) : "—";
updateProgress();
drawMaze();
