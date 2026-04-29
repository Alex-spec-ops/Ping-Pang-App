import Link from "next/link";
import TopBar from "../../components/TopBar";
import Avatar from "../../components/Avatar";
import { getLeaderboard } from "../../lib/data";

export const metadata = {
  title: "Joueurs — PingPang",
};

const medal = (rank: number) =>
  rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;

export default function PlayersPage() {
  const ranked = getLeaderboard();
  return (
    <>
      <TopBar title="Classement" subtitle="Les meilleurs pongistes" />

      <div className="px-4 pt-3">
        <input
          type="search"
          placeholder="Rechercher un joueur, un club…"
          className="w-full rounded-full bg-zinc-100 px-4 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-zinc-900"
        />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto px-4 pb-3 text-xs">
        {["Mondial", "France", "Mon club", "Amis"].map((label, i) => (
          <button
            key={label}
            type="button"
            className={`shrink-0 rounded-full px-3 py-1.5 font-medium ${
              i === 0
                ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ol className="divide-y divide-zinc-100 border-t border-zinc-100 dark:divide-zinc-800 dark:border-zinc-800">
        {ranked.map((p, idx) => {
          const rank = idx + 1;
          return (
            <li key={p.id}>
              <Link
                href={`/profile/${p.id}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <span className="w-7 text-center text-sm font-semibold tabular-nums text-zinc-500">
                  {medal(rank) ?? rank}
                </span>
                <Avatar emoji={p.avatar} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {p.fullName}{" "}
                    <span className="text-xs font-normal text-zinc-500">
                      {p.countryFlag}
                    </span>
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    @{p.username}
                    {p.club ? ` · ${p.club}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold tabular-nums">{p.rating}</p>
                  <p className="text-[10px] text-zinc-500">ELO</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
