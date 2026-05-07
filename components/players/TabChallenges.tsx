"use client";

import { useEffect, useState } from "react";
import { challenges as initialChallenges, getChallengeCreator, formatScheduledAt, modeLabel } from "../../lib/challenges";
import type { PlayerChallenge, ChallengeMode } from "../../lib/challenges";
import { CURRENT_USER_ID, getPlayer } from "../../lib/data";

const me = getPlayer(CURRENT_USER_ID)!;

export default function TabChallenges() {
  const [allChallenges, setAllChallenges] = useState<PlayerChallenge[]>(initialChallenges);
  const [showCreate, setShowCreate] = useState(false);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());

  const openChallenges = allChallenges.filter((c) => c.status === "open");
  const myChallenges = openChallenges.filter((c) => c.creatorId === CURRENT_USER_ID);
  const othersChallenges = openChallenges.filter((c) => c.creatorId !== CURRENT_USER_ID);

  function handleCreate(challenge: PlayerChallenge) {
    setAllChallenges((prev) => [challenge, ...prev]);
    setShowCreate(false);
  }

  function handleJoin(id: string) {
    setJoinedIds((prev) => new Set(prev).add(id));
  }

  function handleCancel(id: string) {
    setAllChallenges((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="ch-tab-wrap">
      {/* ── Créer un défi ── */}
      <div className="ch-create-banner">
        <div className="ch-create-banner-text">
          <span className="ch-create-banner-title">Lance un défi public</span>
          <span className="ch-create-banner-sub">Visible par tous les joueurs de l'app</span>
        </div>
        <button type="button" className="btn-ch-create" onClick={() => setShowCreate(true)}>
          + Créer
        </button>
      </div>

      {/* ── Mes défis ouverts ── */}
      {myChallenges.length > 0 && (
        <section className="ch-section">
          <h2 className="ch-section-title">📢 Mes défis en attente</h2>
          <ul className="ch-list">
            {myChallenges.map((c) => (
              <MyChallengeCard key={c.id} challenge={c} onCancel={handleCancel} />
            ))}
          </ul>
        </section>
      )}

      {/* ── Défis des autres ── */}
      <section className="ch-section">
        <h2 className="ch-section-title">🌍 Défis disponibles ({othersChallenges.length})</h2>
        {othersChallenges.length === 0 ? (
          <p className="ch-empty">Aucun défi ouvert. Sois le premier à en créer un !</p>
        ) : (
          <ul className="ch-list">
            {othersChallenges.map((c) => (
              <PublicChallengeCard
                key={c.id}
                challenge={c}
                joined={joinedIds.has(c.id)}
                onJoin={() => handleJoin(c.id)}
              />
            ))}
          </ul>
        )}
      </section>

      {/* ── Formulaire de création ── */}
      {showCreate && (
        <CreateChallengeSheet onCreate={handleCreate} onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}

/* ── Mon défi ouvert ── */
function MyChallengeCard({
  challenge: c,
  onCancel,
}: {
  challenge: PlayerChallenge;
  onCancel: (id: string) => void;
}) {
  return (
    <li className="ch-card ch-card--mine">
      <div className="ch-card-top">
        <span className="ch-creator-avatar">{me.avatar}</span>
        <div className="ch-creator-info">
          <span className="ch-creator-name">Mon défi</span>
          <span className="ch-creator-meta">{modeLabel(c.mode)} · {c.format}</span>
        </div>
        <span className="ch-open-pill">Ouvert</span>
      </div>
      {c.message && <p className="ch-message">"{c.message}"</p>}
      <div className="ch-meta-row">
        {c.venue && <span className="ch-meta-item">📍 {c.venue}</span>}
        {c.scheduledAt && <span className="ch-meta-item">🗓 {formatScheduledAt(c.scheduledAt)}</span>}
      </div>
      <button type="button" className="btn-ch-cancel" onClick={() => onCancel(c.id)}>
        Annuler le défi
      </button>
    </li>
  );
}

/* ── Défi public d'un autre joueur ── */
function PublicChallengeCard({
  challenge: c,
  joined,
  onJoin,
}: {
  challenge: PlayerChallenge;
  joined: boolean;
  onJoin: () => void;
}) {
  const creator = getChallengeCreator(c);

  return (
    <li className="ch-card ch-card--open">
      <div className="ch-card-top">
        <span className="ch-creator-avatar">{creator?.avatar ?? "🏓"}</span>
        <div className="ch-creator-info">
          <span className="ch-creator-name">{creator?.fullName ?? "Joueur"}</span>
          <span className="ch-creator-meta">@{creator?.username} · {creator?.rating} ELO</span>
        </div>
        <span className={`ch-mode-badge ch-mode-badge--${c.mode}`}>{modeLabel(c.mode)}</span>
      </div>
      {c.message && <p className="ch-message">"{c.message}"</p>}
      <div className="ch-meta-row">
        <span className="ch-meta-item">📋 {c.format}</span>
        {c.venue && <span className="ch-meta-item">📍 {c.venue}</span>}
        {c.scheduledAt && <span className="ch-meta-item">🗓 {formatScheduledAt(c.scheduledAt)}</span>}
      </div>
      <button
        type="button"
        className={joined ? "btn-ch-joined" : "btn-ch-join"}
        onClick={onJoin}
        disabled={joined}
      >
        {joined ? "✅ Défi rejoint !" : "Rejoindre ce défi"}
      </button>
    </li>
  );
}

/* ── Formulaire de création ── */
function CreateChallengeSheet({
  onCreate,
  onClose,
}: {
  onCreate: (c: PlayerChallenge) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<ChallengeMode>("ranked");
  const [format, setFormat] = useState<"BO3" | "BO5" | "BO7">("BO5");
  const [message, setMessage] = useState("");
  const [venue, setVenue] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newChallenge: PlayerChallenge = {
      id: `pch_new_${Date.now()}`,
      creatorId: CURRENT_USER_ID,
      status: "open",
      mode,
      format,
      message: message.trim() || undefined,
      venue: venue.trim() || undefined,
      scheduledAt: scheduledAt || undefined,
      createdAt: new Date().toISOString(),
    };
    onCreate(newChallenge);
  }

  return (
    <div className="ch-sheet-backdrop" onClick={onClose}>
      <div className="ch-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="ch-sheet-handle" aria-hidden="true" />
        <div className="ch-sheet-header">
          <h2 className="ch-sheet-title">Créer un défi</h2>
          <button type="button" className="ch-sheet-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="ch-sheet-form">
          {/* Mode */}
          <div className="ch-form-field">
            <label className="ch-form-label">Type de partie</label>
            <div className="ch-toggle">
              {(["ranked", "casual"] as ChallengeMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`ch-toggle-btn ${mode === m ? "ch-toggle-btn--active" : ""}`}
                  onClick={() => setMode(m)}
                >
                  {m === "ranked" ? "⚔️ Classée" : "🏓 Amicale"}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="ch-form-field">
            <label className="ch-form-label">Format</label>
            <div className="ch-format-picker">
              {(["BO3", "BO5", "BO7"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`ch-format-btn ${format === f ? "ch-format-btn--active" : ""}`}
                  onClick={() => setFormat(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Lieu */}
          <div className="ch-form-field">
            <label className="ch-form-label" htmlFor="ch-venue">Lieu (facultatif)</label>
            <input
              id="ch-venue"
              type="text"
              className="ch-form-input"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Ex: Paris 13 TT, salle communale…"
              maxLength={60}
            />
          </div>

          {/* Date */}
          <div className="ch-form-field">
            <label className="ch-form-label" htmlFor="ch-date">Date & heure (facultatif)</label>
            <input
              id="ch-date"
              type="datetime-local"
              className="ch-form-input"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

          {/* Message */}
          <div className="ch-form-field">
            <label className="ch-form-label" htmlFor="ch-msg">Message (facultatif)</label>
            <textarea
              id="ch-msg"
              className="ch-form-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={120}
              rows={3}
              placeholder="Niveau souhaité, ambiance, consignes…"
            />
            <span className="ch-form-hint">{message.length}/120</span>
          </div>

          <div className="ch-sheet-actions">
            <button type="button" className="btn-ch-sheet-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-ch-sheet-submit">🚀 Lancer le défi</button>
          </div>
        </form>
      </div>
    </div>
  );
}
