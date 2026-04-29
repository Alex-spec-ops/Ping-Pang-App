import Link from "next/link";
import TopBar from "../../../components/TopBar";
import Avatar from "../../../components/Avatar";
import { getMatch, getMatchModeLabel, getPlayer } from "../../../lib/data";
import { setsWon, timeAgo } from "../../../lib/format";
import { isCompetitive } from "../../../lib/types";

export default async function MatchPage(props: PageProps<"/match/[id]">) {
  const { id } = await props.params;
  const match = getMatch(id);

  if (!match) {
    return (
      <>
        <TopBar title="Match" />
        <p className="px-4 py-10 text-center text-sm text-zinc-500">
          Match introuvable.
        </p>
      </>
    );
  }

  const p1 = getPlayer(match.player1Id);
  const p2 = getPlayer(match.player2Id);
  if (!p1 || !p2) return null;
  const won = setsWon(match.sets);

  return (
    <>
      <TopBar
        title={`${p1.fullName} vs ${p2.fullName}`}
        subtitle={`${match.format} · ${getMatchModeLabel(match.mode)} · ${timeAgo(match.playedAt)}`}
      />

      <div
        className={`px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-white ${
          isCompetitive(match.mode) ? "bg-emerald-600" : "bg-zinc-500"
        }`}
      >
        {isCompetitive(match.mode)
          ? `${getMatchModeLabel(match.mode)} · ELO en jeu`
          : "Match amical · n'affecte pas le classement"}
      </div>

      <section className="px-4 py-6">
        <div className="grid grid-cols-3 items-center gap-3">
          <Link
            href={`/profile/${p1.id}`}
            className="flex flex-col items-center gap-2"
          >
            <Avatar emoji={p1.avatar} size="lg" />
            <p className="text-center text-sm font-semibold leading-tight">
              {p1.fullName}
            </p>
            <p className="text-[11px] text-zinc-500">
              {p1.countryFlag} {p1.rating}
            </p>
          </Link>
          <div className="text-center">
            <p className="text-4xl font-extrabold tabular-nums">
              {won.p1}
              <span className="text-zinc-300"> · </span>
              {won.p2}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-zinc-500">
              {match.winnerId === p1.id
                ? "Victoire " + p1.fullName.split(" ")[0]
                : "Victoire " + p2.fullName.split(" ")[0]}
            </p>
          </div>
          <Link
            href={`/profile/${p2.id}`}
            className="flex flex-col items-center gap-2"
          >
            <Avatar emoji={p2.avatar} size="lg" />
            <p className="text-center text-sm font-semibold leading-tight">
              {p2.fullName}
            </p>
            <p className="text-[11px] text-zinc-500">
              {p2.countryFlag} {p2.rating}
            </p>
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-100 px-4 py-4 dark:border-zinc-800">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Détail des manches
        </h3>
        <ul className="space-y-2">
          {match.sets.map((s, i) => {
            const p1Won = s.p1 > s.p2;
            return (
              <li
                key={i}
                className="grid grid-cols-[auto_1fr_auto_auto_1fr] items-center gap-3 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900"
              >
                <span className="text-[11px] font-semibold text-zinc-500">
                  Set {i + 1}
                </span>
                <span
                  className={`text-right text-sm ${
                    p1Won ? "font-bold" : "text-zinc-500"
                  }`}
                >
                  {p1.fullName.split(" ")[0]}
                </span>
                <span className="text-base font-bold tabular-nums">
                  {s.p1}
                </span>
                <span className="text-base font-bold tabular-nums">
                  {s.p2}
                </span>
                <span
                  className={`text-sm ${
                    !p1Won ? "font-bold" : "text-zinc-500"
                  }`}
                >
                  {p2.fullName.split(" ")[0]}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {isCompetitive(match.mode) && match.ratingChange ? (
        <section className="border-t border-zinc-100 px-4 py-4 dark:border-zinc-800">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Évolution ELO
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
              <p className="text-xs text-zinc-500">{p1.fullName}</p>
              <p
                className={`text-lg font-bold ${
                  match.ratingChange.p1 >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {match.ratingChange.p1 >= 0 ? "+" : ""}
                {match.ratingChange.p1}
              </p>
            </div>
            <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
              <p className="text-xs text-zinc-500">{p2.fullName}</p>
              <p
                className={`text-lg font-bold ${
                  match.ratingChange.p2 >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {match.ratingChange.p2 >= 0 ? "+" : ""}
                {match.ratingChange.p2}
              </p>
            </div>
          </div>
          {match.venue ? (
            <p className="mt-3 text-xs text-zinc-500">📍 {match.venue}</p>
          ) : null}
        </section>
      ) : (
        <section className="border-t border-zinc-100 px-4 py-4 dark:border-zinc-800">
          <div className="rounded-xl bg-zinc-50 p-3 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            Match amical : aucun ELO modifié, comptabilisé séparément dans
            l'historique amical de chaque joueur.
          </div>
          {match.venue ? (
            <p className="mt-3 text-xs text-zinc-500">📍 {match.venue}</p>
          ) : null}
        </section>
      )}
    </>
  );
}
