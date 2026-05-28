-- ═══════════════════════════════════════════════════════════════════════════
-- PING PANG & CO. ELITE — Schéma SIMPLIFIÉ
-- Une table par catégorie, JSONB pour les données imbriquées
-- PostgreSQL / Supabase compatible
-- ═══════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── 1. USERS (auth) ────────────────────────────────────────────────────────
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT NOT NULL UNIQUE,
  password_hash   TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 2. PLAYERS (profils + badges + streak + premium + follows) ─────────────
CREATE TABLE players (
  id              TEXT PRIMARY KEY,                       -- "p1", "p2", ...
  user_id         UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  username        TEXT NOT NULL UNIQUE,
  full_name       TEXT NOT NULL,
  country         TEXT NOT NULL,
  country_flag    TEXT NOT NULL,
  city            TEXT NOT NULL,
  club            TEXT,                                   -- club d'origine (libre)
  avatar          TEXT NOT NULL,
  bio             TEXT,
  -- Stats ELO et matchs
  rating          INTEGER NOT NULL DEFAULT 1000,
  peak_rating     INTEGER NOT NULL DEFAULT 1000,
  ranked_wins     INTEGER NOT NULL DEFAULT 0,
  ranked_losses   INTEGER NOT NULL DEFAULT 0,
  casual_wins     INTEGER NOT NULL DEFAULT 0,
  casual_losses   INTEGER NOT NULL DEFAULT 0,
  followers       INTEGER NOT NULL DEFAULT 0,
  -- Engagement (premium, streak, badges)
  premium         BOOLEAN NOT NULL DEFAULT FALSE,
  streak          JSONB NOT NULL DEFAULT '{"current":0,"longest":0,"frozen_left":0}'::jsonb,
  badges          JSONB NOT NULL DEFAULT '[]'::jsonb,     -- ex: [{"id":"first_win","unlocked_at":"..."}]
  follows         JSONB NOT NULL DEFAULT '[]'::jsonb,     -- ex: ["p1","p2","p6"]
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_players_rating ON players(rating DESC);

-- ─── 3. MATCHES (sets inline) ───────────────────────────────────────────────
CREATE TABLE matches (
  id                TEXT PRIMARY KEY,
  player1_id        TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  player2_id        TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  winner_id         TEXT NOT NULL REFERENCES players(id),
  mode              TEXT NOT NULL CHECK (mode IN ('ranked','casual','tournament')),
  format            TEXT NOT NULL CHECK (format IN ('BO3','BO5','BO7')),
  venue             TEXT,
  sets              JSONB NOT NULL,                       -- ex: [{"p1":11,"p2":9},{"p1":9,"p2":11}]
  rating_change     JSONB,                                -- ex: {"p1":18,"p2":-18}
  played_at         TIMESTAMPTZ NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (player1_id <> player2_id)
);
CREATE INDEX idx_matches_player1 ON matches(player1_id, played_at DESC);
CREATE INDEX idx_matches_player2 ON matches(player2_id, played_at DESC);

-- ─── 4. ACTIVITIES (feed + commentaires inline + likes) ─────────────────────
CREATE TABLE activities (
  id              TEXT PRIMARY KEY,
  player_id       TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  kind            TEXT NOT NULL CHECK (kind IN ('match','training','achievement','follow','tournament','club_announce')),
  payload         JSONB NOT NULL DEFAULT '{}'::jsonb,     -- contenu selon kind (match_id, training_minutes, etc.)
  comments        JSONB NOT NULL DEFAULT '[]'::jsonb,     -- ex: [{"id":"c1","player_id":"p6","text":"...","created_at":"..."}]
  liked_by        JSONB NOT NULL DEFAULT '[]'::jsonb,     -- ex: ["p1","p2"]
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_activities_created ON activities(created_at DESC);
CREATE INDEX idx_activities_player  ON activities(player_id);

-- ─── 5. CLUBS (membres + events + chat + défis + achievements inline) ──────
CREATE TABLE clubs (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  short_name      TEXT NOT NULL,
  description     TEXT NOT NULL,
  logo            TEXT NOT NULL,
  color           TEXT NOT NULL,
  visibility      TEXT NOT NULL CHECK (visibility IN ('public','private')),
  type            TEXT NOT NULL CHECK (type IN ('physical','digital')),
  city            TEXT NOT NULL,
  country         TEXT NOT NULL,
  country_flag    TEXT NOT NULL,
  creator_id      TEXT NOT NULL REFERENCES players(id),
  membership      JSONB NOT NULL DEFAULT '{"free":true}'::jsonb,  -- {"free":false,"price":220}
  members         JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- ex: [{"player_id":"p5","role":"creator","joined_at":"...","wins":34,"losses":29}]
  events          JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- ex: [{"id":"e1","title":"...","date":"...","venue":"...","type":"training","max":40,"registered":["p5"]}]
  challenges      JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- ex: [{"id":"ch1","vs_club":"c2","date":"...","status":"accepted"}]
  achievements    JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- ex: [{"id":"a1","emoji":"🎯","label":"100 matchs","unlocked":true,"unlocked_at":"..."}]
  chat            JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- ex: [{"id":"msg1","player_id":"p5","text":"...","sent_at":"..."}]
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 6. CLUB_ADMIN (tournois, cotisations, finances, annonces) ─────────────
CREATE TABLE club_admin (
  club_id         TEXT PRIMARY KEY REFERENCES clubs(id) ON DELETE CASCADE,
  tournaments     JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- ex: [{"id":"t1","name":"...","start_date":"...","format":"single-elim","status":"open","entry_fee":12,"max":16,"registered":["p5","p6"]}]
  subscriptions   JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- ex: [{"id":"s1","player_id":"p5","plan":"annual","amount":220,"start":"...","end":"...","status":"active","paid_via":"card"}]
  bookings        JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- ex: [{"id":"b1","table":1,"players":["p5","p6"],"date":"...","duration":90,"purpose":"training"}]
  coachings       JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- ex: [{"id":"co1","coach":"p6","students":["p7"],"topic":"...","date":"...","duration":60}]
  expenses        JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- ex: [{"id":"x1","label":"...","category":"rent","amount":1200,"date":"..."}]
  invoices        JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- ex: [{"id":"i1","subject":"...","to":"...","amount":220,"date":"...","status":"paid"}]
  announcements   JSONB NOT NULL DEFAULT '[]'::jsonb
  -- ex: [{"id":"an1","title":"...","body":"...","author":"p5","audience":"all","pinned":true,"published_at":"..."}]
);

-- ─── 7. CHALLENGES (défis entre joueurs) ────────────────────────────────────
CREATE TABLE challenges (
  id              TEXT PRIMARY KEY,
  creator_id      TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  opponent_id     TEXT REFERENCES players(id),            -- NULL = défi ouvert
  status          TEXT NOT NULL CHECK (status IN ('open','pending','active','completed')),
  mode            TEXT NOT NULL CHECK (mode IN ('ranked','casual')),
  format          TEXT NOT NULL CHECK (format IN ('BO3','BO5','BO7')),
  venue           TEXT,
  scheduled_at    TIMESTAMPTZ,
  message         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_challenges_status ON challenges(status);

-- ─── 8. MESSAGES (messagerie privée) ────────────────────────────────────────
CREATE TABLE messages (
  id              TEXT PRIMARY KEY,
  sender_id       TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  receiver_id     TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  text            TEXT NOT NULL,
  read_at         TIMESTAMPTZ,
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (sender_id <> receiver_id)
);
CREATE INDEX idx_messages_pair ON messages(sender_id, receiver_id, sent_at);

-- ─── 9. VENUES (cartographie + tags + horaires + reviews + territoire) ─────
CREATE TABLE venues (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  address         TEXT NOT NULL,
  lat             DOUBLE PRECISION NOT NULL,
  lng             DOUBLE PRECISION NOT NULL,
  type            TEXT NOT NULL CHECK (type IN ('club','public','bar')),
  surface         TEXT NOT NULL CHECK (surface IN ('indoor','outdoor')),
  pricing         TEXT NOT NULL CHECK (pricing IN ('free','paid','membership')),
  price_info      TEXT,
  tables          INTEGER NOT NULL DEFAULT 1,
  description     TEXT,
  rating          NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count    INTEGER NOT NULL DEFAULT 0,
  tags            JSONB NOT NULL DEFAULT '[]'::jsonb,     -- ex: ["Compétition","Vestiaires"]
  hours           JSONB NOT NULL DEFAULT '[]'::jsonb,     -- ex: [{"days":"Lun–Ven","time":"18h–22h"}]
  reviews         JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- ex: [{"id":"r1","author":"Léon L.","emoji":"🐧","rating":5,"comment":"...","sub":{"tables":5,"ambiance":5,"clean":4,"access":4},"created_at":"..."}]
  club_wins       JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- ex: [{"club_id":"c1","wins":38},{"club_id":"c2","wins":12}]  (territoire)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_venues_geo ON venues(lat, lng);

-- ═══════════════════════════════════════════════════════════════════════════
-- 9 TABLES — c'est tout.
-- ═══════════════════════════════════════════════════════════════════════════
