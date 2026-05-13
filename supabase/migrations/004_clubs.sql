-- ============================================================
-- 004_clubs.sql — Système Clubs, Événements, Tournois
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: clubs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clubs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  type        text NOT NULL CHECK (type IN ('pro', 'loisir')),
  logo        text,
  description text,
  color       text NOT NULL DEFAULT '#10b981',
  city        text,
  website     text,
  created_by  uuid NOT NULL REFERENCES profiles(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clubs_type ON clubs (type);
CREATE INDEX IF NOT EXISTS idx_clubs_slug ON clubs (slug);

-- ------------------------------------------------------------
-- TABLE: club_members
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS club_members (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id   uuid NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role      text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (club_id, player_id)
);

CREATE INDEX IF NOT EXISTS idx_club_members_club   ON club_members (club_id);
CREATE INDEX IF NOT EXISTS idx_club_members_player ON club_members (player_id);

-- ------------------------------------------------------------
-- TABLE: events
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id          uuid NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  name             text NOT NULL,
  description      text,
  type             text NOT NULL DEFAULT 'casual'
                     CHECK (type IN ('tournament', 'casual', 'training')),
  date             timestamptz NOT NULL,
  location         text,
  max_participants int,
  created_by       uuid NOT NULL REFERENCES profiles(id),
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_club ON events (club_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events (date DESC);

-- ------------------------------------------------------------
-- TABLE: tournaments
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tournaments (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  format   text NOT NULL DEFAULT 'round_robin'
             CHECK (format IN ('round_robin', 'single_elimination', 'double_elimination')),
  status   text NOT NULL DEFAULT 'upcoming'
             CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- TABLE: tournament_participants
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tournament_participants (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  player_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seed          int,
  UNIQUE (tournament_id, player_id)
);

CREATE INDEX IF NOT EXISTS idx_tp_tournament ON tournament_participants (tournament_id);

-- ------------------------------------------------------------
-- VIEW: club_leaderboard
-- Rang des clubs basé sur la somme ELO de leurs membres
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW club_leaderboard AS
SELECT
  c.id,
  c.name,
  c.slug,
  c.type,
  c.logo,
  c.color,
  c.city,
  COUNT(cm.player_id)::int  AS member_count,
  COALESCE(AVG(p.rating), 0)::int AS avg_rating,
  COALESCE(SUM(p.rating), 0)::int AS total_rating
FROM clubs c
LEFT JOIN club_members cm ON cm.club_id = c.id
LEFT JOIN profiles p ON p.id = cm.player_id
GROUP BY c.id, c.name, c.slug, c.type, c.logo, c.color, c.city
ORDER BY avg_rating DESC;

-- ------------------------------------------------------------
-- RLS Policies
-- ------------------------------------------------------------
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;

-- Clubs : lecture publique, écriture authentifiée
CREATE POLICY "clubs_select" ON clubs FOR SELECT USING (true);
CREATE POLICY "clubs_insert" ON clubs FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "clubs_update" ON clubs FOR UPDATE USING (
  EXISTS (SELECT 1 FROM club_members WHERE club_id = clubs.id AND player_id = auth.uid() AND role = 'admin')
);

-- Club members : lecture publique, insertion/suppression par l'intéressé ou admin
CREATE POLICY "cm_select" ON club_members FOR SELECT USING (true);
CREATE POLICY "cm_insert" ON club_members FOR INSERT WITH CHECK (auth.uid() = player_id);
CREATE POLICY "cm_delete" ON club_members FOR DELETE USING (
  auth.uid() = player_id OR
  EXISTS (SELECT 1 FROM club_members a WHERE a.club_id = club_members.club_id AND a.player_id = auth.uid() AND a.role = 'admin')
);

-- Events : lecture publique, écriture par admin du club
CREATE POLICY "events_select" ON events FOR SELECT USING (true);
CREATE POLICY "events_insert" ON events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM club_members WHERE club_id = events.club_id AND player_id = auth.uid() AND role = 'admin')
);

-- Tournaments : lecture publique
CREATE POLICY "tournaments_select" ON tournaments FOR SELECT USING (true);
CREATE POLICY "tournaments_insert" ON tournaments FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM events e
    JOIN club_members cm ON cm.club_id = e.club_id
    WHERE e.id = tournaments.event_id AND cm.player_id = auth.uid() AND cm.role = 'admin'
  )
);

-- Tournament participants : lecture publique, inscription par soi-même
CREATE POLICY "tp_select" ON tournament_participants FOR SELECT USING (true);
CREATE POLICY "tp_insert" ON tournament_participants FOR INSERT WITH CHECK (auth.uid() = player_id);
CREATE POLICY "tp_delete" ON tournament_participants FOR DELETE USING (auth.uid() = player_id);
