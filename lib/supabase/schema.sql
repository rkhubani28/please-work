-- ── Users & Subscriptions ──
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('beat', 'double', 'war-room')),
  tier TEXT NOT NULL CHECK (tier IN ('free', 'all-access', 'league-newsroom')),
  league_count INT DEFAULT 1,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id)
);

-- ── Leagues ──
CREATE TABLE IF NOT EXISTS leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('sleeper', 'yahoo')),
  platform_league_id TEXT NOT NULL,
  league_name TEXT NOT NULL,
  sport TEXT DEFAULT 'nfl',
  year INT,
  scoring_format TEXT CHECK (scoring_format IN ('ppr', 'half-ppr', 'std')),
  roster_size INT,
  bench_size INT,
  max_teams INT,
  connected_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, platform, platform_league_id)
);

-- ── Rosters ──
CREATE TABLE IF NOT EXISTS rosters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  roster_id INT,
  owner_user_id TEXT,
  owner_name TEXT NOT NULL,
  players TEXT[] DEFAULT '{}',
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  points_for FLOAT DEFAULT 0,
  points_against FLOAT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT now()
);

-- ── Projections ──
CREATE TABLE IF NOT EXISTS projections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  week INT NOT NULL,
  player_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  position TEXT,
  nfl_team TEXT,
  opponent TEXT,
  projected_points FLOAT,
  rank INT,
  confidence TEXT,
  analysis TEXT,
  source TEXT,
  generated_at TIMESTAMP DEFAULT now(),
  UNIQUE(league_id, week, player_id)
);

-- ── Trade Analysis ──
CREATE TABLE IF NOT EXISTS trade_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  week INT,
  user_id TEXT NOT NULL,
  give TEXT[] NOT NULL,
  receive TEXT[] NOT NULL,
  verdict TEXT NOT NULL,
  reasoning TEXT,
  generated_at TIMESTAMP DEFAULT now()
);

-- ── Waiver Rankings ──
CREATE TABLE IF NOT EXISTS waiver_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  week INT,
  user_id TEXT NOT NULL,
  recommendations JSONB,
  generated_at TIMESTAMP DEFAULT now()
);

-- ── Start/Sit Recommendations ──
CREATE TABLE IF NOT EXISTS start_sit_recs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  week INT NOT NULL,
  user_id TEXT NOT NULL,
  roster_slate JSONB,
  summary TEXT,
  generated_at TIMESTAMP DEFAULT now(),
  UNIQUE(league_id, week, user_id)
);

-- ── Coverage: Recaps ──
CREATE TABLE IF NOT EXISTS recaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  week INT NOT NULL,
  matchup_id TEXT,
  title TEXT NOT NULL,
  body TEXT,
  mvp TEXT,
  lowlight TEXT,
  generated_at TIMESTAMP DEFAULT now(),
  cached BOOLEAN DEFAULT false,
  UNIQUE(league_id, week, matchup_id)
);

-- ── Coverage: Ranking Columns ──
CREATE TABLE IF NOT EXISTS ranking_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  week INT NOT NULL,
  title TEXT,
  body TEXT,
  rankings JSONB,
  generated_at TIMESTAMP DEFAULT now(),
  cached BOOLEAN DEFAULT false,
  UNIQUE(league_id, week)
);

-- ── Coverage: Storylines ──
CREATE TABLE IF NOT EXISTS storylines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  season INT,
  title TEXT NOT NULL,
  body TEXT,
  teams TEXT[] DEFAULT '{}',
  generated_at TIMESTAMP DEFAULT now(),
  cached BOOLEAN DEFAULT false
);

-- ── Coverage: Awards ──
CREATE TABLE IF NOT EXISTS awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  week INT NOT NULL,
  title TEXT NOT NULL,
  winner TEXT NOT NULL,
  description TEXT,
  generated_at TIMESTAMP DEFAULT now(),
  cached BOOLEAN DEFAULT false
);

-- ── Coverage: Headlines ──
CREATE TABLE IF NOT EXISTS headlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  week INT NOT NULL,
  text TEXT NOT NULL,
  priority TEXT,
  generated_at TIMESTAMP DEFAULT now()
);

-- ── Accuracy Tracking ──
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  week INT NOT NULL,
  prediction FLOAT,
  actual FLOAT,
  error FLOAT,
  recorded_at TIMESTAMP DEFAULT now(),
  outcome_at TIMESTAMP
);

-- ── Cache ──
CREATE TABLE IF NOT EXISTS cached_content (
  key TEXT PRIMARY KEY,
  content TEXT,
  expires_at TIMESTAMP,
  generated_at TIMESTAMP DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_leagues_user ON leagues(user_id);
CREATE INDEX IF NOT EXISTS idx_projections_league_week ON projections(league_id, week);
CREATE INDEX IF NOT EXISTS idx_recaps_league_week ON recaps(league_id, week);
CREATE INDEX IF NOT EXISTS idx_ranking_columns_league_week ON ranking_columns(league_id, week);
CREATE INDEX IF NOT EXISTS idx_predictions_league_week ON predictions(league_id, week);
