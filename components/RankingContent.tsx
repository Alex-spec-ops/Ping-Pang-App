import Link from "next/link";
import Avatar from "./Avatar";
import { CURRENT_USER_ID, getLeaderboard } from "../lib/data";

const medal = (rank: number) =>
  rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;

export default function RankingContent() {
  const ranked = getLeaderboard();
  const me = ranked.findIndex((p) => p.id === CURRENT_USER_ID);

  return (
    <>
      <div className="px-4 pt-3">
        <input
          type="search"
          placeholder="Rechercher un joueur…"
          className="w-full px-3 py-2 text-sm"
          style={{ background: "var(--color-cream)", border: "var(--border-thin)", fontFamily: "var(--font-ui)" }}
        />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto px-4 pb-3 text-xs">
        {["Mondial", "France", "Mon club", "Amis"].map((label, i) => (
          <button
            key={label}
            type="button"
            className="shrink-0 px-3 py-1.5 font-medium"
            style={{
              background: i === 0 ? "var(--color-ink)" : "var(--color-cream)",
              color: i === 0 ? "#fff" : "var(--color-muted)",
              fontFamily: "var(--font-ui)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {me >= 0 && (
        <div
          className="mx-4 mb-3 flex items-center gap-3 p-3"
          style={{ background: "rgba(14,61,46,0.08)", border: "1px solid var(--color-forest)" }}
        >
          <span
            className="grid h-8 w-8 place-items-center text-xs font-bold"
            style={{ background: "var(--color-forest)", color: "#fff", fontFamily: "var(--font-ui)" }}
          >
            #{me + 1}
          </span>
          <p className="flex-1 text-sm font-semibold" style={{ fontFamily: "var(--font-ui)" }}>
            Ta position mondiale
          </p>
        </div>
      )}

      <ol className="border-t pb-8" style={{ borderColor: "var(--color-line)" }}>
        {ranked.map((p, idx) => {
          const rank = idx + 1;
          const isMe = p.id === CURRENT_USER_ID;
          return (
            <li key={p.id} style={{ borderBottom: "var(--border-thin)" }}>
              <Link
                href={`/profile/${p.id}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-50"
                style={{ background: isMe ? "rgba(14,61,46,0.05)" : "transparent" }}
              >
                <span
                  className="w-7 text-center text-sm font-bold tabular-nums"
                  style={{
                    color: rank <= 3 ? "var(--color-gold)" : "var(--color-muted)",
                    fontFamily: "var(--font-ui)",
                  }}
                >
                  {medal(rank) ?? rank}
                </span>
                <Avatar emoji={p.avatar} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold" style={{ fontFamily: "var(--font-ui)" }}>
                    {p.fullName}{" "}
                    <span className="text-xs font-normal text-zinc-500">{p.countryFlag}</span>
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    @{p.username}{p.club ? ` · ${p.club}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="text-base font-bold tabular-nums"
                    style={{ color: "var(--color-forest)", fontFamily: "var(--font-display)" }}
                  >
                    {p.rating}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">ELO</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
