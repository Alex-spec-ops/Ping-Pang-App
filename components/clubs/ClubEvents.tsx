"use client";

import { useState } from "react";
import type { Club, ClubEvent } from "../../lib/clubs";
import { CURRENT_USER_ID } from "../../lib/data";

interface Props { club: Club; color: string }

const typeInfo: Record<ClubEvent["type"], { emoji: string; label: string; bg: string }> = {
  tournament: { emoji: "🏆", label: "Tournoi", bg: "#f59e0b" },
  training:   { emoji: "🏓", label: "Entraînement", bg: "#10b981" },
  social:     { emoji: "🍻", label: "Événement social", bg: "#8b5cf6" },
  challenge:  { emoji: "⚔️", label: "Défi inter-clubs", bg: "#ef4444" },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long",
  });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function ClubEvents({ club, color }: Props) {
  const [registered, setRegistered] = useState<Set<string>>(
    new Set(
      club.events
        .filter((e) => e.registeredIds.includes(CURRENT_USER_ID))
        .map((e) => e.id)
    )
  );

  function toggle(eventId: string) {
    setRegistered((prev) => {
      const next = new Set(prev);
      next.has(eventId) ? next.delete(eventId) : next.add(eventId);
      return next;
    });
  }

  const sorted = [...club.events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="tab-content">
      <p className="section-label">Calendrier du club</p>
      {sorted.length === 0 ? (
        <p className="empty-state">Aucun événement prévu.</p>
      ) : (
        <ul className="club-events-list">
          {sorted.map((ev) => {
            const info = typeInfo[ev.type];
            const isReg = registered.has(ev.id);
            const spotsLeft = ev.maxParticipants
              ? ev.maxParticipants - ev.registeredIds.length
              : null;

            return (
              <li key={ev.id} className="club-event-card">
                <div
                  className="club-event-type-bar"
                  style={{ background: info.bg }}
                >
                  <span>{info.emoji} {info.label}</span>
                  {spotsLeft !== null && (
                    <span>{spotsLeft} places restantes</span>
                  )}
                </div>
                <div className="club-event-body">
                  <h3 className="club-event-title">{ev.title}</h3>
                  <p className="club-event-desc">{ev.description}</p>
                  <p className="club-event-meta">
                    📅 {fmtDate(ev.date)} à {fmtTime(ev.date)}
                  </p>
                  <p className="club-event-meta">📍 {ev.venue}</p>
                  <button
                    type="button"
                    onClick={() => toggle(ev.id)}
                    className={`club-event-btn ${isReg ? "club-event-btn--reg" : ""}`}
                    style={!isReg ? { background: color } : undefined}
                  >
                    {isReg ? "✅ Inscrit — Annuler" : "S'inscrire"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
