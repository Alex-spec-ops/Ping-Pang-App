import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/TopBar";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ClubEventsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: club } = await supabase
    .from("clubs")
    .select("id, name, color, type")
    .eq("slug", slug)
    .single();

  if (!club) notFound();

  const { data: membership } = await supabase
    .from("club_members")
    .select("role")
    .eq("club_id", club.id)
    .eq("player_id", user?.id ?? "")
    .single();

  const isAdmin = membership?.role === "admin";

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("club_id", club.id)
    .order("date", { ascending: true });

  const now = new Date();
  const upcoming = (events ?? []).filter((e) => new Date(e.date) >= now);
  const past = (events ?? []).filter((e) => new Date(e.date) < now);

  function EventCard({ event }: { event: NonNullable<typeof events>[number] }) {
    const d = new Date(event.date);
    const isPast = d < now;
    return (
      <div
        className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${
          isPast
            ? "border-zinc-100 opacity-60 dark:border-zinc-800"
            : "border-zinc-100 dark:border-zinc-800"
        }`}
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
            {event.max_participants
              ? ` · ${event.max_participants} places`
              : ""}
          </p>
          {event.description && (
            <p className="mt-0.5 truncate text-xs text-zinc-400">
              {event.description}
            </p>
          )}
        </div>

        <div className="text-right">
          <p className="text-xs text-zinc-500">
            {d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-md pb-24">
      <TopBar
        title="Événements"
        subtitle={club.name}
        right={
          isAdmin ? (
            <Link
              href={`/club/${slug}/events/new`}
              className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white"
            >
              + Créer
            </Link>
          ) : undefined
        }
      />

      <div className="px-4 py-4">
        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-500">
              À venir
            </h2>
            <div className="flex flex-col gap-2">
              {upcoming.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {upcoming.length === 0 && (
          <div className="mb-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-200 py-12 text-center dark:border-zinc-700">
            <span className="text-4xl">📅</span>
            <p className="font-semibold text-zinc-700 dark:text-zinc-300">
              Aucun événement à venir
            </p>
            {isAdmin && (
              <Link
                href={`/club/${slug}/events/new`}
                className="mt-1 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-semibold text-white"
              >
                Créer un événement
              </Link>
            )}
          </div>
        )}

        {/* Past */}
        {past.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-500">
              Passés
            </h2>
            <div className="flex flex-col gap-2">
              {past.reverse().map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
