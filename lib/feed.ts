import type { Activity } from "./types";
import { CURRENT_USER_FRIENDS, CURRENT_USER_ID, getPlayer } from "./data";

// ─── Feed algorithm ───────────────────────────────────────────────────────────
// Score = chronological timestamp + like-boost (each like ≈ 45 min of recency)

const LIKE_BOOST_MS = 45 * 60 * 1_000;

export function feedScore(a: Activity): number {
  return new Date(a.createdAt).getTime() + a.likes * LIKE_BOOST_MS;
}

export type FeedFilter = "all" | "friends" | "club" | "events" | "défis";

export function applyFilter(activities: Activity[], filter: FeedFilter): Activity[] {
  if (filter === "all") return activities;

  const me = getPlayer(CURRENT_USER_ID);

  return activities.filter((a) => {
    if (filter === "events") {
      return a.kind === "tournament";
    }
    if (filter === "friends") {
      return CURRENT_USER_FRIENDS.has(a.playerId);
    }
    if (filter === "club") {
      const poster = getPlayer(a.playerId);
      return (
        a.kind === "club_announce" ||
        (!!me?.club && !!poster?.club && me.club === poster.club) ||
        a.playerId === CURRENT_USER_ID
      );
    }
    return true;
  });
}

export function sortFeed(activities: Activity[]): Activity[] {
  return [...activities].sort((a, b) => feedScore(b) - feedScore(a));
}

// ─── Pagination ────────────────────────────────────────────────────────────────

export const PAGE_SIZE = 20;

export function getPage(
  sorted: Activity[],
  page: number,
): { items: Activity[]; hasMore: boolean } {
  const end = (page + 1) * PAGE_SIZE;
  return { items: sorted.slice(0, end), hasMore: end < sorted.length };
}
