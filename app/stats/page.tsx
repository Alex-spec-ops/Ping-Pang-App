import TopBar from "../../components/TopBar";
import StatsTabs from "../../components/StatsTabs";
import StatsContent from "../../components/StatsContent";
import RankingContent from "../../components/RankingContent";
import { CURRENT_USER_ID, getLeaderboard, getPlayer } from "../../lib/data";

export const metadata = { title: "Stats & Classement — PingPang" };

export default function StatsPage() {
  const me = getPlayer(CURRENT_USER_ID);
  const ranked = getLeaderboard();
  const rank = ranked.findIndex((p) => p.id === CURRENT_USER_ID) + 1;

  return (
    <>
      <TopBar
        title="Stats & Classement"
        subtitle={
          me
            ? `${me.rating} ELO · #${rank} mondial`
            : `${ranked.length} joueurs`
        }
      />
      <StatsTabs stats={<StatsContent />} ranking={<RankingContent />} />
    </>
  );
}
