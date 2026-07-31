"use strict";

const session = window.SofiaGames.init("wordsearch");
const config = session.difficulty.wordSearch;
const words = session.pickEntries(config.count, { offset: 101 });
const answers = words.map((entry) => entry.answer);
const fillLetters = "AAAAABCDEEEEEFGHIIIIJLLLMNNNNOOOOPQRRRRSSSSTTTUUVY";

const gridElement = document.querySelector("#word-grid");
const wordListElement = document.querySelector("#word-list");
const feedbackElement = document.querySelector("#game-feedback");
const foundCountElement = document.querySelector("#found-count");
const progressCountElement = document.querySelector("#progress-count");
const progressBarElement = document.querySelector("#progress-bar");
const wordPanelNote = document.querySelector("#word-panel-note");
const completionElement = document.querySelector("#completion");
const hintButton = document.querySelector("#hint-button");

gridElement.style.setProperty("--word-grid-size", config.size);
document.querySelector(".word-grid").setAttribute(
  "aria-label",
  `Sopa de letras del capítulo ${session.chapter.number}: ${session.chapter.title}`,
);
document.querySelector("#puzzle-title").textContent = `${session.chapter.title}: sopa de letras`;
document.querySelector(".board-heading > b small").textContent = `/${answers.length}`;
document.querySelector("#completion p").textContent =
  `Completaste el reto del capítulo ${session.chapter.number}: ${session.chapter.title}.`;

function createPuzzle() {
  const random = window.SofiaGames.seededRandom(session.seed + 211);
  const grid = Array.from({ length: config.size }, () => Array(config.size).fill(""));
  const placements = {};

  [...answers].sort((a, b) => b.length - a.length).forEach((word) => {
    const candidates = [];
    for (let row = 0; row < config.size; row += 1) {
      for (let col = 0; col < config.size; col += 1) {
        config.directions.forEach(([rowStep, colStep]) => {
          const cells = Array.from({ length: word.length }, (_, index) => ({
            row: row + rowStep * index,
            col: col + colStep * index,
          }));
          if (cells.some((cell) => cell.row < 0 || cell.row >= config.size || cell.col < 0 || cell.col >= config.size)) return;
          if (cells.some((cell, index) => grid[cell.row][cell.col] && grid[cell.row][cell.col] !== word[index])) return;
          candidates.push({ cells, overlap: cells.filter((cell) => grid[cell.row][cell.col]).length });
        });
      }
    }

    const candidatesByOverlap = window.SofiaGames.shuffle(candidates, random)
      .sort((a, b) => b.overlap - a.overlap);
    const choice = candidatesByOverlap[0];
    if (!choice) throw new Error(`No fue posible ubicar ${word} en la sopa de letras.`);
    choice.cells.forEach((cell, index) => { grid[cell.row][cell.col] = word[index]; });
    placements[word] = choice.cells;
  });

  grid.forEach((row) => row.forEach((letter, col) => {
    if (!letter) row[col] = fillLetters[Math.floor(random() * fillLetters.length)];
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
  const saved = JSON.parse(localStorage.getItem(session.storageKey) || "[]");
  found = new Set(saved.filter((word) => answers.includes(word)));
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
  localStorage.setItem(session.storageKey, JSON.stringify([...found]));
}

function updateProgress() {
  const count = found.size;
  foundCountElement.textContent = String(count);
  progressCountElement.textContent = `${count} de ${answers.length}`;
  progressBarElement.style.width = `${(count / answers.length) * 100}%`;

  wordListElement.querySelectorAll("button").forEach((button) => {
    const isFound = found.has(button.dataset.word);
    button.classList.toggle("is-found", isFound);
    button.disabled = isFound;
    button.setAttribute("aria-pressed", String(isFound));
    button.querySelector("span").textContent = isFound ? "✓" : "○";
  });
  wordPanelNote.textContent = count === answers.length
    ? "Expedición completada."
    : session.difficulty.hints
      ? "Toca una palabra para usar una ayuda."
      : "Modo Guardián: encuentra las palabras sin ayudas.";
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
  const match = answers.find((word) => word === letters || word === reversed);

  if (!match) {
    setFeedback("Esa combinación aún no es una palabra. Sigue explorando.");
  } else if (found.has(match)) {
    setFeedback(`${match} ya estaba en tu bitácora.`);
  } else {
    found.add(match);
    saveProgress();
    setFeedback(found.size === answers.length ? "¡Misión cumplida!" : `¡Encontraste ${match}!`);
    updateProgress();
    if (found.size === answers.length) {
      completionElement.hidden = false;
      window.SofiaLeaderboardBridge?.complete({ words: answers.length });
    }
  }
  selection = [];
  renderSelection();
}

function revealHint(requestedWord) {
  if (!session.takeHint()) {
    setFeedback("El modo Guardián se completa sin ayudas.");
    return;
  }
  const word = requestedWord && !found.has(requestedWord)
    ? requestedWord
    : answers.find((candidate) => !found.has(candidate));
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
  localStorage.removeItem(session.storageKey);
  setFeedback(`Nueva expedición del capítulo ${session.chapter.number} lista.`);
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
        setFeedback("Elige ahora la última letra.");
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
  words.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.word = entry.answer;
    button.innerHTML = `<span aria-hidden="true">○</span>${entry.label}`;
    button.title = entry.clue;
    if (session.difficulty.hints) button.addEventListener("click", () => revealHint(entry.answer));
    else button.disabled = false;
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
hintButton.addEventListener("click", () => revealHint());
document.querySelector("#reset-button").addEventListener("click", resetGame);
document.querySelector("#continue-button").addEventListener("click", () => { completionElement.hidden = true; });

renderGame();
session.updateHintButtons();
