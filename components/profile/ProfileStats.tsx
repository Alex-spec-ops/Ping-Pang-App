"use client";

import type { ProfileStats as ProfileStatsData, DayPoint } from "../../lib/profile";

interface Props {
  stats: ProfileStatsData;
  progression: DayPoint[];
}

export default function ProfileStats({ stats, progression }: Props) {
  // Build SVG path for chart
  const W = 320, H = 80;
  const ratings = progression.map((p) => p.rating);
  const minR = Math.min(...ratings) - 10;
  const maxR = Math.max(...ratings) + 10;
  const scaleX = (i: number) => (i / (progression.length - 1)) * W;
  const scaleY = (r: number) => H - ((r - minR) / (maxR - minR)) * H;

  const linePath = progression
    .map((p, i) => `${i === 0 ? "M" : "L"} ${scaleX(i).toFixed(1)} ${scaleY(p.rating).toFixed(1)}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L ${W} ${H} L 0 ${H} Z`;

  return (
    <section className="profile-stats-section">
      {/* Stat cards row */}
      <div className="stats-grid">
        <StatCard icon="🏓" value={stats.totalMatches.toString()} label="Matchs" />
        <StatCard
          icon="🏆"
          value={`${stats.winRate}%`}
          label={`${stats.wins}V / ${stats.losses}D`}
          accent
        />
        <StatCard
          icon="🔥"
          value={`${stats.currentStreak}`}
          label="Streak actuel"
          hot={stats.currentStreak >= 3}
        />
        <StatCard icon="⭐" value={stats.level} label="Niveau" small />
      </div>

      {/* Progression chart */}
      <div className="chart-card">
        <p className="chart-title">Progression ELO — 30 jours</p>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height={H}
          className="chart-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Area fill */}
          <path d={areaPath} fill="url(#chartGrad)" />
          {/* Line */}
          <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Last point dot */}
          <circle
            cx={scaleX(progression.length - 1)}
            cy={scaleY(progression[progression.length - 1].rating)}
            r="4"
            fill="#10b981"
          />
        </svg>
        <div className="chart-labels">
          <span>{progression[0]?.date?.slice(5)}</span>
          <span className="font-semibold text-emerald-600">{stats.ratingElo} ELO</span>
          <span>{progression[progression.length - 1]?.date?.slice(5)}</span>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon, value, label, accent, hot, small,
}: {
  icon: string;
  value: string;
  label: string;
  accent?: boolean;
  hot?: boolean;
  small?: boolean;
}) {
  return (
    <div className={`stat-card ${accent ? "stat-card--accent" : ""}`}>
      <span className={`stat-card-icon ${hot ? "stat-hot" : ""}`}>{icon}</span>
      <p className={`stat-card-value ${small ? "text-sm" : ""}`}>{value}</p>
      <p className="stat-card-label">{label}</p>
    </div>
  );
}
