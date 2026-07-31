import http from "node:http";
import { randomUUID } from "node:crypto";
import pg from "pg";
import {
  PublicError,
  calculatePoints,
  createChallenge,
  createPlayerToken,
  hashToken,
  normalizeName,
  validateCompletion,
  verifyChallenge,
} from "./domain.js";
import { SCHEMA_SQL } from "./schema.js";

const { Pool } = pg;
const PORT = Number(process.env.PORT || 3000);
const DATABASE_URL = process.env.DATABASE_URL;
const TOKEN_SECRET = process.env.PLAYER_TOKEN_SECRET;
const ALLOWED_ORIGINS = new Set(
  String(process.env.ALLOWED_ORIGIN || "https://sofiacuentoecologico.com")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

if (!DATABASE_URL) throw new Error("DATABASE_URL is required");
if (!TOKEN_SECRET || TOKEN_SECRET.length < 32) throw new Error("PLAYER_TOKEN_SECRET must contain at least 32 characters");

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 8_000,
  ssl: process.env.DATABASE_SSL === "require" ? { rejectUnauthorized: false } : undefined,
});

const rateBuckets = new Map();

function clientIp(request) {
  return String(request.headers["x-forwarded-for"] || request.socket.remoteAddress || "unknown").split(",")[0].trim();
}

function rateLimit(request, key, limit, windowMs) {
  const bucketKey = `${key}:${clientIp(request)}`;
  const now = Date.now();
  const current = rateBuckets.get(bucketKey);
  if (!current || current.resetAt <= now) {
    rateBuckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return;
  }
  current.count += 1;
  if (current.count > limit) throw new PublicError(429, "rate_limited", "Espera un momento antes de intentarlo de nuevo.");
}

function setHeaders(request, response) {
  const origin = request.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }
  response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  response.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
  response.setHeader("Cross-Origin-Resource-Policy", "same-site");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Cache-Control", "no-store");
}

function json(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

async function readBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16_384) throw new PublicError(413, "payload_too_large", "La solicitud es demasiado extensa.");
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new PublicError(400, "invalid_json", "La solicitud no contiene JSON válido.");
  }
}

async function authenticate(request) {
  const authorization = request.headers.authorization || "";
  const match = authorization.match(/^Bearer ([A-Za-z0-9_-]{30,})$/);
  if (!match) throw new PublicError(401, "unauthorized", "El pasaporte del explorador no es válido.");
  const result = await pool.query(
    `SELECT id, display_name AS "displayName"
       FROM leaderboard_players
      WHERE token_hash = $1 AND is_blocked = FALSE`,
    [hashToken(match[1])],
  );
  if (!result.rows[0]) throw new PublicError(401, "unauthorized", "El pasaporte del explorador no es válido.");
  await pool.query("UPDATE leaderboard_players SET last_seen_at = NOW() WHERE id = $1", [result.rows[0].id]);
  return result.rows[0];
}

async function playerSummary(player) {
  const result = await pool.query(
    `WITH totals AS (
       SELECT player_id, SUM(points)::int AS points, COUNT(*)::int AS completed
         FROM leaderboard_scores
        GROUP BY player_id
     ), ranked AS (
       SELECT p.id,
              COALESCE(t.points, 0)::int AS points,
              COALESCE(t.completed, 0)::int AS completed,
              RANK() OVER (ORDER BY COALESCE(t.points, 0) DESC, p.created_at ASC)::int AS position
         FROM leaderboard_players p
         LEFT JOIN totals t ON t.player_id = p.id
        WHERE p.is_blocked = FALSE
     )
     SELECT points, completed, position FROM ranked WHERE id = $1`,
    [player.id],
  );
  const summary = result.rows[0] || { points: 0, completed: 0, position: null };
  if (!summary.points) summary.position = null;
  return { ...player, ...summary };
}

async function createPlayer(request, response) {
  rateLimit(request, "create-player", 8, 60 * 60 * 1000);
  const body = await readBody(request);
  const { displayName, normalizedName } = normalizeName(body.name);
  const token = createPlayerToken();
  try {
    const result = await pool.query(
      `INSERT INTO leaderboard_players (id, display_name, normalized_name, token_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, display_name AS "displayName"`,
      [randomUUID(), displayName, normalizedName, hashToken(token)],
    );
    json(response, 201, { player: await playerSummary(result.rows[0]), token });
  } catch (error) {
    if (error.code === "23505") throw new PublicError(409, "name_taken", "Ese nombre de explorador ya está en uso.");
    throw error;
  }
}

async function renamePlayer(request, response) {
  rateLimit(request, "rename-player", 10, 60 * 60 * 1000);
  const player = await authenticate(request);
  const body = await readBody(request);
  const { displayName, normalizedName } = normalizeName(body.name);
  try {
    const result = await pool.query(
      `UPDATE leaderboard_players
          SET display_name = $1, normalized_name = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING id, display_name AS "displayName"`,
      [displayName, normalizedName, player.id],
    );
    json(response, 200, { player: await playerSummary(result.rows[0]) });
  } catch (error) {
    if (error.code === "23505") throw new PublicError(409, "name_taken", "Ese nombre de explorador ya está en uso.");
    throw error;
  }
}

async function issueChallenge(request, response) {
  rateLimit(request, "challenge", 120, 60 * 60 * 1000);
  const body = await readBody(request);
  const challenge = createChallenge(body, TOKEN_SECRET);
  json(response, 201, { challengeToken: challenge.token, issuedAt: challenge.payload.issuedAt });
}

async function submitScore(request, response) {
  rateLimit(request, "score", 180, 60 * 60 * 1000);
  const player = await authenticate(request);
  const body = await readBody(request);
  const challenge = verifyChallenge(body.challengeToken, TOKEN_SECRET);
  const completion = validateCompletion(body, challenge);
  const points = calculatePoints({ ...challenge, ...completion });
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const previousResult = await client.query(
      `SELECT points FROM leaderboard_scores
        WHERE player_id = $1 AND activity = $2 AND difficulty = $3 AND chapter = $4
        FOR UPDATE`,
      [player.id, challenge.activity, challenge.difficulty, challenge.chapter],
    );
    const previousPoints = previousResult.rows[0]?.points || 0;
    await client.query(
      `INSERT INTO leaderboard_scores (
         id, player_id, challenge_id, activity, difficulty, chapter, seed,
         points, duration_seconds, hints_used, metrics
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (player_id, activity, difficulty, chapter)
       DO UPDATE SET
         challenge_id = CASE WHEN EXCLUDED.points > leaderboard_scores.points THEN EXCLUDED.challenge_id ELSE leaderboard_scores.challenge_id END,
         seed = CASE WHEN EXCLUDED.points > leaderboard_scores.points THEN EXCLUDED.seed ELSE leaderboard_scores.seed END,
         points = GREATEST(leaderboard_scores.points, EXCLUDED.points),
         duration_seconds = CASE WHEN EXCLUDED.points > leaderboard_scores.points THEN EXCLUDED.duration_seconds ELSE leaderboard_scores.duration_seconds END,
         hints_used = CASE WHEN EXCLUDED.points > leaderboard_scores.points THEN EXCLUDED.hints_used ELSE leaderboard_scores.hints_used END,
         metrics = CASE WHEN EXCLUDED.points > leaderboard_scores.points THEN EXCLUDED.metrics ELSE leaderboard_scores.metrics END,
         updated_at = CASE WHEN EXCLUDED.points > leaderboard_scores.points THEN NOW() ELSE leaderboard_scores.updated_at END`,
      [
        randomUUID(), player.id, challenge.id, challenge.activity, challenge.difficulty,
        challenge.chapter, challenge.seed, points, completion.durationSeconds,
        completion.hintsUsed, JSON.stringify(completion.metrics),
      ],
    );
    await client.query("COMMIT");
    const summary = await playerSummary(player);
    json(response, 200, {
      awardedPoints: Math.max(0, points - previousPoints),
      challengePoints: Math.max(points, previousPoints),
      improved: points > previousPoints,
      player: summary,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function listLeaderboard(url, response) {
  const period = url.searchParams.get("period") === "week" ? "week" : "all";
  const limit = Math.max(10, Math.min(100, Number(url.searchParams.get("limit")) || 50));
  const periodFilter = period === "week" ? "AND s.updated_at >= date_trunc('week', NOW())" : "";
  const result = await pool.query(
    `WITH totals AS (
       SELECT p.id,
              p.display_name AS name,
              COALESCE(SUM(s.points), 0)::int AS points,
              COUNT(s.id)::int AS completed,
              MAX(s.updated_at) AS last_active
         FROM leaderboard_players p
         LEFT JOIN leaderboard_scores s ON s.player_id = p.id ${periodFilter}
        WHERE p.is_blocked = FALSE
        GROUP BY p.id, p.display_name, p.created_at
     )
     SELECT RANK() OVER (ORDER BY points DESC, last_active ASC NULLS LAST, name ASC)::int AS position,
            name, points, completed
       FROM totals
      WHERE points > 0
      ORDER BY position ASC, name ASC
      LIMIT $1`,
    [limit],
  );
  json(response, 200, { period, leaderboard: result.rows });
}

async function handle(request, response) {
  setHeaders(request, response);
  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.end();
    return;
  }

  const url = new URL(request.url, "http://localhost");
  if (request.method === "GET" && url.pathname === "/api/health") {
    await pool.query("SELECT 1");
    json(response, 200, { ok: true });
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/players") return createPlayer(request, response);
  if (request.method === "PATCH" && url.pathname === "/api/players/me") return renamePlayer(request, response);
  if (request.method === "GET" && url.pathname === "/api/players/me") {
    const player = await authenticate(request);
    json(response, 200, { player: await playerSummary(player) });
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/challenges") return issueChallenge(request, response);
  if (request.method === "POST" && url.pathname === "/api/scores") return submitScore(request, response);
  if (request.method === "GET" && url.pathname === "/api/leaderboard") return listLeaderboard(url, response);
  throw new PublicError(404, "not_found", "Ruta no encontrada.");
}

await pool.query(SCHEMA_SQL);

const server = http.createServer((request, response) => {
  handle(request, response).catch((error) => {
    const status = error instanceof PublicError ? error.status : 500;
    if (!(error instanceof PublicError)) console.error(error);
    if (!response.headersSent) setHeaders(request, response);
    json(response, status, {
      error: error instanceof PublicError ? error.code : "internal_error",
      message: error instanceof PublicError ? error.message : "No fue posible procesar la solicitud.",
    });
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Sofia leaderboard API listening on port ${PORT}`);
});

function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
