import { notFound } from "next/navigation";
import Link from "next/link";
import TopBar from "../../../components/TopBar";
import Avatar from "../../../components/Avatar";
import DirectChatClient from "../../../components/messages/DirectChatClient";
import { getPlayer } from "../../../lib/data";
import { getConversation } from "../../../lib/messages";

export function generateStaticParams() {
  return [
    { id: "p1" }, { id: "p2" }, { id: "p6" }, { id: "p7" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const friend = getPlayer(id);
  return { title: friend ? `Chat avec ${friend.fullName} — PingPang` : "Chat — PingPang" };
}

export default async function DirectChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const friend = getPlayer(id);

  if (!friend) {
    notFound();
  }

  const initialConversation = getConversation(friend.id) ?? { friendId: friend.id, messages: [] };

  return (
    <div className="flex flex-col h-dvh bg-[#F9F9FF]">
      <TopBar
        title={friend.fullName}
        subtitle="En ligne"
        right={
          <Link
            href="/messages"
            className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-[#0A241E] transition-transform hover:scale-105 active:scale-95"
            style={{ border: "1px solid #E5E7EB", background: "#F9F9FF" }}
          >
            ←
          </Link>
        }
      />
      
      {/* Profil rapide en haut */}
      <div className="flex justify-center pt-4 pb-2 border-b border-[#E5E7EB] bg-white">
        <div className="flex flex-col items-center gap-2">
          <Avatar emoji={friend.avatar} size="lg" />
          <p className="text-xs font-semibold text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
            @{friend.username}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <DirectChatClient friend={friend} initialConversation={initialConversation} />
      </div>
    </div>
  );
}
