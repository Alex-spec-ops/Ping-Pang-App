import { players } from "./data";

export type ChallengeMode = "ranked" | "casual";
export type ChallengeStatus = "open" | "pending" | "active" | "completed";

export type PlayerChallenge = {
  id: string;
  creatorId: string;
  opponentId?: string; // undefined = ouvert à tous
  status: ChallengeStatus;
  mode: ChallengeMode;
  format: "BO3" | "BO5" | "BO7";
  venue?: string;
  scheduledAt?: string;
  message?: string;
  createdAt: string;
};

// Données mock — CURRENT_USER = "p5" (Léon)
export const challenges: PlayerChallenge[] = [
  // Défi actif : Léon a défié Marie → accepté
  {
    id: "pch1",
    creatorId: "p5",
    opponentId: "p6",
    status: "active",
    mode: "ranked",
    format: "BO5",
    venue: "Paris 13 TT",
    scheduledAt: "2026-05-10T19:00:00Z",
    message: "Revanche longtemps attendue 🔥",
    createdAt: "2026-05-04T18:00:00Z",
  },
  // Défi en attente : Alexis a défié Léon (pending acceptance)
  {
    id: "pch2",
    creatorId: "p2",
    opponentId: "p5",
    status: "pending",
    mode: "casual",
    format: "BO3",
    venue: "Montpellier TT",
    scheduledAt: "2026-05-11T16:00:00Z",
    message: "Revanche du match d'avril 😤",
    createdAt: "2026-05-06T09:00:00Z",
  },
  // Défis ouverts (joinables)
  {
    id: "pch3",
    creatorId: "p1",
    status: "open",
    mode: "ranked",
    format: "BO5",
    message: "Cherche adversaire sérieux, niveau 1400+. Viens me défier !",
    createdAt: "2026-05-07T08:00:00Z",
  },
  {
    id: "pch4",
    creatorId: "p3",
    status: "open",
    mode: "casual",
    format: "BO3",
    venue: "Pékin — salle nationale",
    message: "Session amicale pour décompresser 🐉",
    createdAt: "2026-05-06T20:00:00Z",
  },
  {
    id: "pch5",
    creatorId: "p7",
    status: "open",
    mode: "ranked",
    format: "BO3",
    scheduledAt: "2026-05-12T18:00:00Z",
    message: "Barcelone 🐂 — venez me défier !",
    createdAt: "2026-05-05T14:00:00Z",
  },
  {
    id: "pch6",
    creatorId: "p8",
    status: "open",
    mode: "ranked",
    format: "BO7",
    venue: "Berlin — Sporthalle Tempelhof",
    message: "Long format pour joueurs expérimentés uniquement",
    createdAt: "2026-05-06T16:00:00Z",
  },
  {
    id: "pch7",
    creatorId: "p4",
    status: "open",
    mode: "casual",
    format: "BO5",
    scheduledAt: "2026-05-13T14:00:00Z",
    message: "Fun match avant le tournoi de juin !",
    createdAt: "2026-05-05T10:00:00Z",
  },
];

export function getChallengeCreator(challenge: PlayerChallenge) {
  return players.find((p) => p.id === challenge.creatorId);
}

export function getChallengeOpponent(challenge: PlayerChallenge) {
  if (!challenge.opponentId) return null;
  return players.find((p) => p.id === challenge.opponentId) ?? null;
}

export function formatScheduledAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function modeLabel(mode: ChallengeMode) {
  return mode === "ranked" ? "Classé" : "Amical";
}
