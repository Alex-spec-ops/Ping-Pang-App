import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TopBar from "@/components/TopBar";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export const metadata = {
  title: "Mon profil — PingPang",
};

export default async function MyProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: memberships } = await supabase
    .from("club_members")
    .select("role, clubs(id, name, slug, logo, color, type)")
    .eq("player_id", user.id);

  const winRate =
    profile && profile.matches_played > 0
      ? Math.round((profile.matches_won / profile.matches_played) * 100)
      : null;

  return (
    <main className="mx-auto max-w-md pb-24">
      <TopBar
        title="Mon profil"
        subtitle={profile ? `@${profile.username}` : undefined}
      />

      {/* Avatar + stats */}
      <div className="flex flex-col items-center gap-3 px-6 py-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl dark:bg-emerald-900">
          {profile?.avatar ?? "🏓"}
        </div>
        <div className="text-center">
          <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">
            {profile?.full_name ?? profile?.username ?? "—"}
          </p>
          <p className="text-sm text-zinc-500">@{profile?.username}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-zinc-100 border-y border-zinc-100 dark:divide-zinc-800 dark:border-zinc-800">
        <div className="flex flex-col items-center py-4">
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {profile?.rating ?? 1200}
          </p>
          <p className="text-xs text-zinc-500">ELO</p>
        </div>
        <div className="flex flex-col items-center py-4">
          <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">
            {profile?.matches_played ?? 0}
          </p>
          <p className="text-xs text-zinc-500">Matchs</p>
        </div>
        <div className="flex flex-col items-center py-4">
          <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">
            {winRate !== null ? `${winRate}%` : "—"}
          </p>
          <p className="text-xs text-zinc-500">Victoires</p>
        </div>
      </div>

      {/* Clubs */}
      {(memberships ?? []).length > 0 && (
        <section className="px-4 py-4">
          <h2 className="mb-3 font-bold text-zinc-900 dark:text-zinc-100">Mes clubs</h2>
          <div className="flex flex-col gap-2">
            {(memberships ?? []).map((m) => {
              const club = m.clubs as unknown as {
                id: string;
                name: string;
                slug: string;
                logo: string | null;
                color: string;
                type: string;
              } | null;
              if (!club) return null;
              return (
                <Link
                  key={club.id}
                  href={`/club/${club.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-zinc-100 px-4 py-3 transition hover:border-zinc-200 dark:border-zinc-800"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                    style={{ backgroundColor: club.color + "22" }}
                  >
                    {club.logo ?? "🏛️"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                      {club.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {m.role === "admin" ? "Admin" : "Membre"}
                      {" · "}
                      {club.type === "pro" ? "Club Pro" : "Club Loisir"}
                    </p>
                  </div>
                  <span className="text-zinc-400">→</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Actions */}
      <section className="flex flex-col gap-3 px-4 py-4">
        <Link
          href="/club/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-zinc-100 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          🏛️ Créer ou rejoindre un club
        </Link>
        <LogoutButton />
      </section>
    </main>
  );
}
