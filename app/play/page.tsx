import TopBar from "../../components/TopBar";
import Avatar from "../../components/Avatar";
import { getPlayer, liveMatches } from "../../lib/data";
import { setScoreLine, setsWon } from "../../lib/format";

export const metadata = {
  title: "Jouer — PingPang",
};

type Mode = {
  id: string;
  title: string;
  desc: string;
  cta: string;
  icon: string;
};

const competitive: Mode[] = [
  {
    id: "ranked",
    title: "Partie classée",
    desc: "ELO en jeu. Affronte un joueur d'un niveau proche.",
    cta: "Trouver un adversaire",
    icon: "🎯",
  },
  {
    id: "blitz",
    title: "Blitz BO3 classé",
    desc: "Format court, 3 manches gagnantes. ELO en jeu.",
    cta: "Lancer un blitz",
    icon: "⚡",
  },
  {
    id: "tournament",
    title: "Tournoi du jour",
    desc: "Bracket de 8 ou 16 joueurs, points et gains à la clé.",
    cta: "Voir les tournois",
    icon: "🏆",
  },
];

const casual: Mode[] = [
  {
    id: "friend",
    title: "Défier un ami",
    desc: "Match amical, sans ELO. Génère un code et invite un pongiste.",
    cta: "Créer un défi",
    icon: "🤝",
  },
  {
    id: "training",
    title: "Entraînement libre",
    desc: "Joue pour t'amuser ou t'échauffer. Aucun impact sur le classement.",
    cta: "Démarrer une session",
    icon: "🏓",
  },
  {
    id: "club",
    title: "Soirée club",
    desc: "Enregistre un match en club hors compétition officielle.",
    cta: "Saisir un score",
    icon: "🍻",
  },
];

export default function PlayPage() {
  return (
    <>
      <TopBar title="Jouer" subtitle="Compétitif ou amical, à toi de choisir" />

      <Section
        title="🏆 Compétitif"
        subtitle="ELO en jeu, comptabilisé au classement"
        modes={competitive}
      />

      <Section
        title="🤝 Amical"
        subtitle="Hors classement, juste pour le plaisir"
        modes={casual}
      />

      <section className="px-4 pb-4">
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
                      <p className="truncate text-sm font-medium">
                        {p1.fullName}
                      </p>
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
                      <p className="truncate text-sm font-medium">
                        {p2.fullName}
                      </p>
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

function Section({
  title,
  subtitle,
  modes,
}: {
  title: string;
  subtitle: string;
  modes: Mode[];
}) {
  return (
    <section className="px-4 py-4">
      <div className="mb-2">
        <h2
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-muted)", fontFamily: "var(--font-ui)" }}
        >
          {title}
        </h2>
        <p className="text-[11px]" style={{ color: "var(--color-muted)" }}>{subtitle}</p>
      </div>
      <ul className="space-y-3">
        {modes.map((q) => (
          <li
            key={q.id}
            className="overflow-hidden"
            style={{ border: "var(--border-thin)", background: "var(--color-bg)" }}
          >
            <div className="flex items-start gap-3 p-4">
              <span
                className="grid h-12 w-12 shrink-0 place-items-center text-2xl text-white"
                style={{ background: "var(--color-forest)" }}
                aria-hidden
              >
                {q.icon}
              </span>
              <div className="flex-1">
                <h3
                  className="font-semibold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {q.title}
                </h3>
                <p className="mt-0.5 text-sm" style={{ color: "var(--color-muted)" }}>{q.desc}</p>
                <button
                  type="button"
                  className="mt-3 px-4 py-1.5 text-sm font-semibold text-white"
                  style={{ background: "var(--color-forest)", fontFamily: "var(--font-ui)" }}
                >
                  {q.cta}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
