"use client";

import { useState } from "react";
import TabEnCours from "./players/TabEnCours";
import TabChallenges from "./players/TabChallenges";
import TabClubs from "./players/TabClubs";

type Tab = "en-cours" | "challenges" | "clubs";

const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: "en-cours",    label: "En cours",    emoji: "⚔️" },
  { key: "challenges",  label: "Challenges",  emoji: "🎯" },
  { key: "clubs",       label: "Clubs",       emoji: "🏟️" },
];

export default function PlayersPageClient() {
  const [tab, setTab] = useState<Tab>("en-cours");
  const [query, setQuery] = useState("");

  return (
    <div>
      {/* ── Tab bar ── */}
      <div className="players-tab-bar">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`players-tab ${tab === t.key ? "players-tab--active" : ""}`}
          >
            <span className="players-tab-emoji">{t.emoji}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Barre de recherche (clubs uniquement) ── */}
      {tab === "clubs" && (
        <div className="px-4 py-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un club, une ville…"
            className="w-full px-4 py-2 text-sm outline-none"
            style={{
              border: "var(--border-thin)",
              background: "var(--color-cream)",
              fontFamily: "var(--font-ui)",
              color: "var(--color-ink)",
              fontSize: "16px",
            }}
          />
        </div>
      )}

      {/* ── Contenu par onglet ── */}
      {tab === "en-cours"   && <TabEnCours />}
      {tab === "challenges" && <TabChallenges />}
      {tab === "clubs"      && <TabClubs query={query} />}
    </div>
  );
}
