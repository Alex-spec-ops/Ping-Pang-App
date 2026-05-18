import type { Match } from "./types";
import { players, matches } from "./data";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ClubRole = "creator" | "admin" | "member";
export type ClubVisibility = "public" | "private";

export type ClubMember = {
  playerId: string;
  role: ClubRole;
  joinedAt: string;
  clubMatchWins: number;
  clubMatchLosses: number;
};

export type ClubEvent = {
  id: string;
  clubId: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  type: "training" | "tournament" | "social" | "challenge";
  maxParticipants?: number;
  registeredIds: string[];
};

export type ClubChallenge = {
  id: string;
  challengerClubId: string;
  challengedClubId: string;
  date: string;
  venue: string;
  status: "pending" | "accepted" | "completed";
  challengerScore?: number;
  challengedScore?: number;
  winnerId?: string;
};

export type ClubAchievement = {
  id: string;
  emoji: string;
  label: string;
  description: string;
  condition: string;
  unlocked: boolean;
  unlockedAt?: string;
};

export type ClubChatMessage = {
  id: string;
  playerId: string;
  text: string;
  sentAt: string;
};

export type ClubType = "physical" | "digital";

export type ClubMembership = {
  free: boolean;
  price?: number; // € / an, undefined if free
};

export type Club = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  logo: string; // emoji
  color: string; // hex
  visibility: ClubVisibility;
  type: ClubType;
  membership: ClubMembership;
  createdAt: string;
  creatorId: string;
  members: ClubMember[];
  events: ClubEvent[];
  challenges: ClubChallenge[];
  achievements: ClubAchievement[];
  chat: ClubChatMessage[];
  city: string;
  country: string;
  countryFlag: string;
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────

export const clubs: Club[] = [
  {
    id: "c1",
    name: "Paris 13 TT",
    shortName: "P13",
    description: "Club convivial du 13e arrondissement. Tous niveaux bienvenus, du débutant au compétiteur régional. Entraînements mardi + vendredi soir.",
    logo: "🏓",
    color: "#2563eb",
    visibility: "public",
    type: "physical",
    membership: { free: false, price: 220 },
    createdAt: "2024-09-01T00:00:00Z",
    creatorId: "p5",
    city: "Paris",
    country: "France",
    countryFlag: "🇫🇷",
    members: [
      { playerId: "p5", role: "creator", joinedAt: "2024-09-01T00:00:00Z", clubMatchWins: 34, clubMatchLosses: 29 },
      { playerId: "p6", role: "admin",   joinedAt: "2024-09-05T00:00:00Z", clubMatchWins: 28, clubMatchLosses: 18 },
      { playerId: "p7", role: "member",  joinedAt: "2024-10-01T00:00:00Z", clubMatchWins: 15, clubMatchLosses: 12 },
    ],
    events: [
      {
        id: "e1", clubId: "c1",
        title: "Soirée portes ouvertes",
        description: "Vendredi soir de 19h à 23h. Tables libres, débutants bienvenus.",
        date: "2026-05-09T19:00:00Z",
        venue: "Salle Albert Camus, Paris 13",
        type: "social",
        maxParticipants: 40,
        registeredIds: ["p5", "p6"],
      },
      {
        id: "e2", clubId: "c1",
        title: "Open interne — Printemps 2026",
        description: "Tournoi interne par poules, tous niveaux. Inscription obligatoire.",
        date: "2026-05-18T09:00:00Z",
        venue: "Salle Albert Camus, Paris 13",
        type: "tournament",
        maxParticipants: 16,
        registeredIds: ["p5", "p6", "p7"],
      },
    ],
    challenges: [
      {
        id: "ch1",
        challengerClubId: "c1",
        challengedClubId: "c2",
        date: "2026-05-25T14:00:00Z",
        venue: "Salle Albert Camus, Paris 13",
        status: "accepted",
      },
    ],
    achievements: [
      { id: "a1", emoji: "🎯", label: "100 matchs en équipe", description: "Jouer 100 matchs cumulés en club.", condition: "100 matchs", unlocked: true, unlockedAt: "2026-03-15T00:00:00Z" },
      { id: "a2", emoji: "👥", label: "10 membres actifs", description: "Avoir 10 membres actifs le même mois.", condition: "10 membres actifs", unlocked: false },
      { id: "a3", emoji: "👑", label: "Dominance", description: "Meilleur ratio V/D du mois au niveau national.", condition: "Meilleur ratio du mois", unlocked: false },
    ],
    chat: [
      { id: "msg1", playerId: "p6", text: "Belle victoire ce soir les gars 🏓", sentAt: "2026-04-28T21:10:00Z" },
      { id: "msg2", playerId: "p5", text: "Merci ! On revient plus forts vendredi 💪", sentAt: "2026-04-28T21:15:00Z" },
      { id: "msg3", playerId: "p7", text: "Je serai là vendredi aussi, enfin !", sentAt: "2026-04-29T08:00:00Z" },
      { id: "msg4", playerId: "p5", text: "Top ! On sera au complet 🔥", sentAt: "2026-04-29T08:05:00Z" },
    ],
  },
  {
    id: "c2",
    name: "Lyon TT",
    shortName: "LYO",
    description: "Club sportif de haut niveau basé à Lyon. Équipe de Pro B, sections jeunes et adultes. Coach certifié fédéral.",
    logo: "🦁",
    color: "#dc2626",
    visibility: "public",
    type: "physical",
    membership: { free: false, price: 180 },
    createdAt: "2023-01-10T00:00:00Z",
    creatorId: "p6",
    city: "Lyon",
    country: "France",
    countryFlag: "🇫🇷",
    members: [
      { playerId: "p6", role: "creator", joinedAt: "2023-01-10T00:00:00Z", clubMatchWins: 88, clubMatchLosses: 51 },
      { playerId: "p7", role: "member",  joinedAt: "2024-02-01T00:00:00Z", clubMatchWins: 40, clubMatchLosses: 25 },
      { playerId: "p8", role: "member",  joinedAt: "2024-06-01T00:00:00Z", clubMatchWins: 30, clubMatchLosses: 20 },
    ],
    events: [
      {
        id: "e3", clubId: "c2",
        title: "Stage intensif — Coach Bianchi",
        description: "Stage de 3 jours avec Marco Bianchi (ex-coach national italien).",
        date: "2026-05-22T09:00:00Z",
        venue: "Salle Bellecour, Lyon",
        type: "training",
        maxParticipants: 12,
        registeredIds: ["p6", "p8"],
      },
    ],
    challenges: [
      {
        id: "ch1",
        challengerClubId: "c1",
        challengedClubId: "c2",
        date: "2026-05-25T14:00:00Z",
        venue: "Salle Albert Camus, Paris 13",
        status: "accepted",
      },
    ],
    achievements: [
      { id: "a1", emoji: "🎯", label: "100 matchs en équipe", description: "Jouer 100 matchs cumulés en club.", condition: "100 matchs", unlocked: true, unlockedAt: "2025-08-01T00:00:00Z" },
      { id: "a2", emoji: "👥", label: "10 membres actifs", description: "Avoir 10 membres actifs le même mois.", condition: "10 membres actifs", unlocked: true, unlockedAt: "2025-12-01T00:00:00Z" },
      { id: "a3", emoji: "👑", label: "Dominance", description: "Meilleur ratio V/D du mois au niveau national.", condition: "Meilleur ratio du mois", unlocked: false },
    ],
    chat: [
      { id: "msg1", playerId: "p6", text: "Stage confirmé avec Bianchi ! 🎾", sentAt: "2026-04-21T10:00:00Z" },
      { id: "msg2", playerId: "p8", text: "Super nouvelle ! Inscriptions ouvertes ?", sentAt: "2026-04-21T10:30:00Z" },
      { id: "msg3", playerId: "p6", text: "Oui, formulaire en ligne dès demain.", sentAt: "2026-04-21T10:35:00Z" },
    ],
  },
  {
    id: "c3",
    name: "Montpellier TT",
    shortName: "MTP",
    description: "Club d'élite. Home du duo Lebrun. Compétition nationale et internationale.",
    logo: "🦊",
    color: "#7c3aed",
    visibility: "private",
    type: "physical",
    membership: { free: false, price: 350 },
    createdAt: "2020-06-01T00:00:00Z",
    creatorId: "p1",
    city: "Montpellier",
    country: "France",
    countryFlag: "🇫🇷",
    members: [
      { playerId: "p1", role: "creator", joinedAt: "2020-06-01T00:00:00Z", clubMatchWins: 218, clubMatchLosses: 41 },
      { playerId: "p2", role: "admin",   joinedAt: "2020-06-01T00:00:00Z", clubMatchWins: 195, clubMatchLosses: 38 },
    ],
    events: [
      {
        id: "e4", clubId: "c3",
        title: "Entraînement prépa WTT",
        description: "Session intensive avant les WTT Contender de juin.",
        date: "2026-05-07T10:00:00Z",
        venue: "Salle Montpellier TT",
        type: "training",
        registeredIds: ["p1", "p2"],
      },
    ],
    challenges: [],
    achievements: [
      { id: "a1", emoji: "🎯", label: "100 matchs en équipe", description: "Jouer 100 matchs cumulés en club.", condition: "100 matchs", unlocked: true, unlockedAt: "2021-03-01T00:00:00Z" },
      { id: "a2", emoji: "👥", label: "10 membres actifs", description: "Avoir 10 membres actifs le même mois.", condition: "10 membres actifs", unlocked: false },
      { id: "a3", emoji: "👑", label: "Dominance", description: "Meilleur ratio V/D du mois au niveau national.", condition: "Meilleur ratio du mois", unlocked: true, unlockedAt: "2026-02-01T00:00:00Z" },
    ],
    chat: [
      { id: "msg1", playerId: "p1", text: "Alexis, t'es dispo mercredi matin ? 🏓", sentAt: "2026-04-30T09:00:00Z" },
      { id: "msg2", playerId: "p2", text: "Oui cap ! 10h ?", sentAt: "2026-04-30T09:10:00Z" },
      { id: "msg3", playerId: "p1", text: "Parfait 👍", sentAt: "2026-04-30T09:11:00Z" },
    ],
  },
  {
    id: "c4",
    name: "Berlin Open TT",
    shortName: "BLN",
    description: "International club based in Berlin. Open to all nationalities. Weekly ranked evenings.",
    logo: "🦅",
    color: "#059669",
    visibility: "public",
    type: "digital",
    membership: { free: true },
    createdAt: "2022-03-01T00:00:00Z",
    creatorId: "p8",
    city: "Berlin",
    country: "Allemagne",
    countryFlag: "🇩🇪",
    members: [
      { playerId: "p8", role: "creator", joinedAt: "2022-03-01T00:00:00Z", clubMatchWins: 132, clubMatchLosses: 70 },
      { playerId: "p4", role: "member",  joinedAt: "2023-01-01T00:00:00Z", clubMatchWins: 60, clubMatchLosses: 30 },
    ],
    events: [
      {
        id: "e5", clubId: "c4",
        title: "Berlin International Open 2026",
        description: "Grand tournoi international ouvert à tous niveaux.",
        date: "2026-06-07T09:00:00Z",
        venue: "Sporthalle Tempelhof, Berlin",
        type: "tournament",
        maxParticipants: 128,
        registeredIds: ["p8", "p4"],
      },
    ],
    challenges: [],
    achievements: [
      { id: "a1", emoji: "🎯", label: "100 matchs en équipe", description: "Jouer 100 matchs cumulés en club.", condition: "100 matchs", unlocked: true, unlockedAt: "2023-09-01T00:00:00Z" },
      { id: "a2", emoji: "👥", label: "10 membres actifs", description: "Avoir 10 membres actifs le même mois.", condition: "10 membres actifs", unlocked: false },
      { id: "a3", emoji: "👑", label: "Dominance", description: "Meilleur ratio V/D du mois au niveau national.", condition: "Meilleur ratio du mois", unlocked: false },
    ],
    chat: [
      { id: "msg1", playerId: "p8", text: "Registration for Berlin Open is live! 🎉", sentAt: "2026-04-17T11:00:00Z" },
      { id: "msg2", playerId: "p4", text: "Signed up! Let's go 🏓", sentAt: "2026-04-17T12:00:00Z" },
    ],
  },
];

// ─── Accessors ─────────────────────────────────────────────────────────────────

export function getClub(id: string): Club | undefined {
  return clubs.find((c) => c.id === id);
}

export function getUserClubs(playerId: string): Club[] {
  return clubs.filter((c) => c.members.some((m) => m.playerId === playerId));
}

export function isMember(club: Club, playerId: string): boolean {
  return club.members.some((m) => m.playerId === playerId);
}

export function getMemberRole(club: Club, playerId: string): ClubRole | null {
  return club.members.find((m) => m.playerId === playerId)?.role ?? null;
}

export function isAdmin(club: Club, playerId: string): boolean {
  const role = getMemberRole(club, playerId);
  return role === "creator" || role === "admin";
}

export type ClubStats = {
  memberCount: number;
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
};

export function getClubStats(club: Club): ClubStats {
  const totalWins   = club.members.reduce((s, m) => s + m.clubMatchWins, 0);
  const totalLosses = club.members.reduce((s, m) => s + m.clubMatchLosses, 0);
  const totalMatches = totalWins + totalLosses;
  const winRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;
  return { memberCount: club.members.length, totalMatches, totalWins, totalLosses, winRate };
}

export function getClubLeaderboard(club: Club) {
  return [...club.members]
    .map((m) => {
      const player = players.find((p) => p.id === m.playerId);
      return { ...m, player };
    })
    .filter((m) => m.player !== undefined)
    .sort((a, b) => b.clubMatchWins - a.clubMatchWins);
}

// National weekly club ranking by win-rate
export function getClubRanking(): { club: Club; stats: ClubStats; rank: number }[] {
  return clubs
    .map((c) => ({ club: c, stats: getClubStats(c) }))
    .sort((a, b) => b.stats.winRate - a.stats.winRate)
    .map((item, i) => ({ ...item, rank: i + 1 }));
}

export function getClubForPlayer(playerId: string): Club | undefined {
  const player = players.find((p) => p.id === playerId);
  if (!player?.club) return undefined;
  return clubs.find((c) => c.name === player.club);
}

// Free plan: max 3 clubs, 50 members. Premium: unlimited.
export const FREE_MAX_CLUBS = 3;
export const FREE_MAX_MEMBERS = 50;

export const CURRENT_USER_ID = "p5";
export const CURRENT_USER_IS_PREMIUM = false;
