import { CURRENT_USER_ID, getMatchesForPlayer, players } from "./data";
import type { Match, Player } from "./types";

export type PlayerAnalytics = {
  totalMatches: number;
  rankedMatches: number;
  casualMatches: number;
  rankedWins: number;
  rankedLosses: number;
  rankedWinRate: number;
  casualWinRate: number;
  last5: ("V" | "D")[];
  bestStreak: number;
  currentStreak: number;
  pointsPerSet: number;
  pointsConcededPerSet: number;
  avgRatingDelta: number;
  bestWin?: { opponent: Player; delta: number; matchId: string };
  worstLoss?: { opponent: Player; delta: number; matchId: string };
  monthly: { month: string; matches: number; wins: number }[];
  setsWon: number;
  setsLost: number;
};

function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

export function getAnalytics(playerId = CURRENT_USER_ID): PlayerAnalytics {
  const all = getMatchesForPlayer(playerId, "all");
  const ranked = getMatchesForPlayer(playerId, "competitive");
  const casual = getMatchesForPlayer(playerId, "casual");

  const rankedWins = ranked.filter((m) => m.winnerId === playerId).length;
  const rankedLosses = ranked.length - rankedWins;
  const rankedWinRate =
    ranked.length > 0 ? Math.round((rankedWins / ranked.length) * 100) : 0;
  const casualWins = casual.filter((m) => m.winnerId === playerId).length;
  const casualWinRate =
    casual.length > 0 ? Math.round((casualWins / casual.length) * 100) : 0;

  const last5 = all
    .slice(0, 5)
    .map((m) => (m.winnerId === playerId ? "V" : "D")) as ("V" | "D")[];

  let best = 0;
  let cur = 0;
  for (const m of [...all].reverse()) {
    if (m.winnerId === playerId) {
      cur++;
      if (cur > best) best = cur;
    } else {
      cur = 0;
    }
  }
  let curStreak = 0;
  for (const m of all) {
    if (m.winnerId === playerId) curStreak++;
    else break;
  }

  let setsCount = 0;
  let totalPoints = 0;
  let totalConceded = 0;
  let setsWon = 0;
  let setsLost = 0;
  for (const m of all) {
    const isP1 = m.player1Id === playerId;
    for (const s of m.sets) {
      setsCount++;
      const my = isP1 ? s.p1 : s.p2;
      const opp = isP1 ? s.p2 : s.p1;
      totalPoints += my;
      totalConceded += opp;
      if (my > opp) setsWon++;
      else setsLost++;
    }
  }
  const pps = setsCount > 0 ? +(totalPoints / setsCount).toFixed(1) : 0;
  const ppsAgainst =
    setsCount > 0 ? +(totalConceded / setsCount).toFixed(1) : 0;

  // Rating deltas
  let totalDelta = 0;
  let deltaCount = 0;
  let bestWin: PlayerAnalytics["bestWin"];
  let worstLoss: PlayerAnalytics["worstLoss"];
  for (const m of ranked) {
    if (!m.ratingChange) continue;
    const isP1 = m.player1Id === playerId;
    const d = isP1 ? m.ratingChange.p1 : m.ratingChange.p2;
    totalDelta += d;
    deltaCount++;
    const oppId = isP1 ? m.player2Id : m.player1Id;
    const opp = players.find((p) => p.id === oppId);
    if (!opp) continue;
    if (d > 0 && (!bestWin || d > bestWin.delta)) {
      bestWin = { opponent: opp, delta: d, matchId: m.id };
    }
    if (d < 0 && (!worstLoss || d < worstLoss.delta)) {
      worstLoss = { opponent: opp, delta: d, matchId: m.id };
    }
  }
  const avgRatingDelta =
    deltaCount > 0 ? +(totalDelta / deltaCount).toFixed(1) : 0;

  // Monthly aggregation
  const byMonth = new Map<string, { matches: number; wins: number }>();
  for (const m of all) {
    const k = monthKey(m.playedAt);
    const entry = byMonth.get(k) ?? { matches: 0, wins: 0 };
    entry.matches++;
    if (m.winnerId === playerId) entry.wins++;
    byMonth.set(k, entry);
  }
  const monthly = [...byMonth.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, v]) => ({ month, ...v }));

  return {
    totalMatches: all.length,
    rankedMatches: ranked.length,
    casualMatches: casual.length,
    rankedWins,
    rankedLosses,
    rankedWinRate,
    casualWinRate,
    last5,
    bestStreak: best,
    currentStreak: curStreak,
    pointsPerSet: pps,
    pointsConcededPerSet: ppsAgainst,
    avgRatingDelta,
    bestWin,
    worstLoss,
    monthly,
    setsWon,
    setsLost,
  };
}

export type OpponentStat = {
  player: Player;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
};

export function getOpponentBreakdown(playerId = CURRENT_USER_ID): OpponentStat[] {
  const all = getMatchesForPlayer(playerId, "all");
  const byOpp = new Map<string, { matches: number; wins: number; losses: number }>();
  for (const m of all) {
    const oppId = m.player1Id === playerId ? m.player2Id : m.player1Id;
    const entry = byOpp.get(oppId) ?? { matches: 0, wins: 0, losses: 0 };
    entry.matches++;
    if (m.winnerId === playerId) entry.wins++;
    else entry.losses++;
    byOpp.set(oppId, entry);
  }
  return [...byOpp.entries()]
    .map(([oppId, v]) => {
      const player = players.find((p) => p.id === oppId);
      if (!player) return null;
      return {
        player,
        matches: v.matches,
        wins: v.wins,
        losses: v.losses,
        winRate: Math.round((v.wins / v.matches) * 100),
      };
    })
    .filter((x): x is OpponentStat => x !== null)
    .sort((a, b) => b.matches - a.matches);
}
