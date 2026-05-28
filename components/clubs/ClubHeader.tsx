"use client";

import type { Club, ClubStats } from "../../lib/clubs";
import { isMember, isAdmin } from "../../lib/clubs";
import { CURRENT_USER_ID } from "../../lib/data";

interface Props {
  club: Club;
  stats: ClubStats;
  joined: boolean;
  onJoin: () => void;
  onLeave: () => void;
}

export default function ClubHeader({ club, stats, joined, onJoin, onLeave }: Props) {
  const currentUserIsAdmin = isAdmin(club, CURRENT_USER_ID);

  return (
    <section className="px-4 pt-4 pb-3 bg-[#F9F9FF]">
      <div className="flex items-center gap-4">
        <div 
          className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-2xl border-2" 
          style={{ borderColor: club.color, background: "#fff", fontSize: "2rem" }}
        >
          {club.logo}
        </div>
        <div className="min-w-0 flex-1">
          <h2
            className="truncate text-lg font-bold text-[#0A241E] flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="truncate">{club.name}</span>
            {club.visibility === "private" && (
              <span className="text-[9px] font-semibold uppercase tracking-wide text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full border border-[#E5E7EB] shrink-0">
                🔒 Privé
              </span>
            )}
          </h2>
          <p className="truncate text-sm text-zinc-500 mt-0.5" style={{ fontFamily: "var(--font-ui)" }}>
            {club.countryFlag} {club.city} · {club.country}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-zinc-600 leading-relaxed" style={{ fontFamily: "var(--font-ui)" }}>
        {club.description}
      </p>

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-white border border-[#E5E7EB] px-2 py-2 flex flex-col justify-center">
          <p className="text-base font-bold tabular-nums text-[#0A241E]" style={{ fontFamily: "var(--font-display)" }}>
            {stats.memberCount}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>
            Membres
          </p>
        </div>
        <div className="rounded-xl bg-white border border-[#E5E7EB] px-2 py-2 flex flex-col justify-center">
          <p className="text-base font-bold tabular-nums text-[#0A241E]" style={{ fontFamily: "var(--font-display)" }}>
            {stats.totalMatches}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>
            Matchs
          </p>
        </div>
        <div className="rounded-xl bg-white border border-[#E5E7EB] px-2 py-2 flex flex-col justify-center">
          <p className="text-base font-bold tabular-nums" style={{ color: club.color, fontFamily: "var(--font-display)" }}>
            {stats.winRate}%
          </p>
          <p className="text-[10px] uppercase tracking-wide text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>
            {stats.totalWins}V / {stats.totalLosses}D
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {joined ? (
          <>
            {currentUserIsAdmin && (
              <button
                type="button"
                className="flex-[1.5] rounded-xl py-2 text-sm font-bold text-[#0A241E] bg-[#F9F9FF] border border-[#E5E7EB] transition-transform active:scale-95"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                ⚙️ Gérer
              </button>
            )}
            <button
              type="button"
              onClick={onLeave}
              className="flex-1 rounded-xl py-2 text-sm font-bold text-zinc-500 bg-[#F9F9FF] border border-[#E5E7EB] transition-transform active:scale-95"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              Quitter
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl py-2 text-sm font-bold text-[#0A241E] bg-[#F9F9FF] border border-[#E5E7EB] transition-transform active:scale-95"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              🔗 Inviter
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onJoin}
              className="flex-[2] rounded-xl py-2 text-sm font-bold text-white shadow-[0px_4px_10px_rgba(0,0,0,0.1)] transition-transform active:scale-95"
              style={{ background: club.color, fontFamily: "var(--font-ui)" }}
            >
              {club.visibility === "private" ? "🔒 Demander à rejoindre" : "Rejoindre le club"}
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl py-2 text-sm font-bold text-[#0A241E] bg-[#F9F9FF] border border-[#E5E7EB] transition-transform active:scale-95"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              🔗 Inviter
            </button>
          </>
        )}
      </div>
    </section>
  );
}
