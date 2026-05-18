import Link from "next/link";
import ClubTopBar from "../../../components/club-admin/ClubTopBar";
import ClubKpi from "../../../components/club-admin/ClubKpi";
import { getDefaultClub } from "../../../lib/club-admin";
import { getAllTerritories, getVenueLeaderboard } from "../../../lib/territory";
import { venues } from "../../../lib/venues";

export const metadata = { title: "Territoire — Club" };

export default function TerritoryPage() {
  const club = getDefaultClub();
  const territories = getAllTerritories();

  // Venues owned by this club
  const ownedVenueIds = [...territories.entries()]
    .filter(([, owner]) => owner.id === club.id)
    .map(([venueId]) => venueId);

  const ownedVenues = ownedVenueIds
    .map((id) => {
      const venue = venues.find((v) => v.id === id);
      if (!venue) return null;
      const lb = getVenueLeaderboard(id);
      const entry = lb[0];
      const challenger = lb[1] ?? null;
      return { venue, wins: entry?.wins ?? 0, challenger };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.wins - a.wins);

  // Venues where the club is in the leaderboard but doesn't own
  const contestedVenues = [...territories.entries()]
    .filter(([, owner]) => owner.id !== club.id)
    .map(([venueId]) => {
      const lb = getVenueLeaderboard(venueId);
      const clubEntry = lb.find((e) => e.clubId === club.id);
      if (!clubEntry) return null;
      const venue = venues.find((v) => v.id === venueId);
      if (!venue) return null;
      const owner = lb[0];
      const rank = lb.findIndex((e) => e.clubId === club.id) + 1;
      return { venue, clubEntry, owner, rank };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => a.rank - b.rank);

  return (
    <>
      <ClubTopBar
        clubName={club.name}
        clubLogo={club.logo}
        title="Territoire"
        subtitle="Tables sous contrôle"
      />

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-2 px-3 py-3">
        <ClubKpi
          label="Tables possédées"
          value={String(ownedVenues.length)}
          hint="Victoires cumulées"
          accent="gold"
        />
        <ClubKpi
          label="Tables contestées"
          value={String(contestedVenues.length)}
          hint="En bonne position"
          accent="green"
        />
      </section>

      {/* Owned venues */}
      <section className="px-3 pb-4">
        <h2
          className="mb-2 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--color-gold)", fontFamily: "var(--font-ui)" }}
        >
          👑 Tables possédées
        </h2>

        {ownedVenues.length === 0 ? (
          <p
            className="px-3 py-4 text-sm"
            style={{
              color: "rgba(255,255,255,0.6)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Aucune table possédée pour l'instant. Allez jouer et accumulez des victoires !
          </p>
        ) : (
          <ul className="space-y-2">
            {ownedVenues.map(({ venue, wins, challenger }) => (
              <li
                key={venue.id}
                className="flex items-center gap-3 p-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${club.color}55`,
                }}
              >
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center text-xl"
                  style={{ background: club.color + "33", border: `1.5px solid ${club.color}` }}
                >
                  {venue.surface === "outdoor" ? "🌳" : venue.type === "bar" ? "🍹" : "🏓"}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-semibold"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    {venue.name}
                  </p>
                  <p
                    className="text-[11px]"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {wins} victoire{wins > 1 ? "s" : ""} · {venue.arrondissement}e arr.
                    {challenger
                      ? ` · Challenger : ${challenger.club.shortName} (${challenger.wins}V)`
                      : ""}
                  </p>
                </div>
                <span
                  className="text-base"
                  style={{ color: "var(--color-gold)" }}
                >
                  👑
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Contested venues */}
      {contestedVenues.length > 0 && (
        <section className="px-3 pb-8">
          <h2
            className="mb-2 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--color-gold)", fontFamily: "var(--font-ui)" }}
          >
            ⚔️ Tables à conquérir
          </h2>
          <ul className="space-y-2">
            {contestedVenues.map(({ venue, clubEntry, owner, rank }) => (
              <li
                key={venue.id}
                className="flex items-center gap-3 p-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center text-xs font-bold"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.7)",
                    fontFamily: "var(--font-ui)",
                  }}
                >
                  #{rank}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-semibold"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    {venue.name}
                  </p>
                  <p
                    className="text-[11px]"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {clubEntry.wins}V · Leader : {owner.club.logo} {owner.club.shortName} ({owner.wins}V) ·{" "}
                    <span style={{ color: "#f87171" }}>
                      -{owner.wins - clubEntry.wins}V à rattraper
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Explanation */}
      <section className="px-3 pb-8">
        <div
          className="p-3"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p
            className="text-[11px] leading-relaxed"
            style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-ui)" }}
          >
            <strong style={{ color: "var(--color-gold)" }}>Comment ça marche ?</strong>
            {" "}Chaque victoire d'un membre de ton club sur une table lui rapporte 1 point. Le club avec le plus de points possède la table. Les victoires de tous tes membres s'additionnent — envoie tout le monde jouer !
          </p>
        </div>
      </section>
    </>
  );
}
