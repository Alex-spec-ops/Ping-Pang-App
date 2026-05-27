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
  match:        "bg-[#F9F9FF] text-[#0A241E] border border-[#E5E7EB]",
  training:     "bg-sky-50 text-sky-700 border border-sky-100",
  achievement:  "bg-amber-50 text-amber-700 border border-amber-100",
  follow:       "bg-violet-50 text-violet-700 border border-violet-100",
  tournament:   "bg-[#D1EAE2] text-[#0A241E] border border-[#BAE0D4]",
  club_announce:"bg-[#F9F9FF] text-[#0A241E] border border-[#E5E7EB]",
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
    <article
      className="px-4 py-4"
      style={{ borderBottom: "1px solid #E5E7EB", background: "#F9F9FF" }}
    >
      {/* ── Header ── */}
      <header className="mb-3 flex items-center gap-3">
        <Link href={`/profile/${player.id}`} className="shrink-0">
          <Avatar emoji={player.avatar} size="md" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 truncate">
            <Link
              href={`/profile/${player.id}`}
              className="truncate text-sm font-semibold text-[#0A241E]"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              {player.fullName}
            </Link>
            {player.club && (
              <span
                className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
                style={{ fontFamily: "var(--font-ui)", background: "var(--color-forest)", color: "#fff" }}
              >
                {player.club}
              </span>
            )}
          </div>
          <p className="truncate text-xs text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>
            {player.countryFlag} {player.city} · {timeAgo(activity.createdAt)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${KIND_COLOR[activity.kind] ?? KIND_COLOR.match}`}
          style={{ fontFamily: "var(--font-ui)" }}
        >
          {KIND_LABEL[activity.kind]}
        </span>
      </header>

      {/* ── Body ── */}
      {activity.kind === "match" && activity.matchId && (
        <MatchBody matchId={activity.matchId} posterId={activity.playerId} />
      )}
      {activity.kind === "training" && (
        <div className="rounded-xl bg-white border border-[#E5E7EB] p-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏋️</span>
            <div>
              <p className="text-sm font-medium text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
                {activity.trainingTitle}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>
                ⏱ {activity.trainingMinutes} min d'entraînement
              </p>
            </div>
          </div>
        </div>
      )}
      {activity.kind === "achievement" && (
        <div className="rounded-xl bg-white border border-[#E5E7EB] p-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏅</span>
            <p className="text-sm font-semibold text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
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
            className="flex h-8 items-center gap-1 rounded-xl px-2.5 text-xs font-medium transition-all"
            style={{
              fontFamily: "var(--font-ui)",
              background: reactions.has(r) ? "var(--color-forest)" : "#fff",
              color: reactions.has(r) ? "#fff" : "var(--color-muted)",
              border: reactions.has(r) ? "none" : "1px solid #E5E7EB",
            }}
          >
            <span>{r}</span>
            {r === "👍" && likeCount > 0 && <span>{fmtCount(likeCount)}</span>}
          </button>
        ))}

        <button
          type="button"
          onClick={() => {
            setShowComments((v) => !v);
            if (!showComments) setTimeout(() => inputRef.current?.focus(), 150);
          }}
          className="ml-1 flex h-8 items-center gap-1 rounded-xl px-2.5 text-xs font-medium transition-all"
          style={{
            fontFamily: "var(--font-ui)",
            background: showComments ? "var(--color-forest)" : "#fff",
            color: showComments ? "#fff" : "var(--color-muted)",
            border: showComments ? "none" : "1px solid #E5E7EB",
          }}
        >
          <span>💬</span>
          {activity.comments > 0 && <span>{fmtCount(activity.comments)}</span>}
        </button>

        <button
          type="button"
          className="ml-auto flex h-8 items-center gap-1 rounded-xl px-2.5 text-xs font-medium"
          style={{ fontFamily: "var(--font-ui)", color: "var(--color-muted)" }}
        >
          <span>↗</span>
          <span>Partager</span>
        </button>
      </footer>

      {/* ── Comment section ── */}
      {showComments && (
        <div className="mt-3 space-y-2 border-t border-[#E5E7EB] pt-3">
          {comments.map((c) => {
            const commenter = getPlayer(c.playerId);
            if (!commenter) return null;
            return (
              <div key={c.id} className="flex gap-2">
                <Avatar emoji={commenter.avatar} size="xs" />
                <div className="min-w-0 flex-1 rounded-xl bg-white border border-[#E5E7EB] px-3 py-2">
                  <p className="text-[11px] font-semibold text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
                    {commenter.fullName}
                    <span className="ml-1.5 font-normal text-zinc-400">
                      {timeAgo(c.createdAt)}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-600" style={{ fontFamily: "var(--font-ui)" }}>
                    {c.text}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Input */}
          <div className="flex gap-2 pt-1">
            <Avatar emoji={getPlayer(CURRENT_USER_ID)?.avatar ?? "🏓"} size="xs" />
            <input
              ref={inputRef}
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Écrire un commentaire… @mention"
              className="min-w-0 flex-1 rounded-xl px-3 py-2 text-xs outline-none"
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                fontFamily: "var(--font-ui)",
              }}
            />
            <button
              type="button"
              disabled={!commentInput.trim()}
              className="rounded-xl px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
              style={{ background: "var(--color-forest)", fontFamily: "var(--font-ui)" }}
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
      className="block overflow-hidden rounded-xl border border-[#E5E7EB] transition-all hover:translate-y-[-2px] hover:shadow-[0px_4px_20px_rgba(10,36,30,0.05)]"
    >
      {/* Result banner */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white"
        style={{
          fontFamily: "var(--font-ui)",
          letterSpacing: "0.08em",
          background: competitive
            ? posterWon ? "#0A241E" : "#BA1A1A"
            : "#616363",
        }}
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
      <div className="overflow-x-auto bg-white px-3 pb-3 pt-2">
        <table className="w-full min-w-[220px] text-xs">
          <thead>
            <tr>
              <th className="w-28 pr-2 text-left text-[10px] font-normal text-zinc-400" />
              {match.sets.map((_, i) => (
                <th key={i} className="w-8 text-center text-[10px] font-normal text-zinc-400">
                  S{i + 1}
                </th>
              ))}
              <th className="w-8 text-center text-[10px] font-semibold text-zinc-600">
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
                    <span className="truncate font-medium text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
                      {row.player.fullName}
                    </span>
                  </div>
                </td>
                {row.sets.map((score, i) => (
                  <td
                    key={i}
                    className="py-1 text-center tabular-nums font-semibold"
                    style={{ color: row.wins[i] ? "#0A241E" : "#9CA3AF" }}
                  >
                    {score}
                  </td>
                ))}
                <td
                  className="py-1 text-center tabular-nums text-sm font-bold"
                  style={{ color: match.winnerId === row.player.id ? "#0A241E" : "#9CA3AF" }}
                >
                  {row.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ELO delta */}
      <div
        className="bg-white px-3 py-1.5 text-[11px]"
        style={{ borderTop: "1px solid #E5E7EB", fontFamily: "var(--font-ui)" }}
      >
        {delta !== null ? (
          <span className="text-zinc-500">
            ELO :{" "}
            <span style={{ fontWeight: 600, color: delta >= 0 ? "#0A241E" : "#BA1A1A" }}>
              {delta >= 0 ? "+" : ""}{delta}
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
      ? Math.round((activity.tournamentParticipants / activity.tournamentMaxParticipants) * 100)
      : null;

  const dateLabel = activity.tournamentDate
    ? new Date(activity.tournamentDate).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
      <div className="px-3 py-2" style={{ background: "#0A241E" }}>
        <p className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
          🏆 {activity.tournamentTitle}
        </p>
      </div>
      <div className="space-y-1.5 px-3 py-3 bg-[#F9F9FF]">
        {dateLabel && (
          <p className="flex items-center gap-1.5 text-xs text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
            <span>📅</span> {dateLabel}
          </p>
        )}
        {activity.tournamentVenue && (
          <p className="flex items-center gap-1.5 text-xs text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
            <span>📍</span> {activity.tournamentVenue}
          </p>
        )}
        {activity.tournamentPrize && (
          <p className="flex items-center gap-1.5 text-xs text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
            <span>🎖</span> {activity.tournamentPrize}
          </p>
        )}
        {pct !== null && (
          <div className="pt-1">
            <div className="mb-1 flex justify-between text-[10px] text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>
              <span>{activity.tournamentParticipants} / {activity.tournamentMaxParticipants} participants</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "#0A241E" }} />
            </div>
          </div>
        )}
      </div>
      <div className="px-3 pb-3 bg-[#F9F9FF]">
        <button
          type="button"
          className="w-full rounded-xl py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          style={{ fontFamily: "var(--font-ui)", background: "#0A241E", letterSpacing: "0.05em" }}
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
    <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
      <div className="px-3 py-2" style={{ background: "#0A241E" }}>
        <p className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
          📢 {activity.announceTitle}
        </p>
        {poster?.club && (
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-ui)", letterSpacing: "0.06em" }}>
            {poster.club}
          </p>
        )}
      </div>
      <div className="px-3 py-3 bg-[#F9F9FF]">
        <p className="text-xs leading-relaxed text-zinc-600" style={{ fontFamily: "var(--font-ui)" }}>
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
    <div className="flex items-center gap-3 rounded-xl bg-white border border-[#E5E7EB] px-3 py-2.5">
      <Avatar emoji={poster.avatar} size="sm" />
      <span className="text-xs text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>suit maintenant</span>
      <Link href={`/profile/${target.id}`}>
        <Avatar emoji={target.avatar} size="sm" />
      </Link>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
          {target.fullName}
        </p>
        <p className="text-[10px] text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>{target.rating} ELO</p>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
