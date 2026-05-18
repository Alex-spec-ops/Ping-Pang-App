import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/TopBar";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ slug: string; tid: string }>;
}) {
  const { slug, tid } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("*, events(id, name, date, location, club_id, max_participants, clubs(name, slug, color))")
    .eq("id", tid)
    .single();

  if (!tournament) notFound();

  const event = tournament.events as unknown as {
    id: string;
    name: string;
    date: string;
    location: string | null;
    club_id: string;
    max_participants: number | null;
    clubs: { name: string; slug: string; color: string } | null;
  } | null;

  if (!event?.clubs || event.clubs.slug !== slug) notFound();

  const { data: participants } = await supabase
    .from("tournament_participants")
    .select("player_id, seed, profiles(id, username, full_name, avatar, rating)")
    .eq("tournament_id", tid)
    .order("seed", { ascending: true, nullsFirst: false });

  const isRegistered = participants?.some((p) => p.player_id === user?.id);
  const maxP = event.max_participants ?? 32;
  const isFull = (participants?.length ?? 0) >= maxP;
  const isUpcoming = tournament.status === "upcoming";

  const eventDate = new Date(event.date);

  const formatLabel: Record<string, string> = {
    round_robin: "Toutes rondes",
    single_elimination: "Élimination directe",
    double_elimination: "Double élimination",
  };

  const statusLabel: Record<string, { label: string; color: string }> = {
    upcoming: { label: "Inscriptions ouvertes", color: "text-emerald-600" },
    ongoing: { label: "En cours", color: "text-amber-500" },
    completed: { label: "Terminé", color: "text-zinc-400" },
  };

  const st = statusLabel[tournament.status] ?? { label: tournament.status, color: "text-zinc-500" };

  return (
    <main className="mx-auto max-w-md pb-24">
      <TopBar
        title="Tournoi"
        subtitle={event.clubs?.name}
      />

      {/* Header tournoi */}
      <div
        className="px-6 py-6"
        style={{ backgroundColor: (event.clubs?.color ?? "#10b981") + "15" }}
      >
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{event.name}</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {eventDate.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          {" à "}
          {eventDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
        </p>
        {event.location && (
          <p className="mt-0.5 text-sm text-zinc-500">📍 {event.location}</p>
        )}

        <div className="mt-3 flex items-center gap-3">
          <span className={`text-sm font-semibold ${st.color}`}>● {st.label}</span>
          <span className="text-sm text-zinc-400">·</span>
          <span className="text-sm text-zinc-500">{formatLabel[tournament.format]}</span>
        </div>
      </div>

      {/* Stats inscription */}
      <div className="grid grid-cols-2 divide-x divide-zinc-100 border-y border-zinc-100 dark:divide-zinc-800 dark:border-zinc-800">
        <div className="flex flex-col items-center py-4">
          <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">
            {participants?.length ?? 0}
          </p>
          <p className="text-xs text-zinc-500">Inscrits</p>
        </div>
        <div className="flex flex-col items-center py-4">
          <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">{maxP}</p>
          <p className="text-xs text-zinc-500">Places max</p>
        </div>
      </div>

      {/* Bouton inscription */}
      {user && isUpcoming && (
        <div className="px-6 py-4">
          {isRegistered ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm font-semibold text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              ✓ Tu es inscrit à ce tournoi
            </div>
          ) : isFull ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-zinc-100 py-3 text-sm font-semibold text-zinc-500 dark:bg-zinc-800">
              Complet — liste d&apos;attente bientôt
            </div>
          ) : (
            <form action={`/api/tournament/${tid}/join`} method="POST">
              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                S&apos;inscrire au tournoi
              </button>
            </form>
          )}
        </div>
      )}

      {/* Liste participants */}
      <section className="px-4 py-4">
        <h2 className="mb-3 font-bold text-zinc-900 dark:text-zinc-100">
          Participants ({participants?.length ?? 0})
        </h2>

        {(participants ?? []).length === 0 ? (
          <p className="text-center text-sm text-zinc-500 py-6">
            Aucun inscrit pour l&apos;instant — sois le premier !
          </p>
        ) : (
          <ol className="flex flex-col gap-1">
            {(participants ?? []).map((p, i) => {
              const profile = p.profiles as unknown as {
                id: string;
                username: string;
                full_name: string | null;
                avatar: string | null;
                rating: number;
              } | null;
              if (!profile) return null;
              return (
                <li key={p.player_id}>
                  <Link
                    href={`/u/${profile.username}`}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  >
                    <span className="w-5 text-center text-sm text-zinc-400">
                      {i + 1}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-lg dark:bg-emerald-900">
                      {profile.avatar ?? "🏓"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {profile.full_name ?? profile.username}
                      </p>
                      <p className="text-xs text-zinc-500">@{profile.username}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {profile.rating}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {tournament.status === "completed" && (
        <section className="mx-4 mt-2 rounded-2xl bg-amber-50 p-4 text-center dark:bg-amber-950">
          <p className="text-2xl">🏆</p>
          <p className="mt-1 font-semibold text-amber-700 dark:text-amber-300">
            Tournoi terminé
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Les résultats seront disponibles prochainement
          </p>
        </section>
      )}
    </main>
  );
}
