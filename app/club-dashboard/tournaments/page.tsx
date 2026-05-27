import ClubTopBar from "../../../components/club-admin/ClubTopBar";
import ClubCard, {
  ClubGhostButton,
  ClubPrimaryButton,
  ClubSectionTitle,
} from "../../../components/club-admin/ClubCard";
import { getDefaultClub, tournaments, playerName } from "../../../lib/club-admin";

export const metadata = { title: "Tournois — Club" };

const STATUS_LABEL: Record<string, string> = {
  draft: "Brouillon",
  open: "Inscriptions ouvertes",
  live: "En cours",
  closed: "Terminé",
};

const STATUS_COLOR: Record<string, string> = {
  draft: "rgba(255,255,255,0.4)",
  open: "var(--color-gold)",
  live: "#ff7676",
  closed: "rgba(255,255,255,0.6)",
};

const FORMAT_LABEL: Record<string, string> = {
  "round-robin": "Poule",
  "single-elim": "Élim. directe",
  "double-elim": "Double élim.",
  swiss: "Système Suisse",
};

export default function TournamentsPage() {
  const club = getDefaultClub();
  const clubTournaments = tournaments.filter((t) => t.clubId === club.id);

  return (
    <>
      <ClubTopBar
        clubName={club.name}
        clubLogo={club.logo}
        title="Tournois"
        subtitle={`${clubTournaments.length} compétitions gérées`}
        right={<ClubPrimaryButton>+ Créer</ClubPrimaryButton>}
      />

      <section className="px-3 py-3">
        <div className="flex gap-2">
          {["Tous", "Ouverts", "Live", "Brouillons", "Archivés"].map(
            (f, i) => (
              <button
                key={f}
                type="button"
                className="shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background:
                    i === 0 ? "var(--color-gold)" : "rgba(255,255,255,0.06)",
                  color: i === 0 ? "var(--color-forest-deep)" : "#f6f1e3",
                  fontFamily: "var(--font-ui)",
                }}
              >
                {f}
              </button>
            ),
          )}
        </div>
      </section>

      <section className="px-3 pb-4">
        <ClubSectionTitle>Compétitions</ClubSectionTitle>
        <ul className="space-y-2">
          {clubTournaments.map((t) => {
            const fillRatio = Math.round((t.registered.length / t.maxParticipants) * 100);
            return (
              <li key={t.id}>
                <ClubCard>
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl"
                      style={{
                        background: "var(--color-gold)",
                        color: "var(--color-forest-deep)",
                        fontFamily: "var(--font-ui)",
                      }}
                    >
                      <span className="text-[9px] font-bold uppercase">
                        {new Date(t.startDate)
                          .toLocaleDateString("fr-FR", { month: "short" })
                          .replace(".", "")}
                      </span>
                      <span className="text-base font-bold">
                        {new Date(t.startDate).getDate()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className="truncate text-sm font-semibold"
                          style={{ fontFamily: "var(--font-ui)" }}
                        >
                          {t.name}
                        </p>
                        <span
                          className="shrink-0 text-[9px] font-bold uppercase tracking-wider"
                          style={{
                            color: STATUS_COLOR[t.status],
                            fontFamily: "var(--font-ui)",
                          }}
                        >
                          ● {STATUS_LABEL[t.status]}
                        </span>
                      </div>
                      <p
                        className="mt-0.5 text-[11px]"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        {FORMAT_LABEL[t.format]} · {t.category.toUpperCase()} ·{" "}
                        {t.entryFee > 0 ? `${t.entryFee} € engagement` : "Gratuit"}
                        {t.prizePool ? ` · 🏆 ${t.prizePool} €` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px]">
                      <span style={{ color: "rgba(255,255,255,0.6)" }}>
                        Inscrits
                      </span>
                      <span
                        className="font-bold tabular-nums"
                        style={{ color: "var(--color-gold)", fontFamily: "var(--font-ui)" }}
                      >
                        {t.registered.length} / {t.maxParticipants}
                      </span>
                    </div>
                    <div
                      className="mt-1 h-1.5 overflow-hidden rounded-full"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${fillRatio}%`,
                          background: "var(--color-gold)",
                        }}
                      />
                    </div>
                  </div>

                  {t.registered.length > 0 && (
                    <p
                      className="mt-2 truncate text-[10px]"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {t.registered.slice(0, 3).map(playerName).join(", ")}
                      {t.registered.length > 3
                        ? ` +${t.registered.length - 3}`
                        : ""}
                    </p>
                  )}

                  <div className="mt-3 flex gap-2">
                    <ClubGhostButton>Bracket</ClubGhostButton>
                    <ClubGhostButton>Gérer</ClubGhostButton>
                    {t.status === "draft" && (
                      <ClubPrimaryButton>Publier</ClubPrimaryButton>
                    )}
                  </div>
                </ClubCard>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
