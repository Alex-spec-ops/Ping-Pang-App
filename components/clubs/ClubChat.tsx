"use client";

import { useState, useRef, useEffect } from "react";
import type { Club, ClubChatMessage } from "../../lib/clubs";
import { players } from "../../lib/data";
import { CURRENT_USER_ID } from "../../lib/data";

interface Props { club: Club; color: string }

export default function ClubChat({ club, color }: Props) {
  const [messages, setMessages] = useState<ClubChatMessage[]>(club.chat);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    const msg: ClubChatMessage = {
      id: `msg${Date.now()}`,
      playerId: CURRENT_USER_ID,
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
    <div className="club-chat-wrap">
      <p className="section-label">Chat du club</p>

      {/* Message list */}
      <div className="club-chat-messages">
        {messages.map((msg) => {
          const player = players.find((p) => p.id === msg.playerId);
          const isMe = msg.playerId === CURRENT_USER_ID;
          return (
            <div key={msg.id} className={`chat-msg ${isMe ? "chat-msg--me" : "chat-msg--them"}`}>
              {!isMe && (
                <span className="chat-avatar">{player?.avatar ?? "👤"}</span>
              )}
              <div className="chat-bubble-wrap">
                {!isMe && (
                  <p className="chat-sender">{player?.username ?? "?"}</p>
                )}
                <div
                  className={`chat-bubble ${isMe ? "chat-bubble--me" : "chat-bubble--them"}`}
                  style={isMe ? { background: color } : undefined}
                >
                  {msg.text}
                </div>
                <p className={`chat-time ${isMe ? "chat-time--me" : ""}`}>{fmtTime(msg.sentAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="club-chat-input-bar">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message au club…"
          className="club-chat-input"
          maxLength={300}
        />
        <button
          type="button"
          onClick={send}
          disabled={!draft.trim()}
          className="club-chat-send"
          style={{ background: color }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
