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
    lat: 48.8238452, lng: 2.3680586,
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
    lat: 48.8368249, lng: 2.4031250,
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
    lat: 48.8604366, lng: 2.3828485,
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
    lat: 48.8621548, lng: 2.2887657,
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
    lat: 48.8732126, lng: 2.3612691,
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
    lat: 48.8998415, lng: 2.3876126,
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
    lat: 48.8880398, lng: 2.3151195,
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
    lat: 48.8481539, lng: 2.2929107,
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
    lat: 48.8625640, lng: 2.3367804,
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
    lat: 48.8782265, lng: 2.3658760,
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
    lat: 48.8326591, lng: 2.2789914,
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
    lat: 48.8922406, lng: 2.3878226,
    type: "public", surface: "outdoor", pricing: "free",
    tables: 6, rating: 4.4, reviewCount: 187,
    tags: ["Gratuit", "6 tables", "Familles", "Animé"],
    hours: [{ days: "Tous les jours", time: "6h–1h" }],
    photos: [["#f43f5e","#be123c"],["#fb7185","#f43f5e"],["#fda4af","#fb7185"]],
    description: "L'un des meilleurs spots gratuits de Paris avec 6 tables bien entretenues. Très fréquenté le week-end, ambiance familiale.",
  },

  // ── Ping-Pang PARIS — le club de l'app ───────────────────────────────────

  {
    id: "v31",
    name: "Ping-Pang Paris",
    address: "171 Rue du Chevaleret, 75013 Paris",
    arrondissement: 13,
    lat: 48.83321746957268, lng: 2.369769264677102,
    type: "bar", surface: "indoor", pricing: "paid",
    priceInfo: "Réservation via application mobile",
    tables: 10, rating: 4.7, reviewCount: 1,
    tags: ["Bar & club", "Digitalisé", "Réservation app", "Créateurs pros", "Ambiance sociale", "Vêtements éco", "Ping Pod", "Près de Station F"],
    hours: [
      { days: "Lun–Jeu, Dim", time: "10h–23h" },
      { days: "Ven–Sam",      time: "10h–00h" },
    ],
    photos: [["#10b981","#059669"],["#34d399","#10b981"],["#6ee7b7","#34d399"]],
    description: "Premier « Ping Pod » à la française, créé par les pros Quentin Robinot, Antoine Hachard et Quentin Pradelle. Club nouvelle génération entièrement digitalisé : réservation via app, ambiance bar & sport, approche décontractée du ping-pong haut niveau. Également marque de vêtements éco-responsables. Métro Chevaleret (L6) — à côté de Station F.",
  },

  // ── Clubs ajoutés ─────────────────────────────────────────────────────────

  {
    id: "v13",
    name: "Union Sportive du 2ème (US2TT)",
    address: "Gymnase Jean Dame, 17 rue Léopold Bellan, 75002 Paris",
    arrondissement: 2,
    lat: 48.8665777, lng: 2.3454999,
    type: "club", surface: "indoor", pricing: "membership",
    tables: 5, rating: 5.0, reviewCount: 1,
    tags: ["FFTT", "Tous niveaux", "Débutants", "Compétiteurs"],
    hours: [
      { days: "Mar", time: "19h30–22h30" },
      { days: "Mer", time: "18h–19h30" },
      { days: "Ven", time: "18h–22h30" },
      { days: "Sam", time: "9h–14h" },
      { days: "Dim", time: "10h–14h30" },
      { days: "Lun, Jeu", time: "Fermé" },
    ],
    photos: [["#6366f1","#4338ca"],["#818cf8","#6366f1"],["#a5b4fc","#818cf8"]],
    description: "Club affilié FFTT accueillant tous niveaux, débutants et compétiteurs.",
  },
  {
    id: "v14",
    name: "APSM5",
    address: "19 rue Tournefort, 75005 Paris",
    arrondissement: 5,
    lat: 48.8435160, lng: 2.3481739,
    type: "club", surface: "indoor", pricing: "membership",
    tables: 4, rating: 5.0, reviewCount: 2,
    tags: ["Multisports", "Tous âges", "Tous niveaux", "FFTT"],
    hours: [
      { days: "Lun–Mar, Jeu–Ven", time: "16h30–19h" },
      { days: "Mer", time: "9h–19h" },
      { days: "Sam", time: "9h–10h30" },
      { days: "Dim", time: "Fermé" },
    ],
    photos: [["#0ea5e9","#0284c7"],["#38bdf8","#0ea5e9"],["#7dd3fc","#38bdf8"]],
    description: "Club multisports avec section tennis de table, ouvert à tous les âges et tous les niveaux.",
  },
  {
    id: "v15",
    name: "AS Pongistes du 8ème",
    address: "Gymnase Roquepine, 18 rue Roquepine, 75008 Paris",
    arrondissement: 8,
    lat: 48.8733341, lng: 2.3182727,
    type: "club", surface: "indoor", pricing: "membership",
    tables: 4, rating: 4.3, reviewCount: 3,
    tags: ["Amateur", "Professionnel", "Quartier"],
    hours: [{ days: "Horaires", time: "Non renseignés publiquement" }],
    photos: [["#f59e0b","#d97706"],["#fbbf24","#f59e0b"],["#fde68a","#fcd34d"]],
    description: "Club de quartier pour joueurs amateurs et professionnels.",
  },
  {
    id: "v16",
    name: "Paris IX ATT",
    address: "54 rue Jean-Baptiste Pigalle, 75009 Paris",
    arrondissement: 9,
    lat: 48.8809852, lng: 2.3359342,
    type: "club", surface: "indoor", pricing: "membership",
    tables: 12, rating: 5.0, reviewCount: 2,
    tags: ["250 licenciés", "3 entraîneurs", "2 salles", "Compétition", "FFTT"],
    hours: [
      { days: "Lun–Mar", time: "18h30–22h15" },
      { days: "Mer", time: "9h–19h" },
      { days: "Jeu", time: "19h30–22h15" },
      { days: "Ven", time: "18h15–22h15" },
      { days: "Sam", time: "14h–20h" },
      { days: "Dim", time: "12h–18h" },
    ],
    photos: [["#10b981","#059669"],["#34d399","#10b981"],["#6ee7b7","#34d399"]],
    description: "Grand club de référence avec près de 250 licenciés, 3 entraîneurs, 2 salles d'entraînement. Installations modernes pour tous niveaux.",
  },
  {
    id: "v17",
    name: "US Métro TT",
    address: "11 Allée Verte, 75011 Paris",
    arrondissement: 11,
    lat: 48.8596271, lng: 2.3710611,
    type: "club", surface: "indoor", pricing: "membership",
    tables: 8, rating: 4.5, reviewCount: 2,
    tags: ["Omnisports", "FFTT", "Rive droite"],
    hours: [
      { days: "Lun, Mer–Sam", time: "9h–12h · 15h30–20h30" },
      { days: "Mar", time: "9h–17h" },
      { days: "Dim", time: "9h–12h · 15h30–20h30" },
    ],
    photos: [["#8b5cf6","#6d28d9"],["#a78bfa","#8b5cf6"],["#c4b5fd","#a78bfa"]],
    description: "Section tennis de table d'un grand club omnisports de la rive droite.",
  },
  {
    id: "v18",
    name: "Espérance de Reuilly",
    address: "Gymnase Carnot, 26 boulevard de Carnot, 75012 Paris",
    arrondissement: 12,
    lat: 48.8454124, lng: 2.4133613,
    type: "club", surface: "indoor", pricing: "membership",
    tables: 8, rating: 5.0, reviewCount: 1,
    tags: ["Fondé en 1914", "FFTT", "Histoire", "Compétition"],
    hours: [
      { days: "Lun", time: "18h30–23h30" },
      { days: "Mar", time: "17h30–22h" },
      { days: "Mer", time: "17h–22h" },
      { days: "Jeu", time: "17h30–21h30" },
      { days: "Ven", time: "18h–22h30" },
      { days: "Sam", time: "13h–19h" },
      { days: "Dim", time: "9h–17h" },
    ],
    photos: [["#ef4444","#b91c1c"],["#f87171","#ef4444"],["#fca5a5","#f87171"]],
    description: "Institution fondée en 1914, forme les meilleurs pongistes de l'arrondissement depuis plus d'un siècle.",
  },
  {
    id: "v19",
    name: "CSMF Paris TT",
    address: "Salle Auriol, 41 Boulevard Vincent Auriol, 75013 Paris",
    arrondissement: 13,
    lat: 48.8357571, lng: 2.3708388,
    type: "club", surface: "indoor", pricing: "membership",
    tables: 6, rating: 4.5, reviewCount: 2,
    tags: ["Salle dédiée", "Corporatif", "FFTT"],
    hours: [
      { days: "Lun–Mar, Jeu–Ven", time: "14h–22h" },
      { days: "Mer", time: "16h–20h" },
      { days: "Sam–Dim", time: "Fermé" },
    ],
    photos: [["#14b8a6","#0f766e"],["#2dd4bf","#14b8a6"],["#5eead4","#2dd4bf"]],
    description: "Club corporatif avec salle dédiée.",
  },
  {
    id: "v20",
    name: "AS Vietnam",
    address: "25 avenue Porte d'Ivry, 75013 Paris",
    arrondissement: 13,
    lat: 48.8206403, lng: 2.3706275,
    type: "club", surface: "indoor", pricing: "membership",
    tables: 4, rating: 4.0, reviewCount: 1,
    tags: ["Communautaire", "Accueil", "FFTT"],
    hours: [
      { days: "Lun–Mar, Ven–Sam", time: "8h–19h" },
      { days: "Mer", time: "8h–19h" },
      { days: "Dim", time: "8h–19h" },
      { days: "Jeu", time: "Fermé" },
    ],
    photos: [["#f97316","#ea580c"],["#fb923c","#f97316"],["#fdba74","#fb923c"]],
    description: "Club communautaire dans le 13ème.",
  },
  {
    id: "v21",
    name: "AS FFTT",
    address: "3 rue Dieudonné Costes, 75013 Paris",
    arrondissement: 13,
    lat: 48.8204213, lng: 2.3697578,
    type: "club", surface: "indoor", pricing: "membership",
    tables: 6, rating: 4.0, reviewCount: 3,
    tags: ["FFTT", "Fédération"],
    hours: [
      { days: "Lun–Jeu", time: "9h–12h · 13h–17h30" },
      { days: "Ven", time: "9h–12h · 13h–16h" },
    ],
    photos: [["#06b6d4","#0891b2"],["#22d3ee","#06b6d4"],["#67e8f9","#22d3ee"]],
    description: "Association affiliée à la Fédération Française de Tennis de Table.",
  },
  {
    id: "v22",
    name: "Paris 13 TT — Château des Rentiers",
    address: "184 rue Château des Rentiers, 75013 Paris",
    arrondissement: 13,
    lat: 48.8296356, lng: 2.3636736,
    type: "club", surface: "indoor", pricing: "membership",
    tables: 12, rating: 5.0, reviewCount: 1,
    tags: ["280 membres", "3 salles", "Baby Ping", "Inclusif", "4 Labels FFTT", "Entraîneurs diplômés"],
    hours: [
      { days: "Mar–Ven", time: "7h–8h30" },
      { days: "Sam–Dim", time: "7h–18h" },
    ],
    photos: [["#10b981","#059669"],["#34d399","#10b981"],["#a7f3d0","#6ee7b7"]],
    description: "Club dynamique du débutant au niveau professionnel. 4 Labels FFTT, salles équipées, entraîneurs diplômés, école des jeunes, créneaux inclusifs pour personnes en situation de handicap.",
  },
  {
    id: "v23",
    name: "Ping Paris 14",
    address: "8 rue Commandant René Mouchotte, 75014 Paris",
    arrondissement: 14,
    lat: 48.8396617, lng: 2.3208512,
    type: "club", surface: "indoor", pricing: "membership",
    tables: 6, rating: 4.7, reviewCount: 3,
    tags: ["Débutants", "Confirmés", "Accompagnement"],
    hours: [{ days: "Horaires", time: "Non renseignés" }],
    photos: [["#a78bfa","#7c3aed"],["#c4b5fd","#a78bfa"],["#ddd6fe","#c4b5fd"]],
    description: "Club accueillant avec espaces adaptés et accompagnement personnalisé pour débutants et joueurs confirmés.",
  },
  {
    id: "v24",
    name: "ATT XV",
    address: "18 rue Gaston de Caillavet, 75015 Paris",
    arrondissement: 15,
    lat: 48.8489433, lng: 2.2844104,
    type: "club", surface: "indoor", pricing: "membership",
    tables: 6, rating: 5.0, reviewCount: 2,
    tags: ["Loisir", "Compétition", "Collectif", "FFTT"],
    hours: [{ days: "Horaires", time: "Non renseignés" }],
    photos: [["#84cc16","#4d7c0f"],["#a3e635","#84cc16"],["#d9f99d","#bef264"]],
    description: "Club dynamique proposant des options ludiques et compétitives, entraînements collectifs.",
  },
  {
    id: "v25",
    name: "TT16 — Tennis de Table Paris 16",
    address: "Centre sportif Porte de La Muette, 60 Boulevard Lannes, 75016 Paris",
    arrondissement: 16,
    lat: 48.8642636, lng: 2.2688986,
    type: "club", surface: "indoor", pricing: "membership",
    priceInfo: "250 €/an + licence 8 €",
    tables: 16, rating: 5.0, reviewCount: 1,
    tags: ["16 tables", "600 m²", "Ultimate Ping", "7–77 ans", "2 entraîneurs", "Cours individuels", "FFTT"],
    hours: [
      { days: "Lun", time: "19h30–21h30" },
      { days: "Mar", time: "17h30–19h30 · 19h30–21h30" },
      { days: "Mer", time: "15h–16h30 · 16h30–18h · 18h–19h30 · 19h30–21h30" },
      { days: "Jeu", time: "17h30–19h30 · 19h30–21h30" },
      { days: "Ven", time: "14h–16h30 · 17h30–19h30 · 19h30–21h30" },
      { days: "Sam", time: "10h15–13h15 · 14h–19h" },
    ],
    photos: [["#3b82f6","#1d4ed8"],["#60a5fa","#3b82f6"],["#93c5fd","#60a5fa"]],
    description: "Club créé en 2008. Salle dédiée de 600 m² avec 16 tables, espaces de préparation physique. Accueille joueurs de 7 à 77 ans. Pionnier de l'Ultimate Ping à Paris (5h/semaine dédiées).",
  },
  {
    id: "v26",
    name: "Lepic Populaire",
    address: "Chapelle Internationale, 47 rue des Cheminots, 75018 Paris",
    arrondissement: 18,
    lat: 48.8976206, lng: 2.3562531,
    type: "club", surface: "indoor", pricing: "membership",
    tables: 6, rating: 4.5, reviewCount: 2,
    tags: ["Multi-sites", "18ème", "FFTT"],
    hours: [
      { days: "Lun, Jeu", time: "18h–22h" },
      { days: "Mar", time: "18h–21h" },
      { days: "Mer", time: "18h–21h30" },
      { days: "Sam", time: "14h–17h" },
      { days: "Ven, Dim", time: "Fermé" },
    ],
    photos: [["#ec4899","#be185d"],["#f9a8d4","#ec4899"],["#fce7f3","#f9a8d4"]],
    description: "Club avec plusieurs lieux d'entraînement dans le 18ème.",
  },
  {
    id: "v27",
    name: "Amicale Manin Sport Paris-Est",
    address: "Gymnase des Lilas, 5-7 rue des Lilas, 75019 Paris",
    arrondissement: 19,
    lat: 48.8784870, lng: 2.3955116,
    type: "club", surface: "indoor", pricing: "membership",
    tables: 8, rating: 4.7, reviewCount: 3,
    tags: ["Omnisports", "Loisir", "Compétition", "FFTT"],
    hours: [{ days: "Horaires", time: "Non renseignés" }],
    photos: [["#f59e0b","#d97706"],["#fbbf24","#f59e0b"],["#fde68a","#fcd34d"]],
    description: "Club omnisports important avec grosse section tennis de table, ouvert en loisir et compétition.",
  },
  {
    id: "v28",
    name: "USCC",
    address: "Gymnase Curial, 84 rue Curial, 75019 Paris",
    arrondissement: 19,
    lat: 48.8949162, lng: 2.3746128,
    type: "club", surface: "indoor", pricing: "membership",
    tables: 4, rating: 4.0, reviewCount: 2,
    tags: ["Quartier", "FFTT"],
    hours: [{ days: "Horaires", time: "Non renseignés" }],
    photos: [["#0ea5e9","#0284c7"],["#38bdf8","#0ea5e9"],["#bae6fd","#7dd3fc"]],
    description: "Club de quartier affilié FFTT.",
  },
  {
    id: "v29",
    name: "Sporting Paris 20 TT (SP20TT)",
    address: "Complexe sportif Maryse Hilsz, 34 rue Maryse Hilsz, 75020 Paris",
    arrondissement: 20,
    lat: 48.8521540, lng: 2.4136930,
    type: "club", surface: "indoor", pricing: "membership",
    tables: 12, rating: 4.0, reviewCount: 2,
    tags: ["280 membres", "Baby Ping", "3 salles", "Filles", "Tous âges", "Champion Critérium Jeunes", "FFTT"],
    hours: [
      { days: "Lun–Mer", time: "9h–12h · 13h30–17h30" },
      { days: "Jeu–Ven", time: "10h30–12h30 · 14h–17h30" },
      { days: "Sam–Dim", time: "Fermé" },
    ],
    photos: [["#10b981","#059669"],["#6ee7b7","#34d399"],["#a7f3d0","#6ee7b7"]],
    description: "Club majeur avec près de 280 membres, tous âges et niveaux. Baby Ping (4–7 ans), 50+ filles avec 2 coachs féminins. 3 salles de pratique, encadrement professionnel.",
  },
  {
    id: "v30",
    name: "Association Julien Lacroix TT",
    address: "44 rue Pelleport, 75020 Paris",
    arrondissement: 20,
    lat: 48.8647948, lng: 2.4042410,
    type: "club", surface: "indoor", pricing: "membership",
    tables: 10, rating: 4.0, reviewCount: 1,
    tags: ["280 membres", "3 salles", "Baby Ping", "Haut niveau", "FFTT"],
    hours: [
      { days: "Lun", time: "9h–12h · 14h–17h" },
      { days: "Mar", time: "9h–12h · 14h–15h30" },
      { days: "Mer", time: "9h–12h" },
      { days: "Jeu", time: "13h–20h" },
      { days: "Ven", time: "13h30–17h30" },
    ],
    photos: [["#8b5cf6","#6d28d9"],["#a78bfa","#8b5cf6"],["#ddd6fe","#c4b5fd"]],
    description: "280 membres, du bébé ping aux compétiteurs haut niveau, 3 salles modernes.",
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
  // v31 - Ping-Pang Paris
  { id: "r12", venueId: "v31", authorName: "Marie D.",    authorEmoji: "🦋", rating: 5, comment: "Concept incroyable ! L'app de résa est ultra fluide, les tables sont top niveau, et l'ambiance bar rend ça addictif. À faire absolument.", tables: 5, ambiance: 5, cleanliness: 5, accessibility: 4, createdAt: "2026-04-30T21:00:00Z" },
  { id: "r13", venueId: "v13", authorName: "Emma R.", authorEmoji: "🐼", rating: 5, comment: "Je joue ici depuis des années, jamais déçu !", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r14", venueId: "v14", authorName: "Emma R.", authorEmoji: "🐼", rating: 5, comment: "Je joue ici depuis des années, jamais déçu !", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r15", venueId: "v14", authorName: "Hugo D.", authorEmoji: "🐯", rating: 5, comment: "Très belles installations, parfait pour jouer entre amis.", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r16", venueId: "v15", authorName: "Hugo D.", authorEmoji: "🐯", rating: 4, comment: "Excellent accueil, je recommande fortement !", tables: 4, ambiance: 4, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r17", venueId: "v15", authorName: "Chloé T.", authorEmoji: "🦊", rating: 4, comment: "Très belles installations, parfait pour jouer entre amis.", tables: 4, ambiance: 4, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r18", venueId: "v15", authorName: "Hugo D.", authorEmoji: "🐯", rating: 5, comment: "Je joue ici depuis des années, jamais déçu !", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r19", venueId: "v16", authorName: "Emma R.", authorEmoji: "🐼", rating: 5, comment: "Les coachs sont géniaux, progression rapide assurée.", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r20", venueId: "v16", authorName: "Chloé T.", authorEmoji: "🦊", rating: 5, comment: "Je joue ici depuis des années, jamais déçu !", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r21", venueId: "v17", authorName: "Emma R.", authorEmoji: "🐼", rating: 4, comment: "Je joue ici depuis des années, jamais déçu !", tables: 4, ambiance: 4, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r22", venueId: "v17", authorName: "Emma R.", authorEmoji: "🐼", rating: 5, comment: "Je joue ici depuis des années, jamais déçu !", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r23", venueId: "v18", authorName: "Arthur B.", authorEmoji: "🦁", rating: 5, comment: "Je joue ici depuis des années, jamais déçu !", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r24", venueId: "v19", authorName: "Lucas M.", authorEmoji: "🐻", rating: 4, comment: "Les coachs sont géniaux, progression rapide assurée.", tables: 4, ambiance: 4, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r25", venueId: "v19", authorName: "Hugo D.", authorEmoji: "🐯", rating: 5, comment: "Très belles installations, parfait pour jouer entre amis.", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r26", venueId: "v20", authorName: "Arthur B.", authorEmoji: "🦁", rating: 4, comment: "Excellent accueil, je recommande fortement !", tables: 4, ambiance: 4, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r27", venueId: "v21", authorName: "Chloé T.", authorEmoji: "🦊", rating: 4, comment: "Très belles installations, parfait pour jouer entre amis.", tables: 4, ambiance: 4, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r28", venueId: "v21", authorName: "Lucas M.", authorEmoji: "🐻", rating: 4, comment: "Excellent accueil, je recommande fortement !", tables: 4, ambiance: 4, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r29", venueId: "v21", authorName: "Arthur B.", authorEmoji: "🦁", rating: 4, comment: "Très belles installations, parfait pour jouer entre amis.", tables: 4, ambiance: 4, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r30", venueId: "v22", authorName: "Hugo D.", authorEmoji: "🐯", rating: 5, comment: "Super club, très bonne ambiance et les tables sont neuves.", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r31", venueId: "v23", authorName: "Lucas M.", authorEmoji: "🐻", rating: 5, comment: "Bon club mais un peu bondé aux heures de pointe.", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r32", venueId: "v23", authorName: "Arthur B.", authorEmoji: "🦁", rating: 5, comment: "Je joue ici depuis des années, jamais déçu !", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r33", venueId: "v23", authorName: "Chloé T.", authorEmoji: "🦊", rating: 4, comment: "Très belles installations, parfait pour jouer entre amis.", tables: 4, ambiance: 4, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r34", venueId: "v24", authorName: "Emma R.", authorEmoji: "🐼", rating: 5, comment: "Les coachs sont géniaux, progression rapide assurée.", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r35", venueId: "v24", authorName: "Hugo D.", authorEmoji: "🐯", rating: 5, comment: "Bon club mais un peu bondé aux heures de pointe.", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r36", venueId: "v25", authorName: "Hugo D.", authorEmoji: "🐯", rating: 4, comment: "Excellent accueil, je recommande fortement !", tables: 4, ambiance: 4, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r37", venueId: "v25", authorName: "Arthur B.", authorEmoji: "🦁", rating: 5, comment: "Excellent accueil, je recommande fortement !", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r38", venueId: "v26", authorName: "Arthur B.", authorEmoji: "🦁", rating: 5, comment: "Les coachs sont géniaux, progression rapide assurée.", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r39", venueId: "v26", authorName: "Chloé T.", authorEmoji: "🦊", rating: 4, comment: "Très belles installations, parfait pour jouer entre amis.", tables: 4, ambiance: 4, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r40", venueId: "v26", authorName: "Arthur B.", authorEmoji: "🦁", rating: 5, comment: "Super club, très bonne ambiance et les tables sont neuves.", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r41", venueId: "v27", authorName: "Hugo D.", authorEmoji: "🐯", rating: 4, comment: "Je joue ici depuis des années, jamais déçu !", tables: 4, ambiance: 4, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r42", venueId: "v27", authorName: "Hugo D.", authorEmoji: "🐯", rating: 4, comment: "Je joue ici depuis des années, jamais déçu !", tables: 4, ambiance: 4, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r43", venueId: "v28", authorName: "Arthur B.", authorEmoji: "🦁", rating: 4, comment: "Les coachs sont géniaux, progression rapide assurée.", tables: 4, ambiance: 4, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r44", venueId: "v28", authorName: "Arthur B.", authorEmoji: "🦁", rating: 4, comment: "Super club, très bonne ambiance et les tables sont neuves.", tables: 4, ambiance: 4, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r45", venueId: "v29", authorName: "Lucas M.", authorEmoji: "🐻", rating: 4, comment: "Très belles installations, parfait pour jouer entre amis.", tables: 4, ambiance: 4, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r46", venueId: "v30", authorName: "Lucas M.", authorEmoji: "🐻", rating: 5, comment: "Très belles installations, parfait pour jouer entre amis.", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r47", venueId: "v30", authorName: "Emma R.", authorEmoji: "🐼", rating: 5, comment: "Super club, très bonne ambiance et les tables sont neuves.", tables: 5, ambiance: 5, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
  { id: "r48", venueId: "v30", authorName: "Lucas M.", authorEmoji: "🐻", rating: 4, comment: "Très belles installations, parfait pour jouer entre amis.", tables: 4, ambiance: 4, cleanliness: 4, accessibility: 4, createdAt: "2026-05-01T10:00:00Z" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getVenueReviews(venueId: string): VenueReview[] {
  return venueReviews.filter((r) => r.venueId === venueId);
}

export function pinColor(rating: number): string {
  if (rating === 0)  return "#9ca3af"; // gris = pas encore noté
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
