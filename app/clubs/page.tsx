import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/TopBar";
import Link from "next/link";

export const metadata = {
  title: "Clubs — PingPang",
};

export default async function ClubsPage() {
  const supabase = await createClient();

  const clubs: any[] = [];
  const error = null;

  return (
    <main className="mx-auto max-w-md pb-24">
      <TopBar
        title="Clubs"
        subtitle="Classement inter-clubs"
        right={
          <Link
            href="/club/new"
            className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 text-white text-lg"
            aria-label="Créer un club"
          >
            +
          </Link>
        }
      />

      {/* Filtres pro / loisir */}
      <div className="flex gap-2 px-4 py-3">
        <Link
          href="/clubs"
          className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Tous
        </Link>
        <Link
          href="/clubs?type=pro"
          className="rounded-full border border-zinc-200 px-4 py-1.5 text-xs font-semibold text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
        >
          Pro
        </Link>
        <Link
          href="/clubs?type=loisir"
          className="rounded-full border border-zinc-200 px-4 py-1.5 text-xs font-semibold text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
        >
          Loisir
        </Link>
      </div>

      {error && (
        <p className="p-6 text-center text-sm text-red-500">
          {error.message?.includes("relation") || error.message?.includes("does not exist")
            ? "Les tables clubs n'existent pas encore. Lance les migrations SQL dans ton projet Supabase."
            : `Impossible de charger les clubs : ${error.message}`}
        </p>
      )}

      {!error && (
        <ol className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {(clubs ?? []).length === 0 && (
            <li className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="text-5xl">🏛️</span>
              <p className="font-semibold text-zinc-700 dark:text-zinc-300">Aucun club pour l'instant</p>
              <p className="text-sm text-zinc-500">Sois le premier à créer ton club !</p>
              <Link
                href="/club/new"
                className="mt-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white"
              >
                Créer un club
              </Link>
            </li>
          )}

          {(clubs ?? []).map((club, i) => {
            const rank = i + 1;
            return (
              <li key={club.id}>
                <Link
                  href={`/club/${club.slug}`}
                  className="flex items-center gap-4 px-4 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <span
                    className={`w-8 text-center text-sm font-bold ${
                      rank <= 3 ? "text-amber-500" : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
                  </span>

                  {/* Logo */}
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl"
                    style={{ backgroundColor: club.color + "22", color: club.color }}
                  >
                    {club.logo ?? "🏛️"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                        {club.name}
                      </p>
                      {club.type === "pro" && (
                        <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                          Pro
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">
                      {club.member_count} membre{club.member_count !== 1 ? "s" : ""}
                      {club.city ? ` · ${club.city}` : ""}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                      {club.avg_rating}
                    </p>
                    <p className="text-xs text-zinc-400">ELO moy.</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </main>
  );
}
