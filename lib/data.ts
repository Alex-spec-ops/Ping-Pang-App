import type { Activity, LiveMatch, Match, MatchMode, Player } from "./types";
import { isCompetitive } from "./types";

export const players: Player[] = [
  {
    id: "p1",
    username: "felix_fr",
    fullName: "Félix Lebrun",
    country: "France",
    countryFlag: "🇫🇷",
    city: "Montpellier",
    club: "Montpellier TT",
    avatar: "🦊",
    rating: 2812,
    peakRating: 2845,
    rankedWins: 218,
    rankedLosses: 41,
    casualWins: 64,
    casualLosses: 22,
    followers: 18420,
    bio: "Pongiste pro. Service court, attaque rapide.",
  },
  {
    id: "p2",
    username: "alexis_lebrun",
    fullName: "Alexis Lebrun",
    country: "France",
    countryFlag: "🇫🇷",
    city: "Montpellier",
    club: "Montpellier TT",
    avatar: "🐺",
    rating: 2778,
    peakRating: 2790,
    rankedWins: 195,
    rankedLosses: 38,
    casualWins: 51,
    casualLosses: 19,
    followers: 14210,
  },
  {
    id: "p3",
    username: "wang_chuqin",
    fullName: "Wang Chuqin",
    country: "Chine",
    countryFlag: "🇨🇳",
    city: "Pékin",
    avatar: "🐉",
    rating: 2901,
    peakRating: 2912,
    rankedWins: 312,
    rankedLosses: 27,
    casualWins: 88,
    casualLosses: 14,
    followers: 92110,
  },
  {
    id: "p4",
    username: "tomokazu",
    fullName: "Tomokazu Harimoto",
    country: "Japon",
    countryFlag: "🇯🇵",
    city: "Tokyo",
    avatar: "🦅",
    rating: 2802,
    peakRating: 2815,
    rankedWins: 240,
    rankedLosses: 44,
    casualWins: 70,
    casualLosses: 25,
    followers: 31040,
  },
  {
    id: "p5",
    username: "leon_amateur",
    fullName: "Léon Le Calvez",
    country: "France",
    countryFlag: "🇫🇷",
    city: "Paris",
    club: "Paris 13 TT",
    avatar: "🐧",
    rating: 1487,
    peakRating: 1502,
    rankedWins: 34,
    rankedLosses: 29,
    casualWins: 52,
    casualLosses: 47,
    followers: 12,
    bio: "Coup droit topspin, revers bloc. En progression.",
  },
  {
    id: "p6",
    username: "marie_smash",
    fullName: "Marie Dubois",
    country: "France",
    countryFlag: "🇫🇷",
    city: "Lyon",
    club: "Lyon TT",
    avatar: "🦋",
    rating: 1820,
    peakRating: 1840,
    rankedWins: 88,
    rankedLosses: 51,
    casualWins: 33,
    casualLosses: 30,
    followers: 240,
  },
  {
    id: "p7",
    username: "diaz_es",
    fullName: "Carlos Diaz",
    country: "Espagne",
    countryFlag: "🇪🇸",
    city: "Barcelone",
    avatar: "🐂",
    rating: 1965,
    peakRating: 1980,
    rankedWins: 110,
    rankedLosses: 60,
    casualWins: 41,
    casualLosses: 33,
    followers: 540,
  },
  {
    id: "p8",
    username: "sofia_de",
    fullName: "Sofia Müller",
    country: "Allemagne",
    countryFlag: "🇩🇪",
    city: "Berlin",
    avatar: "🦌",
    rating: 2040,
    peakRating: 2055,
    rankedWins: 132,
    rankedLosses: 70,
    casualWins: 48,
    casualLosses: 36,
    followers: 880,
  },
];

export const CURRENT_USER_ID = "p5";

export const matches: Match[] = [
  {
    id: "m1",
    player1Id: "p5",
    player2Id: "p6",
    sets: [
      { p1: 11, p2: 8 },
      { p1: 9, p2: 11 },
      { p1: 11, p2: 7 },
      { p1: 11, p2: 9 },
    ],
    winnerId: "p5",
    ratingChange: { p1: 18, p2: -18 },
    playedAt: "2026-04-28T19:30:00Z",
    venue: "Paris 13 TT",
    format: "BO5",
    mode: "ranked",
  },
  {
    id: "m2",
    player1Id: "p1",
    player2Id: "p3",
    sets: [
      { p1: 11, p2: 9 },
      { p1: 8, p2: 11 },
      { p1: 11, p2: 13 },
      { p1: 11, p2: 6 },
      { p1: 9, p2: 11 },
    ],
    winnerId: "p3",
    ratingChange: { p1: -8, p2: 8 },
    playedAt: "2026-04-27T16:00:00Z",
    venue: "WTT Champions",
    format: "BO5",
    mode: "tournament",
  },
  {
    id: "m3",
    player1Id: "p7",
    player2Id: "p8",
    sets: [
      { p1: 11, p2: 6 },
      { p1: 11, p2: 9 },
      { p1: 11, p2: 8 },
    ],
    winnerId: "p7",
    ratingChange: { p1: 14, p2: -14 },
    playedAt: "2026-04-28T11:00:00Z",
    format: "BO5",
    mode: "ranked",
  },
  {
    id: "m4",
    player1Id: "p5",
    player2Id: "p7",
    sets: [
      { p1: 6, p2: 11 },
      { p1: 8, p2: 11 },
      { p1: 7, p2: 11 },
    ],
    winnerId: "p7",
    ratingChange: { p1: -22, p2: 22 },
    playedAt: "2026-04-22T18:00:00Z",
    format: "BO5",
    mode: "ranked",
  },
  {
    id: "m5",
    player1Id: "p5",
    player2Id: "p2",
    sets: [
      { p1: 8, p2: 11 },
      { p1: 11, p2: 9 },
      { p1: 6, p2: 11 },
    ],
    winnerId: "p2",
    playedAt: "2026-04-25T20:00:00Z",
    venue: "Paris 13 TT — Open Day",
    format: "BO5",
    mode: "casual",
  },
];

export const activities: Activity[] = [
  {
    id: "a1",
    kind: "match",
    playerId: "p5",
    matchId: "m1",
    createdAt: "2026-04-28T20:00:00Z",
    likes: 7,
    comments: 2,
  },
  {
    id: "a2",
    kind: "training",
    playerId: "p5",
    trainingMinutes: 90,
    trainingTitle: "Service + 3e balle (panier)",
    createdAt: "2026-04-27T18:30:00Z",
    likes: 4,
    comments: 1,
  },
  {
    id: "a3",
    kind: "match",
    playerId: "p1",
    matchId: "m2",
    createdAt: "2026-04-27T17:00:00Z",
    likes: 1820,
    comments: 134,
  },
  {
    id: "a4",
    kind: "achievement",
    playerId: "p5",
    achievementTitle: "Premier 1500 ELO atteint 🎉",
    createdAt: "2026-04-26T22:10:00Z",
    likes: 18,
    comments: 5,
  },
  {
    id: "a5",
    kind: "training",
    playerId: "p6",
    trainingMinutes: 60,
    trainingTitle: "Footwork latéral",
    createdAt: "2026-04-26T08:00:00Z",
    likes: 12,
    comments: 0,
  },
  {
    id: "a6",
    kind: "match",
    playerId: "p7",
    matchId: "m3",
    createdAt: "2026-04-28T11:30:00Z",
    likes: 22,
    comments: 3,
  },
  {
    id: "a7",
    kind: "match",
    playerId: "p5",
    matchId: "m5",
    createdAt: "2026-04-25T20:30:00Z",
    likes: 9,
    comments: 4,
  },
];

export const liveMatches: LiveMatch[] = [
  {
    id: "lm1",
    player1Id: "p3",
    player2Id: "p4",
    sets: [
      { p1: 11, p2: 8 },
      { p1: 9, p2: 11 },
    ],
    currentSet: { p1: 7, p2: 5 },
    format: "BO5",
    viewers: 4280,
  },
  {
    id: "lm2",
    player1Id: "p2",
    player2Id: "p8",
    sets: [{ p1: 11, p2: 6 }],
    currentSet: { p1: 4, p2: 3 },
    format: "BO5",
    viewers: 612,
  },
];

export function getPlayer(id: string): Player | undefined {
  return players.find((p) => p.id === id);
}

export function getMatch(id: string): Match | undefined {
  return matches.find((m) => m.id === id);
}

export function getMatchesForPlayer(
  id: string,
  filter: "all" | "competitive" | "casual" = "all",
): Match[] {
  return matches
    .filter((m) => m.player1Id === id || m.player2Id === id)
    .filter((m) => {
      if (filter === "all") return true;
      if (filter === "casual") return m.mode === "casual";
      return isCompetitive(m.mode);
    })
    .sort((a, b) => b.playedAt.localeCompare(a.playedAt));
}

export function getMatchModeLabel(mode: MatchMode): string {
  if (mode === "tournament") return "Tournoi";
  if (mode === "ranked") return "Classé";
  return "Amical";
}

export function getActivitiesSorted(): Activity[] {
  return [...activities].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function getLeaderboard(): Player[] {
  return [...players].sort((a, b) => b.rating - a.rating);
}
