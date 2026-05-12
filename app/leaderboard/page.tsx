import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/TopBar";

const PAGE_SIZE = 20;

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  const { data: profiles, error, count } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar, rating, matches_played, matches_won", {
      count: "exact",
    })
    .order("rating", { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <main className="mx-auto max-w-md pb-24">
      <TopBar title="Classement" subtitle="ELO · K=32" />

      {error && (
        <p className="p-6 text-center text-sm text-red-500">
          Impossible de charger le classement. Configure .env.local.
        </p>
      )}

      {!error && (
        <>
          <ol className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {(profiles ?? []).map((p, i) => {
              const rank = from + i + 1;
              const winRate =
                p.matches_played > 0
                  ? Math.round((p.matches_won / p.matches_played) * 100)
                  : null;

              return (
                <li key={p.id} className="flex items-center gap-4 px-4 py-3">
                  <span
                    className={`w-8 text-center text-sm font-bold ${
                      rank <= 3
                        ? "text-amber-500"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
                  </span>

                  <a
                    href={`/u/${p.username}`}
                    className="flex flex-1 items-center gap-3"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-xl dark:bg-emerald-900">
                      {p.avatar ?? "🏓"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                        {p.full_name ?? p.username}
                      </p>
                      <p className="text-xs text-zinc-500">@{p.username}</p>
                    </div>
                  </a>

                  <div className="text-right">
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                      {p.rating}
                    </p>
                    {winRate !== null && (
                      <p className="text-xs text-zinc-400">{winRate}% V</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-6 text-sm">
              {page > 1 && (
                <a
                  href={`/leaderboard?page=${page - 1}`}
                  className="rounded-lg border border-zinc-200 px-4 py-2 dark:border-zinc-700"
                >
                  ← Précédent
                </a>
              )}
              <span className="text-zinc-400">
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <a
                  href={`/leaderboard?page=${page + 1}`}
                  className="rounded-lg border border-zinc-200 px-4 py-2 dark:border-zinc-700"
                >
                  Suivant →
                </a>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
