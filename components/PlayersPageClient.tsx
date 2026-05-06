"use client";

import { useState } from "react";
import Link from "next/link";
import Avatar from "./Avatar";
import { getLeaderboard, CURRENT_USER_ID } from "../lib/data";
import { clubs, getClubStats, isMember } from "../lib/clubs";

type MainTab = "joueurs" | "clubs";

const medal = (rank: number) =>
  rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;

export default function PlayersPageClient() {
  const [tab, setTab] = useState<MainTab>("joueurs");
  const [query, setQuery] = useState("");
  const ranked = getLeaderboard();

  const filteredPlayers = ranked.filter(
    (p) =>
      p.fullName.toLowerCase().includes(query.toLowerCase()) ||
      p.username.toLowerCase().includes(query.toLowerCase()),
  );

  const filteredClubs = clubs.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.city.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      {/* Main tab bar */}
      <div className="players-tab-bar">
        <button
          type="button"
          onClick={() => setTab("joueurs")}
          className={`players-tab ${tab === "joueurs" ? "players-tab--active" : ""}`}
        >
          🏆 Joueurs
        </button>
        <button
          type="button"
          onClick={() => setTab("clubs")}
          className={`players-tab ${tab === "clubs" ? "players-tab--active" : ""}`}
        >
          🏟️ Clubs
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tab === "joueurs" ? "Rechercher un joueur…" : "Rechercher un club, une ville…"}
          className="w-full px-4 py-2 text-sm outline-none"
          style={{
            border: "var(--border-thin)",
            background: "var(--color-cream)",
            fontFamily: "var(--font-ui)",
            color: "var(--color-ink)",
          }}
        />
      </div>

      {/* ── JOUEURS TAB ── */}
      {tab === "joueurs" && (
        <ol style={{ borderTop: "var(--border-thin)" }}>
          {filteredPlayers.map((p, idx) => {
            const rank = idx + 1;
            return (
              <li key={p.id}>
                <Link
                  href={`/profile/${p.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{ borderBottom: "var(--border-thin)" }}
                >
                  <span className="w-7 text-center text-sm font-semibold" style={{ color: "var(--color-muted)" }}>
                    {medal(rank) ?? rank}
                  </span>
                  <Avatar emoji={p.avatar} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {p.fullName}{" "}
                      <span className="text-xs font-normal text-zinc-500">{p.countryFlag}</span>
                    </p>
                    <p className="truncate text-xs" style={{ color: "var(--color-muted)" }}>
                      @{p.username}{p.club ? ` · ${p.club}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{p.rating}</p>
                    <p className="text-[10px]" style={{ color: "var(--color-muted)" }}>ELO</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}

      {/* ── CLUBS TAB ── */}
      {tab === "clubs" && (
        <div className="px-4 pb-4">
          <div className="mt-1 flex items-center justify-between mb-3">
            <p className="text-xs text-zinc-500">{filteredClubs.length} clubs trouvés</p>
            <Link href="/clubs" className="text-xs font-semibold" style={{ color: "var(--color-forest)" }}>
              Voir tout →
            </Link>
          </div>
          <ul className="space-y-3">
            {filteredClubs.map((club) => {
              const stats = getClubStats(club);
              const joined = isMember(club, CURRENT_USER_ID);
              return (
                <li key={club.id}>
                  <Link href={`/clubs/${club.id}`} className="club-card-mini">
                    <span
                      className="club-card-mini-logo"
                      style={{ background: club.color + "18", borderColor: club.color + "44", color: club.color }}
                    >
                      {club.logo}
                    </span>
                    <div className="club-card-mini-info">
                      <div className="flex items-center gap-1.5">
                        <p className="club-card-mini-name">{club.name}</p>
                        {club.visibility === "private" && <span className="text-[10px]">🔒</span>}
                        {joined && (
                          <span
                            className="club-member-badge"
                            style={{ color: club.color, borderColor: club.color + "55", background: club.color + "11" }}
                          >
                            Membre
                          </span>
                        )}
                      </div>
                      <p className="club-card-mini-meta">
                        {club.countryFlag} {club.city} · {stats.memberCount} membres · {stats.winRate}% ratio
                      </p>
                    </div>
                    <span
                      className="club-card-mini-arrow"
                      style={{ color: club.color }}
                    >→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
