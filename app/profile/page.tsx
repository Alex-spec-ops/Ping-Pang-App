import TopBar from "../../components/TopBar";
import PlayerProfile from "../../components/PlayerProfile";
import { CURRENT_USER_ID, getPlayer } from "../../lib/data";

export const metadata = {
  title: "Mon profil — PingPang",
};

export default function MyProfilePage() {
  const me = getPlayer(CURRENT_USER_ID);
  return (
    <>
      <TopBar
        title="Mon profil"
        subtitle={me ? `@${me.username}` : undefined}
        right={
          <button
            type="button"
            aria-label="Réglages"
            className="grid h-9 w-9 place-items-center rounded-full bg-zinc-100 text-lg dark:bg-zinc-800"
          >
            ⚙️
          </button>
        }
      />
      <PlayerProfile playerId={CURRENT_USER_ID} />
    </>
  );
}
