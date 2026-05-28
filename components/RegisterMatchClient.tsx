"use client";

import { useState } from "react";

/* ── Types ─────────────────────────────────────────────────────── */

type Mode = "Amical" | "Compétitif";
type Format = "rapide" | "normal" | "tournoi";
type SetScore = { p1: number; p2: number };

type Step =
  | { kind: "table-choice" }
  | { kind: "table-photo" }
  | { kind: "mode-choice" }
  | { kind: "qr-code"; mode: Mode }
  | { kind: "playing"; mode: Mode; format?: Format; code: string };

/* ── Helpers ───────────────────────────────────────────────────── */

function genCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
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
    borderRadius: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? "100%" : undefined,
    transition: "opacity 0.15s, transform 0.1s",
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: "var(--color-forest)", color: "#fff" },
    secondary: { background: "var(--color-line)", color: "var(--color-ink)" },
    ghost: { background: "transparent", color: "var(--color-muted)", border: "var(--border-thin)" },
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }} className="active:scale-95">
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
    <div style={{ border: "var(--border-thin)", background: "#fff", padding: 20, display: "flex", flexDirection: "column", gap: 16, borderRadius: "12px" }}>
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

export default function RegisterMatchClient({ preselectedTableId }: { preselectedTableId?: string | null }) {
  const [step, setStep] = useState<Step>(
    preselectedTableId ? { kind: "mode-choice" } : { kind: "table-choice" }
  );

  return (
    <div className="px-6 py-4">
      {step.kind === "table-choice" && (
        <StepTableChoice
          onSelectTable={() => setStep({ kind: "mode-choice" })}
          onSelectHome={() => setStep({ kind: "table-photo" })}
        />
      )}

      {step.kind === "table-photo" && (
        <StepTablePhoto
          onBack={() => setStep({ kind: "table-choice" })}
          onPhotoTaken={() => setStep({ kind: "mode-choice" })}
        />
      )}

      {step.kind === "mode-choice" && (
        <StepModeChoice
          onBack={() => setStep({ kind: "table-choice" })}
          onSelect={(mode) => setStep({ kind: "qr-code", mode })}
        />
      )}

      {step.kind === "qr-code" && (
        <StepQrCode
          mode={step.mode}
          onBack={() => setStep({ kind: "mode-choice" })}
          onStart={() => setStep({ kind: "playing", mode: step.mode, code: genCode() })}
        />
      )}

      {step.kind === "playing" && (
        <ScoreGrid
          mode={step.mode}
          code={step.code}
          onEnd={() => setStep({ kind: "table-choice" })}
        />
      )}
    </div>
  );
}

/* ── Étapes ────────────────────────────────────────────────────── */

function StepTableChoice({ onSelectTable, onSelectHome }: { onSelectTable: () => void; onSelectHome: () => void }) {
  const tables = [
    { id: "1", name: "Table Parc des Buttes-Chaumont", dist: "400m" },
    { id: "2", name: "Square de la Roquette", dist: "1.2km" },
  ];

  return (
    <Card>
      <Title>Choisis ta table</Title>
      <Sub>Sélectionne une table à proximité ou joue chez toi.</Sub>
      
      <div className="flex flex-col gap-2">
        {tables.map(t => (
          <button 
            key={t.id} 
            onClick={onSelectTable}
            className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-[#F9F9FF] text-left hover:border-[#0A241E] transition-colors"
          >
            <span className="text-sm font-bold text-[#0A241E]" style={UI}>{t.name}</span>
            <span className="text-[10px] font-bold text-[#616363] uppercase" style={UI}>{t.dist}</span>
          </button>
        ))}
        
        <div className="my-3 flex items-center gap-2">
          <div className="h-px bg-[#E5E7EB] flex-1" />
          <span className="text-[10px] text-[#616363] uppercase font-bold tracking-wider" style={UI}>OU</span>
          <div className="h-px bg-[#E5E7EB] flex-1" />
        </div>
        
        <button 
          onClick={onSelectHome}
          className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-[#0A241E] bg-white text-[#0A241E] font-bold text-sm transition-colors hover:bg-[#F9F9FF]"
          style={UI}
        >
          🏠 À la maison
        </button>
      </div>
    </Card>
  );
}

function StepTablePhoto({ onBack, onPhotoTaken }: { onBack: () => void; onPhotoTaken: () => void }) {
  const [photo, setPhoto] = useState<string | null>(null);

  // Simulate taking a photo
  const handleCapture = () => {
    // In a real app, this would open a camera or file picker
    setTimeout(() => {
      setPhoto("captured");
    }, 500);
  };

  return (
    <Card>
      <BackBtn onClick={onBack} />
      <Title>Prends ta table en photo</Title>
      <Sub>Pour jouer à la maison, nous avons besoin d'une photo de votre installation.</Sub>
      
      {!photo ? (
        <div 
          onClick={handleCapture}
          className="w-full h-48 bg-[#F9F9FF] border-2 border-[#E5E7EB] border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#0A241E] transition-colors"
        >
          <span className="text-4xl opacity-80">📷</span>
          <span className="text-[11px] font-bold text-[#616363] uppercase tracking-wider" style={UI}>Appuyer pour capturer</span>
        </div>
      ) : (
        <div className="w-full h-48 bg-[#D1EAE2] border-2 border-[#0A241E] rounded-xl flex flex-col items-center justify-center gap-3 relative overflow-hidden">
          <span className="text-4xl drop-shadow-md">✅</span>
          <span className="text-[11px] font-black text-[#0A241E] uppercase tracking-wider" style={UI}>Photo enregistrée</span>
          <button 
            onClick={() => setPhoto(null)} 
            className="absolute top-3 right-3 text-[10px] bg-white px-3 py-1.5 rounded-lg font-bold text-[#BA1A1A] shadow-sm hover:scale-105 transition-transform"
            style={UI}
          >
            Reprendre
          </button>
        </div>
      )}

      <Btn fullWidth disabled={!photo} onClick={onPhotoTaken}>
        Continuer →
      </Btn>
    </Card>
  );
}

function StepModeChoice({ onBack, onSelect }: { onBack: () => void; onSelect: (m: Mode) => void }) {
  return (
    <Card>
      <BackBtn onClick={onBack} />
      <Title>Quel type de partie ?</Title>
      <div className="flex gap-3">
        <Btn fullWidth variant="secondary" onClick={() => onSelect("Amical")}>
          🤝 Amical
        </Btn>
        <Btn fullWidth onClick={() => onSelect("Compétitif")}>
          🎯 Compétitif
        </Btn>
      </div>
    </Card>
  );
}

function StepQrCode({ mode, onBack, onStart }: { mode: Mode; onBack: () => void; onStart: () => void }) {
  return (
    <Card>
      <BackBtn onClick={onBack} />
      <Title>QR Code de session</Title>
      <Sub>
        Mode : <span className="font-bold text-[#0A241E]">{mode}</span> — Fais scanner ce QR code à ton adversaire pour qu'il rejoigne la partie.
      </Sub>

      {/* Mock QR Code */}
      <div className="flex justify-center py-6">
        <div className="w-48 h-48 bg-[#F9F9FF] border border-[#E5E7EB] rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
          {/* Simulated QR Pattern */}
          <div className="absolute inset-4 border-8 border-[#0A241E] rounded-xl"></div>
          <div className="absolute top-8 left-8 w-6 h-6 bg-[#0A241E] rounded-sm"></div>
          <div className="absolute top-8 right-8 w-6 h-6 bg-[#0A241E] rounded-sm"></div>
          <div className="absolute bottom-8 left-8 w-6 h-6 bg-[#0A241E] rounded-sm"></div>
          <div className="w-16 h-16 bg-[#0A241E] rounded-full flex items-center justify-center z-10 text-white font-black text-[10px] uppercase shadow-lg border-4 border-white tracking-widest" style={UI}>
            Ping
          </div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMEEyNDFFIiBmaWxsLW9wYWNpdHk9IjAuMTUiLz4KPC9zdmc+')] opacity-60"></div>
        </div>
      </div>

      <Btn fullWidth onClick={onStart}>
        L'adversaire a rejoint →
      </Btn>
    </Card>
  );
}

/* ── Grille de score (Existant) ───────────────────────────────────────────── */

function ScoreGrid({
  mode, code, onEnd,
}: { mode: Mode; code: string; onEnd: () => void }) {
  const target = mode === "Compétitif" ? 3 : 2; // Default sets
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

  const label = mode === "Amical" ? "🤝 Amical" : "🎯 Compétitif";

  return (
    <div style={{ border: "var(--border-thin)", background: "#fff", display: "flex", flexDirection: "column", gap: 0, borderRadius: "12px", overflow: "hidden" }}>
      {/* Header */}
      <div
        style={{ background: "var(--color-forest)", color: "#fff", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <span style={{ ...UI, fontSize: "12px", fontWeight: 700 }}>{label}</span>
        <span style={{ ...UI, fontSize: "11px", opacity: 0.7 }}>Partie en cours</span>
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
                borderRadius: "4px"
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
              <button type="button" onClick={() => adj("p1", 1)} className="active:scale-95 transition-transform" style={{ ...UI, fontSize: "22px", width: 48, height: 48, background: "var(--color-forest)", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: 700 }}>+</button>
              <p style={{ ...UI, fontSize: "40px", fontWeight: 800, color: "var(--color-ink)", margin: 0, lineHeight: 1 }}>{cur.p1}</p>
              <button type="button" onClick={() => adj("p1", -1)} className="active:scale-95 transition-transform" style={{ ...UI, fontSize: "22px", width: 48, height: 48, background: "var(--color-line)", color: "var(--color-ink)", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: 700 }}>−</button>
            </div>

            {/* VS */}
            <p style={{ ...UI, fontSize: "13px", fontWeight: 700, color: "var(--color-muted)", textAlign: "center" }}>VS</p>

            {/* P2 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <button type="button" onClick={() => adj("p2", 1)} className="active:scale-95 transition-transform" style={{ ...UI, fontSize: "22px", width: 48, height: 48, background: "#e53e3e", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: 700 }}>+</button>
              <p style={{ ...UI, fontSize: "40px", fontWeight: 800, color: "var(--color-ink)", margin: 0, lineHeight: 1 }}>{cur.p2}</p>
              <button type="button" onClick={() => adj("p2", -1)} className="active:scale-95 transition-transform" style={{ ...UI, fontSize: "22px", width: 48, height: 48, background: "var(--color-line)", color: "var(--color-ink)", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: 700 }}>−</button>
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
