// ─── Territory system ─────────────────────────────────────────────────────────
// A venue "belongs" to the club with the most cumulative wins on it.
// A win = any club member winning a match at that venue on a given day.
// Multiple members can contribute wins on the same day — they stack.

import { clubs, type Club } from "./clubs";

export type ClubVenueWins = {
  clubId: string;
  wins: number;
};

// venueId → array of { clubId, wins }
// Wins accumulate per-club from all member victories at the venue (any day, stackable).
const RAW_WINS: Record<string, ClubVenueWins[]> = {
  // Paris 13 TT salle (v1) — home ground of club c1
  v1: [
    { clubId: "c1", wins: 38 },
    { clubId: "c2", wins: 12 },
    { clubId: "c3", wins:  5 },
  ],
  // Tables Promenade Plantée (v2) — contested public spot
  v2: [
    { clubId: "c1", wins: 14 },
    { clubId: "c2", wins: 19 },
    { clubId: "c4", wins:  7 },
  ],
  // Club Omnisports Paris 11 (v3)
  v3: [
    { clubId: "c1", wins: 22 },
    { clubId: "c2", wins:  8 },
  ],
  // Tables Jardins Trocadéro (v4) — c4 territory
  v4: [
    { clubId: "c4", wins: 17 },
    { clubId: "c1", wins:  6 },
    { clubId: "c3", wins:  4 },
  ],
  // Le Spot — Ping-Pong Bar (v5)
  v5: [
    { clubId: "c2", wins: 24 },
    { clubId: "c1", wins: 11 },
    { clubId: "c4", wins:  9 },
  ],
  // Centre Sportif Marville (v6) — c2 territory
  v6: [
    { clubId: "c2", wins: 31 },
    { clubId: "c1", wins: 14 },
    { clubId: "c3", wins:  3 },
  ],
  // Tables Square Batignolles (v7) — c4 territory
  v7: [
    { clubId: "c4", wins: 11 },
    { clubId: "c1", wins:  4 },
  ],
  // Paris 15 TT (v8)
  v8: [
    { clubId: "c1", wins: 18 },
    { clubId: "c2", wins:  9 },
  ],
  // Palais Royal (v9) — c3 territory
  v9: [
    { clubId: "c3", wins: 13 },
    { clubId: "c1", wins:  7 },
    { clubId: "c4", wins:  5 },
  ],
  // Canal Saint-Martin (v10) — c4 territory
  v10: [
    { clubId: "c4", wins: 16 },
    { clubId: "c2", wins:  9 },
    { clubId: "c1", wins:  6 },
  ],
  // Parc de la Villette (v12) — c1 territory
  v12: [
    { clubId: "c1", wins: 27 },
    { clubId: "c2", wins: 15 },
    { clubId: "c4", wins:  8 },
  ],
  // Ping-Pang Paris (v31) — c1 home
  v31: [
    { clubId: "c1", wins: 44 },
    { clubId: "c2", wins: 18 },
    { clubId: "c3", wins:  9 },
    { clubId: "c4", wins:  6 },
  ],
};

// ─── Accessors ────────────────────────────────────────────────────────────────

/** Returns sorted leaderboard for a venue. First entry = owner. */
export function getVenueLeaderboard(venueId: string): (ClubVenueWins & { club: Club })[] {
  const raw = RAW_WINS[venueId] ?? [];
  return raw
    .map((entry) => {
      const club = clubs.find((c) => c.id === entry.clubId);
      return club ? { ...entry, club } : null;
    })
    .filter((x): x is ClubVenueWins & { club: Club } => x !== null)
    .sort((a, b) => b.wins - a.wins);
}

/** Returns the owning club (most wins), or null if no data. */
export function getVenueOwner(venueId: string): Club | null {
  const lb = getVenueLeaderboard(venueId);
  return lb.length > 0 ? lb[0].club : null;
}

/** Returns a map of venueId → ownerClub for all venues with territory data. */
export function getAllTerritories(): Map<string, Club> {
  const out = new Map<string, Club>();
  for (const venueId of Object.keys(RAW_WINS)) {
    const owner = getVenueOwner(venueId);
    if (owner) out.set(venueId, owner);
  }
  return out;
}
