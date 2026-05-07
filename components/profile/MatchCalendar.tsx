"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Match } from "../../lib/types";
import { isCompetitive } from "../../lib/types";
import { getPlayer, getMatchModeLabel } from "../../lib/data";
import { setsWon } from "../../lib/format";

// ── Types ─────────────────────────────────────────────────────────────────────
type DayResult = "win" | "loss" | "neutral";

interface Props {
  playerId: string;
  matches: Match[];
}

// ── Constants ─────────────────────────────────────────────────────────────────
const MONTHS_FR = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre",
];
const DAY_NAMES_FR = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const DAYS_FR = ["L","M","M","J","V","S","D"];

const APP_TODAY = new Date("2026-05-07");

// ── Helpers ───────────────────────────────────────────────────────────────────
function dayKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
}

function computeDayResult(dayMatches: Match[], playerId: string): DayResult {
  const ranked = dayMatches.filter((m) => isCompetitive(m.mode));
  if (ranked.length === 0) return "neutral";
  const wins = ranked.filter((m) => m.winnerId === playerId).length;
  if (wins === ranked.length) return "win";
  if (wins === 0) return "loss";
  return "neutral"; // résultats mixtes
}

function formatDayLabel(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${DAY_NAMES_FR[date.getDay()]} ${d} ${MONTHS_FR[m - 1]} ${y}`;
}

// ── Sous-composant : carte match du jour ──────────────────────────────────────
function DayMatchCard({ match: m, playerId }: { match: Match; playerId: string }) {
  const isP1   = m.player1Id === playerId;
  const oppId  = isP1 ? m.player2Id : m.player1Id;
  const opp    = getPlayer(oppId);
  const won    = m.winnerId === playerId;
  const scored = setsWon(m.sets);
  const me     = isP1 ? scored.p1 : scored.p2;
  const them   = isP1 ? scored.p2 : scored.p1;
  const delta  =
    isCompetitive(m.mode) && m.ratingChange
      ? (isP1 ? m.ratingChange.p1 : m.ratingChange.p2)
      : null;

  return (
    <li>
      <Link href={`/match/${m.id}`} className="mcal-match-card">
        {/* Badge V / D */}
        <span className={`mcal-match-result mcal-match-result--${won ? "win" : "loss"}`}>
          {won ? "V" : "D"}
        </span>

        {/* Adversaire */}
        <span className="mcal-match-avatar">{opp?.avatar ?? "🏓"}</span>

        {/* Infos */}
        <div className="mcal-match-info">
          <span className="mcal-match-opp">vs {opp?.fullName ?? "Joueur inconnu"}</span>
          <span className="mcal-match-meta">
            {getMatchModeLabel(m.mode)}{m.venue ? ` · ${m.venue}` : ""}
          </span>
        </div>

        {/* Score + ELO */}
        <div className="mcal-match-score-col">
          <span className="mcal-match-score">{me}–{them}</span>
          {delta !== null && (
            <span className={`mcal-match-delta ${delta >= 0 ? "mcal-match-delta--pos" : "mcal-match-delta--neg"}`}>
              {delta >= 0 ? "+" : ""}{delta}
            </span>
          )}
        </div>
      </Link>
    </li>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function MatchCalendar({ playerId, matches }: Props) {
  const defaultMonth = useMemo(() => {
    if (matches.length === 0)
      return new Date(APP_TODAY.getFullYear(), APP_TODAY.getMonth(), 1);
    const latest = matches.reduce((a, b) => (a.playedAt > b.playedAt ? a : b));
    const d = new Date(latest.playedAt);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }, [matches]);

  const [monthStart, setMonthStart] = useState(defaultMonth);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Grouper les matchs par jour
  const matchesByDay = useMemo((): Map<string, Match[]> => {
    const map = new Map<string, Match[]>();
    for (const m of matches) {
      const k = m.playedAt.slice(0, 10);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(m);
    }
    return map;
  }, [matches]);

  // Résultat par jour
  const dayMap = useMemo((): Map<string, DayResult> => {
    const map = new Map<string, DayResult>();
    for (const [k, dayMatches] of matchesByDay) {
      map.set(k, computeDayResult(dayMatches, playerId));
    }
    return map;
  }, [matchesByDay, playerId]);

  // Streak : jours consécutifs joués depuis le plus récent
  const streak = useMemo(() => {
    if (dayMap.size === 0) return 0;
    const sortedDays = [...dayMap.keys()].sort().reverse();
    const cursor = new Date(sortedDays[0]);
    let count = 0;
    while (true) {
      const k = cursor.toISOString().slice(0, 10);
      if (dayMap.has(k)) { count++; cursor.setDate(cursor.getDate() - 1); }
      else break;
    }
    return count;
  }, [dayMap]);

  // Grille calendrier
  const year = monthStart.getFullYear();
  const mon  = monthStart.getMonth();
  const daysInMonth = new Date(year, mon + 1, 0).getDate();

  let startDow = new Date(year, mon, 1).getDay();
  startDow = startDow === 0 ? 6 : startDow - 1; // lun = 0

  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() {
    setSelectedKey(null);
    setMonthStart(new Date(year, mon - 1, 1));
  }
  function nextMonth() {
    const next = new Date(year, mon + 1, 1);
    if (next <= new Date(APP_TODAY.getFullYear(), APP_TODAY.getMonth(), 1)) {
      setSelectedKey(null);
      setMonthStart(next);
    }
  }
  function handleDayClick(k: string) {
    if (!matchesByDay.has(k)) return;
    setSelectedKey((prev) => (prev === k ? null : k));
  }

  const isCurrentMonth = year === APP_TODAY.getFullYear() && mon === APP_TODAY.getMonth();
  const todayStr = APP_TODAY.toISOString().slice(0, 10);

  // Stats du mois
  const monthStats = useMemo(() => {
    let wins = 0, losses = 0, neutral = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const r = dayMap.get(dayKey(year, mon, d));
      if (r === "win") wins++;
      else if (r === "loss") losses++;
      else if (r === "neutral") neutral++;
    }
    return { wins, losses, neutral, total: wins + losses + neutral };
  }, [dayMap, year, mon, daysInMonth]);

  const selectedMatches = selectedKey ? (matchesByDay.get(selectedKey) ?? []) : [];
  const selectedResult  = selectedKey ? (dayMap.get(selectedKey) ?? null) : null;

  return (
    <div className="mcal">
      {/* ── Navigation mois ── */}
      <div className="mcal-header">
        <button type="button" className="mcal-nav-btn" onClick={prevMonth} aria-label="Mois précédent">‹</button>
        <div className="mcal-month-info">
          <span className="mcal-month-label">{MONTHS_FR[mon]} {year}</span>
          {streak > 0 && (
            <span className="mcal-streak" title={`${streak} jour${streak > 1 ? "s" : ""} consécutifs joués`}>
              🔥 {streak}j
            </span>
          )}
        </div>
        <button type="button" className="mcal-nav-btn" onClick={nextMonth} disabled={isCurrentMonth} aria-label="Mois suivant">›</button>
      </div>

      {/* ── Grille ── */}
      <div className="mcal-grid">
        {DAYS_FR.map((d, i) => <span key={i} className="mcal-dow">{d}</span>)}

        {cells.map((day, i) => {
          if (!day) return <span key={i} className="mcal-cell mcal-cell--empty" aria-hidden="true" />;

          const k          = dayKey(year, mon, day);
          const res        = dayMap.get(k) ?? null;
          const isToday    = k === todayStr;
          const isSelected = k === selectedKey;
          const hasMatch   = matchesByDay.has(k);

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleDayClick(k)}
              disabled={!hasMatch}
              aria-pressed={isSelected || undefined}
              aria-label={
                res
                  ? `${day} ${MONTHS_FR[mon]} — ${res === "win" ? "Victoire" : res === "loss" ? "Défaite" : "Neutre"}`
                  : `${day} ${MONTHS_FR[mon]}`
              }
              className={[
                "mcal-cell",
                isToday    ? "mcal-cell--today"    : "",
                res        ? `mcal-cell--${res}`   : "",
                isSelected ? "mcal-cell--selected" : "",
              ].filter(Boolean).join(" ")}
            >
              <span className="mcal-day-num">{day}</span>
              {res && <span className={`mcal-dot mcal-dot--${res}`} aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {/* ── Stats du mois ── */}
      {monthStats.total > 0 && (
        <div className="mcal-stats-row">
          <span className="mcal-stat mcal-stat--win">
            <span className="mcal-dot mcal-dot--win" aria-hidden="true" />{monthStats.wins}V
          </span>
          <span className="mcal-stat-sep">·</span>
          <span className="mcal-stat mcal-stat--loss">
            <span className="mcal-dot mcal-dot--loss" aria-hidden="true" />{monthStats.losses}D
          </span>
          {monthStats.neutral > 0 && <>
            <span className="mcal-stat-sep">·</span>
            <span className="mcal-stat mcal-stat--neutral">
              <span className="mcal-dot mcal-dot--neutral" aria-hidden="true" />{monthStats.neutral}N
            </span>
          </>}
          <span className="mcal-stat-total">
            — {monthStats.total} jour{monthStats.total > 1 ? "s" : ""} joué{monthStats.total > 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* ── Panneau de détail du jour sélectionné ── */}
      {selectedKey && selectedMatches.length > 0 && (
        <div className="mcal-detail" key={selectedKey}>
          <div className={`mcal-detail-header mcal-detail-header--${selectedResult}`}>
            <span className="mcal-detail-label">{formatDayLabel(selectedKey)}</span>
            <button
              type="button"
              className="mcal-detail-close"
              onClick={() => setSelectedKey(null)}
              aria-label="Fermer le détail"
            >✕</button>
          </div>
          <ul className="mcal-detail-list">
            {selectedMatches.map((m) => (
              <DayMatchCard key={m.id} match={m} playerId={playerId} />
            ))}
          </ul>
        </div>
      )}

      {/* ── Légende ── */}
      <div className="mcal-legend">
        <span className="mcal-legend-item"><span className="mcal-dot mcal-dot--win" aria-hidden="true" />Victoire</span>
        <span className="mcal-legend-item"><span className="mcal-dot mcal-dot--loss" aria-hidden="true" />Défaite</span>
        <span className="mcal-legend-item"><span className="mcal-dot mcal-dot--neutral" aria-hidden="true" />Neutre</span>
      </div>
    </div>
  );
}
