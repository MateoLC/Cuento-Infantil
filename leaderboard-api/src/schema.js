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

CREATE TABLE IF NOT EXISTS analytics_counters (
  counter_key VARCHAR(40) PRIMARY KEY,
  counter_value BIGINT NOT NULL DEFAULT 0 CHECK (counter_value >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO analytics_counters (counter_key, counter_value)
VALUES ('total_explorers', 0)
ON CONFLICT (counter_key) DO NOTHING;

CREATE TABLE IF NOT EXISTS analytics_visitors (
  visitor_hash CHAR(64) PRIMARY KEY,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_sessions (
  session_hash CHAR(64) PRIMARY KEY,
  visitor_hash CHAR(64) NOT NULL REFERENCES analytics_visitors(visitor_hash) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_pageviews (
  id BIGSERIAL PRIMARY KEY,
  session_hash CHAR(64) NOT NULL REFERENCES analytics_sessions(session_hash) ON DELETE CASCADE,
  page_path VARCHAR(160) NOT NULL,
  view_bucket BIGINT NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_hash, page_path, view_bucket)
);

CREATE INDEX IF NOT EXISTS analytics_visitors_last_seen_idx
  ON analytics_visitors (last_seen_at);

CREATE INDEX IF NOT EXISTS analytics_pageviews_viewed_idx
  ON analytics_pageviews (viewed_at DESC);
`;
