import ClubTopBar from "../../../components/club-admin/ClubTopBar";
import ClubCard, {
  ClubGhostButton,
  ClubPrimaryButton,
  ClubSectionTitle,
} from "../../../components/club-admin/ClubCard";
import { announcements, getDefaultClub } from "../../../lib/club-admin";
import { timeAgo } from "../../../lib/format";

export const metadata = { title: "Communication — Club" };

const AUDIENCE_LABEL: Record<string, string> = {
  all: "Tous les membres",
  competitors: "Compétiteurs",
  youth: "Jeunes",
  vets: "Vétérans",
};

export default function CommunicationPage() {
  const club = getDefaultClub();
  const sorted = [...announcements].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  return (
    <>
      <ClubTopBar
        clubName={club.name}
        clubLogo={club.logo}
        title="Communication"
        subtitle="Annonces & notifications"
        right={<ClubPrimaryButton>+ Annonce</ClubPrimaryButton>}
      />

      {/* ── Composer ── */}
      <section className="px-3 py-3">
        <ClubSectionTitle>Nouvelle annonce</ClubSectionTitle>
        <ClubCard>
          <input
            type="text"
            placeholder="Titre…"
            className="w-full px-2 py-1.5 text-sm"
            style={{
              background: "transparent",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              color: "#f6f1e3",
              fontFamily: "var(--font-ui)",
            }}
          />
          <textarea
            placeholder="Votre message…"
            rows={3}
            className="mt-2 w-full resize-none px-2 py-1.5 text-sm"
            style={{
              background: "transparent",
              color: "#f6f1e3",
              fontFamily: "var(--font-ui)",
              outline: "none",
            }}
          />
          <div className="mt-2 flex flex-wrap gap-1">
            {Object.entries(AUDIENCE_LABEL).map(([k, v], i) => (
              <button
                key={k}
                type="button"
                className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background:
                    i === 0
                      ? "var(--color-gold)"
                      : "rgba(255,255,255,0.06)",
                  color: i === 0 ? "var(--color-forest-deep)" : "#f6f1e3",
                  fontFamily: "var(--font-ui)",
                }}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <label
              className="flex items-center gap-1.5 text-[11px]"
              style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-ui)" }}
            >
              <input type="checkbox" />
              📌 Épingler
            </label>
            <div className="flex gap-2">
              <ClubGhostButton>Aperçu</ClubGhostButton>
              <ClubPrimaryButton>Publier</ClubPrimaryButton>
            </div>
          </div>
        </ClubCard>
      </section>

      {/* ── Historique ── */}
      <section className="px-3 pb-4">
        <ClubSectionTitle>Annonces publiées</ClubSectionTitle>
        <ul className="space-y-2">
          {sorted.map((a) => (
            <li key={a.id}>
              <ClubCard>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      {a.pinned ? "📌 " : ""}
                      {a.title}
                    </p>
                    <p
                      className="mt-0.5 text-[11px]"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      {AUDIENCE_LABEL[a.audience]} ·{" "}
                      {timeAgo(a.publishedAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    aria-label="Plus"
                  >
                    ⋯
                  </button>
                </div>
                <p
                  className="mt-2 text-sm"
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontFamily: "var(--font-ui)",
                  }}
                >
                  {a.body}
                </p>
              </ClubCard>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Canaux ── */}
      <section className="px-3 pb-8">
        <ClubSectionTitle>Canaux de diffusion</ClubSectionTitle>
        <ul className="space-y-2">
          {[
            { icon: "📱", label: "Notifications push", on: true, hint: "Membres ayant accepté" },
            { icon: "📧", label: "Email automatique", on: true, hint: "À chaque annonce épinglée" },
            { icon: "💬", label: "WhatsApp Business", on: false, hint: "À configurer" },
            { icon: "📺", label: "Affichage écran club", on: true, hint: "Salle principale" },
          ].map((c) => (
            <li key={c.label}>
              <ClubCard>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{c.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      {c.label}
                    </p>
                    <p
                      className="text-[11px]"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      {c.hint}
                    </p>
                  </div>
                  <div
                    className="h-5 w-9 rounded-full p-0.5"
                    style={{
                      background: c.on
                        ? "var(--color-gold)"
                        : "rgba(255,255,255,0.12)",
                    }}
                  >
                    <div
                      className="h-4 w-4 rounded-full transition-transform"
                      style={{
                        background: c.on
                          ? "var(--color-forest-deep)"
                          : "rgba(255,255,255,0.5)",
                        transform: c.on
                          ? "translateX(16px)"
                          : "translateX(0)",
                      }}
                    />
                  </div>
                </div>
              </ClubCard>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
