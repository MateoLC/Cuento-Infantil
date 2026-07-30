import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "chapters.js"), "utf8");
const sandbox = {
  URLSearchParams,
  console,
  Date,
  Math,
  Uint32Array,
  window: {},
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(source, sandbox);

const { animals, chapters, difficulties, seededRandom, shuffle } = sandbox.SofiaGames;
assert.equal(chapters.length, 7);
assert.deepEqual(Object.keys(difficulties), ["explorer", "guardian"]);
assert.equal(animals.length, 12);
assert.equal(new Set(animals.map((animal) => animal.id)).size, animals.length);
assert.ok(chapters.filter((chapter) => chapter.number <= 5)
  .every((chapter) => animals.some((animal) => animal.chapter === chapter.number)));

function pickEntries(chapter, difficulty, count, seed) {
  const pool = difficulty === "guardian" ? chapter.entries.slice(6) : chapter.entries.slice(0, 8);
  const fallback = difficulty === "guardian" ? chapter.entries : chapter.entries.slice(0, 10);
  return shuffle(pool.length >= count ? pool : fallback, seededRandom(seed)).slice(0, count);
}

function buildWordSearch(entries, size, directions, seed) {
  const random = seededRandom(seed);
  const grid = Array.from({ length: size }, () => Array(size).fill(""));
  for (const entry of [...entries].sort((a, b) => b.answer.length - a.answer.length)) {
    const candidates = [];
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        for (const [rowStep, colStep] of directions) {
          const cells = Array.from({ length: entry.answer.length }, (_, index) => ({
            row: row + rowStep * index,
            col: col + colStep * index,
          }));
          if (cells.some((cell) => cell.row < 0 || cell.row >= size || cell.col < 0 || cell.col >= size)) continue;
          if (cells.some((cell, index) => grid[cell.row][cell.col] && grid[cell.row][cell.col] !== entry.answer[index])) continue;
          candidates.push({ cells, overlap: cells.filter((cell) => grid[cell.row][cell.col]).length });
        }
      }
    }
    const choice = shuffle(candidates, random).sort((a, b) => b.overlap - a.overlap)[0];
    assert.ok(choice, `Sopa sin espacio: ${entry.answer}`);
    choice.cells.forEach((cell, index) => { grid[cell.row][cell.col] = entry.answer[index]; });
  }
}

function crosswordCanBuild(inputEntries, size, seed) {
  const emptyGrid = () => Array.from({ length: size }, () => Array(size).fill(null));
  const cloneGrid = (grid) => grid.map((row) =>
    row.map((cell) => cell ? { letter: cell.letter, directions: new Set(cell.directions) } : null),
  );
  const cellsFor = (answer, row, col, direction) => [...answer].map((letter, index) => ({
    letter,
    row: row + (direction === "down" ? index : 0),
    col: col + (direction === "across" ? index : 0),
  }));
  const validate = (grid, answer, row, col, direction) => {
    const cells = cellsFor(answer, row, col, direction);
    if (cells.some((cell) => cell.row < 0 || cell.row >= size || cell.col < 0 || cell.col >= size)) return null;
    const before = direction === "across" ? { row, col: col - 1 } : { row: row - 1, col };
    const after = direction === "across" ? { row, col: col + answer.length } : { row: row + answer.length, col };
    if (grid[before.row]?.[before.col] || grid[after.row]?.[after.col]) return null;
    let crossings = 0;
    for (const cell of cells) {
      const occupied = grid[cell.row][cell.col];
      if (occupied) {
        if (occupied.letter !== cell.letter || occupied.directions.has(direction)) return null;
        crossings += 1;
      }
    }
    return crossings ? { cells, crossings } : null;
  };
  const candidatesFor = (grid, answer) => {
    const candidates = [];
    grid.forEach((row, rowIndex) => row.forEach((cell, colIndex) => {
      if (!cell) return;
      [...answer].forEach((letter, letterIndex) => {
        if (letter !== cell.letter) return;
        for (const direction of ["across", "down"]) {
          const startRow = rowIndex - (direction === "down" ? letterIndex : 0);
          const startCol = colIndex - (direction === "across" ? letterIndex : 0);
          const valid = validate(grid, answer, startRow, startCol, direction);
          if (!valid) continue;
          const centerDistance = Math.abs(startRow - size / 2) + Math.abs(startCol - size / 2);
          candidates.push({ row: startRow, col: startCol, direction, score: valid.crossings * 100 - centerDistance });
        }
      });
    }));
    return candidates.sort((a, b) => b.score - a.score || a.row - b.row || a.col - b.col).slice(0, 60);
  };
  const add = (grid, entry, placement) => {
    const next = cloneGrid(grid);
    cellsFor(entry.answer, placement.row, placement.col, placement.direction).forEach((cell) => {
      const existing = next[cell.row][cell.col];
      if (existing) existing.directions.add(placement.direction);
      else next[cell.row][cell.col] = { letter: cell.letter, directions: new Set([placement.direction]) };
    });
    return next;
  };
  const solve = (entries, index, grid) => {
    if (index === entries.length) return true;
    for (const candidate of candidatesFor(grid, entries[index].answer)) {
      if (solve(entries, index + 1, add(grid, entries[index], candidate))) return true;
    }
    return false;
  };
  const baseEntries = [...inputEntries].sort((a, b) => b.answer.length - a.answer.length);
  for (let attempt = 0; attempt < 48; attempt += 1) {
    const entries = attempt === 0
      ? baseEntries
      : shuffle(baseEntries, seededRandom(seed + 900 + attempt));
    const first = entries[0];
    const firstPlacement = {
      row: Math.floor(size / 2),
      col: Math.floor((size - first.answer.length) / 2),
      direction: "across",
    };
    if (solve(entries, 1, add(emptyGrid(), first, firstPlacement))) return true;
  }
  return false;
}

for (const chapter of chapters) {
  assert.equal(chapter.entries.length, 14, `${chapter.title} debe tener 14 conceptos`);
  for (const difficultyId of ["explorer", "guardian"]) {
    const difficulty = difficulties[difficultyId];
    for (let seed = 1; seed <= 30; seed += 1) {
      const wordEntries = pickEntries(chapter, difficultyId, difficulty.wordSearch.count, seed + 100);
      buildWordSearch(wordEntries, difficulty.wordSearch.size, difficulty.wordSearch.directions, seed + 200);

      const crosswordEntries = pickEntries(chapter, difficultyId, difficulty.crossword.count, seed + 500);
      assert.ok(
        crosswordCanBuild(crosswordEntries, difficulty.crossword.size, seed),
        `Crucigrama imposible: ${chapter.title}/${difficultyId}/${seed}`,
      );
    }
  }
}

for (const difficultyId of ["explorer", "guardian"]) {
  const difficulty = difficulties[difficultyId];
  assert.ok(difficulty.memory.pairs <= animals.length);
  for (let seed = 1; seed <= 30; seed += 1) {
    const selected = shuffle(animals, seededRandom(seed + 1201)).slice(0, difficulty.memory.pairs);
    const deck = shuffle(selected.flatMap((animal) => [animal.id, animal.id]), seededRandom(seed + 1202));
    assert.equal(deck.length, difficulty.memory.pairs * 2);
    for (const animal of selected) {
      assert.equal(deck.filter((id) => id === animal.id).length, 2);
    }
  }
}

console.log("OK: 7 capítulos, 2 dificultades, 30 semillas y 12 animales.");
