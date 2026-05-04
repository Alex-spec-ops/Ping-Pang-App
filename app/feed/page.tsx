import TopBar from "../../components/TopBar";
import FeedList from "../../components/FeedList";
import { activities } from "../../lib/data";

export const metadata = {
  title: "Feed — PingPang",
};

export default function FeedPage() {
  return (
    <>
      <TopBar
        title="PingPang"
        subtitle="Le réseau des pongistes"
        right={
          <button
            type="button"
            aria-label="Notifications"
            className="grid h-9 w-9 place-items-center rounded-full bg-zinc-100 text-lg dark:bg-zinc-800"
          >
            🔔
          </button>
        }
      />
      <FeedList items={activities} />
    </>
  );
}
