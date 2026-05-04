"use client";

import Link from "next/link";
import { getClub } from "../../lib/clubs";

interface Props {
  clubId: string;
  size?: "sm" | "md";
}

export default function ClubBadge({ clubId, size = "sm" }: Props) {
  const club = getClub(clubId);
  if (!club) return null;

  const isSmall = size === "sm";

  return (
    <Link
      href={`/clubs/${clubId}`}
      className="club-badge"
      style={{
        background: club.color + "18",
        borderColor: club.color + "55",
        color: club.color,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <span className={isSmall ? "club-badge-logo--sm" : "club-badge-logo--md"}>
        {club.logo}
      </span>
      <span className={isSmall ? "club-badge-name--sm" : "club-badge-name--md"}>
        {club.shortName}
      </span>
    </Link>
  );
}
