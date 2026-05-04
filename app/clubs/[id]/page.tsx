import { notFound } from "next/navigation";
import { getClub } from "../../../lib/clubs";
import ClubPage from "../../../components/clubs/ClubPage";

export function generateStaticParams() {
  return [
    { id: "c1" }, { id: "c2" }, { id: "c3" }, { id: "c4" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const club = getClub(id);
  return { title: club ? `${club.name} — PingPang` : "Club — PingPang" };
}

export default async function ClubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const club = getClub(id);
  if (!club) notFound();
  return <ClubPage club={club} />;
}
