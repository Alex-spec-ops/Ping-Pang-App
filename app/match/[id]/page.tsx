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
      <div className="min-h-dvh bg-[#F9F9FF]">
        <TopBar title="Match" />
        <p className="px-4 py-10 text-center text-sm text-zinc-500">
          Match introuvable.
        </p>
      </div>
    );
  }

  const p1 = getPlayer(match.player1Id);
  const p2 = getPlayer(match.player2Id);
  if (!p1 || !p2) return null;
  const won = setsWon(match.sets);

  return (
    <div className="min-h-dvh bg-[#F9F9FF] text-[#151C27]">
      <TopBar
        title={`${p1.fullName} vs ${p2.fullName}`}
        subtitle={`${match.format} · ${getMatchModeLabel(match.mode)} · ${timeAgo(match.playedAt)}`}
      />

      <div
        className={`px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-white ${
          isCompetitive(match.mode) ? "bg-[#0A241E]" : "bg-[#616363]"
        }`}
        style={{ fontFamily: "var(--font-ui)" }}
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
            <p
              className="text-center text-sm font-semibold leading-tight text-[#0A241E]"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              {p1.fullName}
            </p>
            <p className="text-[11px] text-zinc-500">
              {p1.countryFlag} {p1.rating}
            </p>
          </Link>
          <div className="text-center">
            <p
              className="text-4xl font-extrabold tabular-nums text-[#0A241E]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {won.p1}
              <span className="text-[#DFE0E0]"> · </span>
              {won.p2}
            </p>
            <p
              className="mt-1 text-[11px] uppercase tracking-wide text-zinc-500"
              style={{ fontFamily: "var(--font-ui)" }}
            >
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
            <p
              className="text-center text-sm font-semibold leading-tight text-[#0A241E]"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              {p2.fullName}
            </p>
            <p className="text-[11px] text-zinc-500">
              {p2.countryFlag} {p2.rating}
            </p>
          </Link>
        </div>
      </section>

      <section className="border-t border-[#E5E7EB] px-4 py-4">
        <h3
          className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          Détail des manches
        </h3>
        <ul className="space-y-2">
          {match.sets.map((s, i) => {
            const p1Won = s.p1 > s.p2;
            return (
              <li
                key={i}
                className="grid grid-cols-[auto_1fr_auto_auto_1fr] items-center gap-3 rounded-xl bg-white border border-[#E5E7EB] p-3"
              >
                <span
                  className="text-[11px] font-semibold text-zinc-500"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  Set {i + 1}
                </span>
                <span
                  className={`text-right text-sm ${
                    p1Won ? "font-bold text-[#0A241E]" : "text-zinc-400"
                  }`}
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {p1.fullName.split(" ")[0]}
                </span>
                <span
                  className="text-base font-bold tabular-nums text-[#0A241E]"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {s.p1}
                </span>
                <span
                  className="text-base font-bold tabular-nums text-[#0A241E]"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {s.p2}
                </span>
                <span
                  className={`text-sm ${
                    !p1Won ? "font-bold text-[#0A241E]" : "text-zinc-400"
                  }`}
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {p2.fullName.split(" ")[0]}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {isCompetitive(match.mode) && match.ratingChange ? (
        <section className="border-t border-[#E5E7EB] px-4 py-4">
          <h3
            className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            Évolution ELO
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white border border-[#E5E7EB] p-3">
              <p
                className="text-xs text-zinc-500"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {p1.fullName}
              </p>
              <p
                className={`text-lg font-bold ${
                  match.ratingChange.p1 >= 0 ? "text-[#0A241E]" : "text-[#BA1A1A]"
                }`}
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {match.ratingChange.p1 >= 0 ? "+" : ""}
                {match.ratingChange.p1}
              </p>
            </div>
            <div className="rounded-xl bg-white border border-[#E5E7EB] p-3">
              <p
                className="text-xs text-zinc-500"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {p2.fullName}
              </p>
              <p
                className={`text-lg font-bold ${
                  match.ratingChange.p2 >= 0 ? "text-[#0A241E]" : "text-[#BA1A1A]"
                }`}
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {match.ratingChange.p2 >= 0 ? "+" : ""}
                {match.ratingChange.p2}
              </p>
            </div>
          </div>
          {match.venue ? (
            <p
              className="mt-3 text-xs text-zinc-500"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              📍 {match.venue}
            </p>
          ) : null}
        </section>
      ) : (
        <section className="border-t border-[#E5E7EB] px-4 py-4">
          <div
            className="rounded-xl bg-white border border-[#E5E7EB] p-3 text-xs text-zinc-500"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            Match amical : aucun ELO modifié, comptabilisé séparément dans
            l'historique amical de chaque joueur.
          </div>
          {match.venue ? (
            <p
              className="mt-3 text-xs text-zinc-500"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              📍 {match.venue}
            </p>
          ) : null}
        </section>
      )}
    </div>
  );
}
