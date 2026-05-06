"use client";

import { useState } from "react";
import type { WeekData } from "../lib/streak";

type StyleDef = { bg: string; color: string; ring?: string };

function getStyle(status: string): StyleDef {
  switch (status) {
    case "active":
      return { bg: "var(--color-forest)", color: "#fff" };
    case "current-active":
      return { bg: "var(--color-forest)", color: "#fff", ring: "0 0 0 2px var(--color-cream), 0 0 0 4px var(--color-forest)" };
    case "missed":
      return { bg: "var(--color-line)", color: "var(--color-muted)" };
    case "frozen":
      return { bg: "#60a5fa", color: "#fff" };
    case "current-pending":
      return { bg: "var(--color-line)", color: "var(--color-muted)", ring: "0 0 0 2px var(--color-cream), 0 0 0 4px var(--color-line)" };
    case "current-risk":
      return { bg: "#f59e0b", color: "#fff", ring: "0 0 0 2px var(--color-cream), 0 0 0 4px #f59e0b" };
    default:
      return { bg: "var(--color-line)", color: "var(--color-muted)" };
  }
}

export default function WeekHistoryGrid({ weeks }: { weeks: WeekData[] }) {
  const [tooltip, setTooltip] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-4 gap-x-3 gap-y-4">
      {weeks.map((week, i) => {
        const isCurrent = i === weeks.length - 1;
        const style = getStyle(week.status);
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
              className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition-transform hover:scale-110 active:scale-95"
              style={{
                background: style.bg,
                color: style.color,
                boxShadow: style.ring,
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
            <span className="text-center text-[9px] leading-tight" style={{ color: "var(--color-muted)" }}>
              {week.label}
            </span>

            {/* Tooltip */}
            {showTooltip && (
              <div
                className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1.5 text-[11px] text-white shadow-lg"
                style={{ background: "var(--color-ink)" }}
              >
                {week.matchCount > 0
                  ? `${week.matchCount} match${week.matchCount > 1 ? "s" : ""}`
                  : isCurrent
                  ? "En cours…"
                  : "Aucun match"}
                <div
                  className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent"
                  style={{ borderTopColor: "var(--color-ink)" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
