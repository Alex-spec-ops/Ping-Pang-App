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
      className="flex min-h-dvh flex-col items-center justify-center px-6"
      style={{ background: "#F9F9FF" }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-6xl">🏓</p>
        <h1
          className="mt-4 text-3xl font-bold text-[#0A241E]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          PingPang
        </h1>
        <p
          className="mt-2 text-sm text-[#616363]"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          {isClub ? "Espace admin · gérer un club" : "Le réseau des pongistes"}
        </p>
      </div>

      {/* Tab switcher */}
      <div
        className="w-full max-w-sm flex rounded-xl border border-[#E5E7EB] bg-[#F9F9FF] p-1 mb-4"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        <button
          type="button"
          onClick={() => setTab("player")}
          className={`flex-1 rounded-xl py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
            !isClub ? "bg-white text-[#0A241E] shadow-sm" : "text-[#616363]"
          }`}
        >
          🏓 Joueur
        </button>
        <button
          type="button"
          onClick={() => setTab("club")}
          className={`flex-1 rounded-xl py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
            isClub ? "bg-white text-[#0A241E] shadow-sm" : "text-[#616363]"
          }`}
        >
          🏛️ Club
        </button>
      </div>

      {/* Form */}
      <div className="w-full max-w-sm space-y-3">
        <input
          type="email"
          placeholder={isClub ? "Email du club" : "Email"}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            color: "#0A241E",
            fontFamily: "var(--font-ui)",
          }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            color: "#0A241E",
            fontFamily: "var(--font-ui)",
          }}
        />

        <button
          type="button"
          onClick={isClub ? loginClub : loginPlayer}
          className="w-full rounded-xl py-3 text-sm font-bold uppercase tracking-wider text-white"
          style={{ background: "#0A241E", fontFamily: "var(--font-ui)" }}
        >
          {isClub ? "🔑 Accéder au tableau de bord" : "Se connecter"}
        </button>

        <div
          className="my-3 text-center text-[10px] uppercase tracking-widest text-[#616363]"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          — ou —
        </div>

        <button
          type="button"
          onClick={isClub ? loginClub : loginPlayer}
          className="w-full rounded-xl py-3 text-sm font-bold uppercase tracking-wider text-[#0A241E]"
          style={{
            background: "#F9F9FF",
            border: "1px solid #E5E7EB",
            fontFamily: "var(--font-ui)",
          }}
        >
          🚀 Démo {isClub ? "Paris 13 TT" : "joueur"}
        </button>
      </div>

      {/* Footer */}
      <p
        className="mt-8 max-w-sm text-center text-[11px] text-[#616363]"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        {isClub
          ? "Connecte-toi en tant que responsable de club pour gérer membres, tournois, finances et communication."
          : "Pas de backend. Toutes les données sont locales et fictives."}
      </p>
    </main>
  );
}
