"use client";

import type { StreakData } from "../lib/streak";

export default function StreakHero({ data }: { data: StreakData }) {
  const {
    current,
    longest,
    isAtRisk,
    currentWeekMatchCount,
    dailyDots,
    isPremium,
    frozenWeeksLeft,
  } = data;

  const isBroken = current === 0 && currentWeekMatchCount === 0;
  const isCurrentActive = currentWeekMatchCount > 0;

  // Card gradient + accent
  let gradFrom: string;
  let gradTo: string;
  let accentText: string;
  let statusLabel: string;

  if (isBroken) {
    gradFrom = "#18181b"; // zinc-900
    gradTo = "#27272a";   // zinc-800
    accentText = "#a1a1aa";
    statusLabel = "Streak perdu";
  } else if (isAtRisk) {
    gradFrom = "#7c2d12"; // orange-900
    gradTo = "#92400e";   // amber-800
    accentText = "#fcd34d";
    statusLabel = "⚠️ En danger !";
  } else if (isCurrentActive) {
    gradFrom = "#064e3b"; // emerald-900
    gradTo = "#065f46";   // emerald-800
    accentText = "#6ee7b7";
    statusLabel = "✓ Semaine validée";
  } else {
    gradFrom = "#022c22"; // emerald-950
    gradTo = "#064e3b";   // emerald-900
    accentText = "#34d399";
    statusLabel = "Joue cette semaine !";
  }

  const flameSize = isBroken ? "text-5xl opacity-20" : "text-6xl opacity-25";

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl"
      style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
    >
      {/* Background decorative flame */}
      <span
        className={`pointer-events-none absolute right-5 top-5 select-none ${flameSize}`}
        style={{ animation: isBroken ? undefined : "flame-pulse 2.4s ease-in-out infinite" }}
        aria-hidden
      >
        🔥
      </span>

      {/* Header label */}
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
        Streak hebdomadaire
      </p>

      {/* Main number */}
      <div className="mt-2 flex items-end gap-4">
        <span
          className="text-[88px] font-black leading-none tabular-nums"
          style={{
            animation: current > 0 ? "streak-glow 3s ease-in-out infinite" : undefined,
            lineHeight: 1,
          }}
        >
          {current}
        </span>
        <div className="mb-2">
          <p className="text-xl font-bold leading-tight">semaines</p>
          <p className="text-sm text-white/60">consécutives</p>
        </div>
      </div>

      {/* Status pill */}
      <div
        className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
        style={{ background: "rgba(255,255,255,0.12)", color: accentText }}
      >
        {statusLabel}
      </div>

      {/* Premium freeze badge */}
      {isPremium && frozenWeeksLeft > 0 && (
        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
          🧊 Gel actif · {frozenWeeksLeft} sem. restante{frozenWeeksLeft > 1 ? "s" : ""}
        </div>
      )}

      {/* Daily dot calendar */}
      <div className="mt-5 flex gap-1.5">
        {dailyDots.map((day, idx) => (
          <div key={idx} className="flex flex-1 flex-col items-center gap-1.5">
            <span
              className="block h-2.5 w-2.5 rounded-full transition-all"
              style={{
                background: day.active
                  ? "#34d399"
                  : day.isToday
                  ? "rgba(255,255,255,0.35)"
                  : "rgba(255,255,255,0.12)",
                boxShadow: day.active ? "0 0 8px rgba(52,211,153,0.7)" : undefined,
              }}
            />
            <span
              className="text-[9px] font-medium"
              style={{ color: day.isToday ? "#fff" : "rgba(255,255,255,0.4)" }}
            >
              {day.short}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom stats */}
      <div
        className="mt-4 flex justify-between border-t pt-4"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div>
          <p className="text-[10px] uppercase tracking-wide text-white/40">Record</p>
          <p className="text-base font-bold">
            {longest} sem.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wide text-white/40">Cette semaine</p>
          <p className="text-base font-bold">
            {currentWeekMatchCount} match{currentWeekMatchCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
