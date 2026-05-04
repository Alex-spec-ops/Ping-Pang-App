"use client";

import Link from "next/link";
import type { Club } from "../../lib/clubs";
import { getClubLeaderboard } from "../../lib/clubs";

interface Props { club: Club }

const roleLabel: Record<string, string> = {
  creator: "👑 Créateur",
  admin: "⚡ Admin",
  member: "Membre",
};

export default function ClubMembers({ club }: Props) {
  const leaderboard = getClubLeaderboard(club);

  return (
    <div className="tab-content">
      <p className="section-label">Classement interne</p>
      <ul className="club-leaderboard">
        {leaderboard.map((entry, idx) => {
          if (!entry.player) return null;
          const total = entry.clubMatchWins + entry.clubMatchLosses;
          const wr = total > 0 ? Math.round((entry.clubMatchWins / total) * 100) : 0;
          const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : null;

          return (
            <li key={entry.playerId} className="club-member-row">
              <span className="club-rank">
                {medal ?? <span className="club-rank-num">{idx + 1}</span>}
              </span>
              <span className="club-member-emoji">{entry.player.avatar}</span>
              <Link href={`/profile/${entry.playerId}`} className="club-member-info">
                <p className="club-member-name">{entry.player.fullName}</p>
                <p className="club-member-meta">
                  {roleLabel[entry.role]} · {entry.player.rating} ELO
                </p>
              </Link>
              <div className="club-member-score">
                <p className="club-member-wins">{entry.clubMatchWins}V</p>
                <p className="club-member-wr">{wr}%</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
