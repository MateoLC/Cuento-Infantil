const WORDS = [
  "SERPIENTE",
  "COLOMBIA",
  "ANFIBIO",
  "HUMEDAL",
  "ESCAMAS",
  "HABITAT",
  "REPTIL",
  "BOSQUE",
  "RANA",
  "AGUA",
];

const GRID_SIZE = 12;
const STORAGE_KEY = "diviertete-sopa-biodiversidad-v1";
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];
const FILL_LETTERS = "AAAAABCDEEEEEFGHIIIIJLLLMNNNNOOOOPQRRRRSSSSTTTUUVY";

const gridElement = document.querySelector("#word-grid");
const wordListElement = document.querySelector("#word-list");
const feedbackElement = document.querySelector("#game-feedback");
const foundCountElement = document.querySelector("#found-count");
const progressCountElement = document.querySelector("#progress-count");
const progressBarElement = document.querySelector("#progress-bar");
const wordPanelNote = document.querySelector("#word-panel-note");
const completionElement = document.querySelector("#completion");

function seededRandom(initialSeed) {
  let seed = initialSeed >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function shuffle(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function createPuzzle() {
  const random = seededRandom(20260718);
  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(""));
  const placements = {};

  [...WORDS].sort((a, b) => b.length - a.length).forEach((word) => {
    const candidates = [];
    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let col = 0; col < GRID_SIZE; col += 1) {
        DIRECTIONS.forEach(([rowStep, colStep]) => {
          const cells = Array.from({ length: word.length }, (_, index) => ({
            row: row + rowStep * index,
            col: col + colStep * index,
          }));
          if (cells.some((cell) => cell.row < 0 || cell.row >= GRID_SIZE || cell.col < 0 || cell.col >= GRID_SIZE)) return;
          if (cells.some((cell, index) => grid[cell.row][cell.col] && grid[cell.row][cell.col] !== word[index])) return;
          candidates.push({ cells, overlap: cells.filter((cell) => grid[cell.row][cell.col]).length });
        });
      }
    }

    const choice = shuffle(candidates, random).sort((a, b) => b.overlap - a.overlap)[0];
    if (!choice) throw new Error(`No fue posible ubicar la palabra ${word}`);
    choice.cells.forEach((cell, index) => { grid[cell.row][cell.col] = word[index]; });
    placements[word] = choice.cells;
  });

  grid.forEach((row) => row.forEach((letter, col) => {
    if (!letter) row[col] = FILL_LETTERS[Math.floor(random() * FILL_LETTERS.length)];
  }));
  return { grid, placements };
}

const puzzle = createPuzzle();
let found = new Set();
let selection = [];
let pointerStart = null;
let keyboardStart = null;
let pointerActive = false;
let hintTimeout = null;

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  found = new Set(saved.filter((word) => WORDS.includes(word)));
} catch {
  found = new Set();
}

const keyOf = ({ row, col }) => `${row}-${col}`;

function getLine(start, end) {
  const rowDelta = end.row - start.row;
  const colDelta = end.col - start.col;
  if (rowDelta !== 0 && colDelta !== 0 && Math.abs(rowDelta) !== Math.abs(colDelta)) return [];
  const rowStep = Math.sign(rowDelta);
  const colStep = Math.sign(colDelta);
  const length = Math.max(Math.abs(rowDelta), Math.abs(colDelta)) + 1;
  return Array.from({ length }, (_, index) => ({
    row: start.row + rowStep * index,
    col: start.col + colStep * index,
  }));
}

function setFeedback(message) {
  feedbackElement.textContent = message;
}

function renderSelection() {
  const selectedCells = new Set(selection.map(keyOf));
  const foundCells = new Set();
  found.forEach((word) => puzzle.placements[word].forEach((cell) => foundCells.add(keyOf(cell))));
  gridElement.querySelectorAll(".word-cell").forEach((cell) => {
    const cellKey = `${cell.dataset.row}-${cell.dataset.col}`;
    cell.classList.toggle("is-selected", selectedCells.has(cellKey));
    cell.classList.toggle("is-found", foundCells.has(cellKey));
  });
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...found]));
}

function updateProgress() {
  const count = found.size;
  foundCountElement.textContent = String(count);
  progressCountElement.textContent = `${count} de ${WORDS.length}`;
  progressBarElement.style.width = `${(count / WORDS.length) * 100}%`;

  wordListElement.querySelectorAll("button").forEach((button) => {
    const isFound = found.has(button.dataset.word);
    button.classList.toggle("is-found", isFound);
    button.disabled = isFound;
    button.setAttribute("aria-pressed", String(isFound));
    button.querySelector("span").textContent = isFound ? "✓" : "○";
  });
  wordPanelNote.textContent = count === WORDS.length
    ? "Expedición completada."
    : "Selecciona una palabra para recibir una pista.";
  renderSelection();
}

function completeSelection(cells) {
  if (cells.length < 2) {
    selection = [];
    renderSelection();
    return;
  }
  const letters = cells.map((cell) => puzzle.grid[cell.row][cell.col]).join("");
  const reversed = [...letters].reverse().join("");
  const match = WORDS.find((word) => word === letters || word === reversed);

  if (!match) {
    setFeedback("Esa combinación aún no es una palabra. Sigue explorando.");
  } else if (found.has(match)) {
    setFeedback(`${match} ya estaba en tu bitácora.`);
  } else {
    found.add(match);
    saveProgress();
    setFeedback(found.size === WORDS.length ? "¡Misión cumplida!" : `¡Encontraste ${match}!`);
    updateProgress();
    if (found.size === WORDS.length) completionElement.hidden = false;
  }
  selection = [];
  renderSelection();
}

function revealHint(requestedWord) {
  const word = requestedWord && !found.has(requestedWord)
    ? requestedWord
    : WORDS.find((candidate) => !found.has(candidate));
  if (!word) return;

  window.clearTimeout(hintTimeout);
  gridElement.querySelectorAll(".is-hint").forEach((cell) => cell.classList.remove("is-hint"));
  const firstCell = puzzle.placements[word][0];
  const cell = gridElement.querySelector(`[data-row="${firstCell.row}"][data-col="${firstCell.col}"]`);
  cell.classList.add("is-hint");
  setFeedback(`Pista: ${word} comienza en la letra iluminada.`);
  hintTimeout = window.setTimeout(() => cell.classList.remove("is-hint"), 1800);
}

function resetGame() {
  found.clear();
  selection = [];
  pointerStart = null;
  keyboardStart = null;
  completionElement.hidden = true;
  localStorage.removeItem(STORAGE_KEY);
  setFeedback("Nueva expedición lista. Encuentra las diez palabras.");
  updateProgress();
}

function renderGame() {
  const gridFragment = document.createDocumentFragment();
  puzzle.grid.forEach((row, rowIndex) => row.forEach((letter, colIndex) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "word-cell";
    cell.dataset.row = rowIndex;
    cell.dataset.col = colIndex;
    cell.setAttribute("role", "gridcell");
    cell.setAttribute("aria-label", `Fila ${rowIndex + 1}, columna ${colIndex + 1}, letra ${letter}`);
    cell.textContent = letter;
    cell.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      pointerActive = true;
      pointerStart = { row: rowIndex, col: colIndex };
      keyboardStart = null;
      selection = [pointerStart];
      renderSelection();
    });
    cell.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const current = { row: rowIndex, col: colIndex };
      if (!keyboardStart) {
        keyboardStart = current;
        selection = [current];
        setFeedback("Elige ahora la última letra de la palabra.");
        renderSelection();
      } else {
        completeSelection(getLine(keyboardStart, current));
        keyboardStart = null;
      }
    });
    gridFragment.appendChild(cell);
  }));
  gridElement.appendChild(gridFragment);

  const wordFragment = document.createDocumentFragment();
  WORDS.forEach((word) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.word = word;
    button.innerHTML = `<span aria-hidden="true">○</span>${word}`;
    button.addEventListener("click", () => revealHint(word));
    wordFragment.appendChild(button);
  });
  wordListElement.appendChild(wordFragment);
  updateProgress();
}

gridElement.addEventListener("pointermove", (event) => {
  if (!pointerActive || !pointerStart) return;
  const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".word-cell");
  if (!target || !gridElement.contains(target)) return;
  const line = getLine(pointerStart, { row: Number(target.dataset.row), col: Number(target.dataset.col) });
  if (line.length) {
    selection = line;
    renderSelection();
  }
});

function finishPointerSelection() {
  if (!pointerActive) return;
  pointerActive = false;
  pointerStart = null;
  completeSelection(selection);
}

window.addEventListener("pointerup", finishPointerSelection);
window.addEventListener("pointercancel", finishPointerSelection);
document.querySelector("#hint-button").addEventListener("click", () => revealHint());
document.querySelector("#reset-button").addEventListener("click", resetGame);
document.querySelector("#continue-button").addEventListener("click", () => { completionElement.hidden = true; });

renderGame();
