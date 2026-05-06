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
            className="grid h-9 w-9 place-items-center text-lg"
            style={{ border: "var(--border-thin)", background: "var(--color-cream)" }}
          >
            🔔
          </button>
        }
      />
      <FeedList items={activities} />
    </>
  );
}
