import { redirect } from "next/navigation";

export default async function ClubEditRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  redirect(`/club-dashboard/settings`);
}
