export type MatchType = "tournament" | "ranked" | "casual";

const K_BY_TYPE: Record<MatchType, number> = {
  tournament: 48,
  ranked: 32,
  casual: 16,
};

export function calculateElo(
  winnerRating: number,
  loserRating: number,
  matchType: MatchType = "ranked",
) {
  const K = K_BY_TYPE[matchType];
  const expected = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const delta = Math.round(K * (1 - expected));
  return {
    newWinner: winnerRating + delta,
    newLoser: Math.max(100, loserRating - delta),
    delta,
  };
}
