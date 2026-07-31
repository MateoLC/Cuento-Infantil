import assert from "node:assert/strict";
import test from "node:test";
import {
  PublicError,
  calculatePoints,
  createChallenge,
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
