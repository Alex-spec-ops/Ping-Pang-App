"use client";

import { useState } from "react";
import type { Club } from "../../lib/clubs";
import { getClubStats, isMember } from "../../lib/clubs";
import { CURRENT_USER_ID } from "../../lib/data";
import ClubHeader from "./ClubHeader";
import ClubMembers from "./ClubMembers";
import ClubEvents from "./ClubEvents";
import ClubChallenges from "./ClubChallenges";
import ClubChat from "./ClubChat";
import ClubAchievements from "./ClubAchievements";

type TabKey = "membres" | "evenements" | "defis" | "chat";

const TABS: { key: TabKey; label: string; emoji: string }[] = [
  { key: "membres",    label: "Membres",   emoji: "👥" },
  { key: "evenements", label: "Événements", emoji: "📅" },
  { key: "defis",      label: "Défis",      emoji: "⚔️" },
  { key: "chat",       label: "Chat",       emoji: "💬" },
];

interface Props { club: Club }

export default function ClubPage({ club }: Props) {
  const [tab, setTab] = useState<TabKey>("membres");
  const [joined, setJoined] = useState(isMember(club, CURRENT_USER_ID));
  const stats = getClubStats(club);

  return (
    <div className="club-page">
      <ClubHeader
        club={club}
        stats={stats}
        joined={joined}
        onJoin={() => setJoined(true)}
        onLeave={() => setJoined(false)}
      />

      {/* Achievements strip */}
      <ClubAchievements achievements={club.achievements} />

      {/* Tab bar */}
      <div className="profile-tab-bar">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`profile-tab ${tab === t.key ? "profile-tab--active" : ""}`}
            style={tab === t.key ? { color: club.color } : undefined}
          >
            <span className="profile-tab-emoji">{t.emoji}</span>
            <span className="profile-tab-label">{t.label}</span>
            {tab === t.key && (
              <span className="profile-tab-indicator" style={{ background: club.color }} />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="profile-tab-content-wrap" key={tab}>
        {tab === "membres"    && <ClubMembers club={club} />}
        {tab === "evenements" && <ClubEvents club={club} color={club.color} />}
        {tab === "defis"      && <ClubChallenges club={club} />}
        {tab === "chat"       && <ClubChat club={club} color={club.color} />}
      </div>
    </div>
  );
}
