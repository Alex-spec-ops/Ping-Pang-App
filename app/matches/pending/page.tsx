import TopBar from "@/components/TopBar";
import PendingMatchList from "./PendingMatchList";
import { createClient } from "@/lib/supabase/server";

export default async function PendingMatchesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // En mode mock (pas d'auth), on liste tous les pending
  const query = supabase
    .from("matches")
    .select(
      `id, score_a, score_b, set_scores, played_at, submitted_by,
       player_a:profiles!matches_player_a_id_fkey(id, username, full_name, avatar, rating),
       player_b:profiles!matches_player_b_id_fkey(id, username, full_name, avatar, rating),
       winner:profiles!matches_winner_id_fkey(id, username)`,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (user?.id) {
    query.eq("player_b_id", user.id);
  }

  const { data: matches, error } = await query;

  return (
    <main className="mx-auto max-w-md pb-24">
      <TopBar
        title="Matchs en attente"
        subtitle="À confirmer ou contester"
      />
      {error && (
        <p className="p-6 text-center text-sm text-red-500">
          Impossible de charger les matchs. Configure .env.local.
        </p>
      )}
      {!error && <PendingMatchList matches={(matches ?? []) as never} currentUserId={user?.id} />}
    </main>
  );
}
