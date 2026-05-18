import TopBar from "@/components/TopBar";
import Link from "next/link";
import {
  clubs,
  getClubStats,
  getMemberRole,
  getUserClubs,
  isMember,
} from "@/lib/clubs";
import { CURRENT_USER_ID } from "@/lib/data";
import MyClubCard from "@/components/MyClubCard";

export const metadata = {
  title: "Clubs — PingPang",
};

export default function ClubsPage() {
  const ranked = [...clubs]
    .map((c) => ({ club: c, stats: getClubStats(c) }))
    .sort((a, b) => b.stats.winRate - a.stats.winRate);

  const myClubs = getUserClubs(CURRENT_USER_ID);

  // For each of my clubs, build the card-ready info.
  const myClubCards = myClubs.map((club) => {
    const stats = getClubStats(club);
    const rank = ranked.findIndex((r) => r.club.id === club.id) + 1;
    const myMembership = club.members.find((m) => m.playerId === CURRENT_USER_ID);
    const role = getMemberRole(club, CURRENT_USER_ID) ?? "member";
    return {
      id: club.id,
      name: club.name,
      logo: club.logo,
      color: club.color,
      city: club.city,
      countryFlag: club.countryFlag,
      role,
      rank,
      memberCount: stats.memberCount,
      totalMatches: stats.totalMatches,
      winRate: stats.winRate,
      myWins: myMembership?.clubMatchWins ?? 0,
      myLosses: myMembership?.clubMatchLosses ?? 0,
    };
  });

  return (
    <main className="mx-auto max-w-md pb-24">
      <TopBar
        title="Clubs"
        subtitle="Classement inter-clubs"
        right={
          <Link
            href="/club/new"
            className="grid h-9 w-9 place-items-center rounded-full text-lg"
            aria-label="Créer un club"
            style={{ background: "var(--color-forest)", color: "#fff" }}
          >
            +
          </Link>
        }
      />

      {/* My club(s) card */}
      {myClubCards.length > 0 ? (
        myClubCards.map((c) => <MyClubCard key={c.id} club={c} />)
      ) : (
        <section className="px-4 pt-3">
          <div
            className="flex items-center gap-3 p-3"
            style={{
              background: "var(--color-cream)",
              border: "1px dashed var(--color-line)",
            }}
          >
            <span className="text-xl">🏛️</span>
            <p
              className="flex-1 text-xs"
              style={{
                color: "var(--color-muted)",
                fontFamily: "var(--font-ui)",
              }}
            >
              Tu n&apos;es membre d&apos;aucun club. Rejoins-en un dans la liste
              ou crée le tien.
            </p>
            <Link
              href="/club/new"
              className="shrink-0 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: "var(--color-forest)",
                color: "#fff",
                fontFamily: "var(--font-ui)",
              }}
            >
              Créer
            </Link>
          </div>
        </section>
      )}

      <div className="px-4 pt-5">
        <p
          className="mb-2 text-[10px] font-bold uppercase tracking-widest"
          style={{
            color: "var(--color-forest)",
            fontFamily: "var(--font-ui)",
          }}
        >
          Tous les clubs
        </p>
      </div>

      <div className="flex gap-2 px-4 pb-3">
        <Link
          href="/clubs"
          className="rounded-full px-4 py-1.5 text-xs font-semibold"
          style={{ background: "var(--color-ink)", color: "#fff" }}
        >
          Tous
        </Link>
        <Link
          href="/clubs?type=public"
          className="rounded-full px-4 py-1.5 text-xs font-semibold"
          style={{ border: "var(--border-thin)", color: "var(--color-muted)" }}
        >
          Publics
        </Link>
        <Link
          href="/clubs?type=private"
          className="rounded-full px-4 py-1.5 text-xs font-semibold"
          style={{ border: "var(--border-thin)", color: "var(--color-muted)" }}
        >
          Privés
        </Link>
      </div>

      <ol className="divide-y" style={{ borderColor: "var(--color-line)" }}>
        {ranked.map(({ club, stats }, i) => {
          const rank = i + 1;
          const mine = isMember(club, CURRENT_USER_ID);
          return (
            <li key={club.id}>
              <Link
                href={`/club/${club.id}`}
                className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                style={{
                  borderBottom: "var(--border-thin)",
                  background: mine ? "rgba(14,61,46,0.04)" : "transparent",
                }}
              >
                <span
                  className="w-8 text-center text-sm font-bold"
                  style={{
                    color:
                      rank <= 3 ? "var(--color-gold)" : "var(--color-muted)",
                  }}
                >
                  {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
                </span>

                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl"
                  style={{ background: club.color + "22", color: club.color }}
                >
                  {club.logo}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold">{club.name}</p>
                    {mine && (
                      <span
                        className="shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                        style={{
                          background: "var(--color-forest)",
                          color: "#fff",
                          fontFamily: "var(--font-ui)",
                        }}
                      >
                        Membre
                      </span>
                    )}
                    {club.visibility === "private" && (
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                        style={{
                          background: "var(--color-line)",
                          color: "var(--color-muted)",
                        }}
                      >
                        Privé
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                    {stats.memberCount} membre{stats.memberCount !== 1 ? "s" : ""}
                    {club.city ? ` · ${club.city} ${club.countryFlag}` : ""}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className="text-base font-bold tabular-nums"
                    style={{ color: "var(--color-forest)" }}
                  >
                    {stats.winRate}%
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--color-muted)" }}>
                    {stats.totalMatches} matchs
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
