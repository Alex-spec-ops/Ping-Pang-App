"use client";

import type { Match, Player } from "../../lib/types";
import MatchCalendar from "./MatchCalendar";

interface Props {
  player: Player;
  matches: Match[];
  isPremium: boolean;
}

export default function ProfileMatches({ player, matches }: Props) {
  const sorted = [...matches].sort((a, b) => b.playedAt.localeCompare(a.playedAt));

  return (
    <div className="tab-content">
      <MatchCalendar playerId={player.id} matches={sorted} />
    </div>
  );
}
