"use client";

import { useState } from "react";
import { challenges, getChallengeCreator, getChallengeOpponent, formatScheduledAt, modeLabel } from "../../lib/challenges";
import type { PlayerChallenge } from "../../lib/challenges";
import { CURRENT_USER_ID, getPlayer } from "../../lib/data";

export default function TabEnCours() {
  // Défis actifs où je suis impliqué
  const activeChallenges = challenges.filter(
    (c) =>
      (c.creatorId === CURRENT_USER_ID || c.opponentId === CURRENT_USER_ID) &&
      c.status === "active",
  );
  // Défis me ciblant en attente d'acceptation
  const pendingForMe = challenges.filter(
    (c) => c.opponentId === CURRENT_USER_ID && c.status === "pending",
  );
  // Défis ouverts (pas les miens) disponibles à rejoindre
  const openToJoin = challenges.filter(
    (c) => c.status === "open" && c.creatorId !== CURRENT_USER_ID,
  );

  return (
    <div className="ch-tab-wrap">
      {/* ── À accepter ── */}
      {pendingForMe.length > 0 && (
        <section className="ch-section">
          <h2 className="ch-section-title">🔔 En attente de ta réponse</h2>
          <ul className="ch-list">
            {pendingForMe.map((c) => (
              <PendingCard key={c.id} challenge={c} />
            ))}
          </ul>
        </section>
      )}

      {/* ── Mes défis actifs ── */}
      <section className="ch-section">
        <h2 className="ch-section-title">⚔️ Mes défis actifs</h2>
        {activeChallenges.length === 0 ? (
          <p className="ch-empty">Aucun défi en cours. Crée-en un dans l'onglet Challenges !</p>
        ) : (
          <ul className="ch-list">
            {activeChallenges.map((c) => (
              <ActiveCard key={c.id} challenge={c} />
            ))}
          </ul>
        )}
      </section>

      {/* ── Rejoindre un défi ── */}
      <section className="ch-section">
        <h2 className="ch-section-title">🎯 Défis ouverts à rejoindre</h2>
        {openToJoin.length === 0 ? (
          <p className="ch-empty">Aucun défi ouvert pour l'instant.</p>
        ) : (
          <ul className="ch-list">
            {openToJoin.map((c) => (
              <OpenCard key={c.id} challenge={c} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/* ── Défi en attente de ma réponse ── */
function PendingCard({ challenge: c }: { challenge: PlayerChallenge }) {
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);
  const creator = getChallengeCreator(c);

  if (declined) return null;

  return (
    <li className="ch-card ch-card--pending">
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

      {accepted ? (
        <div className="ch-accepted-banner">✅ Défi accepté — bonne chance !</div>
      ) : (
        <div className="ch-pending-actions">
          <button type="button" className="btn-ch-decline" onClick={() => setDeclined(true)}>
            Décliner
          </button>
          <button type="button" className="btn-ch-accept" onClick={() => setAccepted(true)}>
            ✅ Accepter
          </button>
        </div>
      )}
    </li>
  );
}

/* ── Défi actif ── */
function ActiveCard({ challenge: c }: { challenge: PlayerChallenge }) {
  const creator = getChallengeCreator(c);
  const opponent = getChallengeOpponent(c);
  const me = getPlayer(CURRENT_USER_ID);
  const other = c.creatorId === CURRENT_USER_ID ? opponent : creator;

  return (
    <li className="ch-card ch-card--active">
      <div className="ch-card-top">
        <div className="ch-vs-row">
          <span className="ch-vs-avatar">{me?.avatar ?? "🏓"}</span>
          <span className="ch-vs-text">VS</span>
          <span className="ch-vs-avatar">{other?.avatar ?? "🏓"}</span>
        </div>
        <div className="ch-creator-info">
          <span className="ch-creator-name">{me?.username} vs {other?.username}</span>
          <span className="ch-creator-meta">Défi {modeLabel(c.mode)} · {c.format}</span>
        </div>
        <span className="ch-status-dot ch-status-dot--active" />
      </div>

      {c.message && <p className="ch-message">"{c.message}"</p>}

      <div className="ch-meta-row">
        {c.venue && <span className="ch-meta-item">📍 {c.venue}</span>}
        {c.scheduledAt && <span className="ch-meta-item">🗓 {formatScheduledAt(c.scheduledAt)}</span>}
      </div>

      <div className="ch-active-badge">En cours</div>
    </li>
  );
}

/* ── Défi ouvert ── */
function OpenCard({ challenge: c }: { challenge: PlayerChallenge }) {
  const [joined, setJoined] = useState(false);
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
        onClick={() => !joined && setJoined(true)}
        disabled={joined}
      >
        {joined ? "✅ Défi rejoint !" : "Rejoindre ce défi"}
      </button>
    </li>
  );
}
