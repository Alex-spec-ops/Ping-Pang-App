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
          className="w-full rounded-xl px-3 py-2 text-sm outline-none"
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            fontFamily: "var(--font-ui)",
            color: "#0A241E",
          }}
        />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto px-4 pb-3 text-xs">
        {["Mondial", "France", "Mon club", "Amis"].map((label, i) => (
          <button
            key={label}
            type="button"
            className="shrink-0 rounded-full px-3 py-1.5 font-bold uppercase tracking-wider transition-colors"
            style={{
              background: i === 0 ? "#0A241E" : "#fff",
              color: i === 0 ? "#fff" : "#616363",
              border: i === 0 ? "none" : "1px solid #E5E7EB",
              fontFamily: "var(--font-ui)",
              fontSize: "9px",
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {me >= 0 && (
        <div
          className="mx-4 mb-3 flex items-center gap-3 rounded-xl p-3"
          style={{ background: "#D1EAE2", border: "1px solid #BAE0D4" }}
        >
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
            style={{ background: "#0A241E", fontFamily: "var(--font-ui)" }}
          >
            #{me + 1}
          </span>
          <p className="flex-1 text-sm font-semibold text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
            Ta position mondiale
          </p>
        </div>
      )}

      <ul className="space-y-2 px-4 pb-8">
        {ranked.map((p, idx) => {
          const rank = idx + 1;
          const isMe = p.id === CURRENT_USER_ID;
          return (
            <li key={p.id}>
              <Link
                href={`/profile/${p.id}`}
                className="flex items-center gap-3 rounded-xl px-3 py-3 transition-all hover:translate-y-[-1px] hover:shadow-[0px_4px_20px_rgba(10,36,30,0.05)]"
                style={{
                  background: isMe ? "rgba(10,36,30,0.04)" : "#fff",
                  border: isMe ? "1px solid #BAE0D4" : "1px solid #E5E7EB",
                }}
              >
                <span
                  className="w-7 text-center text-sm font-bold tabular-nums"
                  style={{
                    color: rank <= 3 ? "var(--color-gold)" : "#616363",
                    fontFamily: "var(--font-ui)",
                  }}
                >
                  {medal(rank) ?? rank}
                </span>
                <Avatar emoji={p.avatar} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
                    {p.fullName}{" "}
                    <span className="text-xs font-normal text-zinc-400">{p.countryFlag}</span>
                  </p>
                  <p className="truncate text-xs text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>
                    @{p.username}{p.club ? ` · ${p.club}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="text-base font-bold tabular-nums text-[#0A241E]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {p.rating}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>
                    ELO
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
