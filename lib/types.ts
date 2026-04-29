export type Player = {
  id: string;
  username: string;
  fullName: string;
  country: string;
  countryFlag: string;
  city: string;
  club?: string;
  avatar: string;
  rating: number;
  peakRating: number;
  rankedWins: number;
  rankedLosses: number;
  casualWins: number;
  casualLosses: number;
  followers: number;
  bio?: string;
};

export type SetScore = { p1: number; p2: number };

export type MatchMode = "ranked" | "casual" | "tournament";

export type Match = {
  id: string;
  player1Id: string;
  player2Id: string;
  sets: SetScore[];
  winnerId: string;
  ratingChange?: { p1: number; p2: number };
  playedAt: string;
  venue?: string;
  format: "BO3" | "BO5" | "BO7";
  mode: MatchMode;
};

export function isCompetitive(mode: MatchMode): boolean {
  return mode !== "casual";
}

export type ActivityKind = "match" | "training" | "achievement" | "follow";

export type Activity = {
  id: string;
  kind: ActivityKind;
  playerId: string;
  createdAt: string;
  matchId?: string;
  trainingMinutes?: number;
  trainingTitle?: string;
  achievementTitle?: string;
  targetPlayerId?: string;
  likes: number;
  comments: number;
};

export type LiveMatch = {
  id: string;
  player1Id: string;
  player2Id: string;
  sets: SetScore[];
  currentSet: SetScore;
  format: "BO3" | "BO5" | "BO7";
  viewers: number;
};
