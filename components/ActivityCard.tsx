import Link from "next/link";
import Avatar from "./Avatar";
import { getMatch, getMatchModeLabel, getPlayer } from "../lib/data";
import { setScoreLine, setsWon, timeAgo } from "../lib/format";
import { isCompetitive, type Activity } from "../lib/types";

export default function ActivityCard({ activity }: { activity: Activity }) {
  const player = getPlayer(activity.playerId);
  if (!player) return null;

  return (
    <article className="border-b border-zinc-100 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
      <header className="mb-3 flex items-center gap-3">
        <Link href={`/profile/${player.id}`}>
          <Avatar emoji={player.avatar} size="md" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/profile/${player.id}`}
            className="block truncate text-sm font-semibold"
          >
            {player.fullName}{" "}
            <span className="text-xs font-normal text-zinc-500">
              @{player.username}
            </span>
          </Link>
          <p className="text-xs text-zinc-500">
            {player.countryFlag} {player.city}
            {player.club ? ` · ${player.club}` : ""} ·{" "}
            {timeAgo(activity.createdAt)}
          </p>
        </div>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {activity.kind === "match"
            ? "Match"
            : activity.kind === "training"
              ? "Entraînement"
              : activity.kind === "achievement"
                ? "Trophée"
                : "Suivi"}
        </span>
      </header>

      {activity.kind === "match" && activity.matchId
        ? renderMatchBody(activity.matchId, player.id)
        : null}

      {activity.kind === "training" ? (
        <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
          <p className="text-sm font-medium">{activity.trainingTitle}</p>
          <p className="mt-1 text-xs text-zinc-500">
            ⏱ {activity.trainingMinutes} min
          </p>
        </div>
      ) : null}

      {activity.kind === "achievement" ? (
        <div className="rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:ring-amber-900">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
            🏅 {activity.achievementTitle}
          </p>
        </div>
      ) : null}

      <footer className="mt-3 flex items-center gap-5 text-xs text-zinc-500">
        <button
          type="button"
          className="flex items-center gap-1 transition-colors hover:text-rose-500"
        >
          ❤ <span>{activity.likes}</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1 transition-colors hover:text-sky-500"
        >
          💬 <span>{activity.comments}</span>
        </button>
        <button
          type="button"
          className="ml-auto transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          ↗ Partager
        </button>
      </footer>
    </article>
  );
}

function renderMatchBody(matchId: string, posterId: string) {
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
      <div
        className={`flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white ${
          competitive
            ? posterWon
              ? "bg-emerald-600"
              : "bg-rose-600"
            : "bg-zinc-500"
        }`}
      >
        <span>{posterWon ? "Victoire" : "Défaite"}</span>
        <span
          className={`rounded-full px-1.5 py-0.5 text-[9px] ${
            competitive ? "bg-white/20" : "bg-white/30"
          }`}
        >
          {getMatchModeLabel(match.mode)}
        </span>
        <span className="opacity-80">{match.format}</span>
        {match.venue ? <span className="truncate opacity-80">· {match.venue}</span> : null}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-3">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar emoji={p1.avatar} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{p1.fullName}</p>
            <p className="text-[10px] text-zinc-500">{p1.rating} ELO</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold tabular-nums">
            {won.p1} <span className="text-zinc-300">·</span> {won.p2}
          </p>
          <p className="text-[10px] text-zinc-500">{setScoreLine(match.sets)}</p>
        </div>
        <div className="flex items-center gap-2 justify-end min-w-0">
          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-medium">{p2.fullName}</p>
            <p className="text-[10px] text-zinc-500">{p2.rating} ELO</p>
          </div>
          <Avatar emoji={p2.avatar} size="sm" />
        </div>
      </div>
      <div className="border-t border-zinc-100 px-3 py-2 text-[11px] text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        {delta !== null ? (
          <>
            ELO :{" "}
            <span
              className={
                delta >= 0
                  ? "font-semibold text-emerald-600"
                  : "font-semibold text-rose-600"
              }
            >
              {delta >= 0 ? "+" : ""}
              {delta}
            </span>
          </>
        ) : (
          <span className="italic text-zinc-500">
            Match amical — n'affecte pas le classement
          </span>
        )}
      </div>
    </Link>
  );
}
