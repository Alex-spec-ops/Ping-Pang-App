import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/TopBar";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  return { title: `Club — PingPang` };
}

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: club } = await supabase
    .from("clubs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!club) notFound();

  const { data: members } = await supabase
    .from("club_members")
    .select("player_id, role, joined_at, profiles(id, username, full_name, avatar, rating)")
    .eq("club_id", club.id)
    .order("joined_at", { ascending: true });

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("club_id", club.id)
    .order("date", { ascending: true })
    .limit(3);

  const isAdmin = members?.some(
    (m) => m.player_id === user?.id && m.role === "admin"
  );
  const isMember = members?.some((m) => m.player_id === user?.id);

  const upcomingEvents = (events ?? []).filter(
    (e) => new Date(e.date) >= new Date()
  );

  return (
    <main className="mx-auto max-w-md pb-24">
      <TopBar
        title={club.name}
        subtitle={club.type === "pro" ? "Club Pro" : "Club Loisir"}
        right={
          isAdmin ? (
            <Link
              href={`/club/${slug}/edit`}
              className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              Modifier
            </Link>
          ) : undefined
        }
      />

      {/* Hero */}
      <div
        className="relative flex flex-col items-center gap-3 px-6 py-8"
        style={{ backgroundColor: club.color + "15" }}
      >
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl shadow-sm"
          style={{ backgroundColor: club.color + "25" }}
        >
          {club.logo ?? "🏛️"}
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {club.name}
            </h1>
            {club.type === "pro" && (
              <span className="rounded-full bg-blue-500 px-2.5 py-0.5 text-xs font-bold text-white">
                PRO
              </span>
            )}
          </div>
          {club.city && (
            <p className="mt-0.5 text-sm text-zinc-500">📍 {club.city}</p>
          )}
        </div>

        {club.description && (
          <p className="max-w-xs text-center text-sm text-zinc-600 dark:text-zinc-400">
            {club.description}
          </p>
        )}

        {club.website && (
          <a
            href={club.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 underline"
          >
            {club.website.replace(/^https?:\/\//, "")}
          </a>
        )}

        {!isMember && user && (
          <form action={`/api/club/${club.id}/join`} method="POST">
            <button
              type="submit"
              className="mt-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition"
              style={{ backgroundColor: club.color }}
            >
              Rejoindre ce club
            </button>
          </form>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-zinc-100 border-y border-zinc-100 dark:divide-zinc-800 dark:border-zinc-800">
        <div className="flex flex-col items-center py-4">
          <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">
            {members?.length ?? 0}
          </p>
          <p className="text-xs text-zinc-500">Membres</p>
        </div>
        <div className="flex flex-col items-center py-4">
          <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">
            {upcomingEvents.length}
          </p>
          <p className="text-xs text-zinc-500">Événements</p>
        </div>
        <div className="flex flex-col items-center py-4">
          <p className="text-xl font-black" style={{ color: club.color }}>
            {members && members.length > 0
              ? Math.round(
                  (members as unknown as Array<{ profiles: { rating: number } | null }>)
                    .reduce((sum, m) => sum + (m.profiles?.rating ?? 0), 0) / members.length
                )
              : "—"}
          </p>
          <p className="text-xs text-zinc-500">ELO moy.</p>
        </div>
      </div>

      {/* Événements à venir */}
      <section className="px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-zinc-900 dark:text-zinc-100">Événements</h2>
          <Link
            href={`/club/${slug}/events`}
            className="text-xs text-emerald-600 dark:text-emerald-400"
          >
            Voir tout →
          </Link>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-6 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-500">Aucun événement à venir</p>
            {isAdmin && (
              <Link
                href={`/club/${slug}/events/new`}
                className="mt-3 inline-block rounded-xl bg-emerald-500 px-5 py-2 text-xs font-semibold text-white"
              >
                Créer un événement
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {upcomingEvents.map((event) => {
              const d = new Date(event.date);
              return (
                <Link
                  key={event.id}
                  href={`/club/${slug}/events`}
                  className="flex items-center gap-4 rounded-xl border border-zinc-100 px-4 py-3 transition hover:border-zinc-200 dark:border-zinc-800"
                >
                  <div className="flex flex-col items-center rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                    <span className="text-xs font-medium uppercase text-zinc-500">
                      {d.toLocaleDateString("fr-FR", { month: "short" })}
                    </span>
                    <span className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                      {d.getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                      {event.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {event.type === "tournament"
                        ? "🏆 Tournoi"
                        : event.type === "training"
                          ? "🎯 Entraînement"
                          : "🏓 Match amical"}
                      {event.location ? ` · ${event.location}` : ""}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Membres */}
      <section className="px-4 py-4">
        <h2 className="mb-3 font-bold text-zinc-900 dark:text-zinc-100">Membres</h2>
        <div className="flex flex-col gap-1">
          {(members ?? []).map((m) => {
            const p = m.profiles as unknown as { id: string; username: string; full_name: string | null; avatar: string | null; rating: number } | null;
            if (!p) return null;
            return (
              <Link
                key={m.player_id}
                href={`/u/${p.username}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-lg dark:bg-emerald-900">
                  {p.avatar ?? "🏓"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {p.full_name ?? p.username}
                  </p>
                  <p className="text-xs text-zinc-500">@{p.username}</p>
                </div>
                <div className="flex items-center gap-2">
                  {m.role === "admin" && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                      Admin
                    </span>
                  )}
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {p.rating}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
