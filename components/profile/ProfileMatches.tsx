"use client";

import { useState } from "react";
import Link from "next/link";
import type { Match } from "../../lib/types";
import type { Player } from "../../lib/types";
import { getPlayer, getMatchModeLabel } from "../../lib/data";
import { setScoreLine, setsWon, timeAgo } from "../../lib/format";
import { isCompetitive } from "../../lib/types";

type Period = "week" | "month" | "year";

interface Props {
  player: Player;
  matches: Match[];
  isPremium: boolean;
}

const PERIOD_LABELS: Record<Period, string> = {
  week: "Semaine",
  month: "Mois",
  year: "Année",
};

function filterByPeriod(matches: Match[], period: Period): Match[] {
  const now = new Date("2026-05-04T12:00:00Z");
  const ms = { week: 7, month: 30, year: 365 }[period] * 86400_000;
  return matches.filter((m) => now.getTime() - new Date(m.playedAt).getTime() <= ms);
}

export default function ProfileMatches({ player, matches, isPremium }: Props) {
  const [period, setPeriod] = useState<Period>("month");
  const [tooltip, setTooltip] = useState<string | null>(null);

  const sorted = [...matches].sort((a, b) => b.playedAt.localeCompare(a.playedAt));
  const filtered = filterByPeriod(sorted, period);

  function exportCSV() {
    const rows = [
      ["Date", "Adversaire", "Score", "Mode", "Lieu", "Résultat"],
      ...sorted.map((m) => {
        const oppId = m.player1Id === player.id ? m.player2Id : m.player1Id;
        const opp = getPlayer(oppId);
        const won = m.winnerId === player.id;
        return [
          new Date(m.playedAt).toLocaleDateString("fr-FR"),
          opp?.fullName ?? oppId,
          setScoreLine(m.sets),
          getMatchModeLabel(m.mode),
          m.venue ?? "—",
          won ? "Victoire" : "Défaite",
        ];
      }),
    ];
    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `matchs_${player.username}.csv`;
    a.click();
  }

  return (
    <div className="tab-content">
      {/* Filters row */}
      <div className="matches-filters">
        <div className="period-tabs">
          {(["week", "month", "year"] as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`period-tab ${period === p ? "period-tab--active" : ""}`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
        {isPremium ? (
          <button type="button" onClick={exportCSV} className="btn-export">
            ⬇ CSV
          </button>
        ) : (
          <button
            type="button"
            className="btn-export btn-export--locked"
            onPointerEnter={() => setTooltip("export")}
            onPointerLeave={() => setTooltip(null)}
          >
            🔒 CSV
            {tooltip === "export" && (
              <span className="tooltip">Réservé aux membres Premium</span>
            )}
          </button>
        )}
      </div>

      {/* Match list */}
      {filtered.length === 0 ? (
        <p className="empty-state">Aucun match sur cette période.</p>
      ) : (
        <ul className="match-list">
          {filtered.map((m) => {
            const oppId = m.player1Id === player.id ? m.player2Id : m.player1Id;
            const opp = getPlayer(oppId);
            if (!opp) return null;
            const isP1 = m.player1Id === player.id;
            const won = setsWon(m.sets);
            const me = isP1 ? won.p1 : won.p2;
            const them = isP1 ? won.p2 : won.p1;
            const playerWon = m.winnerId === player.id;
            const delta =
              isCompetitive(m.mode) && m.ratingChange
                ? isP1 ? m.ratingChange.p1 : m.ratingChange.p2
                : null;

            return (
              <li key={m.id} className={`match-item ${playerWon ? "match-item--win" : "match-item--loss"}`}>
                <Link href={`/match/${m.id}`} className="match-item-link">
                  {/* Result pill */}
                  <span className={`match-result-pill ${playerWon ? "match-result-pill--win" : "match-result-pill--loss"}`}>
                    {playerWon ? "V" : "D"}
                  </span>

                  {/* Opponent */}
                  <span className="match-opp-emoji">{opp.avatar}</span>
                  <div className="match-info">
                    <p className="match-opp-name">vs {opp.fullName}</p>
                    <p className="match-meta">
                      {timeAgo(m.playedAt)} · {getMatchModeLabel(m.mode)}
                      {m.venue ? ` · ${m.venue}` : ""}
                    </p>
                  </div>

                  {/* Score + delta */}
                  <div className="match-score-col">
                    <p className="match-score">{me}–{them}</p>
                    {delta !== null && (
                      <p className={`match-delta ${delta >= 0 ? "match-delta--pos" : "match-delta--neg"}`}>
                        {delta >= 0 ? "+" : ""}{delta}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
