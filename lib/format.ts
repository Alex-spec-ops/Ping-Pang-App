export function timeAgo(iso: string, now = new Date()): string {
  const then = new Date(iso).getTime();
  const diffSec = Math.max(1, Math.floor((now.getTime() - then) / 1000));
  if (diffSec < 60) return `${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD} j`;
  const diffW = Math.floor(diffD / 7);
  if (diffW < 5) return `${diffW} sem`;
  const diffMo = Math.floor(diffD / 30);
  if (diffMo < 12) return `${diffMo} mois`;
  return `${Math.floor(diffD / 365)} an${diffD >= 730 ? "s" : ""}`;
}

export function setScoreLine(
  sets: { p1: number; p2: number }[],
): string {
  return sets.map((s) => `${s.p1}-${s.p2}`).join(", ");
}

export function setsWon(
  sets: { p1: number; p2: number }[],
): { p1: number; p2: number } {
  return sets.reduce(
    (acc, s) => ({
      p1: acc.p1 + (s.p1 > s.p2 ? 1 : 0),
      p2: acc.p2 + (s.p2 > s.p1 ? 1 : 0),
    }),
    { p1: 0, p2: 0 },
  );
}
