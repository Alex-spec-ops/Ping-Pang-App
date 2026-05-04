import { matches, players, CURRENT_USER_ID } from "./data";
import type { Match } from "./types";

// ── Types ──────────────────────────────────────────────────────────────────────

export type SubscriptionPlan = "free" | "premium";

export type Badge = {
  id: string;
  emoji: string;
  label: string;
  description: string;
  condition: string;
  unlocked: boolean;
  rare?: boolean;
};

export type ProfileStats = {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  currentStreak: number;
  level: string;
  levelColor: string;
  headerGradient: string;
  ratingElo: number;
};

export type DayPoint = { date: string; rating: number };

export type SubscriptionInfo = {
  plan: SubscriptionPlan;
  activitiesThisMonth: number;
  renewalDate: string;
  discount: number; // 0, 1, 2 or 3
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function computeLevel(rating: number): { level: string; color: string; gradient: string } {
  if (rating >= 2500) return { level: "Élite", color: "#f59e0b", gradient: "from-amber-600 via-orange-500 to-yellow-400" };
  if (rating >= 2000) return { level: "Expert", color: "#8b5cf6", gradient: "from-violet-700 via-purple-600 to-indigo-500" };
  if (rating >= 1700) return { level: "Avancé", color: "#3b82f6", gradient: "from-blue-700 via-blue-500 to-cyan-400" };
  if (rating >= 1400) return { level: "Intermédiaire", color: "#10b981", gradient: "from-emerald-700 via-emerald-500 to-teal-400" };
  return { level: "Débutant", color: "#6b7280", gradient: "from-zinc-600 via-zinc-500 to-zinc-400" };
}

export function getProfileStats(playerId: string): ProfileStats {
  const player = players.find((p) => p.id === playerId);
  if (!player) throw new Error("Player not found");

  const playerMatches = matches.filter(
    (m) => m.player1Id === playerId || m.player2Id === playerId,
  );
  const wins = playerMatches.filter((m) => m.winnerId === playerId).length;
  const losses = playerMatches.length - wins;
  const totalMatches = player.rankedWins + player.rankedLosses + player.casualWins + player.casualLosses;
  const totalWins = player.rankedWins + player.casualWins;
  const totalLosses = player.rankedLosses + player.casualLosses;
  const winRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;

  // Simple streak from sorted matches
  const sorted = [...playerMatches].sort((a, b) => b.playedAt.localeCompare(a.playedAt));
  let streak = 0;
  for (const m of sorted) {
    if (m.winnerId === playerId) streak++;
    else break;
  }

  const { level, color, gradient } = computeLevel(player.rating);

  return {
    totalMatches,
    wins: totalWins,
    losses: totalLosses,
    winRate,
    currentStreak: streak,
    level,
    levelColor: color,
    headerGradient: gradient,
    ratingElo: player.rating,
  };
}

// ── 30-day progress chart (mock) ───────────────────────────────────────────────

export function getProgressionData(playerId: string): DayPoint[] {
  const player = players.find((p) => p.id === playerId);
  if (!player) return [];

  const base = player.rating - 120;
  const today = new Date("2026-05-04");
  const points: DayPoint[] = [];
  let r = base;
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const noise = (Math.sin(i * 0.7 + playerId.length) * 18 + Math.cos(i * 1.3) * 10);
    r = Math.round(Math.max(base - 30, Math.min(player.rating + 10, r + noise)));
    points.push({ date: d.toISOString().slice(0, 10), rating: r });
  }
  // Force last point to current rating
  points[points.length - 1].rating = player.rating;
  return points;
}

// ── Badges ─────────────────────────────────────────────────────────────────────

export function getBadges(playerId: string): Badge[] {
  const player = players.find((p) => p.id === playerId);
  if (!player) return [];

  const totalMatches = player.rankedWins + player.rankedLosses + player.casualWins + player.casualLosses;
  const totalWins = player.rankedWins + player.casualWins;

  return [
    {
      id: "first_win",
      emoji: "🏓",
      label: "Première victoire",
      description: "Remporter son tout premier match.",
      condition: "Gagner 1 match",
      unlocked: totalWins >= 1,
    },
    {
      id: "streak_10",
      emoji: "🔥",
      label: "Streak 10 semaines",
      description: "Jouer au moins un match chaque semaine pendant 10 semaines de suite.",
      condition: "Streak de 10 semaines",
      unlocked: player.rankedWins >= 50,
      rare: true,
    },
    {
      id: "100_matches",
      emoji: "💯",
      label: "100 matchs joués",
      description: "Atteindre 100 matchs enregistrés toutes catégories confondues.",
      condition: "100 matchs joués",
      unlocked: totalMatches >= 100,
    },
    {
      id: "club_champ",
      emoji: "🏆",
      label: "Champion du club",
      description: "Remporter un tournoi officiel de son club.",
      condition: "Gagner un tournoi club",
      unlocked: player.rating >= 2000,
      rare: true,
    },
    {
      id: "explorer",
      emoji: "🗺️",
      label: "Explorateur",
      description: "Jouer dans 10 lieux différents.",
      condition: "10 lieux visités",
      unlocked: player.rankedWins >= 80,
    },
    {
      id: "ranked_200",
      emoji: "📈",
      label: "200 matchs classés",
      description: "Jouer 200 matchs en mode classé.",
      condition: "200 matchs classés",
      unlocked: player.rankedWins + player.rankedLosses >= 200,
    },
    {
      id: "winrate_70",
      emoji: "⚡",
      label: "Machine à gagner",
      description: "Maintenir un taux de victoire ≥ 70 % sur 50 matchs.",
      condition: "70 % win-rate sur 50 matchs",
      unlocked: player.rating >= 2700,
      rare: true,
    },
    {
      id: "social",
      emoji: "🤝",
      label: "Connecté",
      description: "Avoir plus de 100 abonnés.",
      condition: "100+ abonnés",
      unlocked: player.followers >= 100,
    },
  ];
}

// ── Subscription ───────────────────────────────────────────────────────────────

export function getSubscriptionInfo(playerId: string): SubscriptionInfo {
  // p1 = Premium, others = free (demo)
  const isPremium = playerId === "p1" || playerId === "p3";
  const activitiesThisMonth = isPremium ? 18 : 6;
  let discount = 0;
  if (activitiesThisMonth >= 25) discount = 2;
  else if (activitiesThisMonth >= 12) discount = 1;

  return {
    plan: isPremium ? "premium" : "free",
    activitiesThisMonth,
    renewalDate: "2026-06-01",
    discount,
  };
}

// ── Current user subscription (CURRENT_USER_ID = p5 → free) ───────────────────

export const CURRENT_SUBSCRIPTION = getSubscriptionInfo(CURRENT_USER_ID);
