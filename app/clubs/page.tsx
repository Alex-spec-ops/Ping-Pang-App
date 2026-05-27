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
    <main className="mx-auto max-w-md pb-24 bg-[#F9F9FF] min-h-dvh">
      <TopBar
        title="Clubs"
        subtitle="Classement inter-clubs"
        right={
          <Link
            href="/club/new"
            className="grid h-9 w-9 place-items-center rounded-full text-lg"
            aria-label="Créer un club"
            style={{ background: "#0A241E", color: "#fff" }}
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
            className="flex items-center gap-3 rounded-xl p-3"
            style={{ background: "#fff", border: "1px dashed #E5E7EB" }}
          >
            <span className="text-xl">🏛️</span>
            <p
              className="flex-1 text-xs text-zinc-500"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              Tu n&apos;es membre d&apos;aucun club. Rejoins-en un dans la liste
              ou crée le tien.
            </p>
            <Link
              href="/club/new"
              className="shrink-0 rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider"
              style={{ background: "#0A241E", color: "#fff", fontFamily: "var(--font-ui)" }}
            >
              Créer
            </Link>
          </div>
        </section>
      )}

      <div className="px-4 pt-5">
        <p
          className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#0A241E]"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          Tous les clubs
        </p>
      </div>

      <div className="flex gap-2 px-4 pb-3">
        <Link
          href="/clubs"
          className="rounded-full px-4 py-1.5 text-xs font-semibold"
          style={{ background: "#0A241E", color: "#fff", fontFamily: "var(--font-ui)" }}
        >
          Tous
        </Link>
        <Link
          href="/clubs?type=public"
          className="rounded-full px-4 py-1.5 text-xs font-semibold"
          style={{ border: "1px solid #E5E7EB", color: "#616363", background: "#fff", fontFamily: "var(--font-ui)" }}
        >
          Publics
        </Link>
        <Link
          href="/clubs?type=private"
          className="rounded-full px-4 py-1.5 text-xs font-semibold"
          style={{ border: "1px solid #E5E7EB", color: "#616363", background: "#fff", fontFamily: "var(--font-ui)" }}
        >
          Privés
        </Link>
      </div>

      <ol className="space-y-2 px-4">
        {ranked.map(({ club, stats }, i) => {
          const rank = i + 1;
          const mine = isMember(club, CURRENT_USER_ID);
          return (
            <li key={club.id}>
              <Link
                href={`/club/${club.id}`}
                className="flex items-center gap-4 rounded-xl px-4 py-3 transition-all hover:translate-y-[-2px] hover:shadow-[0px_4px_20px_rgba(10,36,30,0.05)]"
                style={{
                  background: mine ? "rgba(10,36,30,0.04)" : "#fff",
                  border: mine ? "1px solid #BAE0D4" : "1px solid #E5E7EB",
                }}
              >
                <span
                  className="w-8 text-center text-sm font-bold"
                  style={{
                    color: rank <= 3 ? "var(--color-gold)" : "#616363",
                    fontFamily: "var(--font-ui)",
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
                    <p
                      className="truncate font-semibold text-[#0A241E]"
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      {club.name}
                    </p>
                    {mine && (
                      <span
                        className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                        style={{ background: "#0A241E", color: "#fff", fontFamily: "var(--font-ui)" }}
                      >
                        Membre
                      </span>
                    )}
                    {club.visibility === "private" && (
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                        style={{ background: "#F9F9FF", border: "1px solid #E5E7EB", color: "#616363", fontFamily: "var(--font-ui)" }}
                      >
                        Privé
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>
                    {stats.memberCount} membre{stats.memberCount !== 1 ? "s" : ""}
                    {club.city ? ` · ${club.city} ${club.countryFlag}` : ""}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className="text-base font-bold tabular-nums text-[#0A241E]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {stats.winRate}%
                  </p>
                  <p className="text-[10px] text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>
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
