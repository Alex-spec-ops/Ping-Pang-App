"use client";

import { useState } from "react";
import Link from "next/link";
import { clubs, getClubStats, isMember, getClubRanking } from "../../lib/clubs";
import { CURRENT_USER_ID } from "../../lib/data";
import ClubCreateForm from "../../components/clubs/ClubCreateForm";

export default function ClubsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "mine" | "ranking">("all");
  const [showCreate, setShowCreate] = useState(false);

  const ranked = getClubRanking();

  const displayed = clubs.filter((c) => {
    const matchQ = c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.city.toLowerCase().includes(query.toLowerCase());
    if (filter === "mine") return matchQ && isMember(c, CURRENT_USER_ID);
    return matchQ;
  });

  return (
    <div className="clubs-list-page">
      {/* Header */}
      <div className="clubs-list-header">
        <div>
          <h1 className="clubs-list-title">Clubs</h1>
          <p className="clubs-list-sub">Rejoins une communauté de pongistes</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="btn-create-club"
        >
          + Créer
        </button>
      </div>

      {/* Search */}
      <div className="clubs-search-wrap">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un club, une ville…"
          className="clubs-search-input"
        />
      </div>

      {/* Filter tabs */}
      <div className="clubs-filters">
        {([["all", "Tous"], ["mine", "Mes clubs"], ["ranking", "Classement"]] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`period-tab ${filter === key ? "period-tab--active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Ranking view */}
      {filter === "ranking" && (
        <div className="clubs-ranking">
          <p className="section-label">Classement national — Ratio V/D</p>
          <ol className="clubs-ranking-list">
            {ranked.map(({ club, stats, rank }) => {
              const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
              return (
                <li key={club.id}>
                  <Link href={`/clubs/${club.id}`} className="clubs-ranking-row">
                    <span className="clubs-rank">{medal ?? rank}</span>
                    <span className="clubs-ranking-logo">{club.logo}</span>
                    <div className="clubs-ranking-info">
                      <p className="clubs-ranking-name">{club.name}</p>
                      <p className="clubs-ranking-meta">{club.countryFlag} {club.city} · {stats.memberCount} membres</p>
                    </div>
                    <div className="clubs-ranking-wr">
                      <p className="clubs-ranking-wr-val">{stats.winRate}%</p>
                      <p className="clubs-ranking-wr-lab">ratio</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* Club cards */}
      {filter !== "ranking" && (
        <>
          {displayed.length === 0 ? (
            <p className="empty-state">Aucun club trouvé.</p>
          ) : (
            <ul className="clubs-card-list">
              {displayed.map((club) => {
                const stats = getClubStats(club);
                const joined = isMember(club, CURRENT_USER_ID);
                return (
                  <li key={club.id}>
                    <Link href={`/clubs/${club.id}`} className="club-card">
                      {/* Color accent bar */}
                      <div className="club-card-accent" style={{ background: club.color }} />
                      <div className="club-card-body">
                        <div className="club-card-top">
                          <span
                            className="club-card-logo"
                            style={{ background: club.color + "18", borderColor: club.color + "44" }}
                          >
                            {club.logo}
                          </span>
                          <div className="club-card-info">
                            <div className="club-card-title-row">
                              <p className="club-card-name">{club.name}</p>
                              {club.visibility === "private" && (
                                <span className="club-private-badge">🔒</span>
                              )}
                              {joined && (
                                <span className="club-member-badge" style={{ color: club.color, borderColor: club.color + "55", background: club.color + "11" }}>
                                  Membre
                                </span>
                              )}
                            </div>
                            <p className="club-card-location">{club.countryFlag} {club.city}</p>
                          </div>
                        </div>
                        <p className="club-card-desc">{club.description}</p>
                        <div className="club-card-stats">
                          <span>{stats.memberCount} membres</span>
                          <span className="club-stats-divider" />
                          <span>{stats.totalMatches} matchs</span>
                          <span className="club-stats-divider" />
                          <span style={{ color: club.color, fontWeight: 700 }}>{stats.winRate}% ratio</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {/* Create form bottom-sheet */}
      {showCreate && <ClubCreateForm onClose={() => setShowCreate(false)} />}
    </div>
  );
}
