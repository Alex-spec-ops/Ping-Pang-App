"use client";

import { useState } from "react";

const PRESET_COLORS = [
  "#2563eb", "#dc2626", "#7c3aed", "#059669",
  "#d97706", "#db2777", "#0891b2", "#374151",
];

const PRESET_EMOJIS = ["🏓", "🦁", "🦊", "🦅", "🐉", "🐺", "🦋", "⚡", "🔥", "🌟", "🏆", "💎"];

interface Props {
  onClose: () => void;
}

export default function ClubCreateForm({ onClose }: Props) {
  const [name, setName]         = useState("");
  const [desc, setDesc]         = useState("");
  const [logo, setLogo]         = useState("🏓");
  const [color, setColor]       = useState(PRESET_COLORS[0]);
  const [visibility, setVis]    = useState<"public" | "private">("public");
  const [submitted, setSubmit]  = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmit(true);
  }

  if (submitted) {
    return (
      <div className="create-form-overlay" onClick={onClose}>
        <div className="create-form-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="create-success">
            <span className="create-success-logo" style={{ background: color + "22", borderColor: color + "44" }}>
              {logo}
            </span>
            <h2 className="create-success-title">Club créé ! 🎉</h2>
            <p className="create-success-sub">{name} est maintenant en ligne.</p>
            <button type="button" className="btn-club-join" style={{ background: color }} onClick={onClose}>
              Voir mon club
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-form-overlay" onClick={onClose}>
      <div className="create-form-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Handle */}
        <div className="create-form-handle" />

        <h2 className="create-form-title">Créer un club</h2>

        <form onSubmit={handleSubmit} className="create-form-body">
          {/* Logo picker */}
          <div className="create-field">
            <label className="create-label">Logo du club</label>
            <div className="emoji-picker">
              {PRESET_EMOJIS.map((e) => (
                <button
                  key={e} type="button"
                  onClick={() => setLogo(e)}
                  className={`emoji-option ${logo === e ? "emoji-option--active" : ""}`}
                  style={logo === e ? { borderColor: color, background: color + "18" } : undefined}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="create-preview" style={{ background: color + "18", borderColor: color + "44" }}>
            <span className="create-preview-logo">{logo}</span>
            <div>
              <p className="create-preview-name" style={{ color }}>{name || "Nom du club"}</p>
              <p className="create-preview-vis">{visibility === "public" ? "🌍 Public" : "🔒 Privé"}</p>
            </div>
          </div>

          {/* Name */}
          <div className="create-field">
            <label className="create-label" htmlFor="club-name">Nom du club *</label>
            <input
              id="club-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Paris Est TT"
              maxLength={40}
              required
              className="create-input"
            />
          </div>

          {/* Description */}
          <div className="create-field">
            <label className="create-label" htmlFor="club-desc">Description</label>
            <textarea
              id="club-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Ambiance, niveau, horaires…"
              maxLength={200}
              rows={3}
              className="create-input create-textarea"
            />
            <p className="create-char-count">{desc.length}/200</p>
          </div>

          {/* Color */}
          <div className="create-field">
            <label className="create-label">Couleur principale</label>
            <div className="color-picker">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c} type="button"
                  onClick={() => setColor(c)}
                  className={`color-swatch ${color === c ? "color-swatch--active" : ""}`}
                  style={{ background: c }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div className="create-field">
            <label className="create-label">Visibilité</label>
            <div className="vis-toggle">
              {(["public", "private"] as const).map((v) => (
                <button
                  key={v} type="button"
                  onClick={() => setVis(v)}
                  className={`vis-option ${visibility === v ? "vis-option--active" : ""}`}
                  style={visibility === v ? { borderColor: color, background: color + "18", color } : undefined}
                >
                  {v === "public" ? "🌍 Public" : "🔒 Privé"}
                </button>
              ))}
            </div>
            <p className="create-hint">
              {visibility === "public"
                ? "Tout le monde peut rejoindre directement."
                : "Seuls les invités peuvent rejoindre."}
            </p>
          </div>

          <button
            type="submit"
            className="btn-club-join create-submit"
            style={{ background: color }}
            disabled={!name.trim()}
          >
            Créer le club
          </button>
        </form>
      </div>
    </div>
  );
}
