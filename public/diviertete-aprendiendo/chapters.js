(() => {
  "use strict";

  const CHAPTERS = [
    {
      id: "anfibios",
      number: 1,
      title: "Anfibios",
      subtitle: "Guardianes del agua",
      pages: "18-31",
      pdfPages: "10-16",
      color: "#5f8d3e",
      start: "rana",
      goal: "humedal",
      mission: "Guía a la rana hasta el humedal.",
      entries: [
        ["RANA", "Anfibio de patas largas que se desplaza dando saltos."],
        ["SAPO", "Anfibio de cuerpo robusto y piel generalmente rugosa."],
        ["AGUA", "Medio indispensable para los huevos y renacuajos."],
        ["PIEL", "Debe permanecer húmeda y también participa en la respiración."],
        ["HUEVO", "Primera etapa de la mayoría de los anfibios."],
        ["CANTO", "Sonido con el que muchos machos atraen pareja."],
        ["CHARCA", "Pequeño cuerpo de agua usado para reproducirse."],
        ["LLUVIA", "Favorece la actividad y reproducción de muchas especies."],
        ["METAMORFOSIS", "Transformación que lleva del renacuajo al adulto."],
        ["RENACUAJO", "Etapa acuática con cola de ranas y sapos."],
        ["BRANQUIAS", "Órganos respiratorios presentes en muchas larvas."],
        ["BIOINDICADOR", "Organismo cuya presencia ayuda a reconocer la salud ambiental."],
        ["HUMEDAD", "Condición esencial para proteger su piel permeable."],
        ["ENDEMISMO", "Condición de una especie que solo vive en una región."],
      ],
    },
    {
      id: "serpientes",
      number: 2,
      title: "Serpientes",
      subtitle: "Reinas del silencio",
      pages: "32-57",
      pdfPages: "17-29",
      color: "#8b603c",
      start: "serpiente",
      goal: "refugio",
      mission: "Guía a la serpiente hasta un refugio seguro.",
      entries: [
        ["ESCAMAS", "Cubierta que protege el cuerpo de las serpientes."],
        ["LENGUA", "Órgano bífido que recoge partículas del ambiente."],
        ["MUDA", "Renovación periódica de la piel."],
        ["VENENO", "Sustancia que algunas especies usan para inmovilizar presas."],
        ["COLMILLO", "Diente especializado que puede conducir veneno."],
        ["BOA", "Serpiente que suele dominar a sus presas por constricción."],
        ["CASCABEL", "Estructura sonora presente al final de la cola de algunas especies."],
        ["CLOACA", "Abertura común de los sistemas digestivo y reproductor."],
        ["JACOBSON", "Órgano que interpreta partículas llevadas por la lengua."],
        ["CONSTRICCION", "Método de caza que consiste en rodear y apretar la presa."],
        ["SOLENOGLIFA", "Dentición con colmillos anteriores largos y móviles."],
        ["PROTEROGLIFA", "Dentición con colmillos anteriores cortos y fijos."],
        ["VIBRACIONES", "Señales del suelo que les permiten percibir movimientos."],
        ["CAMUFLAJE", "Adaptación para confundirse con el entorno."],
      ],
    },
    {
      id: "reptiles",
      number: 3,
      title: "Reptiles",
      subtitle: "Maestros del sol",
      pages: "58-87",
      pdfPages: "30-44",
      color: "#73924b",
      start: "lagarto",
      goal: "roca soleada",
      mission: "Guía al lagarto hasta la roca soleada.",
      entries: [
        ["LAGARTO", "Reptil de cuerpo alargado que suele tener cuatro patas."],
        ["TORTUGA", "Reptil protegido por un caparazón."],
        ["CAIMAN", "Reptil semiacuático de hocico ancho."],
        ["IGUANA", "Lagarto arborícola común en zonas cálidas."],
        ["ESCAMAS", "Cubierta seca que reduce la pérdida de agua."],
        ["HUEVO", "Estructura resistente donde se desarrolla la cría."],
        ["SOL", "Fuente de calor usada para regular la temperatura corporal."],
        ["PULMON", "Órgano con el que respiran los reptiles."],
        ["ECTOTERMO", "Animal que obtiene del ambiente buena parte de su calor."],
        ["HERPETOFAUNA", "Conjunto de anfibios y reptiles de una región."],
        ["COCODRILO", "Gran reptil acuático de hocico alargado."],
        ["CAPARAZON", "Estructura ósea que protege a las tortugas."],
        ["INCUBACION", "Periodo de desarrollo del embrión dentro del huevo."],
        ["REGENERACION", "Capacidad de algunos lagartos para recuperar la cola."],
      ],
    },
    {
      id: "aves",
      number: 4,
      title: "Aves",
      subtitle: "Joyas del viento",
      pages: "88-105",
      pdfPages: "45-53",
      color: "#4f83a4",
      start: "colibri",
      goal: "nido",
      mission: "Guía al colibrí hasta su nido.",
      entries: [
        ["PLUMA", "Estructura exclusiva que cubre el cuerpo de las aves."],
        ["PICO", "Estructura cuya forma se adapta al tipo de alimentación."],
        ["ALA", "Extremidad modificada para el vuelo."],
        ["HUEVO", "Estructura en la que se desarrolla el embrión."],
        ["NIDO", "Lugar preparado para poner e incubar los huevos."],
        ["VUELO", "Forma de desplazamiento de la mayoría de las aves."],
        ["CANTO", "Vocalización usada para comunicarse y marcar territorio."],
        ["NECTAR", "Alimento que buscan muchos colibríes en las flores."],
        ["MIGRACION", "Desplazamiento estacional entre regiones."],
        ["POLINIZACION", "Transporte de polen que algunas aves ayudan a realizar."],
        ["DISPERSION", "Transporte de semillas a nuevos lugares."],
        ["PLUMAJE", "Conjunto de plumas de un ave."],
        ["ENDEMICA", "Especie que solo habita naturalmente en una región."],
        ["CONDOR", "Gran ave andina y símbolo nacional de Colombia."],
      ],
    },
    {
      id: "mamiferos",
      number: 5,
      title: "Mamíferos",
      subtitle: "Espíritus del bosque",
      pages: "106-137",
      pdfPages: "54-69",
      color: "#9b7043",
      start: "oso de anteojos",
      goal: "bosque andino",
      mission: "Guía al oso de anteojos hasta el bosque andino.",
      entries: [
        ["PELO", "Cobertura corporal característica de los mamíferos."],
        ["LECHE", "Alimento producido por las glándulas mamarias."],
        ["CRIA", "Individuo joven cuidado por sus progenitores."],
        ["OSO", "Mamífero andino que ayuda a dispersar semillas."],
        ["JAGUAR", "Gran felino americano de pelaje manchado."],
        ["DELFIN", "Mamífero acuático que respira aire."],
        ["MANATI", "Mamífero acuático herbívoro."],
        ["PULMON", "Órgano respiratorio de todos los mamíferos."],
        ["VIVIPARO", "Animal cuyas crías se desarrollan dentro de la madre."],
        ["MARSUPIAL", "Mamífero cuyas crías completan su desarrollo en una bolsa."],
        ["PLACENTA", "Órgano que conecta a la madre con el embrión."],
        ["ENDOTERMO", "Animal que mantiene estable su temperatura corporal."],
        ["ECOLOCALIZACION", "Orientación mediante sonidos y ecos."],
        ["OMNIVORO", "Animal que consume alimentos de origen vegetal y animal."],
      ],
    },
    {
      id: "arboles",
      number: 6,
      title: "Árboles",
      subtitle: "Pulmones de la tierra",
      pages: "138-153",
      pdfPages: "70-77",
      color: "#426d3b",
      start: "semilla",
      goal: "bosque",
      mission: "Guía la semilla hasta el lugar donde crecerá el bosque.",
      entries: [
        ["RAIZ", "Parte que fija la planta y absorbe agua y minerales."],
        ["TRONCO", "Eje leñoso que sostiene la copa."],
        ["HOJA", "Órgano donde ocurre gran parte de la fotosíntesis."],
        ["SEMILLA", "Estructura que contiene una nueva planta."],
        ["FLOR", "Órgano reproductivo de muchas plantas."],
        ["FRUTO", "Estructura que protege y ayuda a dispersar semillas."],
        ["BOSQUE", "Ecosistema dominado por árboles."],
        ["SOMBRA", "Protección frente al sol que brinda la copa."],
        ["FOTOSINTESIS", "Proceso que transforma luz, agua y dióxido de carbono en alimento."],
        ["CLOROFILA", "Pigmento verde que capta la energía de la luz."],
        ["SAVIABRUTA", "Mezcla de agua y minerales que asciende desde la raíz."],
        ["ESTOMAS", "Pequeñas aberturas de las hojas para el intercambio de gases."],
        ["GERMINACION", "Inicio del crecimiento de una semilla."],
        ["ORQUIDEA", "Familia de plantas con enorme diversidad en Colombia."],
      ],
    },
    {
      id: "ser-humano",
      number: 7,
      title: "Ser humano",
      subtitle: "Armonía y naturaleza",
      pages: "154-186",
      pdfPages: "78-93",
      color: "#b76582",
      start: "comunidad",
      goal: "territorio protegido",
      mission: "Guía a la comunidad hasta un territorio protegido.",
      entries: [
        ["MANOS", "Permitieron fabricar y usar herramientas con precisión."],
        ["FUEGO", "Ayudó a cocinar, protegerse y reunirse."],
        ["FAMILIA", "Primer grupo de cuidado y aprendizaje."],
        ["CULTURA", "Conocimientos y costumbres compartidos por una comunidad."],
        ["RESPETO", "Valor necesario para convivir con otras formas de vida."],
        ["FUTURO", "Tiempo que protegemos con decisiones responsables."],
        ["TIERRA", "Territorio que sostiene los alimentos y la vida."],
        ["COMUNIDAD", "Grupo que coopera para alcanzar propósitos comunes."],
        ["COOPERACION", "Trabajo conjunto que fortaleció a los grupos humanos."],
        ["AGRICULTURA", "Práctica de cultivar plantas para obtener alimento."],
        ["HERRAMIENTA", "Objeto creado para facilitar una tarea."],
        ["LENGUAJE", "Sistema que permite compartir ideas y aprendizajes."],
        ["CONSERVACION", "Protección y uso responsable de la naturaleza."],
        ["BIODIVERSIDAD", "Variedad de seres vivos, ecosistemas y relaciones."],
      ],
    },
  ].map((chapter) => ({
    ...chapter,
    entries: chapter.entries.map(([answer, clue], index) => ({
      id: `${chapter.id}-${index + 1}`,
      answer,
      label: titleCase(answer),
      clue,
    })),
  }));

  const DIFFICULTIES = {
    explorer: {
      id: "explorer",
      label: "Explorador",
      description: "Tablero breve y hasta 3 ayudas.",
      hints: 3,
      wordSearch: { size: 12, count: 8, directions: [[0, 1], [1, 0], [1, 1]] },
      maze: { size: 11 },
      crossword: { count: 6, size: 19 },
      matching: { count: 5 },
      coloring: { fill: true, brushMin: 10, brushMax: 60, brushDefault: 30 },
    },
    guardian: {
      id: "guardian",
      label: "Guardián",
      description: "Más elementos, términos técnicos y cero ayudas.",
      hints: 0,
      wordSearch: {
        size: 18,
        count: 12,
        directions: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
      },
      maze: { size: 19 },
      crossword: { count: 9, size: 25 },
      matching: { count: 8 },
      coloring: { fill: false, brushMin: 5, brushMax: 34, brushDefault: 14 },
    },
  };

  const ACTIVITY_FILES = {
    wordsearch: "index.html",
    maze: "laberinto.html",
    crossword: "crucigrama.html",
    coloring: "colorear.html",
    matching: "asociar.html",
  };

  function titleCase(value) {
    return value.toLocaleLowerCase("es").replace(/(^|\s)\p{L}/gu, (letter) => letter.toLocaleUpperCase("es"));
  }

  function seededRandom(initialSeed) {
    let seed = Number(initialSeed) >>> 0;
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

  function randomSeed() {
    if (window.crypto?.getRandomValues) {
      return window.crypto.getRandomValues(new Uint32Array(1))[0];
    }
    return (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
  }

  function normalizeDifficulty(value) {
    return value === "guardian" ? "guardian" : "explorer";
  }

  function buildUrl(file, difficulty, chapterId, seed) {
    const params = new URLSearchParams({ dificultad: difficulty });
    if (chapterId) params.set("capitulo", chapterId);
    if (seed !== undefined) params.set("semilla", String(seed >>> 0));
    return `${file}?${params.toString()}`;
  }

  function renderSessionControls(session) {
    const intro = document.querySelector(".game-intro");
    if (!intro) return;
    intro.classList.add("has-session-controls");
    const controls = document.createElement("section");
    controls.className = "session-controls";
    controls.setAttribute("aria-label", "Configuración de la actividad");
    controls.innerHTML = `
      <div class="difficulty-control" aria-label="Nivel de dificultad">
        ${Object.values(DIFFICULTIES).map((item) => `
          <a class="${item.id === session.difficulty.id ? "is-active" : ""}"
             href="${buildUrl(ACTIVITY_FILES[session.activity], item.id, session.chapter.id, randomSeed())}"
             ${item.id === session.difficulty.id ? 'aria-current="true"' : ""}>
            <strong>${item.label}</strong>
            <small>${item.id === "explorer" ? "3 ayudas" : "0 ayudas"}</small>
          </a>`).join("")}
      </div>
      <div class="chapter-reference">
        <span>Fuente del reto</span>
        <strong>Capítulo ${session.chapter.number}: ${session.chapter.title}</strong>
        <small>Libro, páginas ${session.chapter.pages}</small>
      </div>
      <button class="new-map-button" type="button">Otro capítulo</button>
    `;
    intro.append(controls);
    controls.querySelector(".new-map-button").addEventListener("click", () => {
      const candidates = CHAPTERS.filter((chapter) => chapter.id !== session.chapter.id);
      const chapter = candidates[Math.floor(Math.random() * candidates.length)];
      window.location.assign(buildUrl(ACTIVITY_FILES[session.activity], session.difficulty.id, chapter.id, randomSeed()));
    });

    document.querySelectorAll(".activity-switcher a").forEach((link) => {
      const file = link.getAttribute("href")?.split("?")[0];
      if (!file) return;
      link.href = buildUrl(file, session.difficulty.id);
    });
  }

  function init(activity) {
    if (!ACTIVITY_FILES[activity]) throw new Error(`Actividad desconocida: ${activity}`);
    const params = new URLSearchParams(window.location.search);
    const difficultyId = normalizeDifficulty(params.get("dificultad"));
    const seedParam = Number(params.get("semilla"));
    const seed = Number.isFinite(seedParam) && seedParam > 0 ? seedParam >>> 0 : randomSeed();
    const random = seededRandom(seed);
    const requestedChapter = CHAPTERS.find((chapter) => chapter.id === params.get("capitulo"));
    const chapter = requestedChapter || CHAPTERS[Math.floor(random() * CHAPTERS.length)];

    if (!requestedChapter || !params.get("semilla") || params.get("dificultad") !== difficultyId) {
      history.replaceState(null, "", buildUrl(ACTIVITY_FILES[activity], difficultyId, chapter.id, seed));
    }

    const session = {
      activity,
      seed,
      random,
      chapter,
      difficulty: DIFFICULTIES[difficultyId],
      storageKey: `sofia-games-v2:${activity}:${difficultyId}:${chapter.id}:${seed}`,
      hintsRemaining: DIFFICULTIES[difficultyId].hints,
      takeHint() {
        if (this.hintsRemaining <= 0) return false;
        this.hintsRemaining -= 1;
        this.updateHintButtons();
        return true;
      },
      updateHintButtons() {
        document.querySelectorAll("[data-hint-button], #hint-button, #maze-hint, #crossword-hint, #match-hint")
          .forEach((button) => {
            button.disabled = this.hintsRemaining <= 0;
            button.textContent = this.hintsRemaining > 0 ? `Pista (${this.hintsRemaining})` : "Sin pistas";
          });
      },
      pickEntries(count, options = {}) {
        const pool = this.difficulty.id === "guardian"
          ? this.chapter.entries.slice(6)
          : this.chapter.entries.slice(0, 8);
        const fallback = this.difficulty.id === "guardian" ? this.chapter.entries : this.chapter.entries.slice(0, 10);
        const entries = pool.length >= count ? pool : fallback;
        const selected = shuffle(entries, seededRandom(this.seed + (options.offset || 0))).slice(0, count);
        return options.longestFirst ? selected.sort((a, b) => b.answer.length - a.answer.length) : selected;
      },
    };

    document.documentElement.dataset.difficulty = difficultyId;
    document.documentElement.dataset.chapter = chapter.id;
    renderSessionControls(session);
    window.setTimeout(() => session.updateHintButtons(), 0);
    return session;
  }

  window.SofiaGames = {
    chapters: CHAPTERS,
    difficulties: DIFFICULTIES,
    init,
    seededRandom,
    shuffle,
    buildUrl,
  };
})();
