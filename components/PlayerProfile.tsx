"use client";

import Link from "next/link";
import { useState } from "react";
import Avatar from "./Avatar";
import { CURRENT_USER_ID, getMatchesForPlayer, getMatchModeLabel, getPlayer } from "../lib/data";
import { setScoreLine, setsWon, timeAgo } from "../lib/format";
import { isCompetitive } from "../lib/types";

type Tab = "competitive" | "casual";

export default function PlayerProfile({ playerId }: { playerId: string }) {
  const [tab, setTab] = useState<Tab>("competitive");

  const player = getPlayer(playerId);
  if (!player) {
    return (
      <div className="px-4 py-10 text-center text-sm text-zinc-500">
        Joueur introuvable.
      </div>
    );
  }

  const rankedTotal = player.rankedWins + player.rankedLosses;
  const casualTotal = player.casualWins + player.casualLosses;
  const rankedWinrate = rankedTotal > 0 ? Math.round((player.rankedWins * 100) / rankedTotal) : 0;
  const casualWinrate = casualTotal > 0 ? Math.round((player.casualWins * 100) / casualTotal) : 0;

  const history = getMatchesForPlayer(player.id, tab);

  return (
    <>
      <section className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-4">
          <Avatar emoji={player.avatar} size="xl" />
          <div className="min-w-0 flex-1">
            <h2
              className="truncate text-lg font-bold text-[#0A241E]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {player.fullName}
            </h2>
            <p className="truncate text-sm text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>
              @{player.username}
            </p>
            <p className="mt-1 truncate text-xs text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>
              {player.countryFlag} {player.city}
              {player.club ? ` · ${player.club}` : ""}
            </p>
          </div>
        </div>

        {player.bio && (
          <p className="mt-3 text-sm text-zinc-600" style={{ fontFamily: "var(--font-ui)" }}>
            {player.bio}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white border border-[#E5E7EB] p-3">
            <p
              className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              🏆 Compétitif
            </p>
            <p
              className="mt-1 text-2xl font-bold tabular-nums text-[#0A241E]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {player.rating}
              <span className="ml-1 text-[10px] font-medium text-zinc-500">ELO</span>
            </p>
            <p className="mt-1 text-[11px] text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>
              {player.rankedWins}V – {player.rankedLosses}D · {rankedWinrate}%
            </p>
            <p className="text-[10px] text-zinc-400" style={{ fontFamily: "var(--font-ui)" }}>
              Peak {player.peakRating}
            </p>
          </div>
          <div className="rounded-xl bg-white border border-[#E5E7EB] p-3">
            <p
              className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              🤝 Amical
            </p>
            <p
              className="mt-1 text-2xl font-bold tabular-nums text-[#0A241E]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {casualTotal}
              <span className="ml-1 text-[10px] font-medium text-zinc-500">matchs</span>
            </p>
            <p className="mt-1 text-[11px] text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>
              {player.casualWins}V – {player.casualLosses}D · {casualWinrate}%
            </p>
            <p className="text-[10px] text-zinc-400" style={{ fontFamily: "var(--font-ui)" }}>
              Hors classement
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
          <Stat value={player.followers.toLocaleString("fr-FR")} label="Abonnés" />
          <Stat value={(rankedTotal + casualTotal).toString()} label="Matchs total" />
        </div>

        {playerId === CURRENT_USER_ID ? (
          <div className="mt-6 flex flex-col gap-3">
            {[
              { title: "ping pang paris, Les icons", image: "/ping-pang-icons.png", link: "https://pingpang.paris/collections/icons-collection-paris-2024" },
              { title: "ping pang paris, les essentiels", image: "/ping-pang-essentiels.png", link: "https://pingpang.paris/collections/collection-version-0-0" },
              { title: "ping pang effect", image: "/ping-pang-effect.png", link: "https://pingpang.paris/blogs/effect-magazine" },
            ].map((item, idx) => (
              <a 
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                key={idx} 
                className="w-full h-28 rounded-2xl bg-[#0A241E] flex items-center justify-center relative overflow-hidden shadow-sm bg-cover bg-center transition-transform hover:scale-[1.02] active:scale-[0.98] block"
                style={{ backgroundImage: `url('${item.image}')`, textDecoration: "none" }}
              >
                <div className="absolute inset-0 bg-black/30 transition-opacity hover:bg-black/40" />
                <h4 
                  className="relative z-10 text-white font-black uppercase tracking-wider text-base px-4 text-center" 
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </h4>
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-xl py-2 text-sm font-bold text-white transition-transform active:scale-95"
              style={{ background: "#0A241E", fontFamily: "var(--font-ui)" }}
            >
              Suivre
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl py-2 text-sm font-bold text-[#0A241E] transition-transform active:scale-95"
              style={{ background: "#F9F9FF", border: "1px solid #E5E7EB", fontFamily: "var(--font-ui)" }}
            >
              Défier
            </button>
          </div>
        )}
      </section>

      <section className="border-t border-[#E5E7EB] px-4 py-4">
        <h3
          className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          Historique des matchs
        </h3>

        <div
          role="tablist"
          className="mb-3 flex rounded-xl border border-[#E5E7EB] bg-[#F9F9FF] p-1 text-xs font-semibold"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "competitive"}
            onClick={() => setTab("competitive")}
            className={`flex-1 rounded-xl py-1.5 transition-colors ${
              tab === "competitive"
                ? "bg-white text-[#0A241E] shadow-sm"
                : "text-zinc-500"
            }`}
            style={{ fontFamily: "var(--font-ui)" }}
          >
            🏆 Compétitif
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "casual"}
            onClick={() => setTab("casual")}
            className={`flex-1 rounded-xl py-1.5 transition-colors ${
              tab === "casual"
                ? "bg-white text-[#0A241E] shadow-sm"
                : "text-zinc-500"
            }`}
            style={{ fontFamily: "var(--font-ui)" }}
          >
            🤝 Amical
          </button>
        </div>

        {history.length === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>
            Aucun match {tab === "competitive" ? "compétitif" : "amical"} enregistré.
          </p>
        ) : (
          <ul className="space-y-2">
            {history.map((m) => {
              const opponentId = m.player1Id === player.id ? m.player2Id : m.player1Id;
              const opponent = getPlayer(opponentId);
              if (!opponent) return null;
              const isP1 = m.player1Id === player.id;
              const won = setsWon(m.sets);
              const me = isP1 ? won.p1 : won.p2;
              const them = isP1 ? won.p2 : won.p1;
              const playerWon = m.winnerId === player.id;
              const competitive = isCompetitive(m.mode);
              const delta =
                competitive && m.ratingChange
                  ? isP1 ? m.ratingChange.p1 : m.ratingChange.p2
                  : null;
              return (
                <li key={m.id}>
                  <Link
                    href={`/match/${m.id}`}
                    className="flex items-center gap-3 rounded-xl bg-white border border-[#E5E7EB] p-3 transition-all hover:translate-y-[-1px] hover:shadow-[0px_4px_20px_rgba(10,36,30,0.05)]"
                  >
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
                      style={{ background: playerWon ? "#0A241E" : "#BA1A1A" }}
                    >
                      {playerWon ? "V" : "D"}
                    </span>
                    <Avatar emoji={opponent.avatar} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-sm font-medium text-[#0A241E]"
                        style={{ fontFamily: "var(--font-ui)" }}
                      >
                        vs {opponent.fullName}
                      </p>
                      <p className="text-[11px] text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>
                        {timeAgo(m.playedAt)} · {getMatchModeLabel(m.mode)} · {setScoreLine(m.sets)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-sm font-bold tabular-nums text-[#0A241E]"
                        style={{ fontFamily: "var(--font-ui)" }}
                      >
                        {me}–{them}
                      </p>
                      {delta !== null ? (
                        <p
                          className="text-[11px] font-semibold"
                          style={{ color: delta >= 0 ? "#0A241E" : "#BA1A1A", fontFamily: "var(--font-ui)" }}
                        >
                          {delta >= 0 ? "+" : ""}{delta}
                        </p>
                      ) : (
                        <p className="text-[11px] text-zinc-400">—</p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white border border-[#E5E7EB] px-2 py-2">
      <p
        className="text-base font-bold tabular-nums text-[#0A241E]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </p>
      <p
        className="text-[10px] uppercase tracking-wide text-zinc-500"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        {label}
      </p>
    </div>
  );
}
