import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: clubId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { error } = await supabase.from("club_members").insert({
    club_id: clubId,
    player_id: user.id,
    role: "member",
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Déjà membre" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: club } = await supabase
    .from("clubs")
    .select("slug")
    .eq("id", clubId)
    .single();

  const redirectUrl = club ? `/club/${club.slug}` : "/clubs";
  return NextResponse.redirect(new URL(redirectUrl, _request.url));
}
