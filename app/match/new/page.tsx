import TopBar from "@/components/TopBar";
import NewMatchForm from "./NewMatchForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewMatchPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar")
    .order("username");

  return (
    <main className="mx-auto max-w-md pb-24">
      <TopBar title="Nouveau match" subtitle="Saisie du résultat" />
      <NewMatchForm profiles={profiles ?? []} />
    </main>
  );
}
