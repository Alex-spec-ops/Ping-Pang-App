-- ============================================================
-- 002_match_type_variable_k.sql
-- Ajoute match_type sur matches + K variable dans confirm_match
-- ============================================================

-- Colonne match_type avec contrainte et défaut 'ranked'
ALTER TABLE matches
  ADD COLUMN IF NOT EXISTS match_type text NOT NULL DEFAULT 'ranked'
    CHECK (match_type IN ('tournament', 'ranked', 'casual'));

-- ============================================================
-- Mise à jour de confirm_match : K variable selon match_type
--   tournament → K = 48
--   ranked     → K = 32
--   casual     → K = 16
-- ============================================================
CREATE OR REPLACE FUNCTION confirm_match(match_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_match         matches%ROWTYPE;
  v_rating_a      int;
  v_rating_b      int;
  v_k             float;
  v_expected_a    float;
  v_delta         int;
  v_new_a         int;
  v_new_b         int;
  v_winner_is_a   bool;
BEGIN
  -- Verrou exclusif sur le match
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

  -- K selon le type de match
  v_k := CASE v_match.match_type
    WHEN 'tournament' THEN 48.0
    WHEN 'casual'     THEN 16.0
    ELSE                   32.0   -- 'ranked' par défaut
  END;

  -- Ratings actuels (verrous)
  SELECT rating INTO v_rating_a FROM profiles WHERE id = v_match.player_a_id FOR UPDATE;
  SELECT rating INTO v_rating_b FROM profiles WHERE id = v_match.player_b_id FOR UPDATE;

  v_winner_is_a := (v_match.winner_id = v_match.player_a_id);

  -- Formule ELO avec K variable
  IF v_winner_is_a THEN
    v_expected_a := 1.0 / (1.0 + power(10.0, (v_rating_b - v_rating_a)::float / 400.0));
    v_delta      := round(v_k * (1.0 - v_expected_a))::int;
    v_new_a      := v_rating_a + v_delta;
    v_new_b      := greatest(100, v_rating_b - v_delta);
  ELSE
    v_expected_a := 1.0 / (1.0 + power(10.0, (v_rating_a - v_rating_b)::float / 400.0));
    v_delta      := round(v_k * (1.0 - v_expected_a))::int;
    v_new_b      := v_rating_b + v_delta;
    v_new_a      := greatest(100, v_rating_a - v_delta);
  END IF;

  -- Mise à jour match
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
