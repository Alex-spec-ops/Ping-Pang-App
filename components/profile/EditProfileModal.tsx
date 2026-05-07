"use client";

import { useEffect, useState } from "react";
import type { Player } from "../../lib/types";

const AVATAR_OPTIONS = [
  "🦊","🐺","🐉","🐯","🦁","🐻","🐼","🦅","🦋","🐬",
  "🦄","🐙","🦈","🐸","🦝","🐨","🐧","🦩","🔥","⚡",
  "🌊","🎯","🏓","🎱","🥊","🧊","🌙","🌟","🎭","🦸",
];

interface Props {
  player: Player;
  onSave: (patch: Pick<Player, "avatar" | "username" | "bio">) => void;
  onClose: () => void;
}

export default function EditProfileModal({ player, onSave, onClose }: Props) {
  const [avatar, setAvatar] = useState(player.avatar);
  const [username, setUsername] = useState(player.username);
  const [bio, setBio] = useState(player.bio ?? "");

  /* Bloque le scroll du body pendant que le modal est ouvert */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ avatar, username, bio });
    onClose();
  }

  return (
    <div className="edit-modal-backdrop" onClick={onClose}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Modifier le profil">

        {/* Poignée de glissement (affordance mobile) */}
        <div className="edit-modal-handle" aria-hidden="true" />

        <div className="edit-modal-header">
          <h2 className="edit-modal-title">Modifier le profil</h2>
          <button type="button" className="edit-modal-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-modal-form">
          {/* Avatar picker */}
          <div className="edit-field">
            <label className="edit-label">Personnage</label>
            <div className="avatar-picker-preview">
              <span className="avatar-picker-current">{avatar}</span>
            </div>
            <div className="avatar-picker-grid">
              {AVATAR_OPTIONS.map((emoji, i) => (
                <button
                  key={i}
                  type="button"
                  className={`avatar-option ${avatar === emoji ? "avatar-option--selected" : ""}`}
                  onClick={() => setAvatar(emoji)}
                  aria-label={`Choisir ${emoji}`}
                  aria-pressed={avatar === emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Surnom */}
          <div className="edit-field">
            <label htmlFor="edit-username" className="edit-label">Surnom</label>
            <div className="edit-input-wrap">
              <span className="edit-input-prefix" aria-hidden="true">@</span>
              <input
                id="edit-username"
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                className="edit-input"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, "_").toLowerCase())}
                maxLength={24}
                placeholder="ton_surnom"
                required
              />
            </div>
            <span className="edit-hint" aria-live="polite">{username.length}/24</span>
          </div>

          {/* Description */}
          <div className="edit-field">
            <label htmlFor="edit-bio" className="edit-label">Description</label>
            <textarea
              id="edit-bio"
              className="edit-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              rows={4}
              placeholder="Dis quelque chose sur toi…"
            />
            <span className="edit-hint" aria-live="polite">{bio.length}/160</span>
          </div>
        </form>

        {/* Actions en bas, toujours visibles au-dessus du clavier */}
        <div className="edit-modal-actions">
          <button type="button" className="btn-edit-cancel" onClick={onClose}>Annuler</button>
          <button type="submit" form="edit-profile-form" className="btn-edit-save" onClick={handleSubmit}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}
