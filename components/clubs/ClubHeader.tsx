"use client";

import type { Club, ClubStats } from "../../lib/clubs";
import { isMember, isAdmin } from "../../lib/clubs";
import { CURRENT_USER_ID } from "../../lib/data";

interface Props {
  club: Club;
  stats: ClubStats;
  joined: boolean;
  onJoin: () => void;
  onLeave: () => void;
}

export default function ClubHeader({ club, stats, joined, onJoin, onLeave }: Props) {
  const currentUserIsAdmin = isAdmin(club, CURRENT_USER_ID);

  return (
    <div className="club-header-wrap">
      {/* Banner */}
      <div
        className="club-banner"
        style={{ background: `linear-gradient(135deg, ${club.color}dd, ${club.color}88)` }}
      >
        {/* Decorative circles */}
        <div className="club-banner-circle club-banner-circle--1" style={{ background: club.color + "33" }} />
        <div className="club-banner-circle club-banner-circle--2" style={{ background: club.color + "22" }} />
      </div>

      {/* Content */}
      <div className="club-header-content">
        {/* Logo */}
        <div className="club-logo-wrap" style={{ borderColor: club.color + "55" }}>
          <span className="club-logo-emoji">{club.logo}</span>
        </div>

        {/* Info */}
        <div className="club-info">
          <div className="club-title-row">
            <h1 className="club-name">{club.name}</h1>
            {club.visibility === "private" && (
              <span className="club-private-badge">🔒 Privé</span>
            )}
          </div>
          <p className="club-location">
            {club.countryFlag} {club.city} · {club.country}
          </p>
          <p className="club-desc">{club.description}</p>

          {/* Stats row */}
          <div className="club-stats-row">
            <ClubStat value={stats.memberCount.toString()} label="Membres" />
            <span className="club-stats-divider" />
            <ClubStat value={stats.totalMatches.toString()} label="Matchs" />
            <span className="club-stats-divider" />
            <ClubStat
              value={`${stats.winRate}%`}
              label={`${stats.totalWins}V / ${stats.totalLosses}D`}
              accent
            />
          </div>

          {/* Actions */}
          <div className="club-header-actions">
            {joined ? (
              <>
                {currentUserIsAdmin && (
                  <button type="button" className="btn-club-manage">
                    ⚙️ Gérer
                  </button>
                )}
                <button
                  type="button"
                  className="btn-club-leave"
                  onClick={onLeave}
                >
                  Quitter
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn-club-join"
                style={{ background: club.color }}
                onClick={onJoin}
              >
                {club.visibility === "private" ? "🔒 Demander à rejoindre" : "Rejoindre le club"}
              </button>
            )}
            <button type="button" className="btn-club-share">
              🔗 Inviter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClubStat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="club-stat-item">
      <p className={`club-stat-value ${accent ? "club-stat-value--accent" : ""}`}>{value}</p>
      <p className="club-stat-label">{label}</p>
    </div>
  );
}
