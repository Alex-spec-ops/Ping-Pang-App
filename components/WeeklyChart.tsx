import type { WeekData } from "../lib/streak";

const STATUS_COLOR: Record<string, string> = {
  active:            "#10b981",
  missed:            "#e4e4e7",
  frozen:            "#60a5fa",
  "current-active":  "#10b981",
  "current-pending": "#a1a1aa",
  "current-risk":    "#f59e0b",
};

const STATUS_COLOR_DARK: Record<string, string> = {
  active:            "#34d399",
  missed:            "#3f3f46",
  frozen:            "#93c5fd",
  "current-active":  "#34d399",
  "current-pending": "#52525b",
  "current-risk":    "#fbbf24",
};

export default function WeeklyChart({ weeks }: { weeks: WeekData[] }) {
  const maxCount = Math.max(...weeks.map((w) => w.matchCount), 1);

  // SVG layout constants
  const VW = 312;        // viewBox width
  const VH = 160;        // viewBox height
  const BAR_AREA_H = 96; // height reserved for bars
  const TOP_PAD = 18;    // space above tallest bar (for labels)
  const BOT_PAD = 30;    // space below bars (for x-labels)
  const Y_BASE = TOP_PAD + BAR_AREA_H; // baseline y-coordinate
  const SLOT = VW / weeks.length;      // ≈ 26 per bar slot
  const BAR_W = SLOT * 0.6;
  const BAR_OFFSET = (SLOT - BAR_W) / 2;

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="w-full"
      aria-label="Graphique d'évolution hebdomadaire"
      role="img"
    >
      {/* Horizontal grid lines */}
      {[0.25, 0.5, 0.75, 1].map((pct) => {
        const y = Y_BASE - pct * BAR_AREA_H;
        return (
          <line
            key={pct}
            x1={0} y1={y} x2={VW} y2={y}
            stroke="currentColor"
            strokeOpacity={0.07}
            strokeWidth={1}
            strokeDasharray={pct < 1 ? "3 3" : undefined}
          />
        );
      })}

      {weeks.map((week, i) => {
        const barH = week.matchCount === 0
          ? 0
          : Math.max(6, (week.matchCount / maxCount) * BAR_AREA_H);
        const x = i * SLOT + BAR_OFFSET;
        const y = Y_BASE - barH;
        const isCurrent = i === weeks.length - 1;
        const fill = STATUS_COLOR[week.status] ?? "#e4e4e7";
        const fillDark = STATUS_COLOR_DARK[week.status] ?? "#3f3f46";

        return (
          <g key={week.key}>
            {/* Bar (light mode) */}
            {barH > 0 && (
              <rect
                x={x} y={y}
                width={BAR_W} height={barH}
                rx={3}
                fill={fill}
                fillOpacity={isCurrent ? 1 : 0.75}
                className="dark:hidden"
              />
            )}
            {/* Bar (dark mode) */}
            {barH > 0 && (
              <rect
                x={x} y={y}
                width={BAR_W} height={barH}
                rx={3}
                fill={fillDark}
                fillOpacity={isCurrent ? 1 : 0.8}
                className="hidden dark:block"
              />
            )}

            {/* Empty week stub */}
            {barH === 0 && (
              <rect
                x={x} y={Y_BASE - 3}
                width={BAR_W} height={3}
                rx={1.5}
                fill="currentColor"
                fillOpacity={0.12}
              />
            )}

            {/* Match count above bar */}
            {week.matchCount > 0 && (
              <text
                x={x + BAR_W / 2} y={y - 4}
                textAnchor="middle"
                fontSize={8}
                fontWeight="700"
                fill="currentColor"
                fillOpacity={0.55}
              >
                {week.matchCount}
              </text>
            )}

            {/* X-axis label */}
            <text
              x={x + BAR_W / 2} y={Y_BASE + 13}
              textAnchor="middle"
              fontSize={7}
              fill="currentColor"
              fillOpacity={isCurrent ? 0.75 : 0.38}
              fontWeight={isCurrent ? "700" : "400"}
            >
              {week.label}
            </text>

            {/* "Auj." tag for current week */}
            {isCurrent && (
              <text
                x={x + BAR_W / 2} y={Y_BASE + 23}
                textAnchor="middle"
                fontSize={6.5}
                fill="currentColor"
                fillOpacity={0.45}
              >
                auj.
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
