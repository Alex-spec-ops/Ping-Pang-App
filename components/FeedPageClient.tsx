"use client";

import { useState } from "react";
import FeedList from "./FeedList";
import TabEnCours from "./players/TabEnCours";
import { activities } from "../lib/data";

type Tab = "feed" | "en-direct";

export default function FeedPageClient() {
  const [tab, setTab] = useState<Tab>("feed");

  return (
    <div>
      {/* ── Barre d'onglets ── */}
      <div className="players-tab-bar">
        <button
          type="button"
          onClick={() => setTab("feed")}
          className={`players-tab ${tab === "feed" ? "players-tab--active" : ""}`}
        >
          <span className="players-tab-emoji">🏓</span>
          <span>Feed</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("en-direct")}
          className={`players-tab ${tab === "en-direct" ? "players-tab--active" : ""}`}
        >
          <span className="players-tab-emoji">⚔️</span>
          <span>En Direct</span>
        </button>
      </div>

      {/* ── Contenu ── */}
      {tab === "feed"      && <FeedList items={activities} />}
      {tab === "en-direct" && <TabEnCours />}
    </div>
  );
}
