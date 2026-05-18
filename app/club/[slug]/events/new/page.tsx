import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import NewEventForm from "./NewEventForm";

export const metadata = {
  title: "Créer un événement — PingPang",
};

export default async function NewEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: club } = await supabase
    .from("clubs")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!club) notFound();

  const { data: membership } = await supabase
    .from("club_members")
    .select("role")
    .eq("club_id", club.id)
    .eq("player_id", user.id)
    .single();

  if (membership?.role !== "admin") redirect(`/club/${slug}`);

  return (
    <main className="mx-auto max-w-md pb-24">
      <TopBar title="Créer un événement" subtitle={club.name} />
      <NewEventForm clubId={club.id} clubSlug={slug} userId={user.id} />
    </main>
  );
}
