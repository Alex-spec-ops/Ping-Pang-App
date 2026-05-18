import { redirect } from "next/navigation";
import { players } from "../../../lib/data";

export default async function UsernameRedirect({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const p = players.find(
    (pl) => pl.username.toLowerCase() === username.toLowerCase(),
  );
  redirect(p ? `/profile/${p.id}` : "/stats");
}
