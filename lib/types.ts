// ── Pricing & Plans ──
export type PlanType = "beat" | "double" | "war-room";
export type TierType = "free" | "all-access" | "league-newsroom";

export interface Plan {
  id: PlanType;
  name: string;
  description: string;
  contentRatio: number; // 0-100, %
  analyticsRatio: number; // 0-100, %
  builtFor: string;
}

export interface Tier {
  id: TierType;
  name: string;
  price: string; // "Free" | "$2.99/mo" | "$39/season"
  depth: "metered" | "full";
  leagues: number; // 1 | unlimited
  sharing: "watermarked" | "clean" | "league-branded";
}

export interface UserSubscription {
  userId: string;
  plan: PlanType;
  tier: TierType;
  leagueCount: number;
  expiresAt: string | null; // ISO date, null for free
  createdAt: string;
}

// ── League Data ──
export interface League {
  id: string;
  userId: string;
  platform: "sleeper" | "yahoo"; // ESPN is P2
  platformLeagueId: string;
  name: string;
  sport: "nfl"; // baseball, basketball, hockey later
  year: number;
  rosters: Roster[];
  settings: LeagueSettings;
  connectedAt: string;
}

export interface LeagueSettings {
  scoringFormat: "ppr" | "half-ppr" | "std";
  rosterSize: number;
  benchSize: number;
  maxTeams: number;
}

export interface Roster {
  id: string;
  leagueId: string;
  rosterId: number;
  ownerUserId: string; // maps to league user
  ownerName: string;
  players: string[]; // NFL player IDs
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
}

export interface RosterPlayer {
  playerId: string;
  name: string;
  position: string;
  nflTeam: string;
  slateStatus: "healthy" | "questionable" | "out" | "doubtful" | "probable";
  projectedPoints: number;
  actualPoints: number | null; // filled after game
}

// ── Projections & Analytics ──
export interface Projection {
  leagueId: string;
  week: number;
  playerId: string;
  playerName: string;
  position: string;
  nflTeam: string;
  opponent: string;
  projectedPoints: number;
  rank: number; // at position
  confidence: "high" | "medium" | "low";
  analysis: string; // brief AI explanation
  generatedAt: string;
  source: "open" | "commercial"; // nflverse vs. fallback feed
}

export interface TradeAnalysis {
  leagueId: string;
  week: number;
  userId: string;
  give: string[];
  receive: string[];
  verdict: "accept" | "decline" | "neutral";
  reasoning: string; // AI explanation
  generatedAt: string;
}

export interface WaiverRanking {
  leagueId: string;
  week: number;
  userId: string;
  recommendations: WaiverPick[];
  generatedAt: string;
}

export interface WaiverPick {
  playerId: string;
  playerName: string;
  position: string;
  rank: number;
  dropCandidate: string;
  reasoning: string;
}

export interface StartSitRecommendation {
  leagueId: string;
  week: number;
  userId: string;
  roster: RosterSlate;
  generatedAt: string;
}

export interface RosterSlate {
  lineup: { playerId: string; decision: "start" | "bench"; reasoning: string }[];
  summary: string; // AI explanation of the lineup
}

// ── Coverage ──
export interface Recap {
  leagueId: string;
  week: number;
  matchupId: string; // team1 vs team2
  title: string;
  body: string; // markdown
  mvp: string;
  lowlight: string;
  generatedAt: string;
  cached: boolean;
}

export interface RankingColumn {
  leagueId: string;
  week: number;
  title: string;
  body: string; // markdown
  rankings: { team: string; rank: number; commentary: string }[];
  generatedAt: string;
  cached: boolean;
}

export interface Storyline {
  leagueId: string;
  season: number;
  title: string;
  body: string;
  teams: string[];
  generatedAt: string;
  cached: boolean;
}

export interface Award {
  leagueId: string;
  week: number;
  title: string;
  winner: string;
  description: string;
  generatedAt: string;
  cached: boolean;
}

export interface Headline {
  leagueId: string;
  week: number;
  text: string;
  priority: "high" | "medium" | "low";
  generatedAt: string;
}

// ── Accuracy Tracking ──
export interface Prediction {
  id: string;
  type: "start-sit" | "projection" | "waiver-rank";
  leagueId: string;
  week: number;
  prediction: string;
  actual: number;
  error: number; // |predicted - actual|
  recordedAt: string;
  outcomeAt: string | null;
}

export interface AccuracyStats {
  metric: string;
  value: number;
  trend: number; // % vs last week
}

// ── Media & Sharing ──
export interface ShareableArtifact {
  id: string;
  leagueId: string;
  type: "recap" | "ranking" | "graphic";
  content: string; // URL or embed
  watermark: boolean;
  sharedAt: string;
  views: number;
  clicks: number;
}

export interface LeagueMediaHub {
  leagueId: string;
  artifacts: ShareableArtifact[];
  subscribers: number;
}

// ── Cache ──
export interface CachedContent {
  key: string; // hash of (leagueId, week, contentType)
  content: string;
  expiresAt: string;
  generatedAt: string;
}
