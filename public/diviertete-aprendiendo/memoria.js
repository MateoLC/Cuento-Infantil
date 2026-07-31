"use strict";

function startMemoria() {
  if (!window.SofiaGames) return;

  const session = window.SofiaGames.init("memory");
  const config = session.difficulty.memory;
  const animalRandom = window.SofiaGames.seededRandom(session.seed + 1201);
  const deckRandom = window.SofiaGames.seededRandom(session.seed + 1202);
  const chapterAnimals = window.SofiaGames.shuffle(
    window.SofiaGames.animals.filter((animal) => animal.chapter === session.chapter.number),
    animalRandom,
  );
  const otherAnimals = window.SofiaGames.shuffle(
    window.SofiaGames.animals.filter((animal) => animal.chapter !== session.chapter.number),
    animalRandom,
  );
  const selectedAnimals = [...chapterAnimals, ...otherAnimals].slice(0, config.pairs);
  const deck = window.SofiaGames.shuffle(
    selectedAnimals.flatMap((animal) => [
      { ...animal, cardId: `${animal.id}-a` },
      { ...animal, cardId: `${animal.id}-b` },
    ]),
    deckRandom,
  );

  const grid = document.querySelector("#memory-grid");
  const feedback = document.querySelector("#memory-feedback");
  const foundCount = document.querySelector("#memory-found");
  const progressLabel = document.querySelector("#memory-progress-label");
  const progressBar = document.querySelector("#memory-progress-bar");
  const pairCount = document.querySelector("#memory-pair-count");
  const moveCount = document.querySelector("#memory-move-count");
  const timeCount = document.querySelector("#memory-time-count");
  const completion = document.querySelector("#memory-completion");
  const result = document.querySelector("#memory-result");
  const hintButton = document.querySelector("#memory-hint");

  if (!grid) return;

  grid.style.setProperty("--memory-columns", config.columns);
  const pairLimitEl = document.querySelector(".memory-heading > b small");
  if (pairLimitEl) pairLimitEl.textContent = `/${config.pairs}`;
  const titleEl = document.querySelector("#memory-title");
  if (titleEl) titleEl.textContent = `Memoria: ${session.chapter.title}`;
  const sourceNoteEl = document.querySelector("#memory-source-note");
  if (sourceNoteEl) {
    sourceNoteEl.textContent = `Fauna del libro con énfasis en el capítulo ${session.chapter.number}, páginas ${session.chapter.pages}.`;
  }
  const levelNoteEl = document.querySelector("#memory-level-note");
  if (levelNoteEl) {
    levelNoteEl.textContent = session.difficulty.id === "guardian"
      ? "Modo Guardián: veinte cartas y ninguna ayuda."
      : "Modo Explorador: doce cartas y tres ayudas.";
  }
  grid.setAttribute(
    "aria-label",
    `Juego de memoria del capítulo ${session.chapter.number}: ${session.chapter.title}`,
  );

  let matched = new Set();
  let moves = 0;
  let seconds = 0;
  let flippedCards = [];
  let locked = false;
  let started = false;
  let timer = null;
  let compareTimeout = null;
  let hintTimeout = null;

  function formatTime(value) {
    const minutes = Math.floor(value / 60).toString().padStart(2, "0");
    const remainingSeconds = (value % 60).toString().padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  }

  function loadState() {
    try {
      const state = JSON.parse(localStorage.getItem(session.storageKey));
      if (!state) return;
      matched = new Set(
        Array.isArray(state.matched)
          ? state.matched.filter((id) => selectedAnimals.some((animal) => animal.id === id))
          : [],
      );
      moves = Number.isFinite(state.moves) ? state.moves : 0;
      seconds = Number.isFinite(state.seconds) ? state.seconds : 0;
    } catch {
      matched = new Set();
      moves = 0;
      seconds = 0;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(session.storageKey, JSON.stringify({
        matched: [...matched],
        moves,
        seconds,
      }));
    } catch {}
  }

  function startTimer() {
    if (started || matched.size === config.pairs) return;
    started = true;
    timer = window.setInterval(() => {
      seconds += 1;
      if (timeCount) timeCount.textContent = formatTime(seconds);
      if (seconds % 5 === 0) saveState();
    }, 1000);
  }

  function cardElementsFor(animalId) {
    return [...grid.querySelectorAll(`[data-animal-id="${animalId}"]`)];
  }

  function setCardState(card, revealed, isMatched = false) {
    card.classList.toggle("is-flipped", revealed);
    card.classList.toggle("is-matched", isMatched);
    const animal = selectedAnimals.find((entry) => entry.id === card.dataset.animalId);
    card.setAttribute(
      "aria-label",
      isMatched
        ? `Pareja de ${animal.name} encontrada`
        : revealed
          ? `${animal.name}, carta descubierta`
          : `Carta ${Number(card.dataset.cardIndex) + 1}, boca abajo`,
    );
    card.setAttribute("aria-pressed", String(revealed));
    card.disabled = isMatched;
  }

  function updateBoard() {
    const count = matched.size;
    if (foundCount) foundCount.textContent = String(count);
    if (pairCount) pairCount.textContent = String(count);
    if (moveCount) moveCount.textContent = String(moves);
    if (timeCount) timeCount.textContent = formatTime(seconds);
    if (progressLabel) progressLabel.textContent = `${count} de ${config.pairs} parejas`;
    if (progressBar) progressBar.style.width = `${Math.round((count / config.pairs) * 100)}%`;

    grid.querySelectorAll(".memory-card").forEach((card) => {
      if (matched.has(card.dataset.animalId)) setCardState(card, true, true);
    });
    saveState();
  }

  function finishGame() {
    window.clearInterval(timer);
    started = false;
    if (feedback) feedback.textContent = "¡Encontraste todas las parejas!";
    if (result) {
      result.textContent = `Completaste ${config.pairs} parejas en ${moves} intentos y ${formatTime(seconds)}.`;
    }
    if (completion) window.setTimeout(() => { completion.hidden = false; }, 300);
  }

  function comparePair() {
    const [first, second] = flippedCards;
    moves += 1;

    if (first.dataset.animalId === second.dataset.animalId) {
      matched.add(first.dataset.animalId);
      setCardState(first, true, true);
      setCardState(second, true, true);
      if (feedback) feedback.textContent = `¡Pareja encontrada: ${first.dataset.animalName}!`;
      flippedCards = [];
      locked = false;
      updateBoard();
      if (matched.size === config.pairs) finishGame();
      return;
    }

    locked = true;
    if (feedback) feedback.textContent = "No son iguales. Recuerda dónde estaba cada animal.";
    compareTimeout = window.setTimeout(() => {
      setCardState(first, false);
      setCardState(second, false);
      flippedCards = [];
      locked = false;
      updateBoard();
    }, config.revealMs);
    updateBoard();
  }

  function chooseCard(card) {
    if (locked || card.classList.contains("is-flipped") || matched.has(card.dataset.animalId)) return;
    startTimer();
    setCardState(card, true);
    flippedCards.push(card);
    if (feedback) {
      feedback.textContent = flippedCards.length === 1
        ? "Busca ahora la otra carta del mismo animal."
        : "Comparando las dos cartas...";
    }
    if (flippedCards.length === 2) comparePair();
  }

  function showHint() {
    if (locked) return;
    if (!session.takeHint()) {
      if (feedback) feedback.textContent = "El modo Guardián se completa sin ayudas.";
      return;
    }

    window.clearTimeout(compareTimeout);
    window.clearTimeout(hintTimeout);
    flippedCards.forEach((card) => setCardState(card, false));
    flippedCards = [];
    const animal = selectedAnimals.find((entry) => !matched.has(entry.id));
    if (!animal) return;
    const cards = cardElementsFor(animal.id);
    locked = true;
    cards.forEach((card) => {
      setCardState(card, true);
      card.classList.add("is-hint");
    });
    if (feedback) feedback.textContent = `Pista: observa la pareja de ${animal.name}.`;
    hintTimeout = window.setTimeout(() => {
      cards.forEach((card) => {
        card.classList.remove("is-hint");
        if (!matched.has(animal.id)) setCardState(card, false);
      });
      locked = false;
    }, 1600);
  }

  function resetGame() {
    window.clearInterval(timer);
    window.clearTimeout(compareTimeout);
    window.clearTimeout(hintTimeout);
    matched = new Set();
    moves = 0;
    seconds = 0;
    flippedCards = [];
    locked = false;
    started = false;
    if (completion) completion.hidden = true;
    try {
      localStorage.removeItem(session.storageKey);
    } catch {}
    grid.querySelectorAll(".memory-card").forEach((card) => {
      card.classList.remove("is-hint");
      setCardState(card, false);
    });
    if (feedback) feedback.textContent = "Voltea dos cartas y encuentra el primer par.";
    updateBoard();
  }

  function renderDeck() {
    grid.innerHTML = "";
    const fragment = document.createDocumentFragment();
    deck.forEach((animal, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "memory-card";
      card.dataset.animalId = animal.id;
      card.dataset.animalName = animal.name;
      card.dataset.cardId = animal.cardId;
      card.dataset.cardIndex = String(index);
      card.setAttribute("role", "gridcell");
      card.innerHTML = `
        <span class="memory-card-inner" aria-hidden="true">
          <span class="memory-card-back"><i></i></span>
          <span class="memory-card-front">
            <img src="${animal.image}" alt="" width="180" height="240" draggable="false" />
            <strong>${animal.name}</strong>
          </span>
        </span>
      `;
      card.addEventListener("click", () => chooseCard(card));
      setCardState(card, matched.has(animal.id), matched.has(animal.id));
      fragment.append(card);
    });
    grid.append(fragment);
  }

  loadState();
  renderDeck();
  updateBoard();
  if (matched.size === config.pairs && feedback) {
    feedback.textContent = "Este tablero ya fue completado.";
  }

  if (hintButton) hintButton.addEventListener("click", showHint);
  const resetBtn = document.querySelector("#memory-reset");
  if (resetBtn) resetBtn.addEventListener("click", resetGame);
  const againBtn = document.querySelector("#memory-again");
  if (againBtn) againBtn.addEventListener("click", resetGame);
  session.updateHintButtons();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startMemoria);
} else {
  startMemoria();
}
