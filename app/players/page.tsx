import TopBar from "../../components/TopBar";
import PlayersPageClient from "../../components/PlayersPageClient";

export const metadata = {
  title: "Communauté — PingPang",
};

export default function PlayersPage() {
  return (
    <>
      <TopBar title="Communauté" subtitle="Défis & Clubs" />
      <PlayersPageClient />
    </>
  );
}
