import Link from "next/link";
import ClubTopBar from "../../components/club-admin/ClubTopBar";
import ClubKpi from "../../components/club-admin/ClubKpi";
import { getDefaultClub, playerName } from "../../lib/club-admin";
import {
  getActiveSubscriptions,
  getExpiringSubscriptions,
  getSubscriptionRevenue,
  getTodayBookings,
  getUpcomingTournaments,
  announcements,
} from "../../lib/club-admin";
import { getClubStats } from "../../lib/clubs";
import { timeAgo } from "../../lib/format";

export const metadata = { title: "Tableau de bord — Club" };

export default function ClubDashboardPage() {
  const club = getDefaultClub();
  const stats = getClubStats(club);
  const subRevenue = getSubscriptionRevenue();
  const active = getActiveSubscriptions();
  const expiring = getExpiringSubscriptions();
  const isPhysical = club.type === "physical";
  const todayBookings = getTodayBookings();
  const upcomingT = getUpcomingTournaments();
  const lastAnnouncement = [...announcements].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  )[0];

  return (
    <>
      <ClubTopBar
        clubName={club.name}
        clubLogo={club.logo}
        title="Tableau de bord"
        subtitle={`${stats.memberCount} membres · ${club.city} ${club.countryFlag}`}
      />

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-2 px-3 py-3">
        <ClubKpi
          label="Abonnements"
          value={`${subRevenue.toLocaleString("fr-FR")} €`}
          hint={`${active.length} adhérent${active.length > 1 ? "s" : ""} actif${active.length > 1 ? "s" : ""}`}
          accent="green"
          trend="up"
        />
        <ClubKpi
          label="Adhérents actifs"
          value={String(active.length)}
          hint={`${expiring.length} à renouveler`}
          accent="gold"
        />
        {isPhysical && (
          <ClubKpi
            label="Réservations du jour"
            value={String(todayBookings.length)}
            hint="Tables 1 → 4"
          />
        )}
        <ClubKpi
          label="Tournois à venir"
          value={String(upcomingT.length)}
          hint={upcomingT[0]?.name ?? "—"}
          accent="gold"
        />
      </section>

      {/* À traiter */}
      <section className="px-3 pb-4">
        <h2
          className="mb-2 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--color-gold)", fontFamily: "var(--font-ui)" }}
        >
          À traiter
        </h2>
        <ul className="space-y-2">
          {expiring.length > 0 && (
            <ActionRow
              icon="⏳"
              title={`${expiring.length} cotisation${expiring.length > 1 ? "s" : ""} expirent bientôt`}
              hint={expiring.map((s) => playerName(s.playerId)).join(", ")}
              href="/club-dashboard/members"
            />
          )}
          <ActionRow icon="🏆" title="3 inscriptions en attente — Open Printemps" hint="Valider ou refuser les paiements" href="/club-dashboard/tournaments" />
          <ActionRow icon="📩" title="2 demandes d'adhésion" hint="Marie L. · Tom B." href="/club-dashboard/members" />
          <ActionRow icon="📣" title="Annoncer la fermeture du 1er mai" hint="Dernière annonce il y a 4 jours" href="/club-dashboard/communication" />
        </ul>
      </section>

      {/* Agenda du jour */}
      <section className="px-3 pb-4">
        <h2
          className="mb-2 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--color-gold)", fontFamily: "var(--font-ui)" }}
        >
          Agenda du jour
        </h2>
        {todayBookings.length === 0 ? (
          <p
            className="rounded-xl px-3 py-4 text-sm"
            style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Aucune réservation enregistrée pour aujourd'hui.
          </p>
        ) : (
          <ul className="space-y-2">
            {todayBookings.map((b) => {
              const hh = new Date(b.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
              return (
                <li
                  key={b.id}
                  className="flex items-center gap-3 rounded-xl p-3"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
                >
                  <div
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold"
                    style={{ background: "var(--color-gold)", color: "var(--color-forest-deep)", fontFamily: "var(--font-ui)" }}
                  >
                    T{b.tableNumber}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold" style={{ fontFamily: "var(--font-ui)" }}>
                      {b.playerIds.map(playerName).join(" · ")}
                    </p>
                    <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {hh} · {b.durationMin} min · {b.purpose}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Dernière annonce */}
      {lastAnnouncement && (
        <section className="px-3 pb-8">
          <h2
            className="mb-2 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--color-gold)", fontFamily: "var(--font-ui)" }}
          >
            Dernière annonce
          </h2>
          <Link
            href="/club-dashboard/communication"
            className="block rounded-xl p-3 transition-opacity hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <div className="flex items-baseline justify-between gap-2">
              <p className="truncate text-sm font-semibold" style={{ fontFamily: "var(--font-ui)" }}>
                {lastAnnouncement.pinned ? "📌 " : ""}{lastAnnouncement.title}
              </p>
              <span className="shrink-0 text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                {timeAgo(lastAnnouncement.publishedAt)}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-xs" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-ui)" }}>
              {lastAnnouncement.body}
            </p>
          </Link>
        </section>
      )}
    </>
  );
}

function ActionRow({ icon, title, hint, href }: { icon: string; title: string; hint: string; href: string }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 rounded-xl p-3 transition-opacity hover:opacity-80"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
      >
        <span className="text-xl">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold" style={{ fontFamily: "var(--font-ui)" }}>{title}</p>
          <p className="truncate text-[11px]" style={{ color: "rgba(255,255,255,0.55)" }}>{hint}</p>
        </div>
        <span className="text-lg" style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
      </Link>
    </li>
  );
}
