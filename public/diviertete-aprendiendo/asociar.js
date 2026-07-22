const MATCH_STORAGE_KEY = "diviertete-asociar-capitulos-v1";

const MATCHES = [
  { id: "anfibios", label: "Anfibios", badge: "AN", description: "Piel húmeda y vida entre el agua y la tierra.", color: "#5f8d3e" },
  { id: "serpientes", label: "Serpientes", badge: "SE", description: "Reptiles alargados que no tienen patas.", color: "#8b603c" },
  { id: "reptiles", label: "Reptiles", badge: "RE", description: "Piel protegida por escamas.", color: "#73924b" },
  { id: "aves", label: "Aves", badge: "AV", description: "Plumas, pico y alas.", color: "#4f83a4" },
  { id: "mamiferos", label: "Mamíferos", badge: "MA", description: "Pelo y alimentación con leche.", color: "#9b7043" },
  { id: "arboles", label: "Árboles", badge: "AR", description: "Raíces, tronco y hojas.", color: "#426d3b" },
  { id: "ser-humano", label: "Ser humano", badge: "SH", description: "Responsabilidad de proteger la naturaleza.", color: "#b76582" },
];

const SOURCE_ORDER = ["aves", "anfibios", "arboles", "serpientes", "ser-humano", "reptiles", "mamiferos"];
const TARGET_ORDER = ["mamiferos", "reptiles", "ser-humano", "anfibios", "aves", "arboles", "serpientes"];

const sourceList = document.querySelector("#source-list");
const targetList = document.querySelector("#target-list");
const matchCount = document.querySelector("#match-count");
const attemptCount = document.querySelector("#attempt-count");
const progressLabel = document.querySelector("#match-progress-label");
const progressBar = document.querySelector("#match-progress-bar");
const feedback = document.querySelector("#match-feedback");
const completion = document.querySelector("#match-completion");
const result = document.querySelector("#match-result");

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
    ? `<b>${entry.badge}</b><span>${entry.label}</span>`
    : `<b>?</b><span>${entry.description}</span>`;

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
    button.setAttribute("aria-label", `${entry.description}. Elegir como característica.`);
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
  sourceList.replaceChildren(...SOURCE_ORDER.map((id) => createCard(getMatch(id), "source")));
  targetList.replaceChildren(...TARGET_ORDER.map((id) => createCard(getMatch(id), "target")));
}

function cardsFor(id) {
  return document.querySelectorAll(`.match-card[data-match-id="${id}"]`);
}

function selectSource(id) {
  if (matched.has(id)) return;
  selectedId = selectedId === id ? null : id;
  updateSelection();
  feedback.textContent = selectedId
    ? `Ahora elige la característica de ${getMatch(id).label}.`
    : "Selecciona una tarjeta de la columna izquierda.";
}

function chooseTarget(targetId) {
  if (matched.has(targetId)) return;
  if (!selectedId) {
    feedback.textContent = "Primero selecciona un capítulo de la columna izquierda.";
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
    feedback.textContent = `¡Correcto! ${getMatch(sourceId).label} encontró su característica.`;
  } else {
    selectedId = sourceId;
    flashWrong(sourceId, targetId);
    feedback.textContent = "Esa conexión no corresponde. Observa las pistas e intenta otra vez.";
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
    const badge = card.querySelector("b");
    if (card.dataset.cardType === "target") badge.textContent = isMatched ? "✓" : "?";
  });
  updateSelection();

  const count = matched.size;
  matchCount.textContent = String(count);
  attemptCount.textContent = String(attempts);
  progressLabel.textContent = `${count} de ${MATCHES.length} conexiones`;
  progressBar.style.width = `${Math.round((count / MATCHES.length) * 100)}%`;

  if (count === MATCHES.length) {
    result.textContent = `Completaste las siete conexiones en ${attempts} ${attempts === 1 ? "intento" : "intentos"}.`;
    completion.hidden = false;
  }
}

function showHint() {
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
  feedback.textContent = "Selecciona una tarjeta de la columna izquierda.";
  updateBoard();
}

loadState();
renderCards();
updateBoard();

document.querySelector("#match-hint").addEventListener("click", showHint);
document.querySelector("#match-reset").addEventListener("click", resetGame);
document.querySelector("#match-again").addEventListener("click", resetGame);
