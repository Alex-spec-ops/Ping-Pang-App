import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tid: string }> },
) {
  const { tid } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("status, events(club_id, max_participants, clubs(slug))")
    .eq("id", tid)
    .single();

  if (!tournament) {
    return NextResponse.json({ error: "Tournoi introuvable" }, { status: 404 });
  }

  if (tournament.status !== "upcoming") {
    return NextResponse.json({ error: "Inscriptions fermées" }, { status: 409 });
  }

  const event = tournament.events as unknown as {
    club_id: string;
    max_participants: number | null;
    clubs: { slug: string } | null;
  } | null;

  if (event?.max_participants) {
    const { count } = await supabase
      .from("tournament_participants")
      .select("*", { count: "exact", head: true })
      .eq("tournament_id", tid);

    if ((count ?? 0) >= event.max_participants) {
      return NextResponse.json({ error: "Tournoi complet" }, { status: 409 });
    }
  }

  const { error } = await supabase.from("tournament_participants").insert({
    tournament_id: tid,
    player_id: user.id,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Déjà inscrit" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const slug = event?.clubs?.slug;
  const redirectUrl = slug
    ? `/club/${slug}/tournament/${tid}`
    : "/clubs";

  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
