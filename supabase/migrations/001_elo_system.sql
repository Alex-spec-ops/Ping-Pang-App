-- ============================================================
-- 001_elo_system.sql — Système ELO Ping-Pang
-- ============================================================

-- Extension uuid
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- TABLE: profiles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username      text NOT NULL UNIQUE,
  full_name     text,
  avatar        text,
  rating        int  NOT NULL DEFAULT 1200,
  matches_played int NOT NULL DEFAULT 0,
  matches_won   int  NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_rating ON profiles (rating DESC);

-- ------------------------------------------------------------
-- TABLE: matches
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS matches (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_a_id      uuid NOT NULL REFERENCES profiles(id),
  player_b_id      uuid NOT NULL REFERENCES profiles(id),
  winner_id        uuid          REFERENCES profiles(id),
  score_a          int  NOT NULL CHECK (score_a BETWEEN 0 AND 3),
  score_b          int  NOT NULL CHECK (score_b BETWEEN 0 AND 3),
  set_scores       jsonb,
  status           text NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'confirmed', 'disputed')),
  submitted_by     uuid NOT NULL REFERENCES profiles(id),
  rating_a_before  int,
  rating_b_before  int,
  rating_a_after   int,
  rating_b_after   int,
  rating_delta     int,
  played_at        timestamptz NOT NULL,
  confirmed_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT no_self_match CHECK (player_a_id <> player_b_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_status ON matches (status);
CREATE INDEX IF NOT EXISTS idx_matches_player_a ON matches (player_a_id);
CREATE INDEX IF NOT EXISTS idx_matches_player_b ON matches (player_b_id);

-- ------------------------------------------------------------
-- FUNCTION: confirm_match(match_id uuid)
-- Applique le calcul ELO en transaction atomique.
-- K=32, score binaire (gagné/perdu).
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION confirm_match(match_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_match         matches%ROWTYPE;
  v_rating_a      int;
  v_rating_b      int;
  v_expected_a    float;
  v_delta         int;
  v_new_a         int;
  v_new_b         int;
  v_winner_is_a   bool;
BEGIN
  -- Verrou exclusif sur le match pour éviter la double confirmation
  SELECT * INTO v_match
    FROM matches
   WHERE id = match_id
     FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Match introuvable : %', match_id;
  END IF;

  IF v_match.status <> 'pending' THEN
    RAISE EXCEPTION 'Le match % n''est pas en statut pending (statut actuel : %)',
      match_id, v_match.status;
  END IF;

  IF v_match.winner_id IS NULL THEN
    RAISE EXCEPTION 'winner_id manquant sur le match %', match_id;
  END IF;

  -- Ratings actuels
  SELECT rating INTO v_rating_a FROM profiles WHERE id = v_match.player_a_id FOR UPDATE;
  SELECT rating INTO v_rating_b FROM profiles WHERE id = v_match.player_b_id FOR UPDATE;

  v_winner_is_a := (v_match.winner_id = v_match.player_a_id);

  -- Formule ELO, du point de vue du gagnant
  IF v_winner_is_a THEN
    v_expected_a := 1.0 / (1.0 + power(10.0, (v_rating_b - v_rating_a)::float / 400.0));
    v_delta      := round(32.0 * (1.0 - v_expected_a))::int;
    v_new_a      := v_rating_a + v_delta;
    v_new_b      := greatest(100, v_rating_b - v_delta);
  ELSE
    v_expected_a := 1.0 / (1.0 + power(10.0, (v_rating_a - v_rating_b)::float / 400.0));
    v_delta      := round(32.0 * (1.0 - v_expected_a))::int;
    v_new_b      := v_rating_b + v_delta;
    v_new_a      := greatest(100, v_rating_a - v_delta);
  END IF;

  -- Mise à jour du match
  UPDATE matches SET
    status          = 'confirmed',
    rating_a_before = v_rating_a,
    rating_b_before = v_rating_b,
    rating_a_after  = v_new_a,
    rating_b_after  = v_new_b,
    rating_delta    = v_delta,
    confirmed_at    = now()
  WHERE id = match_id;

  -- Mise à jour profil A
  UPDATE profiles SET
    rating         = v_new_a,
    matches_played = matches_played + 1,
    matches_won    = matches_won + CASE WHEN v_winner_is_a THEN 1 ELSE 0 END
  WHERE id = v_match.player_a_id;

  -- Mise à jour profil B
  UPDATE profiles SET
    rating         = v_new_b,
    matches_played = matches_played + 1,
    matches_won    = matches_won + CASE WHEN NOT v_winner_is_a THEN 1 ELSE 0 END
  WHERE id = v_match.player_b_id;
END;
$$;
