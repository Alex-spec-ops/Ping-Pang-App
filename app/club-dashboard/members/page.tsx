import ClubTopBar from "../../../components/club-admin/ClubTopBar";
import ClubCard, {
  ClubGhostButton,
  ClubPrimaryButton,
  ClubSectionTitle,
} from "../../../components/club-admin/ClubCard";
import { getDefaultClub, playerName, subscriptions } from "../../../lib/club-admin";
import { players } from "../../../lib/data";

export const metadata = { title: "Membres — Club" };

const pendingRequests = [
  { id: "r1", name: "Marie Levasseur", city: "Paris 13", rating: 1320, since: "Il y a 2 jours" },
  { id: "r2", name: "Tom Bouchard", city: "Paris 14", rating: 980, since: "Il y a 4 h" },
];

export default function MembersPage() {
  const club = getDefaultClub();
  const enriched = club.members.map((m) => {
    const p = players.find((p) => p.id === m.playerId);
    const sub = subscriptions.find((s) => s.playerId === m.playerId);
    return { ...m, player: p, sub };
  });

  return (
    <>
      <ClubTopBar
        clubName={club.name}
        clubLogo={club.logo}
        title="Membres"
        subtitle={`${club.members.length} adhérents`}
        right={<ClubPrimaryButton>+ Inviter</ClubPrimaryButton>}
      />

      <section className="px-3 py-3">
        <input
          type="search"
          placeholder="Rechercher un membre…"
          className="w-full px-3 py-2 text-sm"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#f6f1e3",
            fontFamily: "var(--font-ui)",
          }}
        />
      </section>

      {/* ── Pending requests ── */}
      {pendingRequests.length > 0 && (
        <section className="px-3 pb-4">
          <ClubSectionTitle>Demandes d&apos;adhésion</ClubSectionTitle>
          <ul className="space-y-2">
            {pendingRequests.map((r) => (
              <li key={r.id}>
                <ClubCard>
                  <div className="flex items-center gap-3">
                    <div
                      className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        fontFamily: "var(--font-ui)",
                      }}
                    >
                      {initials(r.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-sm font-semibold"
                        style={{ fontFamily: "var(--font-ui)" }}
                      >
                        {r.name}
                      </p>
                      <p
                        className="truncate text-[11px]"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        {r.city} · ELO ~{r.rating} · {r.since}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <ClubPrimaryButton>Accepter</ClubPrimaryButton>
                    <ClubGhostButton>Refuser</ClubGhostButton>
                  </div>
                </ClubCard>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Members list ── */}
      <section className="px-3 pb-8">
        <ClubSectionTitle>Adhérents</ClubSectionTitle>
        <ul className="space-y-2">
          {enriched.map((m) => {
            if (!m.player) return null;
            const subColor =
              m.sub?.status === "active"
                ? "var(--color-gold)"
                : m.sub?.status === "expiring"
                  ? "#ffb86c"
                  : "rgba(255,255,255,0.4)";
            return (
              <li key={m.playerId}>
                <ClubCard>
                  <div className="flex items-center gap-3">
                    <div
                      className="grid h-10 w-10 place-items-center rounded-full text-lg"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      {m.player.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p
                          className="truncate text-sm font-semibold"
                          style={{ fontFamily: "var(--font-ui)" }}
                        >
                          {m.player.fullName}
                        </p>
                        {m.role !== "member" && (
                          <span
                            className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                            style={{
                              background: "var(--color-gold)",
                              color: "var(--color-forest-deep)",
                              fontFamily: "var(--font-ui)",
                            }}
                          >
                            {m.role}
                          </span>
                        )}
                      </div>
                      <p
                        className="truncate text-[11px]"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        ELO {m.player.rating} · {m.clubMatchWins}V — {m.clubMatchLosses}D
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: subColor, fontFamily: "var(--font-ui)" }}
                      >
                        {m.sub?.status === "active"
                          ? "à jour"
                          : m.sub?.status === "expiring"
                            ? "expire"
                            : "à régler"}
                      </p>
                      <p
                        className="text-[10px]"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        {m.sub?.plan ?? "—"}
                      </p>
                    </div>
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

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
