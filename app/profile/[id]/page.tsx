import TopBar from "../../../components/TopBar";
import PlayerProfile from "../../../components/PlayerProfile";
import { getPlayer } from "../../../lib/data";

export default async function PublicProfilePage(
  props: PageProps<"/profile/[id]">,
) {
  const { id } = await props.params;
  const player = getPlayer(id);
  return (
    <>
      <TopBar
        title={player ? player.fullName : "Profil"}
        subtitle={player ? `@${player.username}` : undefined}
      />
      <PlayerProfile playerId={id} />
    </>
  );
}
