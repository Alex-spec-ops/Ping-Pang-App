"use client";

import { useState } from "react";
import type { Player } from "../../lib/types";
import type { ProfileStats as ProfileStatsData, DayPoint, Badge, SubscriptionInfo } from "../../lib/profile";
import type { Match } from "../../lib/types";
import ProfileHeader from "./ProfileHeader";
import ProfileStatsPanel from "./ProfileStats";
import ProfileMatches from "./ProfileMatches";
import ProfileBadges from "./ProfileBadges";
import ProfileSubscription from "./ProfileSubscription";

type TabKey = "activites" | "badges" | "abonnement";

const TABS: { key: TabKey; label: string; emoji: string }[] = [
  { key: "activites", label: "Activités", emoji: "🏓" },
  { key: "badges", label: "Badges", emoji: "🏅" },
  { key: "abonnement", label: "Abonnement", emoji: "⭐" },
];

interface Props {
  player: Player;
  stats: ProfileStatsData;
  progression: DayPoint[];
  badges: Badge[];
  matches: Match[];
  subscription: SubscriptionInfo;
  isOwnProfile: boolean;
}

export default function ProfileScreen({
  player, stats, progression, badges, matches, subscription, isOwnProfile,
}: Props) {
  const [tab, setTab] = useState<TabKey>("activites");

  return (
    <div className="profile-screen">
      {/* ── Header (identity + gradient) ── */}
      <ProfileHeader
        player={player}
        stats={stats}
        subscription={subscription}
        isOwnProfile={isOwnProfile}
      />

      {/* ── Statistics cards + chart ── */}
      <ProfileStatsPanel stats={stats} progression={progression} />

      {/* ── Tab bar ── */}
      <div className="profile-tab-bar">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`profile-tab ${tab === t.key ? "profile-tab--active" : ""}`}
          >
            <span className="profile-tab-emoji">{t.emoji}</span>
            <span className="profile-tab-label">{t.label}</span>
            {tab === t.key && <span className="profile-tab-indicator" />}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="profile-tab-content-wrap" key={tab}>
        {tab === "activites" && (
          <ProfileMatches player={player} matches={matches} isPremium={subscription.plan === "premium"} />
        )}
        {tab === "badges" && <ProfileBadges badges={badges} />}
        {tab === "abonnement" && <ProfileSubscription info={subscription} />}
      </div>
    </div>
  );
}
