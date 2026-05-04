"use client";

import { useState } from "react";
import type { Badge } from "../../lib/profile";

interface Props {
  badges: Badge[];
}

export default function ProfileBadges({ badges }: Props) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <div className="tab-content">
      <div className="badges-grid">
        {badges.map((b) => (
          <button
            key={b.id}
            type="button"
            className={`badge-card ${b.unlocked ? (b.rare ? "badge-card--rare" : "badge-card--unlocked") : "badge-card--locked"}`}
            onClick={() => setActiveTooltip(activeTooltip === b.id ? null : b.id)}
            aria-label={b.label}
          >
            {/* Rare shimmer ring */}
            {b.unlocked && b.rare && <span className="badge-rare-ring" />}

            <span className={`badge-emoji ${b.unlocked && b.rare ? "badge-emoji--rare" : ""} ${!b.unlocked ? "badge-emoji--locked" : ""}`}>
              {b.emoji}
            </span>
            <p className="badge-label">{b.label}</p>

            {/* Tooltip */}
            {activeTooltip === b.id && (
              <div className="badge-tooltip" onClick={(e) => e.stopPropagation()}>
                <p className="badge-tooltip-desc">{b.description}</p>
                <p className="badge-tooltip-cond">
                  {b.unlocked ? "✅ Débloqué" : `🔒 Condition : ${b.condition}`}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="badges-legend">
        <span className="legend-dot legend-dot--unlocked" /> Débloqué
        <span className="legend-dot legend-dot--rare" /> Rare
        <span className="legend-dot legend-dot--locked" /> Verrouillé
      </div>
    </div>
  );
}
