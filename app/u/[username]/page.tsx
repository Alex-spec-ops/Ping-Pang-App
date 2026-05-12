import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import { createClient } from "@/lib/supabase/server";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar, rating, matches_played, matches_won")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  const { data: matches } = await supabase
    .from("matches")
    .select(
      `id, score_a, score_b, status, played_at,
       rating_a_before, rating_b_before, rating_a_after, rating_b_after, rating_delta,
       player_a:profiles!matches_player_a_id_fkey(id, username, full_name, avatar),
       player_b:profiles!matches_player_b_id_fkey(id, username, full_name, avatar),
       winner:profiles!matches_winner_id_fkey(id)`,
    )
    .or(`player_a_id.eq.${profile.id},player_b_id.eq.${profile.id}`)
    .eq("status", "confirmed")
    .order("played_at", { ascending: false })
    .limit(20);

  const winRate =
    profile.matches_played > 0
      ? Math.round((profile.matches_won / profile.matches_played) * 100)
      : null;

  return (
    <main className="mx-auto max-w-md pb-24">
      <TopBar title={`@${profile.username}`} subtitle="Profil ELO" />

      {/* Hero */}
      <div className="flex flex-col items-center gap-2 py-6">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl dark:bg-emerald-900">
          {profile.avatar ?? "🏓"}
        </span>
        <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {profile.full_name ?? profile.username}
        </p>
        <p className="text-sm text-zinc-500">@{profile.username}</p>
      </div>

      {/* Stats */}
      <div className="mx-4 mb-6 grid grid-cols-3 divide-x divide-zinc-100 rounded-2xl border border-zinc-100 dark:divide-zinc-800 dark:border-zinc-800">
        <Stat label="ELO" value={String(profile.rating)} accent />
        <Stat label="Matchs" value={String(profile.matches_played)} />
        <Stat
          label="Victoires"
          value={winRate !== null ? `${winRate}%` : "—"}
        />
      </div>

      {/* Historique matchs */}
      <h2 className="px-4 pb-2 text-sm font-semibold text-zinc-500 uppercase tracking-wide">
        20 derniers matchs
      </h2>

      {(!matches || matches.length === 0) && (
        <p className="px-4 py-4 text-sm text-zinc-400">Aucun match confirmé.</p>
      )}

      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {(matches ?? []).map((m) => {
          const isA = (m.player_a as { id: string } | null)?.id === profile.id;
          const opponent = isA ? m.player_b : m.player_a;
          const won = (m.winner as { id: string } | null)?.id === profile.id;
          const scoreMe = isA ? m.score_a : m.score_b;
          const scoreOpp = isA ? m.score_b : m.score_a;

          const ratingBefore = isA ? m.rating_a_before : m.rating_b_before;
          const ratingAfter = isA ? m.rating_a_after : m.rating_b_after;
          const delta =
            ratingBefore != null && ratingAfter != null
              ? ratingAfter - ratingBefore
              : null;

          const opp = opponent as { username: string; full_name: string | null; avatar: string | null } | null;

          return (
            <li key={m.id} className="flex items-center gap-3 px-4 py-3">
              <span
                className={`w-2 self-stretch rounded-full ${
                  won ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              <span className="text-xl">{opp?.avatar ?? "🏓"}</span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">
                  {opp?.full_name ?? opp?.username ?? "?"}
                </p>
                <p className="text-xs text-zinc-400">
                  {scoreMe} – {scoreOpp} ·{" "}
                  {new Date(m.played_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              {delta !== null && (
                <span
                  className={`text-sm font-bold ${
                    delta >= 0 ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {delta >= 0 ? "+" : ""}
                  {delta}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col items-center py-4">
      <span
        className={`text-xl font-bold ${
          accent
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-zinc-900 dark:text-zinc-100"
        }`}
      >
        {value}
      </span>
      <span className="text-xs text-zinc-400">{label}</span>
    </div>
  );
}
