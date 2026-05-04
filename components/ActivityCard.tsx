"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Avatar from "./Avatar";
import {
  getCommentsForActivity,
  getMatch,
  getMatchModeLabel,
  getPlayer,
  CURRENT_USER_ID,
} from "../lib/data";
import { setScoreLine, setsWon, timeAgo } from "../lib/format";
import { isCompetitive, type Activity } from "../lib/types";

type Reaction = "👍" | "🔥" | "🏓";
const REACTIONS: Reaction[] = ["👍", "🔥", "🏓"];

const KIND_LABEL: Record<string, string> = {
  match: "Match",
  training: "Entraînement",
  achievement: "Trophée",
  follow: "Suivi",
  tournament: "Tournoi",
  club_announce: "Annonce",
};

const KIND_COLOR: Record<string, string> = {
  match: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  training: "bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-300",
  achievement: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
  follow: "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300",
  tournament: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  club_announce: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300",
};

export default function ActivityCard({
  activity,
  initialReactions = new Set<Reaction>(),
}: {
  activity: Activity;
  initialReactions?: Set<Reaction>;
}) {
  const player = getPlayer(activity.playerId);
  const [reactions, setReactions] = useState<Set<Reaction>>(initialReactions);
  const [likeCount, setLikeCount] = useState(activity.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (!player) return null;

  function toggleReaction(r: Reaction) {
    setReactions((prev) => {
      const next = new Set(prev);
      const hadLike = prev.size > 0;
      if (next.has(r)) {
        next.delete(r);
      } else {
        next.add(r);
      }
      const hasLike = next.size > 0;
      if (!hadLike && hasLike) setLikeCount((n) => n + 1);
      if (hadLike && !hasLike) setLikeCount((n) => n - 1);
      return next;
    });
  }

  const comments = getCommentsForActivity(activity.id);

  return (
    <article className="border-b border-zinc-100 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
      {/* ── Header ── */}
      <header className="mb-3 flex items-center gap-3">
        <Link href={`/profile/${player.id}`} className="shrink-0">
          <Avatar emoji={player.avatar} size="md" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 truncate">
            <Link
              href={`/profile/${player.id}`}
              className="truncate text-sm font-semibold"
            >
              {player.fullName}
            </Link>
            {player.club && (
              <span className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                {player.club}
              </span>
            )}
          </div>
          <p className="truncate text-xs text-zinc-500">
            {player.countryFlag} {player.city} · {timeAgo(activity.createdAt)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${KIND_COLOR[activity.kind] ?? KIND_COLOR.match}`}
        >
          {KIND_LABEL[activity.kind]}
        </span>
      </header>

      {/* ── Body ── */}
      {activity.kind === "match" && activity.matchId && (
        <MatchBody matchId={activity.matchId} posterId={activity.playerId} />
      )}
      {activity.kind === "training" && (
        <div className="rounded-xl bg-sky-50 p-3 ring-1 ring-sky-100 dark:bg-sky-950/20 dark:ring-sky-900/40">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏋️</span>
            <div>
              <p className="text-sm font-medium">{activity.trainingTitle}</p>
              <p className="mt-0.5 text-xs text-sky-700 dark:text-sky-400">
                ⏱ {activity.trainingMinutes} min d'entraînement
              </p>
            </div>
          </div>
        </div>
      )}
      {activity.kind === "achievement" && (
        <div className="rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:ring-amber-900">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏅</span>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              {activity.achievementTitle}
            </p>
          </div>
        </div>
      )}
      {activity.kind === "follow" && activity.targetPlayerId && (
        <FollowBody targetId={activity.targetPlayerId} posterId={activity.playerId} />
      )}
      {activity.kind === "tournament" && (
        <TournamentBody activity={activity} />
      )}
      {activity.kind === "club_announce" && (
        <ClubAnnounceBody activity={activity} />
      )}

      {/* ── Reactions ── */}
      <footer className="mt-3 flex items-center gap-1">
        {REACTIONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => toggleReaction(r)}
            className={`flex h-8 items-center gap-1 rounded-full px-2.5 text-xs font-medium transition-all ${
              reactions.has(r)
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <span>{r}</span>
            {r === "👍" && (
              <span className={reactions.has(r) ? "text-emerald-700 dark:text-emerald-300" : "text-zinc-400"}>
                {likeCount > 0 ? fmtCount(likeCount) : ""}
              </span>
            )}
          </button>
        ))}

        <button
          type="button"
          onClick={() => {
            setShowComments((v) => !v);
            if (!showComments) setTimeout(() => inputRef.current?.focus(), 150);
          }}
          className={`ml-1 flex h-8 items-center gap-1 rounded-full px-2.5 text-xs font-medium transition-all ${
            showComments
              ? "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
              : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          <span>💬</span>
          {activity.comments > 0 && (
            <span className="text-zinc-400">{fmtCount(activity.comments)}</span>
          )}
        </button>

        <button
          type="button"
          className="ml-auto flex h-8 items-center gap-1 rounded-full px-2.5 text-xs font-medium text-zinc-500 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <span>↗</span>
          <span>Partager</span>
        </button>
      </footer>

      {/* ── Comment section ── */}
      {showComments && (
        <div className="mt-3 space-y-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
          {comments.map((c) => {
            const commenter = getPlayer(c.playerId);
            if (!commenter) return null;
            return (
              <div key={c.id} className="flex gap-2">
                <Avatar emoji={commenter.avatar} size="xs" />
                <div className="min-w-0 flex-1 rounded-xl bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
                  <p className="text-[11px] font-semibold">
                    {commenter.fullName}
                    <span className="ml-1.5 font-normal text-zinc-400">
                      {timeAgo(c.createdAt)}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-700 dark:text-zinc-300">
                    {c.text}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Input */}
          <div className="flex gap-2 pt-1">
            <Avatar
              emoji={getPlayer(CURRENT_USER_ID)?.avatar ?? "🏓"}
              size="xs"
            />
            <input
              ref={inputRef}
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Écrire un commentaire… @mention"
              className="min-w-0 flex-1 rounded-xl bg-zinc-100 px-3 py-2 text-xs outline-none ring-1 ring-transparent focus:ring-emerald-400 dark:bg-zinc-800 dark:focus:ring-emerald-600"
            />
            <button
              type="button"
              disabled={!commentInput.trim()}
              className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
              onClick={() => setCommentInput("")}
            >
              ↩
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MatchBody({ matchId, posterId }: { matchId: string; posterId: string }) {
  const match = getMatch(matchId);
  if (!match) return null;
  const p1 = getPlayer(match.player1Id);
  const p2 = getPlayer(match.player2Id);
  if (!p1 || !p2) return null;

  const won = setsWon(match.sets);
  const posterIsP1 = match.player1Id === posterId;
  const posterWon = match.winnerId === posterId;
  const competitive = isCompetitive(match.mode);
  const delta =
    competitive && match.ratingChange
      ? posterIsP1
        ? match.ratingChange.p1
        : match.ratingChange.p2
      : null;

  return (
    <Link
      href={`/match/${match.id}`}
      className="block overflow-hidden rounded-xl ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-900"
    >
      {/* Result banner */}
      <div
        className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white ${
          competitive
            ? posterWon
              ? "bg-emerald-600"
              : "bg-rose-600"
            : "bg-zinc-500"
        }`}
      >
        <span>{posterWon ? "✓ Victoire" : "✕ Défaite"}</span>
        <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[9px]">
          {getMatchModeLabel(match.mode)}
        </span>
        <span className="opacity-80">{match.format}</span>
        {match.venue && (
          <span className="ml-auto truncate opacity-70">📍 {match.venue}</span>
        )}
      </div>

      {/* Score table */}
      <div className="overflow-x-auto px-3 pb-3 pt-2">
        <table className="w-full min-w-[220px] text-xs">
          <thead>
            <tr>
              <th className="w-28 pr-2 text-left text-[10px] font-normal text-zinc-400" />
              {match.sets.map((_, i) => (
                <th
                  key={i}
                  className="w-8 text-center text-[10px] font-normal text-zinc-400"
                >
                  S{i + 1}
                </th>
              ))}
              <th className="w-8 text-center text-[10px] font-semibold text-zinc-600 dark:text-zinc-300">
                Tot
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { player: p1, sets: match.sets.map((s) => s.p1), total: won.p1, wins: match.sets.map((s) => s.p1 > s.p2) },
              { player: p2, sets: match.sets.map((s) => s.p2), total: won.p2, wins: match.sets.map((s) => s.p2 > s.p1) },
            ].map((row) => (
              <tr key={row.player.id}>
                <td className="pr-2 py-1">
                  <div className="flex items-center gap-1.5">
                    <Avatar emoji={row.player.avatar} size="xs" />
                    <span className="truncate font-medium">{row.player.fullName}</span>
                  </div>
                </td>
                {row.sets.map((score, i) => (
                  <td
                    key={i}
                    className={`py-1 text-center tabular-nums font-semibold ${
                      row.wins[i]
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-zinc-400"
                    }`}
                  >
                    {score}
                  </td>
                ))}
                <td
                  className={`py-1 text-center tabular-nums text-sm font-bold ${
                    match.winnerId === row.player.id
                      ? "text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-400"
                  }`}
                >
                  {row.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ELO delta */}
      <div className="border-t border-zinc-100 px-3 py-1.5 text-[11px] dark:border-zinc-800">
        {delta !== null ? (
          <span>
            ELO :{" "}
            <span
              className={`font-semibold ${
                delta >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {delta >= 0 ? "+" : ""}
              {delta}
            </span>
          </span>
        ) : (
          <span className="italic text-zinc-400">Hors classement</span>
        )}
      </div>
    </Link>
  );
}

function TournamentBody({ activity }: { activity: Activity }) {
  const pct =
    activity.tournamentMaxParticipants && activity.tournamentParticipants
      ? Math.round(
          (activity.tournamentParticipants /
            activity.tournamentMaxParticipants) *
            100,
        )
      : null;

  const dateLabel = activity.tournamentDate
    ? new Date(activity.tournamentDate).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-emerald-200 dark:ring-emerald-900/40">
      <div className="bg-emerald-600 px-3 py-2">
        <p className="text-sm font-bold text-white">🏆 {activity.tournamentTitle}</p>
      </div>
      <div className="space-y-1.5 bg-emerald-50 px-3 py-3 dark:bg-emerald-950/20">
        {dateLabel && (
          <p className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300">
            <span>📅</span> {dateLabel}
          </p>
        )}
        {activity.tournamentVenue && (
          <p className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300">
            <span>📍</span> {activity.tournamentVenue}
          </p>
        )}
        {activity.tournamentPrize && (
          <p className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300">
            <span>🎖</span> {activity.tournamentPrize}
          </p>
        )}
        {pct !== null && (
          <div className="pt-1">
            <div className="mb-1 flex justify-between text-[10px] text-emerald-700 dark:text-emerald-400">
              <span>
                {activity.tournamentParticipants} /{" "}
                {activity.tournamentMaxParticipants} participants
              </span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-emerald-200 dark:bg-emerald-900">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="bg-emerald-50 px-3 pb-3 dark:bg-emerald-950/20">
        <button
          type="button"
          className="w-full rounded-lg bg-emerald-600 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          S'inscrire →
        </button>
      </div>
    </div>
  );
}

function ClubAnnounceBody({ activity }: { activity: Activity }) {
  const poster = getPlayer(activity.playerId);
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-indigo-200 dark:ring-indigo-900/40">
      <div className="bg-indigo-600 px-3 py-2">
        <p className="text-sm font-bold text-white">📢 {activity.announceTitle}</p>
        {poster?.club && (
          <p className="text-[10px] text-indigo-200">{poster.club}</p>
        )}
      </div>
      <div className="bg-indigo-50 px-3 py-3 dark:bg-indigo-950/20">
        <p className="text-xs leading-relaxed text-indigo-900 dark:text-indigo-200">
          {activity.announceBody}
        </p>
      </div>
    </div>
  );
}

function FollowBody({ targetId, posterId }: { targetId: string; posterId: string }) {
  const poster = getPlayer(posterId);
  const target = getPlayer(targetId);
  if (!poster || !target) return null;
  return (
    <div className="flex items-center gap-3 rounded-xl bg-violet-50 px-3 py-2.5 ring-1 ring-violet-100 dark:bg-violet-950/20 dark:ring-violet-900/40">
      <Avatar emoji={poster.avatar} size="sm" />
      <span className="text-xs text-zinc-600 dark:text-zinc-400">suit maintenant</span>
      <Link href={`/profile/${target.id}`}>
        <Avatar emoji={target.avatar} size="sm" />
      </Link>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold">{target.fullName}</p>
        <p className="text-[10px] text-zinc-500">{target.rating} ELO</p>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
