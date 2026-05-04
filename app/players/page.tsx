import TopBar from "../../components/TopBar";
import PlayersPageClient from "../../components/PlayersPageClient";

export const metadata = {
  title: "Joueurs & Clubs — PingPang",
};

export default function PlayersPage() {
  return (
    <>
      <TopBar title="Classement" subtitle="Joueurs & Clubs" />
      <PlayersPageClient />
    </>
  );
}
