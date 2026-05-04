import ProfileScreen from "../../components/profile/ProfileScreen";
import { CURRENT_USER_ID, getPlayer, getMatchesForPlayer } from "../../lib/data";
import {
  getProfileStats,
  getProgressionData,
  getBadges,
  getSubscriptionInfo,
} from "../../lib/profile";

export const metadata = {
  title: "Mon profil — PingPang",
};

export default function MyProfilePage() {
  const player = getPlayer(CURRENT_USER_ID);
  if (!player) return <p className="p-8 text-center text-sm text-zinc-500">Joueur introuvable.</p>;

  const stats = getProfileStats(CURRENT_USER_ID);
  const progression = getProgressionData(CURRENT_USER_ID);
  const badges = getBadges(CURRENT_USER_ID);
  const matches = getMatchesForPlayer(CURRENT_USER_ID);
  const subscription = getSubscriptionInfo(CURRENT_USER_ID);

  return (
    <ProfileScreen
      player={player}
      stats={stats}
      progression={progression}
      badges={badges}
      matches={matches}
      subscription={subscription}
      isOwnProfile={true}
    />
  );
}
