export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS leaderboard_players (
  id UUID PRIMARY KEY,
  display_name VARCHAR(20) NOT NULL,
  normalized_name VARCHAR(20) NOT NULL UNIQUE,
  token_hash CHAR(64) NOT NULL UNIQUE,
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leaderboard_scores (
  id UUID PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES leaderboard_players(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL,
  activity VARCHAR(24) NOT NULL,
  difficulty VARCHAR(12) NOT NULL,
  chapter VARCHAR(24) NOT NULL,
  seed BIGINT NOT NULL,
  points INTEGER NOT NULL CHECK (points >= 0 AND points <= 300),
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0),
  hints_used INTEGER NOT NULL DEFAULT 0 CHECK (hints_used BETWEEN 0 AND 3),
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (player_id, activity, difficulty, chapter)
);

CREATE INDEX IF NOT EXISTS leaderboard_scores_player_idx
  ON leaderboard_scores (player_id);

CREATE INDEX IF NOT EXISTS leaderboard_scores_updated_idx
  ON leaderboard_scores (updated_at DESC);
`;
