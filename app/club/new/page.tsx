import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TopBar from "@/components/TopBar";
import NewClubForm from "./NewClubForm";

export const metadata = {
  title: "Créer un club — PingPang",
};

export default async function NewClubPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="mx-auto max-w-md pb-24">
      <TopBar title="Créer un club" />
      <NewClubForm userId={user.id} />
    </main>
  );
}
