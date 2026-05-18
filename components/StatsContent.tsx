import Link from "next/link";
import Avatar from "./Avatar";
import { CURRENT_USER_ID, getPlayer } from "../lib/data";
import { getAnalytics, getOpponentBreakdown } from "../lib/stats";

export default function StatsContent() {
  const me = getPlayer(CURRENT_USER_ID);
  const s = getAnalytics();
  const opponents = getOpponentBreakdown();

  const setsTotal = s.setsWon + s.setsLost;
  const setsWinRate =
    setsTotal > 0 ? Math.round((s.setsWon / setsTotal) * 100) : 0;

  return (
    <>
      <section className="px-4 pt-4">
        <div className="p-4 text-center" style={{ background: "var(--color-forest)", color: "#fff" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-gold)", fontFamily: "var(--font-ui)" }}>
            ELO actuel
          </p>
          <p className="text-4xl font-bold tabular-nums" style={{ fontFamily: "var(--font-display)" }}>
            {me?.rating ?? "—"}
          </p>
          <p className="mt-1 text-[11px]" style={{ color: "rgba(255,255,255,0.7)" }}>
            Peak {me?.peakRating} · {s.avgRatingDelta >= 0 ? "+" : ""}
            {s.avgRatingDelta} en moyenne par match classé
          </p>
        </div>
      </section>

      <section className="px-4 pt-4">
        <SectionTitle>Forme récente</SectionTitle>
        <div className="flex items-center justify-between p-3" style={{ background: "var(--color-cream)", border: "var(--border-thin)" }}>
          <div>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>
              5 derniers matchs
            </p>
            <div className="mt-1 flex gap-1">
              {s.last5.length === 0 ? (
                <span className="text-xs text-zinc-400">Aucun match</span>
              ) : (
                s.last5.map((r, i) => (
                  <span
                    key={i}
                    className="grid h-6 w-6 place-items-center text-[11px] font-bold text-white"
                    style={{ background: r === "V" ? "var(--color-forest)" : "#c4423a", fontFamily: "var(--font-ui)" }}
                  >
                    {r}
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--color-forest)", fontFamily: "var(--font-display)" }}>
              {s.currentStreak} 🔥
            </p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>
              Série en cours · meilleure : {s.bestStreak}
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pt-4">
        <SectionTitle>Vue d&apos;ensemble</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <Kpi label="Matchs classés" value={String(s.rankedMatches)} hint={`${s.rankedWins}V — ${s.rankedLosses}D`} />
          <Kpi label="Matchs amicaux" value={String(s.casualMatches)} hint={`${s.casualWinRate}% V`} muted />
          <Kpi label="Victoire classée" value={`${s.rankedWinRate}%`} hint="winrate compétitif" accent />
          <Kpi label="Sets gagnés" value={`${setsWinRate}%`} hint={`${s.setsWon} / ${setsTotal}`} />
          <Kpi label="Points / set" value={String(s.pointsPerSet)} hint={`contre ${s.pointsConcededPerSet}`} />
          <Kpi label="ELO moyen / match" value={`${s.avgRatingDelta >= 0 ? "+" : ""}${s.avgRatingDelta}`} hint="par match classé" accent={s.avgRatingDelta >= 0} />
        </div>
      </section>

      {(s.bestWin || s.worstLoss) && (
        <section className="px-4 pt-4">
          <SectionTitle>Faits marquants</SectionTitle>
          <ul className="space-y-2">
            {s.bestWin && (
              <li>
                <Link href={`/match/${s.bestWin.matchId}`} className="flex items-center gap-3 p-3" style={{ background: "rgba(14,61,46,0.06)", borderLeft: "3px solid var(--color-forest)" }}>
                  <Avatar emoji={s.bestWin.opponent.avatar} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--color-forest)", fontFamily: "var(--font-ui)" }}>
                      🥇 Plus belle victoire
                    </p>
                    <p className="truncate text-sm font-semibold" style={{ fontFamily: "var(--font-ui)" }}>
                      vs {s.bestWin.opponent.fullName}
                    </p>
                  </div>
                  <p className="text-sm font-bold tabular-nums" style={{ color: "var(--color-forest)" }}>+{s.bestWin.delta}</p>
                </Link>
              </li>
            )}
            {s.worstLoss && (
              <li>
                <Link href={`/match/${s.worstLoss.matchId}`} className="flex items-center gap-3 p-3" style={{ background: "rgba(196,66,58,0.06)", borderLeft: "3px solid #c4423a" }}>
                  <Avatar emoji={s.worstLoss.opponent.avatar} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#c4423a", fontFamily: "var(--font-ui)" }}>
                      💥 Défaite la plus coûteuse
                    </p>
                    <p className="truncate text-sm font-semibold" style={{ fontFamily: "var(--font-ui)" }}>
                      vs {s.worstLoss.opponent.fullName}
                    </p>
                  </div>
                  <p className="text-sm font-bold tabular-nums" style={{ color: "#c4423a" }}>{s.worstLoss.delta}</p>
                </Link>
              </li>
            )}
          </ul>
        </section>
      )}

      {s.monthly.length > 0 && (
        <section className="px-4 pt-4">
          <SectionTitle>Activité mensuelle</SectionTitle>
          <div className="p-3" style={{ background: "var(--color-cream)", border: "var(--border-thin)" }}>
            <div className="flex items-end gap-2" style={{ height: 96 }}>
              {s.monthly.map((m) => {
                const max = Math.max(...s.monthly.map((x) => x.matches));
                const h = Math.max(8, Math.round((m.matches / max) * 88));
                const winH = m.matches > 0 ? Math.round((m.wins / m.matches) * h) : 0;
                const label = new Date(m.month + "-01").toLocaleDateString("fr-FR", { month: "short" });
                return (
                  <div key={m.month} className="flex flex-1 flex-col items-center justify-end gap-1">
                    <div className="relative w-full" style={{ height: h, background: "rgba(0,0,0,0.06)" }} title={`${m.wins} V / ${m.matches} matchs`}>
                      <div className="absolute bottom-0 left-0 right-0" style={{ height: winH, background: "var(--color-forest)" }} />
                    </div>
                    <span className="text-[9px] uppercase" style={{ color: "var(--color-muted)" }}>{label}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[10px]" style={{ color: "var(--color-muted)" }}>
              Vert = victoires · gris = défaites
            </p>
          </div>
        </section>
      )}

      {opponents.length > 0 && (
        <section className="px-4 pt-4 pb-8">
          <SectionTitle>Adversaires les plus joués</SectionTitle>
          <ul className="space-y-2">
            {opponents.slice(0, 6).map((o) => (
              <li key={o.player.id} className="flex items-center gap-3 p-3" style={{ background: "#fff", border: "var(--border-thin)" }}>
                <Avatar emoji={o.player.avatar} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold" style={{ fontFamily: "var(--font-ui)" }}>
                    {o.player.fullName}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    {o.matches} match{o.matches > 1 ? "s" : ""} · {o.wins}V — {o.losses}D
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold tabular-nums" style={{ color: o.winRate >= 50 ? "var(--color-forest)" : "#c4423a", fontFamily: "var(--font-display)" }}>
                    {o.winRate}%
                  </p>
                  <div className="mt-1 h-1 w-16" style={{ background: "var(--color-line)" }}>
                    <div className="h-full" style={{ width: `${o.winRate}%`, background: o.winRate >= 50 ? "var(--color-forest)" : "#c4423a" }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-forest)", fontFamily: "var(--font-ui)" }}>
      {children}
    </h2>
  );
}

function Kpi({ label, value, hint, accent, muted }: { label: string; value: string; hint?: string; accent?: boolean; muted?: boolean }) {
  return (
    <div className="p-3" style={{ background: "var(--color-cream)", border: "var(--border-thin)", opacity: muted ? 0.85 : 1 }}>
      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--color-muted)", fontFamily: "var(--font-ui)" }}>{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums" style={{ fontFamily: "var(--font-display)", color: accent ? "var(--color-forest)" : "var(--color-ink)" }}>{value}</p>
      {hint ? <p className="mt-0.5 text-[11px]" style={{ color: "var(--color-muted)" }}>{hint}</p> : null}
    </div>
  );
}
