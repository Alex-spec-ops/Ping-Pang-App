"use client";

import Link from "next/link";
import { useState } from "react";
import Avatar from "./Avatar";
import { getMatchesForPlayer, getMatchModeLabel, getPlayer } from "../lib/data";
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
  const rankedWinrate =
    rankedTotal > 0 ? Math.round((player.rankedWins * 100) / rankedTotal) : 0;
  const casualWinrate =
    casualTotal > 0 ? Math.round((player.casualWins * 100) / casualTotal) : 0;

  const history = getMatchesForPlayer(player.id, tab);

  return (
    <>
      <section className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-4">
          <Avatar emoji={player.avatar} size="xl" />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold">{player.fullName}</h2>
            <p className="truncate text-sm text-zinc-500">@{player.username}</p>
            <p className="mt-1 truncate text-xs text-zinc-500">
              {player.countryFlag} {player.city}
              {player.club ? ` · ${player.club}` : ""}
            </p>
          </div>
        </div>
        {player.bio ? (
          <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
            {player.bio}
          </p>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:ring-emerald-900">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              🏆 Compétitif
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-900 dark:text-emerald-100">
              {player.rating}
              <span className="ml-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                ELO
              </span>
            </p>
            <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-300">
              {player.rankedWins}V – {player.rankedLosses}D · {rankedWinrate}%
            </p>
            <p className="text-[10px] text-emerald-700/70 dark:text-emerald-300/70">
              Peak {player.peakRating}
            </p>
          </div>
          <div className="rounded-xl bg-zinc-100 p-3 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
              🤝 Amical
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {casualTotal}
              <span className="ml-1 text-[10px] font-medium text-zinc-500">
                matchs
              </span>
            </p>
            <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
              {player.casualWins}V – {player.casualLosses}D · {casualWinrate}%
            </p>
            <p className="text-[10px] text-zinc-500">Hors classement</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
          <Stat
            value={player.followers.toLocaleString("fr-FR")}
            label="Abonnés"
          />
          <Stat
            value={(rankedTotal + casualTotal).toString()}
            label="Matchs total"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white"
          >
            Suivre
          </button>
          <button
            type="button"
            className="flex-1 rounded-full bg-zinc-100 py-2 text-sm font-semibold dark:bg-zinc-800"
          >
            Défier
          </button>
        </div>
      </section>

      <section className="border-t border-zinc-100 px-4 py-4 dark:border-zinc-800">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Historique des matchs
        </h3>

        <div
          role="tablist"
          className="mb-3 flex rounded-full bg-zinc-100 p-1 text-xs font-semibold dark:bg-zinc-900"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "competitive"}
            onClick={() => setTab("competitive")}
            className={`flex-1 rounded-full py-1.5 transition-colors ${
              tab === "competitive"
                ? "bg-white text-emerald-700 shadow-sm dark:bg-zinc-950 dark:text-emerald-300"
                : "text-zinc-500"
            }`}
          >
            🏆 Compétitif
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "casual"}
            onClick={() => setTab("casual")}
            className={`flex-1 rounded-full py-1.5 transition-colors ${
              tab === "casual"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-100"
                : "text-zinc-500"
            }`}
          >
            🤝 Amical
          </button>
        </div>

        {history.length === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-500">
            Aucun match {tab === "competitive" ? "compétitif" : "amical"} enregistré.
          </p>
        ) : (
          <ul className="space-y-2">
            {history.map((m) => {
              const opponentId =
                m.player1Id === player.id ? m.player2Id : m.player1Id;
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
                  ? isP1
                    ? m.ratingChange.p1
                    : m.ratingChange.p2
                  : null;
              return (
                <li key={m.id}>
                  <Link
                    href={`/match/${m.id}`}
                    className="flex items-center gap-3 rounded-xl bg-zinc-50 p-3 transition-colors hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white ${
                        playerWon ? "bg-emerald-600" : "bg-rose-600"
                      }`}
                    >
                      {playerWon ? "V" : "D"}
                    </span>
                    <Avatar emoji={opponent.avatar} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        vs {opponent.fullName}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {timeAgo(m.playedAt)} · {getMatchModeLabel(m.mode)} · {setScoreLine(m.sets)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold tabular-nums">
                        {me}–{them}
                      </p>
                      {delta !== null ? (
                        <p
                          className={`text-[11px] font-semibold ${
                            delta >= 0 ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {delta >= 0 ? "+" : ""}
                          {delta}
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
    <div className="rounded-xl bg-zinc-50 px-2 py-2 dark:bg-zinc-900">
      <p className="text-base font-bold tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-zinc-500">
        {label}
      </p>
    </div>
  );
}
