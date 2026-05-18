"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "../../components/SessionProvider";
import { DEFAULT_CLUB_ID } from "../../lib/club-admin";

type Tab = "player" | "club";

export default function LoginPage() {
  const router = useRouter();
  const { setMode, setActiveClub } = useSession();
  const [tab, setTab] = useState<Tab>("player");

  function loginPlayer() {
    setMode("player");
    setActiveClub(null);
    router.push("/feed");
  }

  function loginClub() {
    setMode("club");
    setActiveClub(DEFAULT_CLUB_ID);
    router.push("/club-dashboard");
  }

  const isClub = tab === "club";

  return (
    <main
      className="flex min-h-dvh flex-col items-center justify-center px-6 transition-colors"
      style={{
        background: isClub
          ? "var(--color-forest-deep)"
          : "var(--color-cream)",
        color: isClub ? "#f6f1e3" : "var(--color-ink)",
      }}
    >
      {/* ── Header ── */}
      <div className="text-center">
        <p className="text-6xl">🏓</p>
        <h1
          className="mt-4 text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          PingPang
        </h1>
        <p
          className="mt-2 text-sm"
          style={{
            color: isClub ? "rgba(255,255,255,0.7)" : "var(--color-muted)",
            fontFamily: "var(--font-ui)",
          }}
        >
          {isClub
            ? "Espace admin · gérer un club"
            : "Le réseau des pongistes"}
        </p>
      </div>

      {/* ── Tabs Joueur / Club ── */}
      <div
        className="mt-8 grid w-full max-w-sm grid-cols-2"
        style={{
          background: isClub ? "rgba(255,255,255,0.06)" : "#fff",
          border: isClub
            ? "1px solid rgba(255,255,255,0.1)"
            : "var(--border-thin)",
          fontFamily: "var(--font-ui)",
        }}
      >
        <button
          type="button"
          onClick={() => setTab("player")}
          className="py-3 text-xs font-bold uppercase tracking-widest transition-colors"
          style={{
            background: !isClub ? "var(--color-forest)" : "transparent",
            color: !isClub
              ? "#fff"
              : "rgba(255,255,255,0.55)",
          }}
        >
          🏓 Joueur
        </button>
        <button
          type="button"
          onClick={() => setTab("club")}
          className="py-3 text-xs font-bold uppercase tracking-widest transition-colors"
          style={{
            background: isClub ? "var(--color-gold)" : "transparent",
            color: isClub
              ? "var(--color-forest-deep)"
              : "var(--color-muted)",
          }}
        >
          🏛️ Club
        </button>
      </div>

      {/* ── Form ── */}
      <div className="mt-4 w-full max-w-sm space-y-3">
        <input
          type="email"
          placeholder={isClub ? "Email du club" : "Email"}
          className="w-full px-4 py-3 text-sm"
          style={{
            background: isClub ? "rgba(255,255,255,0.06)" : "#fff",
            border: isClub
              ? "1px solid rgba(255,255,255,0.12)"
              : "var(--border-thin)",
            color: isClub ? "#f6f1e3" : "var(--color-ink)",
            fontFamily: "var(--font-ui)",
          }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full px-4 py-3 text-sm"
          style={{
            background: isClub ? "rgba(255,255,255,0.06)" : "#fff",
            border: isClub
              ? "1px solid rgba(255,255,255,0.12)"
              : "var(--border-thin)",
            color: isClub ? "#f6f1e3" : "var(--color-ink)",
            fontFamily: "var(--font-ui)",
          }}
        />

        <button
          type="button"
          onClick={isClub ? loginClub : loginPlayer}
          className="w-full py-3 text-sm font-bold uppercase tracking-wider"
          style={{
            background: isClub ? "var(--color-gold)" : "var(--color-forest)",
            color: isClub ? "var(--color-forest-deep)" : "#fff",
            fontFamily: "var(--font-ui)",
          }}
        >
          {isClub ? "🔑 Accéder au tableau de bord" : "Se connecter"}
        </button>

        <div
          className="my-4 text-center text-[10px] uppercase tracking-widest"
          style={{
            color: isClub ? "rgba(255,255,255,0.4)" : "var(--color-muted)",
          }}
        >
          — ou —
        </div>

        <button
          type="button"
          onClick={isClub ? loginClub : loginPlayer}
          className="w-full py-3 text-sm font-bold uppercase tracking-wider"
          style={{
            background: isClub
              ? "transparent"
              : "var(--color-ink)",
            color: isClub ? "#f6f1e3" : "#fff",
            border: isClub ? "1px solid rgba(255,255,255,0.25)" : "none",
            fontFamily: "var(--font-ui)",
          }}
        >
          🚀 Démo {isClub ? "Paris 13 TT" : "joueur"}
        </button>
      </div>

      {/* ── Footer ── */}
      <div
        className="mt-6 max-w-sm text-center text-[11px]"
        style={{
          color: isClub ? "rgba(255,255,255,0.5)" : "var(--color-muted)",
          fontFamily: "var(--font-ui)",
        }}
      >
        {isClub ? (
          <>
            Connecte-toi en tant que <strong>responsable de club</strong> pour
            gérer membres, tournois, finances et communication.
          </>
        ) : (
          <>
            Pas de backend. Toutes les données sont locales et fictives.
          </>
        )}
      </div>
    </main>
  );
}
