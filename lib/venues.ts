// ─── Types ────────────────────────────────────────────────────────────────────

export type VenueType    = "club" | "public" | "bar";
export type Surface      = "indoor" | "outdoor";
export type Pricing      = "free" | "paid" | "membership";

export type HourSlot = { days: string; time: string };

export type Venue = {
  id: string;
  name: string;
  address: string;
  arrondissement: number;
  lat: number;
  lng: number;
  type: VenueType;
  surface: Surface;
  pricing: Pricing;
  priceInfo?: string;
  tables: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  hours: HourSlot[];
  photos: Array<[string, string]>; // [gradientFrom, gradientTo]
  description: string;
};

export type VenueReview = {
  id: string;
  venueId: string;
  authorName: string;
  authorEmoji: string;
  rating: number;
  comment: string;
  tables: number;
  ambiance: number;
  cleanliness: number;
  accessibility: number;
  createdAt: string;
};

// ─── Venues ───────────────────────────────────────────────────────────────────

export const venues: Venue[] = [
  {
    id: "v1",
    name: "Paris 13 TT",
    address: "27 rue Nationale, Paris 13e",
    arrondissement: 13,
    lat: 48.8310, lng: 2.3600,
    type: "club", surface: "indoor", pricing: "membership",
    priceInfo: "Licence FFTT + cotisation ~80 €/an",
    tables: 12, rating: 4.8, reviewCount: 48,
    tags: ["Compétition", "Entraîneur certifié", "Vestiaires", "Classement officiel"],
    hours: [
      { days: "Lun–Ven", time: "18h–22h" },
      { days: "Sam", time: "9h–18h" },
      { days: "Dim", time: "Fermé" },
    ],
    photos: [["#10b981","#059669"],["#3b82f6","#1d4ed8"],["#8b5cf6","#6d28d9"]],
    description: "Club affilié FFTT avec équipes en championnat National. Salle professionnelle avec 12 tables Cornilleau et éclairage LED.",
  },
  {
    id: "v2",
    name: "Tables Promenade Plantée",
    address: "Avenue Daumesnil, Paris 12e",
    arrondissement: 12,
    lat: 48.8490, lng: 2.3870,
    type: "public", surface: "outdoor", pricing: "free",
    tables: 4, rating: 4.3, reviewCount: 112,
    tags: ["Gratuit", "Cadre verdoyant", "Débutants bienvenus", "Animé le week-end"],
    hours: [{ days: "Tous les jours", time: "Lever–coucher du soleil" }],
    photos: [["#34d399","#059669"],["#86efac","#4ade80"],["#a7f3d0","#6ee7b7"]],
    description: "Quatre tables gratuites en accès libre sur la célèbre promenade aérienne. Belle atmosphère, idéal pour les parties décontractées.",
  },
  {
    id: "v3",
    name: "Club Omnisports Paris 11",
    address: "3 rue Duranti, Paris 11e",
    arrondissement: 11,
    lat: 48.8590, lng: 2.3826,
    type: "club", surface: "indoor", pricing: "paid",
    priceInfo: "5 €/séance ou abonnement 35 €/mois",
    tables: 8, rating: 4.1, reviewCount: 67,
    tags: ["Tables pro", "Éclairage professionnel", "Accessible PMR", "Cours disponibles"],
    hours: [
      { days: "Lun, Mer, Ven", time: "17h–22h" },
      { days: "Mar, Jeu", time: "12h–14h · 17h–22h" },
      { days: "Sam–Dim", time: "10h–19h" },
    ],
    photos: [["#f59e0b","#d97706"],["#fbbf24","#f59e0b"],["#fde68a","#fcd34d"]],
    description: "Salle polyvalente avec section ping-pong active. 8 tables Stiga disponibles. Ambiance conviviale, tous niveaux acceptés.",
  },
  {
    id: "v4",
    name: "Tables Jardins du Trocadéro",
    address: "Place du Trocadéro, Paris 16e",
    arrondissement: 16,
    lat: 48.8617, lng: 2.2924,
    type: "public", surface: "outdoor", pricing: "free",
    tables: 3, rating: 3.8, reviewCount: 89,
    tags: ["Gratuit", "Vue Tour Eiffel", "Très fréquenté"],
    hours: [{ days: "Tous les jours", time: "7h–22h" }],
    photos: [["#60a5fa","#2563eb"],["#93c5fd","#60a5fa"],["#bfdbfe","#93c5fd"]],
    description: "Tables en plein air avec une vue imprenable sur la Tour Eiffel. Très touristique mais accessible à tous.",
  },
  {
    id: "v5",
    name: "Le Spot — Ping-Pong Bar",
    address: "42 rue des Vinaigriers, Paris 10e",
    arrondissement: 10,
    lat: 48.8740, lng: 2.3568,
    type: "bar", surface: "indoor", pricing: "paid",
    priceInfo: "12 €/h la table, boissons en plus",
    tables: 6, rating: 4.5, reviewCount: 204,
    tags: ["Bar & restauration", "Ambiance festive", "Réservation recommandée", "Soirées thématiques"],
    hours: [
      { days: "Mer–Ven", time: "17h–2h" },
      { days: "Sam–Dim", time: "14h–2h" },
      { days: "Lun–Mar", time: "Fermé" },
    ],
    photos: [["#ec4899","#be185d"],["#f9a8d4","#ec4899"],["#6366f1","#4338ca"]],
    description: "Bar branché du 10e avec 6 tables réservables. Cocktails, musique et ping-pong : la combinaison parfaite pour une soirée entre amis.",
  },
  {
    id: "v6",
    name: "Centre Sportif Marville",
    address: "10 avenue de la Porte de la Villette, Paris 19e",
    arrondissement: 19,
    lat: 48.8834, lng: 2.3864,
    type: "club", surface: "indoor", pricing: "paid",
    priceInfo: "3 €/h (tarif Paris) sur présentation carte Paris",
    tables: 16, rating: 4.6, reviewCount: 133,
    tags: ["Tables pro", "16 tables", "Éclairage LED", "Vestiaires", "Parking"],
    hours: [
      { days: "Lun–Ven", time: "8h–22h" },
      { days: "Sam", time: "8h–20h" },
      { days: "Dim", time: "8h–18h" },
    ],
    photos: [["#0ea5e9","#0284c7"],["#38bdf8","#0ea5e9"],["#7dd3fc","#38bdf8"]],
    description: "Grand complexe sportif municipal avec une salle de tennis de table de haut niveau. Idéal pour l'entraînement sérieux.",
  },
  {
    id: "v7",
    name: "Tables Square des Batignolles",
    address: "148 rue Cardinet, Paris 17e",
    arrondissement: 17,
    lat: 48.8839, lng: 2.3170,
    type: "public", surface: "outdoor", pricing: "free",
    tables: 2, rating: 3.9, reviewCount: 41,
    tags: ["Gratuit", "Calme", "Quartier résidentiel"],
    hours: [{ days: "Tous les jours", time: "8h–21h30" }],
    photos: [["#84cc16","#4d7c0f"],["#a3e635","#84cc16"],["#d9f99d","#bef264"]],
    description: "Deux tables en béton dans un square verdoyant du 17e. Peu connues des touristes, plus tranquilles que les grands parcs.",
  },
  {
    id: "v8",
    name: "Paris 15 TT",
    address: "22 rue Fondary, Paris 15e",
    arrondissement: 15,
    lat: 48.8390, lng: 2.2990,
    type: "club", surface: "indoor", pricing: "membership",
    priceInfo: "Licence FFTT + cotisation 90 €/an",
    tables: 10, rating: 4.4, reviewCount: 77,
    tags: ["Compétition D1", "Baby-ping", "Cours collectifs", "Vestiaires"],
    hours: [
      { days: "Lun, Mer, Ven", time: "18h30–22h" },
      { days: "Mar, Jeu", time: "18h–22h" },
      { days: "Sam", time: "10h–17h" },
    ],
    photos: [["#f97316","#ea580c"],["#fb923c","#f97316"],["#fdba74","#fb923c"]],
    description: "Club dynamique du 15e avec des équipes à tous les niveaux. Programme baby-ping pour les 6–10 ans le mercredi.",
  },
  {
    id: "v9",
    name: "Tables Palais Royal",
    address: "Place du Palais Royal, Paris 1er",
    arrondissement: 1,
    lat: 48.8638, lng: 2.3366,
    type: "public", surface: "outdoor", pricing: "free",
    tables: 2, rating: 4.0, reviewCount: 156,
    tags: ["Gratuit", "Cadre historique", "Centre Paris", "Très touristique"],
    hours: [{ days: "Tous les jours", time: "7h–21h" }],
    photos: [["#a78bfa","#7c3aed"],["#c4b5fd","#a78bfa"],["#ddd6fe","#c4b5fd"]],
    description: "Tables mythiques sous les arcades du Palais Royal. Cadre exceptionnel, fréquentées par les Parisiens et touristes.",
  },
  {
    id: "v10",
    name: "Tables Canal Saint-Martin",
    address: "Quai de Valmy, Paris 10e",
    arrondissement: 10,
    lat: 48.8680, lng: 2.3620,
    type: "public", surface: "outdoor", pricing: "free",
    tables: 3, rating: 4.2, reviewCount: 98,
    tags: ["Gratuit", "Bord du canal", "Animé le soir", "Décontracté"],
    hours: [{ days: "Tous les jours", time: "9h–22h" }],
    photos: [["#06b6d4","#0891b2"],["#22d3ee","#06b6d4"],["#67e8f9","#22d3ee"]],
    description: "Tables bien entretenues le long du Canal Saint-Martin. Ambiance bobo détendue, apporter sa balle (volées par les pigeons sinon).",
  },
  {
    id: "v11",
    name: "Stade Aquatique Paris 14",
    address: "12 rue Louis-Armand, Paris 14e",
    arrondissement: 14,
    lat: 48.8280, lng: 2.3264,
    type: "club", surface: "indoor", pricing: "paid",
    priceInfo: "6 €/séance adulte, 3 €/séance jeune",
    tables: 7, rating: 4.0, reviewCount: 44,
    tags: ["Équipement récent", "Accessible PMR", "Parking vélo"],
    hours: [
      { days: "Mar–Ven", time: "16h–22h" },
      { days: "Sam–Dim", time: "9h–19h" },
      { days: "Lun", time: "Fermé" },
    ],
    photos: [["#14b8a6","#0f766e"],["#2dd4bf","#14b8a6"],["#5eead4","#2dd4bf"]],
    description: "Salle de ping-pong associée au complexe sportif du 14e. Tables Butterfly récentes, vestiaires modernes.",
  },
  {
    id: "v12",
    name: "Tables Parc de la Villette",
    address: "211 avenue Jean Jaurès, Paris 19e",
    arrondissement: 19,
    lat: 48.8950, lng: 2.3930,
    type: "public", surface: "outdoor", pricing: "free",
    tables: 6, rating: 4.4, reviewCount: 187,
    tags: ["Gratuit", "6 tables", "Familles", "Animé"],
    hours: [{ days: "Tous les jours", time: "6h–1h" }],
    photos: [["#f43f5e","#be123c"],["#fb7185","#f43f5e"],["#fda4af","#fb7185"]],
    description: "L'un des meilleurs spots gratuits de Paris avec 6 tables bien entretenues. Très fréquenté le week-end, ambiance familiale.",
  },
];

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const venueReviews: VenueReview[] = [
  // v1 - Paris 13 TT
  { id: "r1",  venueId: "v1",  authorName: "Léon L.",     authorEmoji: "🐧", rating: 5, comment: "Mon club depuis 2 ans. Entraîneur top, équipe compétitive et ambiance super saine.", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-04-10T18:00:00Z" },
  { id: "r2",  venueId: "v1",  authorName: "Marie D.",    authorEmoji: "🦋", rating: 5, comment: "Niveau d'exigence excellent. Tables Cornilleau, éclairage LED parfait.", tables: 5, ambiance: 5, cleanliness: 5, accessibility: 3, createdAt: "2026-03-22T09:00:00Z" },
  { id: "r3",  venueId: "v1",  authorName: "Carlos D.",   authorEmoji: "🐂", rating: 4, comment: "Très bon club, vestiaires un peu vétustes mais l'essentiel est là.", tables: 5, ambiance: 4, cleanliness: 3, accessibility: 4, createdAt: "2026-02-14T19:00:00Z" },
  // v2 - Promenade Plantée
  { id: "r4",  venueId: "v2",  authorName: "Sofia M.",    authorEmoji: "🦌", rating: 4, comment: "Parfait pour une partie improvisée. Apporter sa balle, les filets sont en bon état.", tables: 3, ambiance: 5, cleanliness: 4, accessibility: 5, createdAt: "2026-04-18T14:00:00Z" },
  { id: "r5",  venueId: "v2",  authorName: "Félix L.",    authorEmoji: "🦊", rating: 5, comment: "Top spot pour s'échauffer. Le weekend c'est animé, semaine c'est paisible.", tables: 4, ambiance: 5, cleanliness: 3, accessibility: 4, createdAt: "2026-03-08T11:00:00Z" },
  // v5 - Le Spot
  { id: "r6",  venueId: "v5",  authorName: "Alexis L.",   authorEmoji: "🐺", rating: 5, comment: "Soirée incroyable ! Tables bien entretenues, cocktails excellents. Réserver obligatoire.", tables: 4, ambiance: 5, cleanliness: 5, accessibility: 4, createdAt: "2026-04-25T23:00:00Z" },
  { id: "r7",  venueId: "v5",  authorName: "Marie D.",    authorEmoji: "🦋", rating: 4, comment: "Excellent pour un afterwork. Un peu cher mais l'ambiance vaut le prix.", tables: 4, ambiance: 5, cleanliness: 4, accessibility: 3, createdAt: "2026-04-01T20:00:00Z" },
  // v6 - Marville
  { id: "r8",  venueId: "v6",  authorName: "Carlos D.",   authorEmoji: "🐂", rating: 5, comment: "16 tables, éclairage professionnel, prix municipal imbattable. LA salle de Paris.", tables: 5, ambiance: 4, cleanliness: 5, accessibility: 5, createdAt: "2026-04-05T17:00:00Z" },
  { id: "r9",  venueId: "v6",  authorName: "Sofia M.",    authorEmoji: "🦌", rating: 4, comment: "Grand complexe bien géré. Parking pratique. Parfois un peu bruyant avec d'autres sports.", tables: 5, ambiance: 4, cleanliness: 4, accessibility: 5, createdAt: "2026-03-12T15:00:00Z" },
  // v12 - Villette
  { id: "r10", venueId: "v12", authorName: "Léon L.",     authorEmoji: "🐧", rating: 4, comment: "6 tables en accès libre, c'est rare ! Parfois il faut attendre le weekend.", tables: 4, ambiance: 5, cleanliness: 3, accessibility: 5, createdAt: "2026-04-20T16:00:00Z" },
  { id: "r11", venueId: "v12", authorName: "Félix L.",    authorEmoji: "🦊", rating: 5, comment: "Meilleur spot gratuit de Paris. Grand espace, bonnes vibrations.", tables: 4, ambiance: 5, cleanliness: 4, accessibility: 5, createdAt: "2026-03-28T14:00:00Z" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getVenueReviews(venueId: string): VenueReview[] {
  return venueReviews.filter((r) => r.venueId === venueId);
}

export function pinColor(rating: number): string {
  if (rating >= 4.5) return "#10b981";
  if (rating >= 3.5) return "#f59e0b";
  return "#ef4444";
}

/** Haversine distance in km */
export function distanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function moderateReview(text: string): { ok: boolean; reason?: string } {
  if (text.trim().length < 10) return { ok: false, reason: "Commentaire trop court (min. 10 caractères)." };
  if (text.length > 500) return { ok: false, reason: "Commentaire trop long (max 500 caractères)." };
  const banned = ["http", "casino", "xxx", "spam", "arnaque"];
  for (const w of banned) {
    if (text.toLowerCase().includes(w))
      return { ok: false, reason: "Contenu signalé comme inapproprié." };
  }
  return { ok: true };
}
