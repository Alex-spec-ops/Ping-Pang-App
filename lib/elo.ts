const K = 32;

export function calculateElo(winnerRating: number, loserRating: number) {
  const expected = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const delta = Math.round(K * (1 - expected));
  return {
    newWinner: winnerRating + delta,
    newLoser: Math.max(100, loserRating - delta),
    delta,
  };
}
