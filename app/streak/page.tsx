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
            className="grid h-9 w-9 place-items-center rounded-full bg-zinc-100 text-lg dark:bg-zinc-800"
          >
            ↑
          </button>
        }
      />

      {/* ── Risk warning ─────────────────────────────────── */}
      {isAtRisk && (
        <div className="mx-4 mt-3 flex gap-3 rounded-xl bg-amber-50 p-3.5 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:ring-amber-900">
          <span className="shrink-0 text-xl">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Ton streak est en danger !
            </p>
            <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
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
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Badges de régularité
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {badges.map((badge) => (
            <div
              key={badge.weeks}
              className={`flex items-center gap-3 rounded-xl p-3 transition-all ${
                badge.unlocked
                  ? "bg-emerald-50 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:ring-emerald-900"
                  : "bg-zinc-50 ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800"
              }`}
              style={{ opacity: badge.unlocked ? 1 : 0.5 }}
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
                  className={`text-[10px] ${
                    badge.unlocked
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-400"
                  }`}
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
            className="mt-3 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            🧊 Premium — Protège ton streak avec le Gel
          </button>
        )}
      </section>

      {/* ── 12-week history grid ─────────────────────────── */}
      <section className="px-4 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Historique des 12 semaines
          </h2>
          <span className="flex items-center gap-1.5 text-[10px] text-zinc-400">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Actif
            <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            Manqué
          </span>
        </div>
        <WeekHistoryGrid weeks={weekHistory} />
      </section>

      {/* ── Weekly evolution chart ───────────────────────── */}
      <section className="px-4 pt-6 pb-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Évolution hebdomadaire
        </h2>
        <div className="rounded-xl bg-zinc-50 px-3 pt-4 pb-2 ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800">
          <WeeklyChart weeks={weekHistory} />
          <div className="mt-1 flex justify-center gap-5">
            <ChartLegend color="bg-emerald-500" label="Match joué" />
            <ChartLegend color="bg-zinc-300 dark:bg-zinc-600" label="Semaine manquée" />
            <ChartLegend color="bg-amber-400" label="En attente" />
          </div>
        </div>
      </section>
    </>
  );
}

function ChartLegend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-[10px] text-zinc-500">{label}</span>
    </div>
  );
}
