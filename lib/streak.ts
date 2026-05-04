import type { Match } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type WeekStatus =
  | "active"           // past week with ≥1 match
  | "missed"           // past week with 0 matches
  | "frozen"           // freeze token used (Premium)
  | "current-active"   // current week, already has a match
  | "current-pending"  // current week, no match yet, early (Mon–Wed)
  | "current-risk";    // current week, no match yet, late (Thu–Sun)

export type WeekData = {
  key: string;         // "YYYY-MM-DD" of Monday
  label: string;       // "28 avr"
  matchCount: number;
  status: WeekStatus;
};

export type DayDot = {
  short: string;       // "L", "M", "M", "J", "V", "S", "D"
  active: boolean;
  isToday: boolean;
};

export type StreakBadge = {
  weeks: number;
  emoji: string;
  label: string;
  description: string;
  unlocked: boolean;
};

export type StreakData = {
  current: number;
  longest: number;
  isAtRisk: boolean;
  currentWeekMatchCount: number;
  weekHistory: WeekData[];  // 12 weeks oldest→newest (index 11 = current)
  dailyDots: DayDot[];      // 7 days oldest→newest (index 6 = today)
  badges: StreakBadge[];
  isPremium: boolean;
  frozenWeeksLeft: number;
};

// ─── UTC date helpers ─────────────────────────────────────────────────────────

function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const dow = d.getUTCDay(); // 0 = Sun
  d.setUTCDate(d.getUTCDate() + (dow === 0 ? -6 : 1 - dow));
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + n);
  return d;
}

function toKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const DAY_SHORT_FR = ["D", "L", "M", "M", "J", "V", "S"];
const MONTHS_FR = [
  "jan", "fév", "mar", "avr", "mai", "jun",
  "jul", "aoû", "sep", "oct", "nov", "déc",
];

function fmtWeekLabel(monday: Date): string {
  return `${monday.getUTCDate()} ${MONTHS_FR[monday.getUTCMonth()]}`;
}

// ─── Mock history for player p5 (demo purposes) ───────────────────────────────
// Fills out a realistic 7-week streak that the sparse matches array can't provide.

const MOCK_P5_DATES: string[] = [
  // Week Apr 13–19 → 3 matches
  "2026-04-14T18:00:00Z",
  "2026-04-16T19:30:00Z",
  "2026-04-18T20:00:00Z",
  // Week Apr 6–12 → 1 match
  "2026-04-08T19:00:00Z",
  // Week Mar 30 – Apr 5 → 2 matches
  "2026-04-01T18:00:00Z",
  "2026-04-03T20:00:00Z",
  // Week Mar 23–29 → 1 match
  "2026-03-25T19:00:00Z",
  // Week Mar 16–22 → 2 matches
  "2026-03-17T18:00:00Z",
  "2026-03-20T19:30:00Z",
  // Week Feb 23 – Mar 1 → 1 match (old streak before the gap)
  "2026-02-25T19:00:00Z",
];

// ─── Main export ──────────────────────────────────────────────────────────────

export function getStreakData(
  playerId: string,
  allMatches: Match[],
  today: Date = new Date(),
  isPremium = false,
  frozenWeeksLeft = 0,
): StreakData {
  const thisMonday = getMondayOf(today);
  const dow = today.getUTCDay();
  const lateInWeek = dow === 0 || dow >= 4; // Thu(4) Fri(5) Sat(6) Sun(0)

  // Build weekKey → matchCount map from real matches
  const countMap: Record<string, number> = {};
  const playerMatches = allMatches.filter(
    (m) => m.player1Id === playerId || m.player2Id === playerId,
  );
  for (const m of playerMatches) {
    const k = toKey(getMondayOf(new Date(m.playedAt)));
    countMap[k] = (countMap[k] ?? 0) + 1;
  }

  // Inject mock data for p5 demo
  if (playerId === "p5") {
    for (const ds of MOCK_P5_DATES) {
      const k = toKey(getMondayOf(new Date(ds)));
      countMap[k] = (countMap[k] ?? 0) + 1;
    }
  }

  // Build daily match date set for the dot calendar
  const matchDaySet = new Set<string>();
  for (const m of playerMatches) {
    matchDaySet.add(toKey(new Date(m.playedAt)));
  }
  if (playerId === "p5") {
    for (const ds of MOCK_P5_DATES) {
      matchDaySet.add(toKey(new Date(ds)));
    }
  }

  // 12-week history: index 0 = oldest (11 weeks back), index 11 = current week
  const weekHistory: WeekData[] = [];
  for (let i = 0; i < 12; i++) {
    const monday = addDays(thisMonday, -(11 - i) * 7);
    const k = toKey(monday);
    const count = countMap[k] ?? 0;
    const isCurrent = i === 11;

    let status: WeekStatus;
    if (isCurrent) {
      if (frozenWeeksLeft > 0) {
        status = "frozen";
      } else if (count > 0) {
        status = "current-active";
      } else if (lateInWeek) {
        status = "current-risk";
      } else {
        status = "current-pending";
      }
    } else {
      status = count > 0 ? "active" : "missed";
    }

    weekHistory.push({ key: k, label: fmtWeekLabel(monday), matchCount: count, status });
  }

  // Current streak: count backward from last completed week
  // (include current week only if it already has a match or is frozen)
  const currentWeek = weekHistory[11];
  const startIdx =
    currentWeek.matchCount > 0 || currentWeek.status === "frozen" ? 11 : 10;

  let current = 0;
  for (let i = startIdx; i >= 0; i--) {
    const w = weekHistory[i];
    if (w.matchCount > 0 || w.status === "frozen") {
      current++;
    } else {
      break;
    }
  }

  // Longest streak within the 12-week window
  let longest = 0;
  let run = 0;
  for (let i = 0; i < 12; i++) {
    const w = weekHistory[i];
    // Don't penalise the in-progress current week
    if (i === 11 && w.matchCount === 0 && w.status !== "frozen") continue;
    if (w.matchCount > 0 || w.status === "frozen") {
      run++;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
  }
  if (current > longest) longest = current;

  // Daily dots: 7 days ending with today (index 0 = 6 days ago, index 6 = today)
  const dailyDots: DayDot[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today, -i);
    dailyDots.push({
      short: DAY_SHORT_FR[d.getUTCDay()],
      active: matchDaySet.has(toKey(d)),
      isToday: i === 0,
    });
  }

  // Badges
  const badges: StreakBadge[] = [
    { weeks: 4,  emoji: "🥈", label: "Régulier",   description: "4 semaines",  unlocked: longest >= 4  },
    { weeks: 12, emoji: "🥇", label: "Acharné",    description: "12 semaines", unlocked: longest >= 12 },
    { weeks: 26, emoji: "💎", label: "Diamant",    description: "6 mois",      unlocked: longest >= 26 },
    { weeks: 52, emoji: "👑", label: "Légendaire", description: "1 an",        unlocked: longest >= 52 },
  ];

  const isAtRisk = lateInWeek && currentWeek.matchCount === 0 && current > 0;

  return {
    current,
    longest,
    isAtRisk,
    currentWeekMatchCount: currentWeek.matchCount,
    weekHistory,
    dailyDots,
    badges,
    isPremium,
    frozenWeeksLeft,
  };
}
