"use client";

import type { ClubAchievement } from "../../lib/clubs";

interface Props { achievements: ClubAchievement[] }

export default function ClubAchievements({ achievements }: Props) {
  return (
    <div className="club-achievements-wrap">
      <p className="section-label">Achievements collectifs</p>
      <div className="club-achievements-grid">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={`club-achievement-card ${a.unlocked ? "club-achievement-card--unlocked" : "club-achievement-card--locked"}`}
          >
            <span className={`club-achievement-emoji ${!a.unlocked ? "club-achievement-emoji--locked" : ""}`}>
              {a.emoji}
            </span>
            <p className="club-achievement-label">{a.label}</p>
            <p className="club-achievement-cond">{a.unlocked ? (a.unlockedAt ? `✅ ${new Date(a.unlockedAt).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}` : "✅ Débloqué") : `🔒 ${a.condition}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
