-- ============================================================
-- 003_rls_policies.sql — Row Level Security
-- Lecture publique, écriture via la clé anon (app sans auth)
-- ============================================================

-- Activer RLS (déjà actif par défaut sur Supabase, mais explicite)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches  ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- profiles
-- ------------------------------------------------------------
-- Lecture : tout le monde (leaderboard, profils publics)
CREATE POLICY "profiles_select_all"
  ON profiles FOR SELECT
  USING (true);

-- Insert/Update : autorisé via anon (app sans auth réelle)
CREATE POLICY "profiles_insert_anon"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "profiles_update_anon"
  ON profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------
-- matches
-- ------------------------------------------------------------
-- Lecture : tout le monde
CREATE POLICY "matches_select_all"
  ON matches FOR SELECT
  USING (true);

-- Insert : autorisé via anon
CREATE POLICY "matches_insert_anon"
  ON matches FOR INSERT
  WITH CHECK (true);

-- Update : autorisé via anon (confirm/dispute)
CREATE POLICY "matches_update_anon"
  ON matches FOR UPDATE
  USING (true)
  WITH CHECK (true);
