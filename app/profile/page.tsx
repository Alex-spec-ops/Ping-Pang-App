import TopBar from "../../components/TopBar";
import PlayerProfile from "../../components/PlayerProfile";
import ClubModeSwitch from "../../components/ClubModeSwitch";
import LogoutButton from "./LogoutButton";
import { CURRENT_USER_ID, getPlayer } from "../../lib/data";
import { getUserClubs } from "../../lib/clubs";

export const metadata = {
  title: "Mon profil — PingPang",
};

export default function MyProfilePage() {
  const me = getPlayer(CURRENT_USER_ID);
  const myClubs = getUserClubs(CURRENT_USER_ID);

  return (
    <>
      <TopBar
        title="Mon profil"
        subtitle={me ? `@${me.username}` : undefined}
        right={
          <button
            type="button"
            aria-label="Réglages"
            className="grid h-9 w-9 place-items-center text-lg"
            style={{
              border: "var(--border-thin)",
              background: "var(--color-cream)",
            }}
          >
            ⚙️
          </button>
        }
      />

      {myClubs.length > 0 && (
        <ClubModeSwitch
          clubs={myClubs.map((c) => ({
            id: c.id,
            name: c.name,
            logo: c.logo,
            role: c.members.find((m) => m.playerId === CURRENT_USER_ID)?.role ?? "member",
          }))}
        />
      )}

      <PlayerProfile playerId={CURRENT_USER_ID} />

      <section
        className="px-4 py-6"
        style={{ borderTop: "var(--border-thin)" }}
      >
        <LogoutButton />
      </section>
    </>
  );
}
