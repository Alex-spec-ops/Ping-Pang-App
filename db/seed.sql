-- ═══════════════════════════════════════════════════════════════════════════
-- PING PANG & CO. ELITE — Seed (version simplifiée)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── USERS ──────────────────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash) VALUES
  ('00000000-0000-0000-0000-000000000001', 'felix@pingpang.app',    crypt('demo1234', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000002', 'alexis@pingpang.app',   crypt('demo1234', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000003', 'wang@pingpang.app',     crypt('demo1234', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000004', 'harimoto@pingpang.app', crypt('demo1234', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000005', 'leon@pingpang.app',     crypt('demo1234', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000006', 'marie@pingpang.app',    crypt('demo1234', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000007', 'carlos@pingpang.app',   crypt('demo1234', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000008', 'sofia@pingpang.app',    crypt('demo1234', gen_salt('bf')));

-- ─── PLAYERS ────────────────────────────────────────────────────────────────
INSERT INTO players (id, user_id, username, full_name, country, country_flag, city, club, avatar, rating, peak_rating, ranked_wins, ranked_losses, casual_wins, casual_losses, followers, bio, premium, streak, badges, follows) VALUES
  ('p1', '00000000-0000-0000-0000-000000000001', 'felix_fr',    'Félix Lebrun',      'France',  '🇫🇷', 'Montpellier', 'Montpellier TT', '🦊', 2812, 2845, 218, 41, 25, 12, 18420, 'Pro FFTT — Montpellier TT.', TRUE,
    '{"current":36,"longest":52,"frozen_left":2}',
    '[{"id":"first_win","unlocked_at":"2020-02-01"},{"id":"100_matches","unlocked_at":"2021-06-10"},{"id":"club_champ","unlocked_at":"2022-03-15"},{"id":"winrate_70","unlocked_at":"2023-09-01"},{"id":"social","unlocked_at":"2022-11-04"}]',
    '[]'),
  ('p2', '00000000-0000-0000-0000-000000000002', 'alexis_lb',   'Alexis Lebrun',     'France',  '🇫🇷', 'Montpellier', 'Montpellier TT', '🐺', 2778, 2799, 195, 38, 30, 14, 14210, 'Pro FFTT — top 10 mondial.', FALSE,
    '{"current":28,"longest":40,"frozen_left":0}', '[]', '[]'),
  ('p3', '00000000-0000-0000-0000-000000000003', 'wang_chuqin', 'Wang Chuqin',       'Chine',   '🇨🇳', 'Beijing',     NULL,             '🐉', 2901, 2920, 405, 62, 12, 4, 52310, 'World #1.', TRUE,
    '{"current":88,"longest":88,"frozen_left":4}',
    '[{"id":"first_win","unlocked_at":"2018-01-01"},{"id":"100_matches","unlocked_at":"2019-04-20"},{"id":"club_champ","unlocked_at":"2020-08-12"},{"id":"winrate_70","unlocked_at":"2021-01-30"},{"id":"social","unlocked_at":"2020-05-15"}]',
    '[]'),
  ('p4', '00000000-0000-0000-0000-000000000004', 'harimoto',    'Tomokazu Harimoto', 'Japon',   '🇯🇵', 'Tokyo',       NULL,             '🐯', 2802, 2841, 312, 84, 18, 9, 33020, 'Top player JPN.', FALSE,
    '{"current":15,"longest":36,"frozen_left":0}', '[]', '[]'),
  ('p5', '00000000-0000-0000-0000-000000000005', 'leon_pp',     'Léon Le Calvez',    'France',  '🇫🇷', 'Paris',       'Paris 13 TT',    '🐧', 1487, 1502,  34, 29, 12, 8,   142, 'Joueur PP — Paris 13e. Toujours partant pour un match.', FALSE,
    '{"current":7,"longest":12,"frozen_left":0}',
    '[{"id":"first_win","unlocked_at":"2024-09-15"},{"id":"social","unlocked_at":"2026-04-20"}]',
    '["p1","p2","p6","p7"]'),
  ('p6', '00000000-0000-0000-0000-000000000006', 'marie_lyon',  'Marie Dubois',      'France',  '🇫🇷', 'Lyon',        'Lyon TT',        '🦄', 1820, 1840,  88, 51, 22, 15,  980, 'Coach niveau 2 + compétitrice.', FALSE,
    '{"current":14,"longest":22,"frozen_left":0}',
    '[{"id":"first_win","unlocked_at":"2023-07-01"},{"id":"100_matches","unlocked_at":"2024-09-12"},{"id":"social","unlocked_at":"2025-06-20"}]',
    '[]'),
  ('p7', '00000000-0000-0000-0000-000000000007', 'carlos_esp',  'Carlos Diaz',       'Espagne', '🇪🇸', 'Barcelona',   NULL,             '🐧', 1965, 1980,  55, 44, 18, 10,  320, 'Amateur — niveau régional.', FALSE,
    '{"current":3,"longest":11,"frozen_left":0}', '[]', '[]'),
  ('p8', '00000000-0000-0000-0000-000000000008', 'sofia_de',    'Sofia Müller',      'Allemagne','🇩🇪','Berlin',     'Berlin Open TT', '🦊', 2040, 2068, 132, 70, 26, 11, 2150, 'TT Bundesliga 2.', FALSE,
    '{"current":21,"longest":45,"frozen_left":0}',
    '[{"id":"first_win","unlocked_at":"2022-04-10"},{"id":"100_matches","unlocked_at":"2023-08-22"},{"id":"club_champ","unlocked_at":"2024-11-05"},{"id":"social","unlocked_at":"2023-12-15"}]',
    '[]');

-- ─── CLUBS (avec membres, events, chat, défis, achievements en JSONB) ──────
INSERT INTO clubs (id, name, short_name, description, logo, color, visibility, type, city, country, country_flag, creator_id, membership, members, events, challenges, achievements, chat, created_at) VALUES
('c1', 'Paris 13 TT', 'P13', 'Club FFTT du 13e arrondissement. Tables ouvertes tous les jours, coachs niveau 2, compétitions internes.', '🏓', '#2563eb', 'public', 'physical', 'Paris', 'France', '🇫🇷', 'p5',
  '{"free":false,"price":220}',
  '[
    {"player_id":"p5","role":"creator","joined_at":"2024-09-01","wins":34,"losses":29},
    {"player_id":"p6","role":"admin",  "joined_at":"2024-10-15","wins":28,"losses":18},
    {"player_id":"p7","role":"member", "joined_at":"2025-01-08","wins":15,"losses":12}
  ]',
  '[
    {"id":"e1","title":"Soirée portes ouvertes","description":"Découvrez le club, essai gratuit, démo coach.","date":"2026-05-09T19:00:00Z","venue":"Salle Albert Camus, Paris 13","type":"social","max":40,"registered":["p5","p6"]},
    {"id":"e2","title":"Open interne — printemps","description":"Tournoi simple-élim BO5, ouvert à tous les membres.","date":"2026-05-18T14:00:00Z","venue":"Salle Albert Camus, Paris 13","type":"tournament","max":16,"registered":["p5","p6","p7"]}
  ]',
  '[{"id":"ch1","vs_club":"c2","date":"2026-05-25T14:00:00Z","venue":"Salle Albert Camus, Paris 13","status":"accepted"}]',
  '[
    {"id":"a1","emoji":"🎯","label":"100 matchs en équipe","description":"Jouer 100 matchs cumulés en club.","condition":"100 matchs","unlocked":true,"unlocked_at":"2026-03-15"},
    {"id":"a2","emoji":"👥","label":"10 membres actifs","description":"Atteindre 10 membres actifs.","condition":"10 membres","unlocked":false},
    {"id":"a3","emoji":"🏆","label":"Domination locale","description":"Gagner un défi inter-club.","condition":"1 défi gagné","unlocked":false}
  ]',
  '[
    {"id":"msg1","player_id":"p5","text":"Bonjour à tous ! Soirée portes ouvertes ce vendredi, venez nombreux 🏓","sent_at":"2026-05-04T10:15:00Z"},
    {"id":"msg2","player_id":"p6","text":"Je serai là pour faire des démos avec les débutants 👌","sent_at":"2026-05-04T10:30:00Z"},
    {"id":"msg3","player_id":"p7","text":"Quelqu''un veut s''entraîner samedi 18h ?","sent_at":"2026-05-05T08:45:00Z"},
    {"id":"msg4","player_id":"p5","text":"@carlos je suis dispo, on se voit à la salle","sent_at":"2026-05-05T09:00:00Z"}
  ]',
  '2024-09-01T00:00:00Z'),

('c2', 'Lyon TT', 'LYTT', 'Section compétition + loisirs, salle au cœur de Lyon. Coach Bianchi en stage mensuel.', '🦁', '#dc2626', 'public', 'physical', 'Lyon', 'France', '🇫🇷', 'p6',
  '{"free":false,"price":180}',
  '[
    {"player_id":"p6","role":"creator","joined_at":"2023-06-15","wins":88,"losses":51},
    {"player_id":"p7","role":"member", "joined_at":"2024-02-10","wins":40,"losses":25},
    {"player_id":"p8","role":"member", "joined_at":"2024-08-05","wins":30,"losses":20}
  ]',
  '[{"id":"e3","title":"Stage intensif Coach Bianchi","description":"Stage de 3 jours, technique et préparation physique.","date":"2026-05-22T09:00:00Z","venue":"Gymnase Marville, Lyon","type":"training","max":12,"registered":["p6","p8"]}]',
  '[{"id":"ch1","vs_club":"c1","date":"2026-05-25T14:00:00Z","venue":"Salle Albert Camus, Paris 13","status":"accepted"}]',
  '[
    {"id":"a1","emoji":"🎯","label":"100 matchs en équipe","unlocked":true,"unlocked_at":"2025-08-01"},
    {"id":"a2","emoji":"👥","label":"10 membres actifs","unlocked":true,"unlocked_at":"2025-12-01"}
  ]',
  '[
    {"id":"msg1","player_id":"p6","text":"Stage Bianchi confirmé — 12 places, déjà 8 inscrits.","sent_at":"2026-05-02T14:20:00Z"},
    {"id":"msg2","player_id":"p7","text":"Je m''inscris !","sent_at":"2026-05-02T14:25:00Z"},
    {"id":"msg3","player_id":"p8","text":"Désolée, conflit Berlin — la prochaine fois.","sent_at":"2026-05-02T18:10:00Z"}
  ]',
  '2023-06-15T00:00:00Z'),

('c3', 'Montpellier TT', 'MTT', 'Le club des frères Lebrun. Sélectif — réservé aux compétiteurs nationaux et internationaux.', '⚡', '#f59e0b', 'private', 'physical', 'Montpellier', 'France', '🇫🇷', 'p1',
  '{"free":false,"price":350}',
  '[
    {"player_id":"p1","role":"creator","joined_at":"2020-01-10","wins":218,"losses":41},
    {"player_id":"p2","role":"admin",  "joined_at":"2020-01-10","wins":195,"losses":38}
  ]',
  '[{"id":"e4","title":"Entraînement prépa WTT","description":"Session prépa coupe du monde — fermé public.","date":"2026-05-07T18:00:00Z","venue":"Centre national Montpellier","type":"training","registered":["p1","p2"]}]',
  '[]',
  '[
    {"id":"a1","emoji":"🎯","label":"100 matchs en équipe","unlocked":true,"unlocked_at":"2024-06-01"},
    {"id":"a2","emoji":"👑","label":"Dominance","unlocked":true,"unlocked_at":"2026-02-01"},
    {"id":"a3","emoji":"🌍","label":"Champion international","unlocked":true,"unlocked_at":"2024-12-10"}
  ]',
  '[
    {"id":"msg1","player_id":"p1","text":"Session prépa WTT ce jeudi 18h. Présence obligatoire pour les sélectionnés.","sent_at":"2026-05-01T20:00:00Z"},
    {"id":"msg2","player_id":"p2","text":"OK chef, j''apporte les nouvelles balles plastique.","sent_at":"2026-05-01T20:15:00Z"}
  ]',
  '2020-01-10T00:00:00Z'),

('c4', 'Berlin Open TT', 'BOTT', 'Club digital + IRL. Inscriptions gratuites, événements internationaux.', '🌍', '#10b981', 'public', 'digital', 'Berlin', 'Allemagne', '🇩🇪', 'p8',
  '{"free":true}',
  '[
    {"player_id":"p8","role":"creator","joined_at":"2022-03-20","wins":132,"losses":70},
    {"player_id":"p4","role":"member", "joined_at":"2023-04-15","wins":60,"losses":30}
  ]',
  '[{"id":"e5","title":"Berlin International Open","description":"Tournoi européen, 128 joueurs, prizepool 5000 €.","date":"2026-06-07T10:00:00Z","venue":"Mercedes-Benz Arena, Berlin","type":"tournament","max":128,"registered":["p8","p4"]}]',
  '[]',
  '[
    {"id":"a1","emoji":"🎯","label":"100 matchs en équipe","unlocked":true,"unlocked_at":"2023-09-01"},
    {"id":"a2","emoji":"🌍","label":"Club international","unlocked":true,"unlocked_at":"2023-11-15"}
  ]',
  '[
    {"id":"msg1","player_id":"p8","text":"Berlin Open : inscriptions ouvertes, deadline 25 mai.","sent_at":"2026-05-03T12:00:00Z"},
    {"id":"msg2","player_id":"p4","text":"Inscrit. Hâte de jouer à Berlin pour la première fois 🇩🇪","sent_at":"2026-05-03T13:30:00Z"}
  ]',
  '2022-03-20T00:00:00Z');

-- ─── CLUB ADMIN (uniquement pour c1 dans le mock) ──────────────────────────
INSERT INTO club_admin (club_id, tournaments, subscriptions, bookings, coachings, expenses, invoices, announcements) VALUES
('c1',
  '[
    {"id":"t1","name":"Open Printemps 2026","start_date":"2026-05-18","format":"single-elim","category":"open","entry_fee":12,"max":16,"prize_pool":200,"status":"open","registered":[{"player_id":"p5","paid":true},{"player_id":"p6","paid":true},{"player_id":"p7","paid":false}]},
    {"id":"t2","name":"Coupe jeunes <15 ans","start_date":"2026-06-08","format":"round-robin","category":"u15","entry_fee":0,"max":12,"status":"draft","registered":[]}
  ]',
  '[
    {"id":"s1","player_id":"p5","plan":"annual",    "amount":220,"start":"2025-09-01","end":"2026-08-31","status":"active",  "paid_via":"card"},
    {"id":"s2","player_id":"p6","plan":"annual",    "amount":220,"start":"2025-09-01","end":"2026-08-31","status":"active",  "paid_via":"transfer"},
    {"id":"s3","player_id":"p7","plan":"semestrial","amount":130,"start":"2026-02-01","end":"2026-07-31","status":"expiring","paid_via":"cash"}
  ]',
  '[
    {"id":"b1","table":1,"players":["p5","p6"],"date":"2026-05-04T19:00:00Z","duration":90,"purpose":"training"},
    {"id":"b2","table":2,"players":["p7"],     "date":"2026-05-04T19:00:00Z","duration":60,"purpose":"lesson"},
    {"id":"b3","table":1,"players":["p5"],     "date":"2026-05-05T18:30:00Z","duration":60,"purpose":"match"}
  ]',
  '[
    {"id":"co1","coach":"p6","students":["p7"],     "topic":"Service court latéral","date":"2026-05-04T19:00:00Z","duration":60,"notes":"Travailler la régularité du rebond."},
    {"id":"co2","coach":"p6","students":["p5","p7"],"topic":"Schémas tactiques BO5","date":"2026-05-08T18:30:00Z","duration":90}
  ]',
  '[
    {"id":"x1","label":"Loyer salle Albert Camus — avril","category":"rent",     "amount":1200,"date":"2026-04-05"},
    {"id":"x2","label":"Lot de 50 balles plastique",      "category":"equipment","amount":95,  "date":"2026-04-10"},
    {"id":"x3","label":"Salaires coachs avril",           "category":"coach",    "amount":640, "date":"2026-04-30"},
    {"id":"x4","label":"Arbitres + collation Open",       "category":"event",    "amount":310, "date":"2026-05-18"}
  ]',
  '[
    {"id":"i1","subject":"Cotisation annuelle 2025-26 — Léon Le Calvez","to":"Léon Le Calvez","amount":220,"date":"2025-09-04","status":"paid"},
    {"id":"i2","subject":"Avance stage Bianchi — Marie Dubois",         "to":"Marie Dubois",   "amount":90, "date":"2026-04-15","status":"sent"},
    {"id":"i3","subject":"Réservation événement privé — Carlos Diaz",   "to":"Carlos Diaz",    "amount":480,"date":"2026-04-01","status":"overdue"}
  ]',
  '[
    {"id":"an1","title":"Renouvellement cotisations 2026-27","body":"Les cotisations pour la saison 2026-27 sont ouvertes. Tarif : 220€ annuel, paiement échelonné possible.","author":"p5","audience":"all","pinned":true, "published_at":"2026-04-28T10:00:00Z"},
    {"id":"an2","title":"Fermeture 1er mai",                 "body":"La salle sera fermée le 1er mai (jour férié). Reprise normale le 2 mai.",                                "author":"p5","audience":"all","pinned":false,"published_at":"2026-04-25T18:00:00Z"}
  ]');

-- Les 3 autres clubs ont un admin vide pour pouvoir extender plus tard
INSERT INTO club_admin (club_id) VALUES ('c2'), ('c3'), ('c4');

-- ─── MATCHES ────────────────────────────────────────────────────────────────
INSERT INTO matches (id, player1_id, player2_id, winner_id, mode, format, venue, sets, rating_change, played_at) VALUES
  ('m1',  'p5', 'p6', 'p5', 'ranked',     'BO5', 'Paris 13 TT',          '[{"p1":11,"p2":9},{"p1":9,"p2":11},{"p1":11,"p2":7},{"p1":11,"p2":8}]', '{"p1":18,"p2":-18}', '2026-04-28T19:30:00Z'),
  ('m2',  'p1', 'p3', 'p3', 'tournament', 'BO5', 'WTT Champions Macao', '[{"p1":9,"p2":11},{"p1":8,"p2":11},{"p1":11,"p2":9},{"p1":7,"p2":11}]', '{"p1":-22,"p2":22}', '2026-04-27T15:00:00Z'),
  ('m3',  'p5', 'p7', 'p7', 'ranked',     'BO3', 'Paris 13 TT',          '[{"p1":9,"p2":11},{"p1":8,"p2":11}]',                                    '{"p1":-14,"p2":14}', '2026-04-26T18:00:00Z'),
  ('m4',  'p2', 'p4', 'p2', 'ranked',     'BO5', 'Montpellier TT',       '[{"p1":11,"p2":7},{"p1":11,"p2":9},{"p1":9,"p2":11},{"p1":11,"p2":8}]', '{"p1":16,"p2":-16}', '2026-04-25T16:00:00Z'),
  ('m5',  'p6', 'p8', 'p8', 'ranked',     'BO5', 'Lyon TT',              '[{"p1":9,"p2":11},{"p1":11,"p2":8},{"p1":8,"p2":11},{"p1":7,"p2":11}]', '{"p1":-12,"p2":12}', '2026-04-24T19:00:00Z'),
  ('m6',  'p5', 'p2', 'p2', 'casual',     'BO3', 'Paris 13 TT',          '[{"p1":9,"p2":11},{"p1":7,"p2":11}]',                                    '{"p1":-3,"p2":3}',   '2026-04-22T20:00:00Z'),
  ('m7',  'p1', 'p2', 'p1', 'tournament', 'BO7', 'France Championship',  '[{"p1":11,"p2":9},{"p1":9,"p2":11},{"p1":11,"p2":7},{"p1":11,"p2":8}]', '{"p1":19,"p2":-19}', '2026-04-20T14:00:00Z'),
  ('m8',  'p7', 'p8', 'p8', 'ranked',     'BO5', 'Berlin Open TT',       '[{"p1":9,"p2":11},{"p1":8,"p2":11},{"p1":11,"p2":9},{"p1":7,"p2":11}]', '{"p1":-10,"p2":10}', '2026-04-19T18:30:00Z'),
  ('m9',  'p3', 'p4', 'p3', 'tournament', 'BO7', 'WTT Champions Macao',  '[{"p1":11,"p2":9},{"p1":11,"p2":7},{"p1":9,"p2":11},{"p1":11,"p2":8}]', '{"p1":15,"p2":-15}', '2026-04-18T15:00:00Z'),
  ('m10', 'p6', 'p7', 'p6', 'ranked',     'BO5', 'Lyon TT',              '[{"p1":11,"p2":8},{"p1":9,"p2":11},{"p1":11,"p2":7},{"p1":11,"p2":9}]', '{"p1":13,"p2":-13}', '2026-04-17T19:00:00Z'),
  ('m11', 'p5', 'p1', 'p1', 'casual',     'BO3', 'Paris 13 TT',          '[{"p1":8,"p2":11},{"p1":9,"p2":11}]',                                    '{"p1":-2,"p2":2}',   '2026-04-15T20:30:00Z'),
  ('m12', 'p5', 'p7', 'p5', 'ranked',     'BO5', 'Paris 13 TT',          '[{"p1":11,"p2":9},{"p1":9,"p2":11},{"p1":11,"p2":7},{"p1":11,"p2":8}]', '{"p1":15,"p2":-15}', '2026-04-30T20:00:00Z');

-- ─── ACTIVITIES (feed avec commentaires inline) ─────────────────────────────
INSERT INTO activities (id, player_id, kind, payload, comments, liked_by, created_at) VALUES
  ('a1',  'p5', 'match',         '{"match_id":"m1"}',
                                  '[{"id":"c1","player_id":"p6","text":"Belle victoire ! 🏓","created_at":"2026-04-28T20:00:00Z"},{"id":"c2","player_id":"p7","text":"GG, prochaine fois je prends ma revanche.","created_at":"2026-04-28T20:15:00Z"}]',
                                  '[]', '2026-04-28T19:45:00Z'),
  ('a2',  'p5', 'training',      '{"minutes":90,"title":"Service court, attaque rapide"}', '[]', '[]', '2026-04-28T08:00:00Z'),
  ('a3',  'p1', 'match',         '{"match_id":"m2"}',
                                  '[{"id":"c3","player_id":"p2","text":"Frérot, tu as donné le maximum 💪","created_at":"2026-04-27T16:00:00Z"},{"id":"c4","player_id":"p5","text":"Match incroyable, hâte de revoir Wang en finale.","created_at":"2026-04-27T17:00:00Z"}]',
                                  '[]', '2026-04-27T15:30:00Z'),
  ('a4',  'p5', 'achievement',   '{"title":"Premier 1500 ELO atteint 🎉"}',
                                  '[{"id":"c5","player_id":"p1","text":"Bravo, continue comme ça !","created_at":"2026-04-27T11:00:00Z"},{"id":"c6","player_id":"p6","text":"Trop fort 🚀","created_at":"2026-04-27T12:00:00Z"}]',
                                  '[]', '2026-04-27T10:00:00Z'),
  ('a5',  'p5', 'follow',        '{"target":"p1"}', '[]', '[]', '2026-04-26T20:00:00Z'),
  ('a6',  'p5', 'match',         '{"match_id":"m3"}', '[]', '[]', '2026-04-26T18:15:00Z'),
  ('a7',  'p5', 'tournament',    '{"title":"Open de Paris — printemps","date":"2026-05-18","venue":"Paris 13 TT","participants":12,"max":16,"prize":"Classement officiel + coupes"}', '[]', '[]', '2026-04-25T14:00:00Z'),
  ('a8',  'p2', 'match',         '{"match_id":"m4"}',
                                  '[{"id":"c7","player_id":"p5","text":"GG Alexis, le revers était parfait.","created_at":"2026-04-25T18:00:00Z"}]',
                                  '[]', '2026-04-25T16:30:00Z'),
  ('a9',  'p6', 'training',      '{"minutes":120,"title":"Préparation tournoi Lyon"}',
                                  '[{"id":"c8","player_id":"p7","text":"Tu peux partager ton plan d''entraînement ?","created_at":"2026-04-25T12:00:00Z"}]',
                                  '[]', '2026-04-25T09:00:00Z'),
  ('a10', 'p8', 'match',         '{"match_id":"m5"}',
                                  '[{"id":"c9","player_id":"p6","text":"Sofia trop forte 🦊","created_at":"2026-04-24T20:30:00Z"}]',
                                  '[]', '2026-04-24T19:30:00Z'),
  ('a11', 'p5', 'club_announce', '{"title":"Soirée portes ouvertes 🎉","body":"Vendredi 9 mai à partir de 19h — venez tester les nouvelles tables."}', '[]', '[]', '2026-04-23T18:00:00Z'),
  ('a12', 'p5', 'match',         '{"match_id":"m6"}', '[]', '[]', '2026-04-22T20:30:00Z'),
  ('a13', 'p6', 'achievement',   '{"title":"50 matchs en compétition"}', '[]', '[]', '2026-04-21T11:00:00Z'),
  ('a14', 'p1', 'match',         '{"match_id":"m7"}', '[]', '[]', '2026-04-20T14:30:00Z'),
  ('a15', 'p5', 'training',      '{"minutes":60,"title":"Revers tactique"}', '[]', '[]', '2026-04-19T07:30:00Z'),
  ('a16', 'p8', 'match',         '{"match_id":"m8"}', '[]', '[]', '2026-04-19T19:00:00Z'),
  ('a17', 'p8', 'tournament',    '{"title":"Berlin International Open 2026","date":"2026-06-07","venue":"Mercedes-Benz Arena, Berlin","participants":64,"max":128,"prize":"Prizepool 5000 €"}', '[]', '[]', '2026-04-18T16:00:00Z'),
  ('a18', 'p3', 'match',         '{"match_id":"m9"}',
                                  '[{"id":"c10","player_id":"p4","text":"Bravo Chuqin, niveau hors-norme.","created_at":"2026-04-18T16:00:00Z"}]',
                                  '[]', '2026-04-18T15:30:00Z'),
  ('a19', 'p7', 'training',      '{"minutes":180,"title":"Stage long format BO7"}', '[]', '[]', '2026-04-18T08:00:00Z'),
  ('a20', 'p6', 'match',         '{"match_id":"m10"}', '[]', '[]', '2026-04-17T19:30:00Z'),
  ('a21', 'p3', 'achievement',   '{"title":"World #1 — 12 mois consécutifs"}',
                                  '[{"id":"c11","player_id":"p1","text":"Légendaire 👑","created_at":"2026-04-16T11:00:00Z"},{"id":"c12","player_id":"p8","text":"Inhumain.","created_at":"2026-04-16T11:30:00Z"}]',
                                  '[]', '2026-04-16T10:00:00Z'),
  ('a22', 'p5', 'match',         '{"match_id":"m11"}', '[]', '[]', '2026-04-15T21:00:00Z'),
  ('a23', 'p7', 'follow',        '{"target":"p5"}', '[]', '[]', '2026-04-14T18:00:00Z'),
  ('a24', 'p6', 'club_announce', '{"title":"Nouveau coach Bianchi 🇮🇹","body":"Stage intensif les 22-24 mai, places limitées."}', '[]', '[]', '2026-04-13T15:00:00Z'),
  ('a25', 'p5', 'match',         '{"match_id":"m12"}', '[]', '[]', '2026-04-30T20:30:00Z');

-- ─── CHALLENGES ─────────────────────────────────────────────────────────────
INSERT INTO challenges (id, creator_id, opponent_id, status, mode, format, venue, scheduled_at, message, created_at) VALUES
  ('pch1', 'p5', 'p6',  'active',  'ranked', 'BO5', 'Paris 13 TT',     '2026-05-10T19:00:00Z', 'Revanche longtemps attendue 🔥', '2026-05-01T10:00:00Z'),
  ('pch2', 'p2', 'p5',  'pending', 'casual', 'BO3', 'Paris 13 TT',     '2026-05-11T20:00:00Z', 'On se fait un BO3 ?',            '2026-05-02T14:00:00Z'),
  ('pch3', 'p1', NULL,  'open',    'ranked', 'BO5', 'Montpellier TT',  NULL,                   'Défi ouvert — niveau 2500+',     '2026-05-03T08:00:00Z'),
  ('pch4', 'p3', NULL,  'open',    'casual', 'BO3', 'Beijing TT Hall', NULL,                   'Casual session, anyone?',        '2026-05-03T12:00:00Z'),
  ('pch5', 'p7', NULL,  'open',    'ranked', 'BO3', 'Barcelona TT',    '2026-05-12T18:00:00Z', 'Niveau régional bienvenu.',      '2026-05-03T15:00:00Z'),
  ('pch6', 'p8', NULL,  'open',    'ranked', 'BO7', 'Berlin Open TT',  NULL,                   'Long format, top players only.', '2026-05-04T09:00:00Z'),
  ('pch7', 'p4', NULL,  'open',    'casual', 'BO5', NULL,              '2026-05-13T19:00:00Z', 'Match amical en visio possible.','2026-05-04T16:00:00Z');

-- ─── MESSAGES (DMs) ─────────────────────────────────────────────────────────
INSERT INTO messages (id, sender_id, receiver_id, text, sent_at) VALUES
  ('dm1', 'p1', 'p5', 'Salut Léon ! T''entraînes mardi ?',                    '2026-05-03T14:00:00Z'),
  ('dm2', 'p5', 'p1', 'Salut Félix ! Oui carrément, on se voit à 19h ?',      '2026-05-03T14:15:00Z'),
  ('dm3', 'p6', 'p5', 'Bravo pour le 1500 ELO 🎉',                            '2026-05-02T18:00:00Z'),
  ('dm4', 'p5', 'p6', 'Merci Marie ! On se fait un match ce weekend ?',       '2026-05-02T18:30:00Z'),
  ('dm5', 'p6', 'p5', 'Samedi 14h ça te va ?',                                '2026-05-02T19:00:00Z'),
  ('dm6', 'p2', 'p5', 'Hello, tu participes au tournoi de mai à Paris 13 ?',  '2026-05-01T10:00:00Z');

-- ─── VENUES (avec tags, horaires, reviews, territoire inline) ──────────────
INSERT INTO venues (id, name, address, lat, lng, type, surface, pricing, price_info, tables, rating, review_count, description, tags, hours, reviews, club_wins) VALUES
('v1', 'Paris 13 TT', 'Salle Albert Camus, 24 rue Charcot, 75013 Paris', 48.8238, 2.3681, 'club', 'indoor', 'membership', 'Licence FFTT + cotisation ~80 €/an', 12, 4.8, 48, 'Club historique du 13e, 12 tables compétition.',
  '["Compétition","Entraîneur certifié","Vestiaires"]',
  '[{"days":"Lun–Ven","time":"18h–22h"},{"days":"Sam–Dim","time":"10h–20h"}]',
  '[{"id":"r1","author":"Léon L.","emoji":"🐧","rating":5,"comment":"Salle au top, tables Cornilleau, super ambiance.","sub":{"tables":5,"ambiance":5,"clean":4,"access":4}},{"id":"r2","author":"Marie D.","emoji":"🦄","rating":5,"comment":"Coach de qualité, on progresse vite.","sub":{"tables":5,"ambiance":5,"clean":4,"access":5}}]',
  '[{"club_id":"c1","wins":38},{"club_id":"c2","wins":12},{"club_id":"c3","wins":5}]'),

('v2', 'Tables Promenade Plantée', 'Promenade Plantée, 75012 Paris', 48.8442, 2.3812, 'public', 'outdoor', 'free', NULL, 4, 4.2, 22, 'Tables en plein air sur l''ancienne voie ferrée.',
  '["Plein air","Gratuit"]',
  '[{"days":"Tous les jours","time":"24h/24"}]',
  '[{"id":"r3","author":"Léon L.","emoji":"🐧","rating":4,"comment":"Cool pour des matchs amicaux le weekend.","sub":{"tables":4,"ambiance":5,"clean":3,"access":4}}]',
  '[{"club_id":"c2","wins":19},{"club_id":"c1","wins":14},{"club_id":"c4","wins":7}]'),

('v3', 'TT Bercy', 'Centre sportif Bercy, 75012 Paris', 48.8378, 2.3823, 'club', 'indoor', 'membership', 'Cotisation 220 €/an', 8, 4.6, 31, 'Club avec section jeunes et compétition.',
  '["Compétition","Section jeunes"]',
  '[{"days":"Lun–Ven","time":"17h–22h"},{"days":"Sam","time":"14h–19h"}]',
  '[{"id":"r4","author":"Carlos D.","emoji":"🐧","rating":4,"comment":"Bon niveau de jeu, dispo en soirée.","sub":{"tables":4,"ambiance":4,"clean":4,"access":4}}]',
  '[{"club_id":"c1","wins":22},{"club_id":"c2","wins":8}]'),

('v4', 'Parc Monceau Tables', 'Parc Monceau, 75008 Paris', 48.8800, 2.3092, 'public', 'outdoor', 'free', NULL, 2, 3.8, 14, 'Tables en pierre, surface irrégulière.',
  '["Plein air","Gratuit"]',
  '[{"days":"Tous les jours","time":"8h–22h"}]',
  '[]', '[]'),

('v5', 'Buttes-Chaumont TT', 'Parc des Buttes-Chaumont, 75019 Paris', 48.8800, 2.3833, 'public', 'outdoor', 'free', NULL, 3, 4.0, 19, 'Tables récentes en béton, ambiance détendue.',
  '["Plein air","Gratuit","Récent"]',
  '[{"days":"Tous les jours","time":"8h–22h"}]',
  '[{"id":"r5","author":"Léon L.","emoji":"🐧","rating":4,"comment":"Tables récentes, plein air agréable l''été.","sub":{"tables":4,"ambiance":5,"clean":4,"access":5}}]',
  '[{"club_id":"c1","wins":11},{"club_id":"c2","wins":9}]');

-- ═══════════════════════════════════════════════════════════════════════════
-- ✅ Seed terminé. Comptes : leon@pingpang.app / demo1234 (+ 7 autres)
-- ═══════════════════════════════════════════════════════════════════════════
