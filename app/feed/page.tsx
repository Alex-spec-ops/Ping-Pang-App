import Link from "next/link";
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
          <div className="flex gap-2">
            <Link
              href="/messages"
              aria-label="Messages"
              className="grid h-9 w-9 place-items-center text-lg transition-transform hover:scale-105 active:scale-95"
              style={{ border: "1px solid #E5E7EB", background: "#F9F9FF", borderRadius: ".75rem" }}
            >
              💬
            </Link>
            <button
              type="button"
              aria-label="Notifications"
              className="grid h-9 w-9 place-items-center text-lg transition-transform hover:scale-105 active:scale-95"
              style={{ border: "1px solid #E5E7EB", background: "#F9F9FF", borderRadius: ".75rem" }}
            >
              🔔
            </button>
          </div>
        }
      />
      <FeedList items={activities} />
    </>
  );
}
