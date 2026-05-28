import Link from "next/link";
import TopBar from "../../components/TopBar";
import Avatar from "../../components/Avatar";
import { getAllConversations } from "../../lib/messages";
import { getPlayer } from "../../lib/data";

export const metadata = {
  title: "Messages — PingPang",
};

function formatTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function MessagesPage() {
  const conversations = getAllConversations();

  return (
    <div className="flex min-h-dvh flex-col bg-[#F9F9FF]">
      <TopBar
        title="Messages"
        right={
          <Link
            href="/feed"
            className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-[#0A241E] transition-transform hover:scale-105 active:scale-95"
            style={{ border: "1px solid #E5E7EB", background: "#F9F9FF" }}
          >
            ←
          </Link>
        }
      />
      <div className="flex-1 px-4 py-4">
        {conversations.length === 0 ? (
          <p className="text-center text-sm text-zinc-500 mt-10" style={{ fontFamily: "var(--font-ui)" }}>
            Aucun message pour le moment.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {conversations.map((conv) => {
              const friend = getPlayer(conv.friendId);
              if (!friend) return null;
              const lastMsg = conv.messages[conv.messages.length - 1];

              return (
                <li key={friend.id}>
                  <Link
                    href={`/messages/${friend.id}`}
                    className="flex items-center gap-4 rounded-xl bg-white p-3 border border-[#E5E7EB] transition-all hover:translate-y-[-2px] hover:shadow-[0px_4px_20px_rgba(10,36,30,0.05)]"
                  >
                    <Avatar emoji={friend.avatar} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <p
                          className="truncate text-sm font-bold text-[#0A241E]"
                          style={{ fontFamily: "var(--font-ui)" }}
                        >
                          {friend.fullName}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-medium" style={{ fontFamily: "var(--font-ui)" }}>
                          {formatTime(lastMsg.sentAt)}
                        </p>
                      </div>
                      <p
                        className="truncate text-xs text-zinc-500"
                        style={{ fontFamily: "var(--font-ui)" }}
                      >
                        {lastMsg.senderId === friend.id ? "" : "Vous : "}{lastMsg.text}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
