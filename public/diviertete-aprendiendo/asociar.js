"use strict";

const session = window.SofiaGames.init("matching");
const MATCH_STORAGE_KEY = session.storageKey;
const MATCHES = session.pickEntries(session.difficulty.matching.count, { offset: 701 }).map((entry) => ({
  id: entry.id,
  label: entry.label,
  description: entry.clue,
  color: session.chapter.color,
}));
const sourceOrder = window.SofiaGames.shuffle(MATCHES.map((entry) => entry.id), window.SofiaGames.seededRandom(session.seed + 702));
const targetOrder = window.SofiaGames.shuffle(MATCHES.map((entry) => entry.id), window.SofiaGames.seededRandom(session.seed + 703));

const sourceList = document.querySelector("#source-list");
const targetList = document.querySelector("#target-list");
const matchCount = document.querySelector("#match-count");
const attemptCount = document.querySelector("#attempt-count");
const progressLabel = document.querySelector("#match-progress-label");
const progressBar = document.querySelector("#match-progress-bar");
const feedback = document.querySelector("#match-feedback");
const completion = document.querySelector("#match-completion");
const result = document.querySelector("#match-result");

document.querySelector("#matching-title").textContent = `Conceptos de ${session.chapter.title}`;
document.querySelector(".matching-column-targets h2").textContent = "Encuentra su definición";
document.querySelector(".matching-info-panel > p").textContent =
  `Relaciona cada término con la explicación tomada del capítulo ${session.chapter.number}.`;
document.querySelector("#match-completion > span").textContent = `${MATCHES.length} conexiones`;

let matched = new Set();
let attempts = 0;
let selectedId = null;
let hintTimeout = null;

function getMatch(id) {
  return MATCHES.find((entry) => entry.id === id);
}

function loadState() {
  try {
    const state = JSON.parse(localStorage.getItem(MATCH_STORAGE_KEY));
    if (!state) return;
    matched = new Set(Array.isArray(state.matched) ? state.matched.filter((id) => getMatch(id)) : []);
    attempts = Number.isFinite(state.attempts) ? state.attempts : 0;
  } catch {
    matched = new Set();
    attempts = 0;
  }
}

function saveState() {
  localStorage.setItem(MATCH_STORAGE_KEY, JSON.stringify({ matched: [...matched], attempts }));
}

function createCard(entry, type) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "match-card";
  button.dataset.matchId = entry.id;
  button.dataset.cardType = type;
  button.style.setProperty("--card-color", entry.color);
  button.innerHTML = type === "source"
    ? `<span>${entry.label}</span>`
    : `<span>${entry.description}</span>`;

  if (type === "source") {
    button.draggable = true;
    button.setAttribute("aria-label", `${entry.label}. Seleccionar para asociar.`);
    button.addEventListener("click", () => selectSource(entry.id));
    button.addEventListener("dragstart", (event) => {
      if (matched.has(entry.id)) {
        event.preventDefault();
        return;
      }
      selectedId = entry.id;
      event.dataTransfer.setData("text/plain", entry.id);
      event.dataTransfer.effectAllowed = "move";
      button.classList.add("is-dragging");
      updateSelection();
    });
    button.addEventListener("dragend", () => button.classList.remove("is-dragging"));
  } else {
    button.setAttribute("aria-label", `${entry.description}. Elegir como definición.`);
    button.addEventListener("click", () => chooseTarget(entry.id));
    button.addEventListener("dragover", (event) => {
      if (matched.has(entry.id)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      button.classList.add("is-dragover");
    });
    button.addEventListener("dragleave", () => button.classList.remove("is-dragover"));
    button.addEventListener("drop", (event) => {
      event.preventDefault();
      button.classList.remove("is-dragover");
      const sourceId = event.dataTransfer.getData("text/plain");
      if (sourceId) tryMatch(sourceId, entry.id);
    });
  }
  return button;
}

function renderCards() {
  sourceList.replaceChildren(...sourceOrder.map((id) => createCard(getMatch(id), "source")));
  targetList.replaceChildren(...targetOrder.map((id) => createCard(getMatch(id), "target")));
}

function cardsFor(id) {
  return document.querySelectorAll(`.match-card[data-match-id="${id}"]`);
}

function selectSource(id) {
  if (matched.has(id)) return;
  selectedId = selectedId === id ? null : id;
  updateSelection();
  feedback.textContent = selectedId
    ? `Ahora elige la definición de ${getMatch(id).label}.`
    : "Selecciona un término de la columna izquierda.";
}

function chooseTarget(targetId) {
  if (matched.has(targetId)) return;
  if (!selectedId) {
    feedback.textContent = "Primero selecciona un término de la columna izquierda.";
    return;
  }
  tryMatch(selectedId, targetId);
}

function updateSelection() {
  document.querySelectorAll('.match-card[data-card-type="source"]').forEach((card) => {
    const selected = card.dataset.matchId === selectedId;
    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-pressed", String(selected));
  });
}

function flashWrong(sourceId, targetId) {
  [...cardsFor(sourceId), ...cardsFor(targetId)].forEach((card) => {
    card.classList.add("is-wrong");
    window.setTimeout(() => card.classList.remove("is-wrong"), 450);
  });
}

function tryMatch(sourceId, targetId) {
  if (!getMatch(sourceId) || !getMatch(targetId) || matched.has(sourceId) || matched.has(targetId)) return;
  attempts += 1;
  if (sourceId === targetId) {
    matched.add(sourceId);
    selectedId = null;
    feedback.textContent = `¡Correcto! ${getMatch(sourceId).label} encontró su definición.`;
  } else {
    selectedId = sourceId;
    flashWrong(sourceId, targetId);
    feedback.textContent = "Esa relación no corresponde. Lee de nuevo e intenta otra vez.";
  }
  saveState();
  updateBoard();
}

function updateBoard() {
  document.querySelectorAll(".match-card").forEach((card) => {
    const isMatched = matched.has(card.dataset.matchId);
    card.classList.toggle("is-matched", isMatched);
    card.disabled = isMatched;
    card.draggable = card.dataset.cardType === "source" && !isMatched;
  });
  updateSelection();

  const count = matched.size;
  matchCount.textContent = String(count);
  attemptCount.textContent = String(attempts);
  progressLabel.textContent = `${count} de ${MATCHES.length} conexiones`;
  progressBar.style.width = `${Math.round((count / MATCHES.length) * 100)}%`;

  if (count === MATCHES.length) {
    result.textContent =
      `Completaste ${MATCHES.length} conexiones del capítulo ${session.chapter.number} en ${attempts} intentos.`;
    completion.hidden = false;
  }
}

function showHint() {
  if (!session.takeHint()) {
    feedback.textContent = "El modo Guardián se completa sin ayudas.";
    return;
  }
  window.clearTimeout(hintTimeout);
  document.querySelectorAll(".match-card").forEach((card) => card.classList.remove("is-hint"));
  const id = selectedId && !matched.has(selectedId)
    ? selectedId
    : MATCHES.find((entry) => !matched.has(entry.id))?.id;
  if (!id) return;
  selectedId = id;
  updateSelection();
  cardsFor(id).forEach((card) => card.classList.add("is-hint"));
  feedback.textContent = "Las dos tarjetas iluminadas forman una conexión.";
  hintTimeout = window.setTimeout(() => cardsFor(id).forEach((card) => card.classList.remove("is-hint")), 1800);
}

function resetGame() {
  matched = new Set();
  attempts = 0;
  selectedId = null;
  completion.hidden = true;
  localStorage.removeItem(MATCH_STORAGE_KEY);
  feedback.textContent = "Selecciona un término de la columna izquierda.";
  updateBoard();
}

loadState();
renderCards();
updateBoard();

document.querySelector("#match-hint").addEventListener("click", showHint);
document.querySelector("#match-reset").addEventListener("click", resetGame);
document.querySelector("#match-again").addEventListener("click", resetGame);
session.updateHintButtons();
