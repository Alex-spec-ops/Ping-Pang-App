"use client";

import { useState } from "react";
import type { WeekData } from "../lib/streak";

const STATUS_STYLE: Record<
  string,
  { bg: string; text: string; ring?: string }
> = {
  active:           { bg: "bg-emerald-500",                          text: "text-white" },
  missed:           { bg: "bg-zinc-200 dark:bg-zinc-800",            text: "text-zinc-400 dark:text-zinc-600" },
  frozen:           { bg: "bg-blue-400",                             text: "text-white" },
  "current-active": { bg: "bg-emerald-500",                          text: "text-white",  ring: "ring-2 ring-emerald-300 ring-offset-2 dark:ring-offset-zinc-950" },
  "current-pending":{ bg: "bg-zinc-300 dark:bg-zinc-700",            text: "text-zinc-500 dark:text-zinc-400", ring: "ring-2 ring-zinc-300 dark:ring-zinc-600 ring-offset-2 dark:ring-offset-zinc-950" },
  "current-risk":   { bg: "bg-amber-400",                            text: "text-white",  ring: "ring-2 ring-amber-300 ring-offset-2 dark:ring-offset-zinc-950" },
};

export default function WeekHistoryGrid({ weeks }: { weeks: WeekData[] }) {
  const [tooltip, setTooltip] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-4 gap-x-3 gap-y-4">
      {weeks.map((week, i) => {
        const isCurrent = i === weeks.length - 1;
        const style = STATUS_STYLE[week.status] ?? STATUS_STYLE.missed;
        const showTooltip = tooltip === i;

        return (
          <div
            key={week.key}
            className="relative flex flex-col items-center gap-1.5"
            onMouseEnter={() => setTooltip(i)}
            onMouseLeave={() => setTooltip(null)}
          >
            {/* Bubble */}
            <button
              type="button"
              className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition-transform hover:scale-110 active:scale-95 ${style.bg} ${style.text} ${style.ring ?? ""}`}
              style={{
                animation:
                  isCurrent && week.status === "current-active"
                    ? "celebrate-pop 0.6s ease-out"
                    : undefined,
              }}
              aria-label={`Semaine du ${week.label} : ${week.matchCount} match${week.matchCount !== 1 ? "s" : ""}`}
            >
              {week.matchCount > 0 ? (
                week.matchCount
              ) : isCurrent ? (
                <span className="text-base leading-none">·</span>
              ) : (
                <span className="text-[11px] opacity-40">✕</span>
              )}

              {/* Flame pip for streak weeks */}
              {week.status === "active" && i >= weeks.length - 8 && (
                <span className="absolute -right-0.5 -top-0.5 text-[10px] leading-none">
                  🔥
                </span>
              )}
            </button>

            {/* Week label */}
            <span className="text-center text-[9px] leading-tight text-zinc-500 dark:text-zinc-400">
              {week.label}
            </span>

            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-2.5 py-1.5 text-[11px] text-white shadow-lg dark:bg-zinc-700">
                {week.matchCount > 0
                  ? `${week.matchCount} match${week.matchCount > 1 ? "s" : ""}`
                  : isCurrent
                  ? "En cours…"
                  : "Aucun match"}
                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-700" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
