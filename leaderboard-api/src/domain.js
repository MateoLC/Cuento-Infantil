import { createHash, createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";

export const ACTIVITIES = new Set([
  "wordsearch",
  "maze",
  "crossword",
  "coloring",
  "matching",
  "memory",
]);

export const DIFFICULTIES = new Set(["explorer", "guardian"]);

export const CHAPTERS = new Set([
  "anfibios",
  "serpientes",
  "reptiles",
  "aves",
  "mamiferos",
  "arboles",
  "ser-humano",
]);

const BLOCKED_TERMS = [
  "admin",
  "administrador",
  "moderador",
  "soporte",
  "dokploy",
  "sofía oficial",
  "sofia oficial",
];

const TARGET_SECONDS = {
  wordsearch: { explorer: 210, guardian: 420 },
  maze: { explorer: 120, guardian: 260 },
  crossword: { explorer: 300, guardian: 600 },
  coloring: { explorer: 240, guardian: 420 },
  matching: { explorer: 120, guardian: 240 },
  memory: { explorer: 150, guardian: 300 },
};

const MINIMUM_SECONDS = {
  wordsearch: { explorer: 8, guardian: 15 },
  maze: { explorer: 5, guardian: 10 },
  crossword: { explorer: 10, guardian: 20 },
  coloring: { explorer: 12, guardian: 20 },
  matching: { explorer: 5, guardian: 9 },
  memory: { explorer: 6, guardian: 12 },
};

export class PublicError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function normalizeName(value) {
  if (typeof value !== "string") {
    throw new PublicError(400, "invalid_name", "Escribe un nombre de explorador.");
  }

  const displayName = value.normalize("NFKC").trim().replace(/\s+/g, " ");
  if (displayName.length < 3 || displayName.length > 20) {
    throw new PublicError(400, "invalid_name", "El nombre debe tener entre 3 y 20 caracteres.");
  }
  if (!/^[\p{L}\p{N}][\p{L}\p{N} .'-]*[\p{L}\p{N}]$/u.test(displayName)) {
    throw new PublicError(400, "invalid_name", "Usa letras, números, espacios, puntos o guiones.");
  }

  const normalizedName = displayName.toLocaleLowerCase("es");
  if (BLOCKED_TERMS.some((term) => normalizedName.includes(term))) {
    throw new PublicError(400, "blocked_name", "Elige otro nombre de explorador.");
  }

  return { displayName, normalizedName };
}

const ANALYTICS_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function normalizeAnalyticsId(value) {
  if (typeof value !== "string" || !ANALYTICS_ID_PATTERN.test(value)) {
    throw new PublicError(400, "invalid_analytics", "El identificador de medición no es válido.");
  }
  return value.toLowerCase();
}

export function normalizeAnalyticsVisit(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new PublicError(400, "invalid_analytics", "Los datos de medición no son válidos.");
  }
  const visitorId = normalizeAnalyticsId(input.visitorId);
  const sessionId = normalizeAnalyticsId(input.sessionId);
  const path = typeof input.path === "string" ? input.path.trim().split(/[?#]/, 1)[0] : "";
  if (!path || path.length > 160 || !/^\/[A-Za-z0-9/_-]*$/.test(path)) {
    throw new PublicError(400, "invalid_analytics", "La ruta de medición no es válida.");
  }
  return { visitorId, sessionId, path };
}

export function hashAnalyticsId(value, kind, secret) {
  const id = normalizeAnalyticsId(value);
  if (!new Set(["visitor", "session"]).has(kind) || typeof secret !== "string" || secret.length < 32) {
    throw new Error("Analytics hashing configuration is invalid");
  }
  return createHmac("sha256", secret).update(`${kind}:${id}`).digest("hex");
}

export function createPlayerToken() {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function createChallenge(input, secret, now = Date.now()) {
  validateChallengeInput(input);
  const payload = {
    id: randomUUID(),
    activity: input.activity,
    difficulty: input.difficulty,
    chapter: input.chapter,
    seed: Number(input.seed) >>> 0,
    issuedAt: now,
    expiresAt: now + 4 * 60 * 60 * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
  return { token: `${encoded}.${signature}`, payload };
}

export function verifyChallenge(token, secret, now = Date.now()) {
  if (typeof token !== "string" || token.length > 1200) {
    throw new PublicError(400, "invalid_challenge", "El reto no es válido.");
  }
  const [encoded, signature, extra] = token.split(".");
  if (!encoded || !signature || extra) {
    throw new PublicError(400, "invalid_challenge", "El reto no es válido.");
  }
  const expected = createHmac("sha256", secret).update(encoded).digest();
  let received;
  try {
    received = Buffer.from(signature, "base64url");
  } catch {
    throw new PublicError(400, "invalid_challenge", "El reto no es válido.");
  }
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    throw new PublicError(400, "invalid_challenge", "El reto no es válido.");
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    throw new PublicError(400, "invalid_challenge", "El reto no es válido.");
  }
  validateChallengeInput(payload);
  if (!Number.isFinite(payload.issuedAt) || !Number.isFinite(payload.expiresAt) || payload.expiresAt < now) {
    throw new PublicError(400, "expired_challenge", "Este reto venció. Abre un tablero nuevo.");
  }
  return payload;
}

export function validateChallengeInput(input) {
  if (!input || !ACTIVITIES.has(input.activity) || !DIFFICULTIES.has(input.difficulty) || !CHAPTERS.has(input.chapter)) {
    throw new PublicError(400, "invalid_challenge", "La configuración del reto no es válida.");
  }
  const seed = Number(input.seed);
  if (!Number.isFinite(seed) || seed <= 0 || seed > 0xffffffff) {
    throw new PublicError(400, "invalid_challenge", "La semilla del reto no es válida.");
  }
  if (input.activity === "memory" && ["arboles", "ser-humano"].includes(input.chapter)) {
    throw new PublicError(400, "invalid_challenge", "El capítulo no pertenece al juego de memoria.");
  }
}

export function validateCompletion(input, challenge, now = Date.now()) {
  const durationSeconds = Number(input?.durationSeconds);
  const hintsUsed = Number(input?.hintsUsed ?? 0);
  const elapsedSeconds = Math.max(0, Math.floor((now - challenge.issuedAt) / 1000));
  const minimum = MINIMUM_SECONDS[challenge.activity][challenge.difficulty];

  if (!Number.isFinite(durationSeconds) || durationSeconds < minimum || durationSeconds > elapsedSeconds + 15) {
    throw new PublicError(400, "implausible_score", "El tiempo del resultado no es válido.");
  }
  if (!Number.isInteger(hintsUsed) || hintsUsed < 0 || hintsUsed > 3) {
    throw new PublicError(400, "implausible_score", "El número de ayudas no es válido.");
  }
  if (challenge.difficulty === "guardian" && hintsUsed !== 0) {
    throw new PublicError(400, "implausible_score", "El modo Guardián no permite ayudas.");
  }

  const metrics = input?.metrics && typeof input.metrics === "object" && !Array.isArray(input.metrics)
    ? input.metrics
    : {};
  if (JSON.stringify(metrics).length > 2000) {
    throw new PublicError(400, "implausible_score", "Los datos del resultado son demasiado extensos.");
  }

  return { durationSeconds: Math.round(durationSeconds), hintsUsed, metrics };
}

export function calculatePoints({ activity, difficulty, durationSeconds, hintsUsed }) {
  const base = difficulty === "guardian" ? 180 : 100;
  const target = TARGET_SECONDS[activity][difficulty];
  const speedRatio = Math.max(0, Math.min(1, (target - durationSeconds) / target));
  const speedBonus = Math.round(speedRatio * 80);
  const noHintBonus = difficulty === "explorer" && hintsUsed === 0 ? 30 : 0;
  const hintPenalty = difficulty === "explorer" ? Math.min(hintsUsed, 3) * 10 : 0;
  return Math.max(base, base + speedBonus + noHintBonus - hintPenalty);
}
