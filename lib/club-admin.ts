// Admin-side data layer for the club dashboard. In-memory mock so the UI
// can be exercised without a backend. Re-exports from lib/clubs where useful.

import { clubs, type Club, type ClubMember } from "./clubs";
import { players } from "./data";

export type Subscription = {
  id: string;
  playerId: string;
  plan: "annual" | "semestrial" | "monthly";
  amount: number; // €
  startDate: string;
  endDate: string;
  status: "active" | "expiring" | "expired";
  paidVia: "card" | "transfer" | "cash" | "cheque";
};

export type ClubExpense = {
  id: string;
  label: string;
  category: "equipment" | "rent" | "coach" | "event" | "other";
  amount: number; // €
  date: string;
};

export type ClubInvoice = {
  id: string;
  subject: string;
  to: string;
  amount: number;
  date: string;
  status: "draft" | "sent" | "paid" | "overdue";
};

export type CourtBooking = {
  id: string;
  tableNumber: number;
  playerIds: string[];
  date: string; // ISO
  durationMin: number;
  purpose: "training" | "match" | "lesson" | "other";
};

export type Coaching = {
  id: string;
  coachId: string;
  studentIds: string[];
  topic: string;
  date: string;
  durationMin: number;
  notes?: string;
};

export type Tournament = {
  id: string;
  clubId: string;
  name: string;
  startDate: string;
  endDate?: string;
  format: "round-robin" | "single-elim" | "double-elim" | "swiss";
  category: "open" | "u15" | "u18" | "vets" | "women";
  entryFee: number;
  registered: string[]; // playerIds
  maxParticipants: number;
  prizePool?: number;
  status: "draft" | "open" | "live" | "closed";
};

export type ClubAnnouncement = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  authorId: string;
  audience: "all" | "competitors" | "youth" | "vets";
  pinned: boolean;
};

// ── Mock data — Paris 13 TT (club "c1") ────────────────────────────────────

export const subscriptions: Subscription[] = [
  {
    id: "s1",
    playerId: "p5",
    plan: "annual",
    amount: 220,
    startDate: "2025-09-01",
    endDate: "2026-08-31",
    status: "active",
    paidVia: "card",
  },
  {
    id: "s2",
    playerId: "p6",
    plan: "annual",
    amount: 220,
    startDate: "2025-09-01",
    endDate: "2026-08-31",
    status: "active",
    paidVia: "transfer",
  },
  {
    id: "s3",
    playerId: "p7",
    plan: "semestrial",
    amount: 130,
    startDate: "2026-02-01",
    endDate: "2026-07-31",
    status: "expiring",
    paidVia: "cash",
  },
];

export const expenses: ClubExpense[] = [
  {
    id: "x1",
    label: "Loyer salle Albert Camus — avril",
    category: "rent",
    amount: 1200,
    date: "2026-04-05",
  },
  {
    id: "x2",
    label: "Lot 50 balles Nittaku",
    category: "equipment",
    amount: 95,
    date: "2026-04-10",
  },
  {
    id: "x3",
    label: "Honoraires coach jeunes — avril",
    category: "coach",
    amount: 640,
    date: "2026-04-30",
  },
  {
    id: "x4",
    label: "Frais Open Printemps (arbitres, collations)",
    category: "event",
    amount: 310,
    date: "2026-05-18",
  },
];

export const invoices: ClubInvoice[] = [
  {
    id: "i1",
    subject: "Cotisation annuelle 2025-26 — Léon Le Calvez",
    to: "Léon Le Calvez",
    amount: 220,
    date: "2025-09-04",
    status: "paid",
  },
  {
    id: "i2",
    subject: "Stage Bianchi — acompte",
    to: "Marie Dubois",
    amount: 90,
    date: "2026-04-20",
    status: "sent",
  },
  {
    id: "i3",
    subject: "Réservation salle — événement privé",
    to: "Entreprise Adidas FR",
    amount: 480,
    date: "2026-04-12",
    status: "overdue",
  },
];

export const bookings: CourtBooking[] = [
  {
    id: "b1",
    tableNumber: 1,
    playerIds: ["p5", "p6"],
    date: "2026-05-04T19:00:00Z",
    durationMin: 90,
    purpose: "training",
  },
  {
    id: "b2",
    tableNumber: 2,
    playerIds: ["p7"],
    date: "2026-05-04T19:00:00Z",
    durationMin: 60,
    purpose: "lesson",
  },
  {
    id: "b3",
    tableNumber: 1,
    playerIds: ["p5"],
    date: "2026-05-05T18:30:00Z",
    durationMin: 60,
    purpose: "match",
  },
];

export const coachings: Coaching[] = [
  {
    id: "co1",
    coachId: "p6",
    studentIds: ["p7"],
    topic: "Service court latéral",
    date: "2026-05-04T19:00:00Z",
    durationMin: 60,
    notes: "Travailler la régularité du rebond.",
  },
  {
    id: "co2",
    coachId: "p6",
    studentIds: ["p5", "p7"],
    topic: "Schémas tactiques BO5",
    date: "2026-05-08T19:00:00Z",
    durationMin: 90,
  },
];

export const tournaments: Tournament[] = [
  {
    id: "t1",
    clubId: "c1",
    name: "Open Printemps 2026",
    startDate: "2026-05-18",
    format: "single-elim",
    category: "open",
    entryFee: 12,
    registered: ["p5", "p6", "p7"],
    maxParticipants: 16,
    prizePool: 200,
    status: "open",
  },
  {
    id: "t2",
    clubId: "c1",
    name: "Coupe jeunes < 15 ans",
    startDate: "2026-06-08",
    format: "round-robin",
    category: "u15",
    entryFee: 0,
    registered: [],
    maxParticipants: 8,
    status: "draft",
  },
];

export const announcements: ClubAnnouncement[] = [
  {
    id: "an1",
    title: "Renouvellement cotisations 2026-27",
    body: "Les cotisations 2026-27 ouvrent le 1er juin. Tarif annuel inchangé à 220 €.",
    publishedAt: "2026-04-25T10:00:00Z",
    authorId: "p5",
    audience: "all",
    pinned: true,
  },
  {
    id: "an2",
    title: "Salle fermée le 1er mai",
    body: "Pas d'entraînement jeudi 1er mai. Reprise vendredi 2.",
    publishedAt: "2026-04-28T18:00:00Z",
    authorId: "p5",
    audience: "all",
    pinned: false,
  },
];

// ── Accessors ─────────────────────────────────────────────────────────────

export function getClubBalance(clubId: string): {
  income: number;
  expenses: number;
  net: number;
} {
  const income = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.amount, 0);
  const exp = expenses.reduce((s, e) => s + e.amount, 0);
  return { income, expenses: exp, net: income - exp };
}

export function getSubscriptionRevenue(): number {
  return subscriptions
    .filter((s) => s.status !== "expired")
    .reduce((sum, s) => sum + s.amount, 0);
}

export function getActiveSubscriptions(): Subscription[] {
  return subscriptions.filter((s) => s.status !== "expired");
}

export function getExpiringSubscriptions(): Subscription[] {
  return subscriptions.filter((s) => s.status === "expiring");
}

export function getMonthlyExpensesByCategory(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const e of expenses) {
    out[e.category] = (out[e.category] ?? 0) + e.amount;
  }
  return out;
}

export function getTodayBookings(): CourtBooking[] {
  const today = new Date().toISOString().slice(0, 10);
  return bookings.filter((b) => b.date.slice(0, 10) === today);
}

export function getUpcomingTournaments(): Tournament[] {
  const now = new Date();
  return tournaments
    .filter((t) => new Date(t.startDate) >= now)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

// Default "active" club for the demo: Paris 13 TT (creator = p5 = current user).
export const DEFAULT_CLUB_ID = "c1";

export function getDefaultClub(): Club {
  return clubs.find((c) => c.id === DEFAULT_CLUB_ID) ?? clubs[0];
}

export function memberOfClub(club: Club, playerId: string): ClubMember | undefined {
  return club.members.find((m) => m.playerId === playerId);
}

export function playerName(playerId: string): string {
  return players.find((p) => p.id === playerId)?.fullName ?? "—";
}
