const CROSSWORD_SIZE = 17;
const CROSSWORD_STORAGE_KEY = "diviertete-crucigrama-biodiversidad-v1";

const CROSSWORD_WORDS = [
  { answer: "BIODIVERSIDAD", clue: "Variedad de seres vivos que comparten nuestro planeta." },
  { answer: "SERPIENTE", clue: "Reptil alargado que se desplaza sin patas." },
  { answer: "COLOMBIA", clue: "País que reúne selvas, páramos, costas y una enorme riqueza natural." },
  { answer: "ANFIBIO", clue: "Animal que puede vivir entre el agua y la tierra." },
  { answer: "HUMEDAL", clue: "Ecosistema donde el agua y la tierra se encuentran." },
  { answer: "ESCAMAS", clue: "Cubierta que protege la piel de muchos reptiles." },
  { answer: "HABITAT", clue: "Lugar natural donde vive una especie." },
  { answer: "REPTIL", clue: "Vertebrado de piel seca que regula su temperatura con el ambiente." },
  { answer: "RANA", clue: "Anfibio saltador que anuncia la salud del agua." },
  { answer: "VIDA", clue: "Lo que cuidamos cuando protegemos la naturaleza." },
];

const gridElement = document.querySelector("#crossword-grid");
const cluesElement = document.querySelector("#crossword-clues");
const feedbackElement = document.querySelector("#crossword-feedback");
const foundElement = document.querySelector("#crossword-found");
const progressLabel = document.querySelector("#crossword-progress-label");
const progressBar = document.querySelector("#crossword-progress-bar");
const completion = document.querySelector("#crossword-completion");

function createEmptyGrid() {
  return Array.from({ length: CROSSWORD_SIZE }, () => Array(CROSSWORD_SIZE).fill(null));
}

function cloneGrid(grid) {
  return grid.map((row) => row.map((cell) => cell ? { letter: cell.letter, directions: new Set(cell.directions) } : null));
}

function placementCells(answer, row, col, direction) {
  return [...answer].map((letter, index) => ({
    letter,
    row: row + (direction === "down" ? index : 0),
    col: col + (direction === "across" ? index : 0),
  }));
}

function validatePlacement(grid, answer, row, col, direction) {
  const cells = placementCells(answer, row, col, direction);
  if (cells.some((cell) => cell.row < 0 || cell.row >= CROSSWORD_SIZE || cell.col < 0 || cell.col >= CROSSWORD_SIZE)) return null;

  const before = direction === "across" ? { row, col: col - 1 } : { row: row - 1, col };
  const after = direction === "across" ? { row, col: col + answer.length } : { row: row + answer.length, col };
  if (grid[before.row]?.[before.col] || grid[after.row]?.[after.col]) return null;

  let crossings = 0;
  for (const cell of cells) {
    const occupied = grid[cell.row][cell.col];
    if (occupied) {
      if (occupied.letter !== cell.letter || occupied.directions.has(direction)) return null;
      crossings += 1;
      continue;
    }

    const neighbors = direction === "across"
      ? [grid[cell.row - 1]?.[cell.col], grid[cell.row + 1]?.[cell.col]]
      : [grid[cell.row]?.[cell.col - 1], grid[cell.row]?.[cell.col + 1]];
    if (neighbors.some(Boolean)) return null;
  }

  return crossings ? { cells, crossings } : null;
}

function findCandidates(grid, answer) {
  const candidates = [];
  grid.forEach((row, rowIndex) => row.forEach((cell, colIndex) => {
    if (!cell) return;
    [...answer].forEach((letter, letterIndex) => {
      if (letter !== cell.letter) return;
      ["across", "down"].forEach((direction) => {
        const startRow = rowIndex - (direction === "down" ? letterIndex : 0);
        const startCol = colIndex - (direction === "across" ? letterIndex : 0);
        const valid = validatePlacement(grid, answer, startRow, startCol, direction);
        if (!valid) return;
        const centerDistance = Math.abs(startRow - CROSSWORD_SIZE / 2) + Math.abs(startCol - CROSSWORD_SIZE / 2);
        candidates.push({ row: startRow, col: startCol, direction, score: valid.crossings * 100 - centerDistance });
      });
    });
  }));
  return candidates.sort((a, b) => b.score - a.score || a.row - b.row || a.col - b.col).slice(0, 60);
}

function addPlacement(grid, entry, placement) {
  const nextGrid = cloneGrid(grid);
  placementCells(entry.answer, placement.row, placement.col, placement.direction).forEach((cell) => {
    const existing = nextGrid[cell.row][cell.col];
    if (existing) existing.directions.add(placement.direction);
    else nextGrid[cell.row][cell.col] = { letter: cell.letter, directions: new Set([placement.direction]) };
  });
  return nextGrid;
}

function solveCrossword(entries, index, grid, placements) {
  if (index === entries.length) return { grid, placements };
  const entry = entries[index];
  const candidates = findCandidates(grid, entry.answer);
  for (const candidate of candidates) {
    const result = solveCrossword(
      entries,
      index + 1,
      addPlacement(grid, entry, candidate),
      [...placements, { ...entry, ...candidate }],
    );
    if (result) return result;
  }
  return null;
}

function buildCrossword() {
  const entries = [...CROSSWORD_WORDS].sort((a, b) => b.answer.length - a.answer.length);
  const grid = createEmptyGrid();
  const first = entries[0];
  const firstPlacement = {
    ...first,
    row: Math.floor(CROSSWORD_SIZE / 2),
    col: Math.floor((CROSSWORD_SIZE - first.answer.length) / 2),
    direction: "across",
  };
  const firstGrid = addPlacement(grid, first, firstPlacement);
  return solveCrossword(entries, 1, firstGrid, [firstPlacement]);
}

const solution = buildCrossword();
if (!solution) throw new Error("No fue posible construir el crucigrama.");

const bounds = solution.placements.reduce((current, placement) => {
  placementCells(placement.answer, placement.row, placement.col, placement.direction).forEach((cell) => {
    current.minRow = Math.min(current.minRow, cell.row);
    current.maxRow = Math.max(current.maxRow, cell.row);
    current.minCol = Math.min(current.minCol, cell.col);
    current.maxCol = Math.max(current.maxCol, cell.col);
  });
  return current;
}, { minRow: CROSSWORD_SIZE, maxRow: 0, minCol: CROSSWORD_SIZE, maxCol: 0 });

solution.placements.forEach((placement, index) => {
  placement.id = index;
  placement.cells = placementCells(placement.answer, placement.row, placement.col, placement.direction);
});

const orderedStarts = [...new Set(solution.placements.map((placement) => `${placement.row}-${placement.col}`))]
  .map((key) => {
    const [row, col] = key.split("-").map(Number);
    return { key, row, col };
  })
  .sort((a, b) => a.row - b.row || a.col - b.col);
const numberByStart = new Map(orderedStarts.map((start, index) => [start.key, index + 1]));
solution.placements.forEach((placement) => {
  placement.number = numberByStart.get(`${placement.row}-${placement.col}`);
});

const cellData = new Map();
solution.placements.forEach((placement) => placement.cells.forEach((cell) => {
  const key = `${cell.row}-${cell.col}`;
  const current = cellData.get(key) || { ...cell, words: [] };
  current.words.push(placement.id);
  cellData.set(key, current);
}));

let activeWordId = solution.placements[0].id;
let showErrors = false;

function cellKey(row, col) {
  return `${row}-${col}`;
}

function getInput(row, col) {
  return gridElement.querySelector(`[data-cell="${cellKey(row, col)}"]`);
}

function saveProgress() {
  const values = {};
  gridElement.querySelectorAll("input[data-cell]").forEach((input) => {
    if (input.value) values[input.dataset.cell] = input.value;
  });
  localStorage.setItem(CROSSWORD_STORAGE_KEY, JSON.stringify(values));
}

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(CROSSWORD_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function isWordComplete(placement) {
  return placement.cells.every((cell) => getInput(cell.row, cell.col)?.value === cell.letter);
}

function selectWord(wordId, focus = false) {
  activeWordId = wordId;
  document.querySelectorAll(".crossword-cell").forEach((cell) => cell.classList.remove("is-active"));
  cluesElement.querySelectorAll("button").forEach((button) => button.classList.toggle("is-active", Number(button.dataset.wordId) === wordId));
  const placement = solution.placements.find((word) => word.id === wordId);
  placement.cells.forEach((cell) => getInput(cell.row, cell.col)?.parentElement.classList.add("is-active"));
  if (focus) {
    const target = placement.cells.find((cell) => !getInput(cell.row, cell.col)?.value) || placement.cells[0];
    getInput(target.row, target.col)?.focus();
  }
}

function updateProgress() {
  const completeWords = solution.placements.filter(isWordComplete);
  const count = completeWords.length;
  foundElement.textContent = String(count);
  progressLabel.textContent = `${count} de ${solution.placements.length} palabras`;
  progressBar.style.width = `${Math.round((count / solution.placements.length) * 100)}%`;

  document.querySelectorAll(".crossword-cell").forEach((cell) => {
    const input = cell.querySelector("input");
    if (!input) return;
    const data = cellData.get(input.dataset.cell);
    cell.classList.toggle("is-correct", input.value === data.letter);
    cell.classList.toggle("is-error", showErrors && input.value && input.value !== data.letter);
  });
  cluesElement.querySelectorAll("button").forEach((button) => {
    const placement = solution.placements.find((word) => word.id === Number(button.dataset.wordId));
    button.classList.toggle("is-complete", isWordComplete(placement));
  });

  if (count === solution.placements.length) {
    feedbackElement.textContent = "¡Completaste el crucigrama de la biodiversidad!";
    completion.hidden = false;
  }
  saveProgress();
}

function renderGrid() {
  const rows = bounds.maxRow - bounds.minRow + 1;
  const columns = bounds.maxCol - bounds.minCol + 1;
  gridElement.style.setProperty("--crossword-rows", rows);
  gridElement.style.setProperty("--crossword-columns", columns);
  gridElement.setAttribute("role", "grid");
  const saved = loadProgress();

  for (let row = bounds.minRow; row <= bounds.maxRow; row += 1) {
    for (let col = bounds.minCol; col <= bounds.maxCol; col += 1) {
      const key = cellKey(row, col);
      const data = cellData.get(key);
      const cell = document.createElement("div");
      cell.className = "crossword-cell";
      if (!data) {
        cell.setAttribute("aria-hidden", "true");
        gridElement.append(cell);
        continue;
      }

      const startingWords = solution.placements.filter((placement) => placement.row === row && placement.col === col);
      if (startingWords.length) {
        const number = document.createElement("span");
        number.className = "crossword-number";
        number.textContent = String(startingWords[0].number);
        cell.append(number);
      }

      const input = document.createElement("input");
      input.type = "text";
      input.inputMode = "text";
      input.maxLength = 1;
      input.autocomplete = "off";
      input.spellcheck = false;
      input.dataset.cell = key;
      input.value = saved[key] || "";
      input.setAttribute("aria-label", `Casilla fila ${row - bounds.minRow + 1}, columna ${col - bounds.minCol + 1}`);
      input.addEventListener("focus", () => {
        if (!data.words.includes(activeWordId)) selectWord(data.words[0]);
      });
      input.addEventListener("click", () => {
        if (data.words.length > 1 && data.words.includes(activeWordId)) {
          const nextIndex = (data.words.indexOf(activeWordId) + 1) % data.words.length;
          selectWord(data.words[nextIndex]);
        }
      });
      input.addEventListener("input", () => {
        input.value = input.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g, "").slice(-1).toUpperCase();
        showErrors = false;
        updateProgress();
        if (input.value) moveWithinWord(row, col, 1);
      });
      input.addEventListener("keydown", (event) => handleKeydown(event, row, col));
      cell.append(input);
      gridElement.append(cell);
    }
  }
}

function moveWithinWord(row, col, offset) {
  const placement = solution.placements.find((word) => word.id === activeWordId);
  const index = placement.cells.findIndex((cell) => cell.row === row && cell.col === col);
  const target = placement.cells[index + offset];
  if (target) getInput(target.row, target.col)?.focus();
}

function handleKeydown(event, row, col) {
  const directionMoves = {
    ArrowUp: [-1, 0],
    ArrowRight: [0, 1],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1],
  };
  if (directionMoves[event.key]) {
    event.preventDefault();
    const [rowMove, colMove] = directionMoves[event.key];
    getInput(row + rowMove, col + colMove)?.focus();
  } else if (event.key === "Backspace" && !event.currentTarget.value) {
    event.preventDefault();
    moveWithinWord(row, col, -1);
  } else if (event.key === "Enter") {
    event.preventDefault();
    moveWithinWord(row, col, 1);
  }
}

function renderClues() {
  [
    ["across", "Horizontales"],
    ["down", "Verticales"],
  ].forEach(([direction, label]) => {
    const group = document.createElement("section");
    group.className = "clue-group";
    const heading = document.createElement("h3");
    heading.textContent = label;
    group.append(heading);
    solution.placements
      .filter((placement) => placement.direction === direction)
      .sort((a, b) => a.number - b.number)
      .forEach((placement) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.wordId = String(placement.id);
        button.innerHTML = `<b>${placement.number}</b><span>${placement.clue}</span>`;
        button.addEventListener("click", () => selectWord(placement.id, true));
        group.append(button);
      });
    cluesElement.append(group);
  });
}

function checkAnswers() {
  showErrors = true;
  updateProgress();
  const wrong = [...gridElement.querySelectorAll(".crossword-cell.is-error")].length;
  const empty = [...gridElement.querySelectorAll("input[data-cell]")].filter((input) => !input.value).length;
  feedbackElement.textContent = wrong
    ? `Revisa ${wrong} ${wrong === 1 ? "casilla marcada" : "casillas marcadas"}.`
    : empty
      ? "Todo va bien. Aún quedan casillas por completar."
      : "¡Todas las respuestas están correctas!";
}

function revealHint() {
  const active = solution.placements.find((word) => word.id === activeWordId);
  const candidates = [active, ...solution.placements.filter((word) => word.id !== activeWordId && !isWordComplete(word))];
  const placement = candidates.find((word) => !isWordComplete(word));
  if (!placement) return;
  const target = placement.cells.find((cell) => getInput(cell.row, cell.col)?.value !== cell.letter);
  const input = getInput(target.row, target.col);
  input.value = target.letter;
  input.parentElement.classList.add("is-hint");
  window.setTimeout(() => input.parentElement.classList.remove("is-hint"), 1500);
  selectWord(placement.id);
  feedbackElement.textContent = "La naturaleza dejó una letra como pista.";
  showErrors = false;
  updateProgress();
  input.focus();
}

function resetCrossword() {
  gridElement.querySelectorAll("input[data-cell]").forEach((input) => { input.value = ""; });
  localStorage.removeItem(CROSSWORD_STORAGE_KEY);
  completion.hidden = true;
  showErrors = false;
  feedbackElement.textContent = "Selecciona una pista y completa las casillas.";
  selectWord(solution.placements[0].id);
  updateProgress();
}

renderGrid();
renderClues();
selectWord(activeWordId);
updateProgress();

document.querySelector("#crossword-check").addEventListener("click", checkAnswers);
document.querySelector("#crossword-hint").addEventListener("click", revealHint);
document.querySelector("#crossword-reset").addEventListener("click", resetCrossword);
document.querySelector("#crossword-again").addEventListener("click", resetCrossword);
