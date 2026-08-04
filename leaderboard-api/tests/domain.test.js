import assert from "node:assert/strict";
import test from "node:test";
import {
  PublicError,
  calculatePoints,
  createChallenge,
  hashAnalyticsId,
  normalizeAnalyticsVisit,
  normalizeName,
  validateCompletion,
  verifyChallenge,
} from "../src/domain.js";

const secret = "0123456789abcdef0123456789abcdef";
const challengeInput = {
  activity: "memory",
  difficulty: "explorer",
  chapter: "anfibios",
  seed: 12345,
};

test("normaliza nombres públicos", () => {
  assert.deepEqual(normalizeName("  Rana   Verde  "), {
    displayName: "Rana Verde",
    normalizedName: "rana verde",
  });
  assert.throws(() => normalizeName("ad"), PublicError);
  assert.throws(() => normalizeName("Administrador"), PublicError);
});

test("valida identificadores anónimos y rutas de medición", () => {
  const visit = normalizeAnalyticsVisit({
    visitorId: "2ed4fba1-e9cb-4efd-8197-753b15e68be5",
    sessionId: "26632a6c-b671-48c5-8196-cae83d2874f5",
    path: "/diviertete-aprendiendo?origen=inicio",
  });
  assert.equal(visit.path, "/diviertete-aprendiendo");
  assert.throws(() => normalizeAnalyticsVisit({ ...visit, visitorId: "visitor-1" }), PublicError);
  assert.throws(() => normalizeAnalyticsVisit({ ...visit, path: "https://otro-sitio.example" }), PublicError);
});

test("separa los hashes de visitantes y sesiones", () => {
  const id = "2ed4fba1-e9cb-4efd-8197-753b15e68be5";
  const secret = "0123456789abcdef0123456789abcdef";
  assert.notEqual(hashAnalyticsId(id, "visitor", secret), hashAnalyticsId(id, "session", secret));
});

test("firma y verifica un reto", () => {
  const now = 1_800_000_000_000;
  const challenge = createChallenge(challengeInput, secret, now);
  assert.equal(verifyChallenge(challenge.token, secret, now + 20_000).activity, "memory");
  assert.throws(() => verifyChallenge(`${challenge.token}x`, secret, now + 20_000), PublicError);
});

test("rechaza resultados imposibles", () => {
  const now = 1_800_000_000_000;
  const challenge = createChallenge(challengeInput, secret, now).payload;
  assert.throws(
    () => validateCompletion({ durationSeconds: 2, hintsUsed: 0 }, challenge, now + 30_000),
    PublicError,
  );
});

test("Guardián puntúa más y las pistas reducen el resultado", () => {
  const explorer = calculatePoints({ activity: "memory", difficulty: "explorer", durationSeconds: 90, hintsUsed: 0 });
  const withHints = calculatePoints({ activity: "memory", difficulty: "explorer", durationSeconds: 90, hintsUsed: 2 });
  const guardian = calculatePoints({ activity: "memory", difficulty: "guardian", durationSeconds: 180, hintsUsed: 0 });
  assert.ok(explorer > withHints);
  assert.ok(guardian > explorer);
});
