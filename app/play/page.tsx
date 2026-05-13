import TopBar from "../../components/TopBar";
import Avatar from "../../components/Avatar";
import { getPlayer, liveMatches } from "../../lib/data";
import { setScoreLine, setsWon } from "../../lib/format";
import RegisterMatchClient from "../../components/RegisterMatchClient";

export const metadata = {
  title: "Enregistrer — PingPang",
};

export default function PlayPage() {
  return (
    <>
      <TopBar title="Enregistrer" subtitle="Matchs en cours" />

      <RegisterMatchClient />

      <section className="px-4 pb-4 pt-4">
        <h2
          className="mb-2 text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-muted)", fontFamily: "var(--font-ui)" }}
        >
          🔴 En direct
        </h2>
        <ul className="space-y-3">
          {liveMatches.map((m) => {
            const p1 = getPlayer(m.player1Id);
            const p2 = getPlayer(m.player2Id);
            if (!p1 || !p2) return null;
            const won = setsWon(m.sets);
            return (
              <li
                key={m.id}
                className="overflow-hidden"
                style={{ border: "var(--border-thin)" }}
              >
                <div
                  className="flex items-center justify-between px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ background: "var(--color-red)" }}
                >
                  <span>● Live · {m.format}</span>
                  <span>👁 {m.viewers.toLocaleString("fr-FR")}</span>
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar emoji={p1.avatar} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p1.fullName}</p>
                      <p className="text-[10px]" style={{ color: "var(--color-muted)" }}>
                        {p1.countryFlag} {p1.rating}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold tabular-nums">
                      {won.p1} <span style={{ color: "var(--color-line)" }}>·</span> {won.p2}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--color-muted)" }}>
                      {setScoreLine(m.sets)}
                      {m.sets.length > 0 ? " · " : ""}
                      <span className="font-semibold" style={{ color: "var(--color-red)" }}>
                        {m.currentSet.p1}-{m.currentSet.p2}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2 min-w-0">
                    <div className="min-w-0 text-right">
                      <p className="truncate text-sm font-medium">{p2.fullName}</p>
                      <p className="text-[10px]" style={{ color: "var(--color-muted)" }}>
                        {p2.countryFlag} {p2.rating}
                      </p>
                    </div>
                    <Avatar emoji={p2.avatar} size="sm" />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
