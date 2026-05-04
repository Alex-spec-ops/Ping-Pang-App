"use client";

import type { Club } from "../../lib/clubs";
import { getClub, getClubStats } from "../../lib/clubs";

interface Props { club: Club }

const statusLabel: Record<string, { label: string; color: string }> = {
  pending:   { label: "⏳ En attente", color: "#f59e0b" },
  accepted:  { label: "✅ Accepté", color: "#10b981" },
  completed: { label: "🏁 Terminé", color: "#6b7280" },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function ClubChallenges({ club }: Props) {
  return (
    <div className="tab-content">
      <p className="section-label">Défis inter-clubs</p>

      {club.challenges.length === 0 ? (
        <div className="club-empty-challenges">
          <p className="empty-state">Aucun défi en cours.</p>
          <button type="button" className="btn-challenge-create">
            ⚔️ Lancer un défi
          </button>
        </div>
      ) : (
        <ul className="club-challenges-list">
          {club.challenges.map((ch) => {
            const isChallenger = ch.challengerClubId === club.id;
            const opponentId = isChallenger ? ch.challengedClubId : ch.challengerClubId;
            const opponent = getClub(opponentId);
            const opponentStats = opponent ? getClubStats(opponent) : null;
            const s = statusLabel[ch.status];

            return (
              <li key={ch.id} className="club-challenge-card">
                {/* VS row */}
                <div className="club-challenge-vs">
                  <div className="club-challenge-side">
                    <span className="club-challenge-logo">{club.logo}</span>
                    <p className="club-challenge-cname">{club.shortName}</p>
                  </div>
                  <div className="club-challenge-center">
                    <p className="club-challenge-vs-text">VS</p>
                    {ch.status === "completed" && ch.challengerScore !== undefined && (
                      <p className="club-challenge-score">
                        {isChallenger ? ch.challengerScore : ch.challengedScore}
                        {" — "}
                        {isChallenger ? ch.challengedScore : ch.challengerScore}
                      </p>
                    )}
                  </div>
                  <div className="club-challenge-side club-challenge-side--right">
                    <span className="club-challenge-logo">{opponent?.logo ?? "❓"}</span>
                    <p className="club-challenge-cname">{opponent?.shortName ?? "?"}</p>
                  </div>
                </div>

                {/* Meta */}
                <div className="club-challenge-meta">
                  <span
                    className="club-challenge-status"
                    style={{ color: s.color, borderColor: s.color + "44", background: s.color + "11" }}
                  >
                    {s.label}
                  </span>
                  <p className="club-challenge-date">📅 {fmtDate(ch.date)}</p>
                  <p className="club-challenge-venue">📍 {ch.venue}</p>
                </div>

                {/* Stats comparison */}
                {opponentStats && (
                  <div className="club-challenge-stats">
                    <div className="club-challenge-stat">
                      <p className="club-challenge-stat-val">{getClubStats(club).winRate}%</p>
                      <p className="club-challenge-stat-lab">Votre ratio</p>
                    </div>
                    <span className="club-stats-divider" />
                    <div className="club-challenge-stat">
                      <p className="club-challenge-stat-val">{opponentStats.winRate}%</p>
                      <p className="club-challenge-stat-lab">Ratio {opponent?.shortName}</p>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <button type="button" className="btn-challenge-create">
        ⚔️ Lancer un nouveau défi
      </button>
    </div>
  );
}
