import { redirect } from "next/navigation";

export default async function ClubEventsRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  redirect("/club-dashboard/tournaments");
}
