import Link from "next/link";
import StatsContent from "../../components/StatsContent";
import RankingContent from "../../components/RankingContent";
import StatsTabs from "../../components/StatsTabs";
import Avatar from "../../components/Avatar";
import {
  CURRENT_USER_ID,
  getPlayer,
  getMatchesForPlayer,
  getMatchModeLabel,
} from "../../lib/data";
import { setScoreLine, setsWon, timeAgo } from "../../lib/format";
import { isCompetitive } from "../../lib/types";

export const metadata = { title: "Stats — PingPang" };

export default function StatsPage() {
  const myMatches = getMatchesForPlayer(CURRENT_USER_ID, "all");

  const matchsContent = (
    <div className="px-4 pt-4">
      <h1
        className="mb-4 text-2xl font-black uppercase tracking-tight text-[#0A241E]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Historique des Matchs
      </h1>
      {myMatches.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-500">
          Aucun match enregistré.
        </p>
      ) : (
        <ul className="space-y-2">
          {myMatches.map((m) => {
            const opponentId =
              m.player1Id === CURRENT_USER_ID ? m.player2Id : m.player1Id;
            const opponent = getPlayer(opponentId);
            if (!opponent) return null;
            const isP1 = m.player1Id === CURRENT_USER_ID;
            const won = setsWon(m.sets);
            const meScore = isP1 ? won.p1 : won.p2;
            const themScore = isP1 ? won.p2 : won.p1;
            const playerWon = m.winnerId === CURRENT_USER_ID;
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
                  prefetch={false}
                  className="flex items-center gap-3 rounded-xl bg-white p-3 border border-[#E5E7EB] transition-all hover:translate-y-[-2px] hover:shadow-[0px_4px_20px_rgba(10,36,30,0.05)]"
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white ${
                      playerWon ? "bg-[#0A241E]" : "bg-[#BA1A1A]"
                    }`}
                  >
                    {playerWon ? "V" : "D"}
                  </span>
                  <Avatar emoji={opponent.avatar} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-sm font-semibold"
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      vs {opponent.fullName}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      {timeAgo(m.playedAt)} · {getMatchModeLabel(m.mode)} ·{" "}
                      {setScoreLine(m.sets)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-sm font-bold tabular-nums"
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      {meScore}–{themScore}
                    </p>
                    {delta !== null ? (
                      <p
                        className={`text-[11px] font-bold ${
                          delta >= 0 ? "text-[#0A241E]" : "text-[#BA1A1A]"
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
    </div>
  );

  const rangContent = (
    <div className="px-4 pt-4">
      <h1
        className="mb-4 text-2xl font-black uppercase tracking-tight text-[#0A241E]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Classement Mondial
      </h1>
      <RankingContent />
    </div>
  );

  return (
    <div className="flex min-h-dvh flex-col bg-[#F9F9FF] text-[#151C27]">
      <StatsTabs
        tabs={[
          { id: "suivi", label: "Suivi", icon: <img src="/icons/graphique.png" alt="Suivi" className="w-5 h-5 object-contain" />, content: <StatsContent /> },
          { id: "rang", label: "Rang", icon: <img src="/icons/tournoi.png" alt="Rang" className="w-5 h-5 object-contain" />, content: rangContent },
          { id: "matchs", label: "Matchs", icon: <img src="/icons/ping-pong-2.png" alt="Matchs" className="w-5 h-5 object-contain" />, content: matchsContent },
        ]}
      />
    </div>
  );
}
