"use client";

import { useState } from "react";

/* ── Types ─────────────────────────────────────────────────────── */

type Mode = "amical" | "classé";
type Format = "rapide" | "normal" | "tournoi";
type SetScore = { p1: number; p2: number };

type Step =
  | { kind: "idle" }
  | { kind: "mode" }
  | { kind: "choice"; mode: Mode }
  | { kind: "classé-format" }
  | { kind: "code-display"; mode: Mode; format?: Format; code: string }
  | { kind: "code-join"; mode: Mode }
  | { kind: "playing"; mode: Mode; format?: Format; code: string };

/* ── Helpers ───────────────────────────────────────────────────── */

function genCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function setsToWin(format?: Format): number {
  if (format === "rapide") return 2;
  if (format === "tournoi") return 4;
  return 3; // normal + amical
}

function formatLabel(f: Format) {
  if (f === "rapide") return "Match Rapide";
  if (f === "tournoi") return "Tournoi";
  return "Match Normal";
}

/* ── Styles partagés ───────────────────────────────────────────── */

const UI: React.CSSProperties = { fontFamily: "var(--font-ui)" };

function Btn({
  children,
  onClick,
  variant = "primary",
  disabled,
  fullWidth,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  fullWidth?: boolean;
}) {
  const base: React.CSSProperties = {
    ...UI,
    fontSize: "13px",
    fontWeight: 700,
    padding: "10px 18px",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? "100%" : undefined,
    transition: "opacity 0.15s",
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: "var(--color-forest)", color: "#fff" },
    secondary: { background: "var(--color-line)", color: "var(--color-ink)" },
    ghost: { background: "transparent", color: "var(--color-muted)", border: "var(--border-thin)" },
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ ...UI, fontSize: "12px", color: "var(--color-muted)", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 12 }}>
      ← Retour
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ border: "var(--border-thin)", background: "#fff", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      {children}
    </div>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return <p style={{ ...UI, fontSize: "15px", fontWeight: 700, color: "var(--color-ink)", margin: 0 }}>{children}</p>;
}

function Sub({ children }: { children: React.ReactNode }) {
  return <p style={{ ...UI, fontSize: "12px", color: "var(--color-muted)", margin: 0 }}>{children}</p>;
}

/* ── Composant principal ───────────────────────────────────────── */

export default function RegisterMatchClient() {
  const [step, setStep] = useState<Step>({ kind: "idle" });

  return (
    <div className="px-4 pb-4 pt-4" style={{ borderBottom: "var(--border-thin)" }}>
      {step.kind === "idle" && (
        <Btn fullWidth onClick={() => setStep({ kind: "mode" })}>
          ⚡ Enregistrer ma partie
        </Btn>
      )}

      {step.kind === "mode" && (
        <Card>
          <Title>Quel type de partie ?</Title>
          <div className="flex gap-3">
            <Btn fullWidth variant="secondary" onClick={() => setStep({ kind: "choice", mode: "amical" })}>
              🤝 Amical
            </Btn>
            <Btn fullWidth onClick={() => setStep({ kind: "choice", mode: "classé" })}>
              🎯 Classé
            </Btn>
          </div>
          <BackBtn onClick={() => setStep({ kind: "idle" })} />
        </Card>
      )}

      {step.kind === "choice" && step.mode === "amical" && (
        <StepAmicalChoice
          onBack={() => setStep({ kind: "mode" })}
          onCreate={() => setStep({ kind: "code-display", mode: "amical", code: genCode() })}
          onJoin={() => setStep({ kind: "code-join", mode: "amical" })}
        />
      )}

      {step.kind === "choice" && step.mode === "classé" && (
        <StepClasséChoice
          onBack={() => setStep({ kind: "mode" })}
          onCreate={() => setStep({ kind: "classé-format" })}
          onJoin={() => setStep({ kind: "code-join", mode: "classé" })}
        />
      )}

      {step.kind === "classé-format" && (
        <StepClasséFormat
          onBack={() => setStep({ kind: "choice", mode: "classé" })}
          onSelect={(f) => setStep({ kind: "code-display", mode: "classé", format: f, code: genCode() })}
        />
      )}

      {step.kind === "code-display" && (
        <StepCodeDisplay
          mode={step.mode}
          format={step.format}
          code={step.code}
          onBack={() =>
            step.mode === "amical"
              ? setStep({ kind: "choice", mode: "amical" })
              : setStep({ kind: "classé-format" })
          }
          onStart={() => setStep({ kind: "playing", mode: step.mode, format: step.format, code: step.code })}
        />
      )}

      {step.kind === "code-join" && (
        <StepCodeJoin
          mode={step.mode}
          onBack={() => setStep({ kind: "choice", mode: step.mode })}
          onJoin={(code) => setStep({ kind: "playing", mode: step.mode, code })}
        />
      )}

      {step.kind === "playing" && (
        <ScoreGrid
          mode={step.mode}
          format={step.format}
          code={step.code}
          onEnd={() => setStep({ kind: "idle" })}
        />
      )}
    </div>
  );
}

/* ── Étapes ────────────────────────────────────────────────────── */

function StepAmicalChoice({
  onBack, onCreate, onJoin,
}: { onBack: () => void; onCreate: () => void; onJoin: () => void }) {
  return (
    <Card>
      <BackBtn onClick={onBack} />
      <Title>🤝 Partie amicale</Title>
      <Sub>Crée une session ou rejoins celle d'un ami.</Sub>
      <div className="flex gap-3">
        <Btn fullWidth variant="secondary" onClick={onCreate}>Créer</Btn>
        <Btn fullWidth onClick={onJoin}>Rejoindre</Btn>
      </div>
    </Card>
  );
}

function StepClasséChoice({
  onBack, onCreate, onJoin,
}: { onBack: () => void; onCreate: () => void; onJoin: () => void }) {
  return (
    <Card>
      <BackBtn onClick={onBack} />
      <Title>🎯 Partie classée</Title>
      <Sub>Crée une session ou rejoins celle d'un adversaire.</Sub>
      <div className="flex gap-3">
        <Btn fullWidth variant="secondary" onClick={onCreate}>Créer</Btn>
        <Btn fullWidth onClick={onJoin}>Rejoindre</Btn>
      </div>
    </Card>
  );
}

function StepClasséFormat({
  onBack, onSelect,
}: { onBack: () => void; onSelect: (f: Format) => void }) {
  const formats: { id: Format; label: string; desc: string }[] = [
    { id: "rapide",  label: "Match Rapide",  desc: "2 sets gagnants" },
    { id: "normal",  label: "Match Normal",  desc: "3 sets gagnants" },
    { id: "tournoi", label: "Tournoi",        desc: "4 sets gagnants" },
  ];
  return (
    <Card>
      <BackBtn onClick={onBack} />
      <Title>Choisis le format</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {formats.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onSelect(f.id)}
            style={{
              ...UI,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              border: "var(--border-thin)",
              background: "#fff",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: "13px", color: "var(--color-ink)" }}>{f.label}</span>
            <span style={{ fontSize: "11px", color: "var(--color-muted)" }}>{f.desc}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

function StepCodeDisplay({
  mode, format, code, onBack, onStart,
}: { mode: Mode; format?: Format; code: string; onBack: () => void; onStart: () => void }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Card>
      <BackBtn onClick={onBack} />
      <Title>Code de session</Title>
      <Sub>
        {mode === "amical" ? "🤝 Amical" : `🎯 Classé${format ? ` · ${formatLabel(format)}` : ""}`}
        {" "}— partage ce code à ton adversaire.
      </Sub>

      {/* Code affiché */}
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <p style={{ ...UI, fontSize: "40px", fontWeight: 800, letterSpacing: "0.2em", color: "var(--color-forest)", margin: 0 }}>
          {code}
        </p>
      </div>

      <div className="flex gap-3">
        <Btn fullWidth variant="ghost" onClick={copy}>
          {copied ? "✅ Copié !" : "📋 Copier"}
        </Btn>
        <Btn fullWidth onClick={onStart}>
          Lancer la partie →
        </Btn>
      </div>
    </Card>
  );
}

function StepCodeJoin({
  mode, onBack, onJoin,
}: { mode: Mode; onBack: () => void; onJoin: (code: string) => void }) {
  const [value, setValue] = useState("");
  const valid = /^\d{6}$/.test(value);

  return (
    <Card>
      <BackBtn onClick={onBack} />
      <Title>Rejoindre une session</Title>
      <Sub>{mode === "amical" ? "🤝 Amical" : "🎯 Classé"} — saisis le code partagé par ton adversaire.</Sub>

      <input
        type="number"
        inputMode="numeric"
        maxLength={6}
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, 6))}
        placeholder="000000"
        style={{
          ...UI,
          fontSize: "28px",
          fontWeight: 800,
          letterSpacing: "0.2em",
          textAlign: "center",
          padding: "14px",
          border: "var(--border-thin)",
          background: "var(--color-cream)",
          color: "var(--color-ink)",
          width: "100%",
          outline: "none",
        }}
      />

      <Btn fullWidth disabled={!valid} onClick={() => valid && onJoin(value)}>
        Rejoindre →
      </Btn>
    </Card>
  );
}

/* ── Grille de score ───────────────────────────────────────────── */

function ScoreGrid({
  mode, format, code, onEnd,
}: { mode: Mode; format?: Format; code: string; onEnd: () => void }) {
  const target = setsToWin(format);
  const [sets, setSets] = useState<SetScore[]>([]);
  const [cur, setCur] = useState<SetScore>({ p1: 0, p2: 0 });
  const [finished, setFinished] = useState(false);

  const setsP1 = sets.filter((s) => s.p1 > s.p2).length;
  const setsP2 = sets.filter((s) => s.p2 > s.p1).length;
  const winner = setsP1 >= target ? "Toi" : setsP2 >= target ? "Adversaire" : null;

  function validateSet() {
    if (cur.p1 === 0 && cur.p2 === 0) return;
    if (cur.p1 === cur.p2) return;
    const next = [...sets, cur];
    setSets(next);
    setCur({ p1: 0, p2: 0 });
    const w1 = next.filter((s) => s.p1 > s.p2).length;
    const w2 = next.filter((s) => s.p2 > s.p1).length;
    if (w1 >= target || w2 >= target) setFinished(true);
  }

  function adj(player: "p1" | "p2", delta: number) {
    setCur((prev) => ({ ...prev, [player]: Math.max(0, prev[player] + delta) }));
  }

  const label = mode === "amical"
    ? "🤝 Amical"
    : `🎯 Classé · ${format ? formatLabel(format) : ""}`;

  return (
    <div style={{ border: "var(--border-thin)", background: "#fff", display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header */}
      <div
        style={{ background: "var(--color-forest)", color: "#fff", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <span style={{ ...UI, fontSize: "12px", fontWeight: 700 }}>{label}</span>
        <span style={{ ...UI, fontSize: "11px", opacity: 0.7 }}>Code : {code}</span>
      </div>

      {/* Sets gagnés */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", padding: "14px 16px", borderBottom: "var(--border-thin)", gap: 8, alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ ...UI, fontSize: "11px", fontWeight: 600, color: "var(--color-muted)", margin: 0 }}>Toi</p>
          <p style={{ ...UI, fontSize: "36px", fontWeight: 800, color: setsP1 >= target ? "var(--color-forest)" : "var(--color-ink)", margin: 0, lineHeight: 1 }}>{setsP1}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ ...UI, fontSize: "10px", color: "var(--color-muted)", margin: 0 }}>sets gagnés</p>
          <p style={{ ...UI, fontSize: "10px", color: "var(--color-muted)", margin: 0 }}>/{target}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ ...UI, fontSize: "11px", fontWeight: 600, color: "var(--color-muted)", margin: 0 }}>Adversaire</p>
          <p style={{ ...UI, fontSize: "36px", fontWeight: 800, color: setsP2 >= target ? "#e53e3e" : "var(--color-ink)", margin: 0, lineHeight: 1 }}>{setsP2}</p>
        </div>
      </div>

      {/* Historique des sets */}
      {sets.length > 0 && (
        <div style={{ padding: "8px 16px", borderBottom: "var(--border-thin)", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {sets.map((s, i) => (
            <span
              key={i}
              style={{
                ...UI,
                fontSize: "11px",
                fontWeight: 600,
                padding: "2px 8px",
                background: s.p1 > s.p2 ? "var(--color-forest)" : "#e53e3e",
                color: "#fff",
              }}
            >
              Set {i + 1} : {s.p1}-{s.p2}
            </span>
          ))}
        </div>
      )}

      {/* Score du set en cours */}
      {!finished && (
        <>
          <div style={{ padding: "8px 16px 4px" }}>
            <p style={{ ...UI, fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-muted)", margin: 0 }}>
              Set {sets.length + 1} en cours
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", padding: "8px 16px 16px", gap: 8, alignItems: "center" }}>
            {/* P1 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <button type="button" onClick={() => adj("p1", 1)} style={{ ...UI, fontSize: "22px", width: 48, height: 48, background: "var(--color-forest)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700 }}>+</button>
              <p style={{ ...UI, fontSize: "40px", fontWeight: 800, color: "var(--color-ink)", margin: 0, lineHeight: 1 }}>{cur.p1}</p>
              <button type="button" onClick={() => adj("p1", -1)} style={{ ...UI, fontSize: "22px", width: 48, height: 48, background: "var(--color-line)", color: "var(--color-ink)", border: "none", cursor: "pointer", fontWeight: 700 }}>−</button>
            </div>

            {/* VS */}
            <p style={{ ...UI, fontSize: "13px", fontWeight: 700, color: "var(--color-muted)", textAlign: "center" }}>VS</p>

            {/* P2 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <button type="button" onClick={() => adj("p2", 1)} style={{ ...UI, fontSize: "22px", width: 48, height: 48, background: "#e53e3e", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700 }}>+</button>
              <p style={{ ...UI, fontSize: "40px", fontWeight: 800, color: "var(--color-ink)", margin: 0, lineHeight: 1 }}>{cur.p2}</p>
              <button type="button" onClick={() => adj("p2", -1)} style={{ ...UI, fontSize: "22px", width: 48, height: 48, background: "var(--color-line)", color: "var(--color-ink)", border: "none", cursor: "pointer", fontWeight: 700 }}>−</button>
            </div>
          </div>

          <div style={{ padding: "0 16px 16px", display: "flex", gap: 8 }}>
            <Btn fullWidth variant="secondary" disabled={cur.p1 === cur.p2 && cur.p1 === 0} onClick={validateSet}>
              ✅ Valider le set
            </Btn>
          </div>
        </>
      )}

      {/* Fin de partie */}
      {finished && winner && (
        <div style={{ padding: 20, textAlign: "center", display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ ...UI, fontSize: "28px", margin: 0 }}>{winner === "Toi" ? "🏆" : "😤"}</p>
          <p style={{ ...UI, fontSize: "17px", fontWeight: 800, color: winner === "Toi" ? "var(--color-forest)" : "#e53e3e", margin: 0 }}>
            {winner === "Toi" ? "Victoire !" : "Défaite"} — {winner}
          </p>
          <p style={{ ...UI, fontSize: "13px", color: "var(--color-muted)", margin: 0 }}>
            Score final : {setsP1} – {setsP2}
          </p>
          <Btn fullWidth onClick={onEnd}>Terminer</Btn>
        </div>
      )}
    </div>
  );
}
