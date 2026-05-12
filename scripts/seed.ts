/**
 * Seed : 20 joueurs fictifs + 30 matchs confirmés avec ELO calculé.
 * Usage : node --experimental-strip-types scripts/seed.ts
 * Prérequis : NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { calculateElo } from "../lib/elo.ts";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Chargement manuel de .env.local
function loadEnv() {
  try {
    const envPath = join(process.cwd(), ".env.local");
    const lines = readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const [key, ...rest] = line.split("=");
      if (key && rest.length) {
        process.env[key.trim()] = rest.join("=").trim();
      }
    }
  } catch {
    // .env.local absent — variables d'env déjà chargées
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY requis.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------------------------------------------------------------------
// Données fictives
// ---------------------------------------------------------------------------

const PLAYERS = [
  { username: "felix_fr",       full_name: "Félix Lebrun",      avatar: "🦊" },
  { username: "alexis_lb",      full_name: "Alexis Lebrun",     avatar: "🐺" },
  { username: "marie_smash",    full_name: "Marie Dubois",       avatar: "🦋" },
  { username: "diaz_es",        full_name: "Carlos Diaz",        avatar: "🐂" },
  { username: "sofia_de",       full_name: "Sofia Müller",       avatar: "🦌" },
  { username: "pierre_ttc",     full_name: "Pierre Martin",      avatar: "🦁" },
  { username: "camille_bx",     full_name: "Camille Rousseau",   avatar: "🐦" },
  { username: "hugo_nantes",    full_name: "Hugo Bernard",       avatar: "🦝" },
  { username: "lea_lyon",       full_name: "Léa Simon",          avatar: "🦜" },
  { username: "theo_paris",     full_name: "Théo Petit",         avatar: "🐯" },
  { username: "ana_madrid",     full_name: "Ana García",         avatar: "🌹" },
  { username: "jan_berlin",     full_name: "Jan Schmidt",        avatar: "🦅" },
  { username: "lucas_bel",      full_name: "Lucas Dupont",       avatar: "🐻" },
  { username: "emma_nice",      full_name: "Emma Laurent",       avatar: "🦈" },
  { username: "romain_ttc",     full_name: "Romain Moreau",      avatar: "🐸" },
  { username: "alice_str",      full_name: "Alice Blanc",        avatar: "🦩" },
  { username: "maxime_tou",     full_name: "Maxime Leroy",       avatar: "🦊" },
  { username: "julie_rennes",   full_name: "Julie Thomas",       avatar: "🐧" },
  { username: "kévin_metz",     full_name: "Kévin Richard",      avatar: "🐺" },
  { username: "sophie_brest",   full_name: "Sophie Durand",      avatar: "🦋" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomSets(winnerSide: "a" | "b"): { sets: Array<{ a: number; b: number }>; scoreA: number; scoreB: number } {
  const setsToWin = 3;
  const sets: Array<{ a: number; b: number }> = [];
  let wonA = 0;
  let wonB = 0;

  while (wonA < setsToWin && wonB < setsToWin) {
    const remaining = setsToWin - (winnerSide === "a" ? wonA : wonB);
    const mustWin = remaining === 1;
    if (mustWin && wonA === setsToWin - 1 && wonB < setsToWin - 1 && winnerSide === "a") {
      sets.push({ a: 11, b: Math.floor(Math.random() * 9) });
      wonA++;
    } else if (mustWin && wonB === setsToWin - 1 && wonA < setsToWin - 1 && winnerSide === "b") {
      sets.push({ a: Math.floor(Math.random() * 9), b: 11 });
      wonB++;
    } else {
      // alternance légèrement biaisée vers le gagnant
      const aWins = Math.random() < (winnerSide === "a" ? 0.6 : 0.4);
      sets.push(aWins ? { a: 11, b: Math.floor(Math.random() * 9) } : { a: Math.floor(Math.random() * 9), b: 11 });
      if (aWins) wonA++; else wonB++;
    }
  }
  return { sets, scoreA: wonA, scoreB: wonB };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function seed() {
  console.log("→ Insertion des profils…");

  const { data: inserted, error: profileErr } = await supabase
    .from("profiles")
    .upsert(
      PLAYERS.map((p) => ({ ...p, rating: 1200, matches_played: 0, matches_won: 0 })),
      { onConflict: "username" },
    )
    .select("id, username, rating");

  if (profileErr) {
    console.error("Erreur profils:", profileErr.message);
    process.exit(1);
  }

  console.log(`  ✔ ${inserted!.length} profils`);

  // Map username → profil courant (rating mutable)
  const profileMap: Record<string, { id: string; rating: number }> = {};
  for (const p of inserted!) {
    profileMap[p.username] = { id: p.id, rating: p.rating };
  }

  const ids = inserted!.map((p) => p.id);

  console.log("→ Création de 30 matchs confirmés…");

  const now = Date.now();

  for (let i = 0; i < 30; i++) {
    const shuffled = shuffle(ids);
    const idA = shuffled[0];
    const idB = shuffled[1];

    const ratingA = profileMap[inserted!.find((p) => p.id === idA)!.username].rating;
    const ratingB = profileMap[inserted!.find((p) => p.id === idB)!.username].rating;

    const winnerSide: "a" | "b" = Math.random() < 0.5 ? "a" : "b";
    const winnerId = winnerSide === "a" ? idA : idB;
    const winnerRating = winnerSide === "a" ? ratingA : ratingB;
    const loserRating = winnerSide === "a" ? ratingB : ratingA;

    const elo = calculateElo(winnerRating, loserRating);
    const newRatingA = winnerSide === "a" ? elo.newWinner : elo.newLoser;
    const newRatingB = winnerSide === "b" ? elo.newWinner : elo.newLoser;

    const { sets, scoreA, scoreB } = randomSets(winnerSide);

    // Date dans les 30 derniers jours
    const playedAt = new Date(now - Math.random() * 30 * 86400000).toISOString();

    const { error: matchErr } = await supabase.from("matches").insert({
      player_a_id: idA,
      player_b_id: idB,
      winner_id: winnerId,
      score_a: scoreA,
      score_b: scoreB,
      set_scores: sets,
      status: "confirmed",
      submitted_by: idA,
      rating_a_before: ratingA,
      rating_b_before: ratingB,
      rating_a_after: newRatingA,
      rating_b_after: newRatingB,
      rating_delta: elo.delta,
      played_at: playedAt,
      confirmed_at: new Date(now - Math.random() * 86400000).toISOString(),
    });

    if (matchErr) {
      console.error(`  ✗ Match ${i + 1}:`, matchErr.message);
      continue;
    }

    // Update ratings localement
    const usernameA = inserted!.find((p) => p.id === idA)!.username;
    const usernameB = inserted!.find((p) => p.id === idB)!.username;
    profileMap[usernameA].rating = newRatingA;
    profileMap[usernameB].rating = newRatingB;

    process.stdout.write(".");
  }

  console.log("\n→ Mise à jour des ratings en base…");

  // Sync ratings + stats vers profiles
  for (const [username, data] of Object.entries(profileMap)) {
    const { data: stats } = await supabase
      .from("matches")
      .select("id, winner_id, player_a_id, player_b_id")
      .or(`player_a_id.eq.${data.id},player_b_id.eq.${data.id}`)
      .eq("status", "confirmed");

    const matchesPlayed = stats?.length ?? 0;
    const matchesWon = stats?.filter((m) => m.winner_id === data.id).length ?? 0;

    await supabase
      .from("profiles")
      .update({ rating: data.rating, matches_played: matchesPlayed, matches_won: matchesWon })
      .eq("id", data.id);

    process.stdout.write("·");
  }

  console.log("\n✔ Seed terminé !");
  console.log("  Lancez 'npm run dev' et visitez /leaderboard");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
