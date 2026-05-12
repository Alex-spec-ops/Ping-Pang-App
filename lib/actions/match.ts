"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "../supabase/server";

// ---------------------------------------------------------------------------
// Schémas Zod
// ---------------------------------------------------------------------------

const submitMatchSchema = z.object({
  player_b_id: z.string().uuid("Adversaire invalide"),
  winner_id: z.string().uuid("Gagnant invalide"),
  score_a: z.number().int().min(0).max(3),
  score_b: z.number().int().min(0).max(3),
  set_scores: z
    .array(z.object({ a: z.number().int(), b: z.number().int() }))
    .nullable()
    .optional(),
  played_at: z.string().datetime(),
});

// ---------------------------------------------------------------------------
// Types retour
// ---------------------------------------------------------------------------

type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// ---------------------------------------------------------------------------
// submitMatch — Joueur A soumet un match (status: pending)
// ---------------------------------------------------------------------------

export async function submitMatch(
  raw: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parse = submitMatchSchema.safeParse(raw);
  if (!parse.success) {
    return { ok: false, error: parse.error.issues[0].message };
  }

  const data = parse.data;
  const supabase = await createClient();

  // Récupère le profil courant (submitted_by = player_a)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const submittedBy = user?.id ?? process.env.SEED_USER_ID;

  if (!submittedBy) {
    return { ok: false, error: "Non authentifié" };
  }

  if (submittedBy === data.player_b_id) {
    return { ok: false, error: "Impossible de jouer contre soi-même" };
  }

  const { data: match, error } = await supabase
    .from("matches")
    .insert({
      player_a_id: submittedBy,
      player_b_id: data.player_b_id,
      winner_id: data.winner_id,
      score_a: data.score_a,
      score_b: data.score_b,
      set_scores: data.set_scores ?? null,
      status: "pending",
      submitted_by: submittedBy,
      played_at: data.played_at,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/matches/pending");
  return { ok: true, data: { id: match.id } };
}

// ---------------------------------------------------------------------------
// confirmMatch — Joueur B confirme → ELO calculé en transaction SQL
// ---------------------------------------------------------------------------

export async function confirmMatch(matchId: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.rpc("confirm_match", {
    match_id: matchId,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/matches/pending");
  revalidatePath("/leaderboard");
  revalidatePath("/");
  return { ok: true, data: undefined };
}

// ---------------------------------------------------------------------------
// disputeMatch — Joueur B conteste → status disputed, pas d'update rating
// ---------------------------------------------------------------------------

export async function disputeMatch(matchId: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("matches")
    .update({ status: "disputed" })
    .eq("id", matchId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/matches/pending");
  return { ok: true, data: undefined };
}
