import TopBar from "../../components/TopBar";
import StreakHero from "../../components/StreakHero";
import WeekHistoryGrid from "../../components/WeekHistoryGrid";
import WeeklyChart from "../../components/WeeklyChart";
import { getStreakData } from "../../lib/streak";
import { matches, CURRENT_USER_ID, getPlayer } from "../../lib/data";

export const metadata = { title: "Streak — PingPang" };

// Pinned to a Monday so the demo is always consistent.
const DEMO_TODAY = new Date("2026-05-04T12:00:00Z");

export default function StreakPage() {
  const me = getPlayer(CURRENT_USER_ID);
  const data = getStreakData(CURRENT_USER_ID, matches, DEMO_TODAY, false, 0);
  const { isAtRisk, badges, weekHistory } = data;

  return (
    <>
      <TopBar
        title="Streak 🔥"
        subtitle={me ? `@${me.username}` : undefined}
        right={
          <button
            type="button"
            aria-label="Partager"
            className="grid h-9 w-9 place-items-center text-lg"
            style={{ border: "var(--border-thin)", background: "var(--color-cream)" }}
          >
            ↑
          </button>
        }
      />

      {/* ── Risk warning ─────────────────────────────────── */}
      {isAtRisk && (
        <div className="mx-4 mt-3 flex gap-3 p-3.5" style={{ background: "#fffbeb", border: "1px solid #f59e0b" }}>
          <span className="shrink-0 text-xl">⚠️</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#92400e" }}>
              Ton streak est en danger !
            </p>
            <p className="mt-0.5 text-xs" style={{ color: "#b45309" }}>
              Joue au moins un match avant ce soir pour maintenir ta série.
            </p>
          </div>
        </div>
      )}

      {/* ── Hero card ────────────────────────────────────── */}
      <section className="px-4 pt-4">
        <StreakHero data={data} />
      </section>

      {/* ── Badges ───────────────────────────────────────── */}
      <section className="px-4 pt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)", fontFamily: "var(--font-ui)" }}>
          Badges de régularité
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {badges.map((badge) => (
            <div
              key={badge.weeks}
              className="flex items-center gap-3 p-3 transition-all"
              style={{
                opacity: badge.unlocked ? 1 : 0.45,
                border: badge.unlocked ? "1px solid var(--color-forest)" : "var(--border-thin)",
                background: badge.unlocked ? "var(--color-cream)" : "var(--color-bg)",
              }}
            >
              <span
                className="text-2xl"
                style={{
                  filter: badge.unlocked ? undefined : "grayscale(1)",
                  animation:
                    badge.unlocked && badge.weeks === 4
                      ? "celebrate-pop 0.7s ease-out 0.2s both"
                      : undefined,
                }}
              >
                {badge.emoji}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold">{badge.label}</p>
                <p
                  className="text-[10px]"
                  style={{ color: badge.unlocked ? "var(--color-forest)" : "var(--color-muted)", fontFamily: "var(--font-ui)" }}
                >
                  {badge.unlocked ? "Débloqué ✓" : `${badge.description} requises`}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Premium upsell */}
        {!data.isPremium && (
          <button
            type="button"
            className="mt-3 w-full py-2.5 text-sm font-semibold text-white"
            style={{ background: "var(--color-forest)", fontFamily: "var(--font-ui)" }}
          >
            🧊 Premium — Protège ton streak avec le Gel
          </button>
        )}
      </section>

      {/* ── 12-week history grid ─────────────────────────── */}
      <section className="px-4 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)", fontFamily: "var(--font-ui)" }}>
            Historique des 12 semaines
          </h2>
          <span className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--color-muted)" }}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--color-forest)" }} />
            Actif
            <span className="ml-1.5 inline-block h-2 w-2 rounded-full" style={{ background: "var(--color-line)" }} />
            Manqué
          </span>
        </div>
        <WeekHistoryGrid weeks={weekHistory} />
      </section>

      {/* ── Weekly evolution chart ───────────────────────── */}
      <section className="px-4 pt-6 pb-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)", fontFamily: "var(--font-ui)" }}>
          Évolution hebdomadaire
        </h2>
        <div className="px-3 pt-4 pb-2" style={{ background: "var(--color-cream)", border: "var(--border-thin)" }}>
          <WeeklyChart weeks={weekHistory} />
          <div className="mt-1 flex justify-center gap-5">
            <ChartLegend color="var(--color-forest)" label="Match joué" />
            <ChartLegend color="var(--color-line)" label="Semaine manquée" />
            <ChartLegend color="#f59e0b" label="En attente" />
          </div>
        </div>
      </section>
    </>
  );
}

function ChartLegend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      <span className="text-[10px]" style={{ color: "var(--color-muted)" }}>{label}</span>
    </div>
  );
}
