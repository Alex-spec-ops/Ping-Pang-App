import Link from "next/link";
import { notFound } from "next/navigation";
import { getClub } from "../../../lib/clubs";
import ClubPage from "../../../components/clubs/ClubPage";
import TopBar from "../../../components/TopBar";

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
  return (
    <>
      <TopBar
        title={club.name}
        subtitle={`${club.countryFlag} ${club.city}`}
        right={
          <Link
            href="/clubs"
            className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-[#0A241E]"
            style={{ border: "1px solid #E5E7EB", background: "#F9F9FF" }}
          >
            ←
          </Link>
        }
      />
      <ClubPage club={club} />
    </>
  );
}
