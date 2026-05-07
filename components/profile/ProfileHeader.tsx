"use client";

import { useRef, useState } from "react";
import type { Player } from "../../lib/types";
import type { ProfileStats, SubscriptionInfo } from "../../lib/profile";
import ClubBadge from "../clubs/ClubBadge";
import { getClubForPlayer } from "../../lib/clubs";

interface Props {
  player: Player;
  stats: ProfileStats;
  subscription: SubscriptionInfo;
  isOwnProfile: boolean;
  onEditClick?: () => void;
}

export default function ProfileHeader({ player, stats, subscription, isOwnProfile, onEditClick }: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarUrl(URL.createObjectURL(f));
  }

  return (
    <div className="profile-header-wrap">
      {/* Gradient banner */}
      <div className={`profile-banner bg-gradient-to-br ${stats.headerGradient}`} />

      {/* Content */}
      <div className="profile-header-content">
        {/* Avatar */}
        <div className="profile-avatar-wrap">
          <button
            type="button"
            onClick={() => isOwnProfile && fileRef.current?.click()}
            className="profile-avatar-btn"
            aria-label="Changer la photo de profil"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="profile-avatar-img" />
            ) : (
              <span className="profile-avatar-emoji">{player.avatar}</span>
            )}
            {isOwnProfile && (
              <span className="profile-avatar-edit-icon">📷</span>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        {/* Name + badges row */}
        <div className="profile-identity">
          <div className="profile-name-row">
            <h1 className="profile-fullname">{player.fullName}</h1>
            {/* Subscription badge */}
            {subscription.plan === "premium" ? (
              <span className="badge-premium">⭐ Premium</span>
            ) : (
              <span className="badge-free">Free</span>
            )}
          </div>

          <p className="profile-username">@{player.username}</p>

          {/* Club badge(s) — clickable, links to club page */}
          {(() => {
            const club = getClubForPlayer(player.id);
            return club ? <ClubBadge clubId={club.id} size="md" /> : null;
          })()}

          {/* Level badge */}
          <span
            className="profile-level-badge"
            style={{ background: stats.levelColor + "22", color: stats.levelColor, borderColor: stats.levelColor + "55" }}
          >
            {stats.level} · {stats.ratingElo} ELO
          </span>

          {/* Bio */}
          {player.bio && (
            <p className="profile-bio">{player.bio}</p>
          )}

          {/* Location */}
          <p className="profile-location">
            {player.countryFlag} {player.city}
          </p>

          {/* Edit / Follow button */}
          {isOwnProfile ? (
            <button type="button" className="btn-edit-profile" onClick={onEditClick}>
              ✏️ Modifier le profil
            </button>
          ) : (
            <div className="profile-action-row">
              <button type="button" className="btn-follow">Suivre</button>
              <button type="button" className="btn-challenge">⚔️ Défier</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
