"use client";

import { useState, useRef, useEffect } from "react";
import type { Player } from "../../lib/types";
import type { Conversation, DirectMessage } from "../../lib/messages";
import { CURRENT_USER_ID } from "../../lib/data";

interface Props {
  friend: Player;
  initialConversation: Conversation;
}

export default function DirectChatClient({ friend, initialConversation }: Props) {
  const [messages, setMessages] = useState<DirectMessage[]>(initialConversation.messages);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    const msg: DirectMessage = {
      id: `msg${Date.now()}`,
      senderId: CURRENT_USER_ID,
      receiverId: friend.id,
      text,
      sentAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setDraft("");
  }

  function fmtTime(iso: string) {
    return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4 pb-2">
        {messages.map((msg) => {
          const isMe = msg.senderId === CURRENT_USER_ID;
          return (
            <div key={msg.id} className={`flex gap-2 items-end max-w-[85%] ${isMe ? "self-end flex-row-reverse" : "self-start"}`}>
              {!isMe && (
                <span className="text-xl shrink-0">{friend.avatar}</span>
              )}
              <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div
                  className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    isMe 
                      ? "bg-[#0A241E] text-white rounded-br-sm" 
                      : "bg-white text-[#0A241E] border border-[#E5E7EB] rounded-bl-sm"
                  }`}
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {msg.text}
                </div>
                <p className="text-[10px] text-zinc-400 mt-1 px-1" style={{ fontFamily: "var(--font-ui)" }}>
                  {fmtTime(msg.sentAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 border-t border-[#E5E7EB] bg-white flex items-end gap-2 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Votre message..."
          className="flex-1 bg-[#F9F9FF] border border-[#E5E7EB] rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#0A241E] transition-colors"
          style={{ fontFamily: "var(--font-ui)" }}
          maxLength={300}
        />
        <button
          type="button"
          onClick={send}
          disabled={!draft.trim()}
          className="shrink-0 h-10 w-10 bg-[#0A241E] text-white rounded-full flex items-center justify-center font-bold text-lg disabled:opacity-50 transition-opacity"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
