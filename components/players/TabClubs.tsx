"use client";

import { useState } from "react";
import Link from "next/link";
import { clubs, getClubStats, isMember } from "../../lib/clubs";
import { CURRENT_USER_ID } from "../../lib/data";
import ClubCreateForm from "../clubs/ClubCreateForm";

interface Props {
  query: string;
}

export default function TabClubs({ query }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());

  const myClubs = clubs.filter((c) => isMember(c, CURRENT_USER_ID));
  const discoverClubs = clubs
    .filter((c) => !isMember(c, CURRENT_USER_ID) && c.visibility === "public")
    .filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.city.toLowerCase().includes(query.toLowerCase()),
    );

  return (
    <div className="ch-tab-wrap">
      {/* ── Créer un club ── */}
      <div className="ch-create-banner">
        <div className="ch-create-banner-text">
          <span className="ch-create-banner-title">Crée ton club</span>
          <span className="ch-create-banner-sub">Public ou privé, visible dans l'app</span>
        </div>
        <button type="button" className="btn-ch-create" onClick={() => setShowCreate(true)}>
          + Créer
        </button>
      </div>

      {/* ── Mes clubs ── */}
      {myClubs.length > 0 && (
        <section className="ch-section">
          <h2 className="ch-section-title">🏟️ Mes clubs</h2>
          <ul className="ch-list ch-list--clubs">
            {myClubs.map((club) => {
              const stats = getClubStats(club);
              return (
                <li key={club.id}>
                  <Link href={`/clubs/${club.id}`} className="ch-club-card">
                    <span
                      className="ch-club-logo"
                      style={{
                        background: club.color + "18",
                        borderColor: club.color + "44",
                        color: club.color,
                      }}
                    >
                      {club.logo}
                    </span>
                    <div className="ch-club-info">
                      <div className="ch-club-name-row">
                        <span className="ch-club-name">{club.name}</span>
                        {club.visibility === "private" && (
                          <span className="ch-club-private">🔒</span>
                        )}
                        <span
                          className="ch-club-member-badge"
                          style={{
                            color: club.color,
                            borderColor: club.color + "55",
                            background: club.color + "11",
                          }}
                        >
                          Membre
                        </span>
                      </div>
                      <span className="ch-club-meta">
                        {club.countryFlag} {club.city} · {stats.memberCount} membres · {stats.winRate}% ratio
                      </span>
                    </div>
                    <span className="ch-club-arrow" style={{ color: club.color }}>→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* ── Découvrir ── */}
      <section className="ch-section">
        <h2 className="ch-section-title">🔍 Rejoindre un club</h2>
        {discoverClubs.length === 0 ? (
          <p className="ch-empty">
            {query ? `Aucun club pour "${query}".` : "Tous les clubs publics sont déjà rejoints."}
          </p>
        ) : (
          <ul className="ch-list ch-list--clubs">
            {discoverClubs.map((club) => {
              const stats = getClubStats(club);
              const joined = joinedIds.has(club.id);
              return (
                <li key={club.id} className="ch-club-join-item">
                  <Link href={`/clubs/${club.id}`} className="ch-club-card">
                    <span
                      className="ch-club-logo"
                      style={{
                        background: club.color + "18",
                        borderColor: club.color + "44",
                        color: club.color,
                      }}
                    >
                      {club.logo}
                    </span>
                    <div className="ch-club-info">
                      <div className="ch-club-name-row">
                        <span className="ch-club-name">{club.name}</span>
                      </div>
                      <span className="ch-club-meta">
                        {club.countryFlag} {club.city} · {stats.memberCount} membres · {stats.winRate}% ratio
                      </span>
                      <span className="ch-club-desc">{club.description}</span>
                    </div>
                  </Link>
                  <button
                    type="button"
                    className={joined ? "btn-ch-joined" : "btn-club-join-inline"}
                    style={!joined ? { background: club.color } : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!joined) setJoinedIds((prev) => new Set(prev).add(club.id));
                    }}
                    disabled={joined}
                  >
                    {joined ? "✅ Rejoint" : "Rejoindre"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {showCreate && <ClubCreateForm onClose={() => setShowCreate(false)} />}
    </div>
  );
}
