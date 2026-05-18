import ClubTopBar from "../../../components/club-admin/ClubTopBar";
import ClubCard, {
  ClubGhostButton,
  ClubPrimaryButton,
  ClubSectionTitle,
} from "../../../components/club-admin/ClubCard";
import { getDefaultClub } from "../../../lib/club-admin";

export const metadata = { title: "Réglages — Club" };

export default function SettingsPage() {
  const club = getDefaultClub();
  const isPhysical = club.type === "physical";

  return (
    <>
      <ClubTopBar
        clubName={club.name}
        clubLogo={club.logo}
        title="Réglages"
        subtitle="Identité, accès, intégrations"
      />

      <section className="px-3 py-3">
        <ClubSectionTitle>Identité du club</ClubSectionTitle>
        <ClubCard>
          <Row label="Nom" value={club.name} editable />
          <Row label="Slug" value={club.shortName} editable />
          <Row label="Ville" value={`${club.city}, ${club.country} ${club.countryFlag}`} editable />
          <Row label="Logo" value={club.logo} editable />
          <Row label="Visibilité" value={club.visibility === "public" ? "Public" : "Privé"} editable />
          <Row label="Type" value={club.type === "physical" ? "🏢 Club physique" : "💻 Club digital"} editable />
          <Row
            label="Adhésion"
            value={club.membership.free ? "Gratuite" : `${club.membership.price} € / an`}
            editable
          />
          <div className="mt-3 flex gap-2">
            <ClubPrimaryButton>Enregistrer</ClubPrimaryButton>
            <ClubGhostButton>Annuler</ClubGhostButton>
          </div>
        </ClubCard>
      </section>

      <section className="px-3 pb-4">
        <ClubSectionTitle>Plan & abonnement</ClubSectionTitle>
        <ClubCard>
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "var(--color-gold)", fontFamily: "var(--font-ui)" }}
              >
                Plan actuel
              </p>
              <p
                className="text-base font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Free · jusqu&apos;à 50 membres
              </p>
            </div>
            <ClubPrimaryButton>Passer Premium</ClubPrimaryButton>
          </div>
          <ul
            className="mt-3 space-y-1 text-[11px]"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            <li>✓ 3 clubs · 50 membres · 4 tournois/mois</li>
            <li>✗ Pas d&apos;export comptable</li>
            <li>✗ Pas de personnalisation logo / domaine</li>
            <li>✗ Pas d&apos;intégration billetterie</li>
          </ul>
        </ClubCard>
      </section>

      <section className="px-3 pb-4">
        <ClubSectionTitle>Intégrations</ClubSectionTitle>
        <ul className="space-y-2">
          {[
            { name: "FFTT — Synchro classement", connected: false, icon: "🇫🇷" },
            { name: "Stripe — Encaissement en ligne", connected: true, icon: "💳" },
            { name: "Google Calendar", connected: true, icon: "📅" },
            { name: "Discord serveur", connected: false, icon: "🎮" },
            ...(isPhysical ? [{ name: "Doctolib — Réservation tables", connected: false, icon: "📋" }] : []),
          ].map((it) => (
            <li key={it.name}>
              <ClubCard>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{it.icon}</span>
                  <p
                    className="flex-1 text-sm font-semibold"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    {it.name}
                  </p>
                  {it.connected ? (
                    <ClubGhostButton>Connecté</ClubGhostButton>
                  ) : (
                    <ClubPrimaryButton>Connecter</ClubPrimaryButton>
                  )}
                </div>
              </ClubCard>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-3 pb-8">
        <ClubSectionTitle>Zone sensible</ClubSectionTitle>
        <ClubCard>
          <p
            className="text-[11px]"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Archiver ou supprimer le club. Cette action est irréversible et
            désactive l&apos;accès des membres.
          </p>
          <div className="mt-3 flex gap-2">
            <ClubGhostButton>Archiver</ClubGhostButton>
            <button
              type="button"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider"
              style={{
                background: "transparent",
                color: "#ff7676",
                border: "1px solid #ff7676",
                fontFamily: "var(--font-ui)",
              }}
            >
              Supprimer
            </button>
          </div>
        </ClubCard>
      </section>
    </>
  );
}

function Row({
  label,
  value,
  editable,
}: {
  label: string;
  value: string;
  editable?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 py-2"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <span
        className="text-[11px] font-bold uppercase tracking-wider"
        style={{
          color: "rgba(255,255,255,0.55)",
          fontFamily: "var(--font-ui)",
        }}
      >
        {label}
      </span>
      <span
        className="truncate text-sm"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        {value}
        {editable && (
          <span style={{ color: "rgba(255,255,255,0.3)" }}> ›</span>
        )}
      </span>
    </div>
  );
}
