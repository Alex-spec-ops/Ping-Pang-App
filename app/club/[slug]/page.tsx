import { redirect } from "next/navigation";
import { clubs } from "../../../lib/clubs";

export default async function ClubSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const club =
    clubs.find((c) => c.id === slug) ||
    clubs.find((c) => c.shortName.toLowerCase() === slug.toLowerCase()) ||
    clubs.find((c) => c.name.toLowerCase().replace(/\s+/g, "-") === slug);
  redirect(club ? `/clubs/${club.id}` : "/clubs");
}
