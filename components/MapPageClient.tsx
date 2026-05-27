"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Avatar from "./Avatar";
import { CURRENT_USER_ID, getPlayer } from "../lib/data";

export default function MapPageClient() {
  const me = getPlayer(CURRENT_USER_ID);

  // Drawer: "peek" = handle only, "half" = half screen, "full" = full info
  const [drawerState, setDrawerState] = useState<"peek" | "half" | "full">("peek");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [challengeTarget, setChallengeTarget] = useState<string | null>(null);

  const dragStartY = useRef<number | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const DRAWER_HEIGHTS = {
    peek: 52,   // just the handle bar
    half: 340,
    full: 560,
  };

  function onDragStart(clientY: number) {
    dragStartY.current = clientY;
  }

  function onDragEnd(clientY: number) {
    if (dragStartY.current === null) return;
    const dy = dragStartY.current - clientY; // positive = swipe up
    if (dy > 40) {
      setDrawerState((s) => (s === "peek" ? "half" : s === "half" ? "full" : "full"));
    } else if (dy < -40) {
      setDrawerState((s) => (s === "full" ? "half" : s === "half" ? "peek" : "peek"));
    }
    dragStartY.current = null;
  }

  return (
    <div className="relative w-full overflow-hidden bg-[#c9e8f5] select-none"
      style={{ height: "calc(100dvh - 64px)" }}
    >
      {/* ── Map placeholder ── */}
      <div className="absolute inset-0 z-0 bg-[#c9e8f5] flex items-center justify-center">
        <p className="text-[#0A241E]/30 text-sm font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-ui)" }}>
          Carte à venir
        </p>
      </div>

      {/* ── Floating controls ── */}
      <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
        {/* Scanner */}
        <button
          type="button"
          onClick={() => setIsScannerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0A241E]/90 text-white text-[9px] font-black uppercase tracking-wider shadow-lg backdrop-blur-sm"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.625 13.5h.75m-.75 3h.75m-.75 3h.75M13.5 13.5h.75m-.75 3h.75m-.75 3h.75m3.75-6v-3h-3" />
          </svg>
          Scanner
        </button>

        {/* Profile link */}
        <Link
          href="/profile"
          className="grid h-10 w-10 place-items-center rounded-xl bg-white/90 border border-white/20 shadow-md self-end"
        >
          <Avatar emoji={me?.avatar ?? "🐧"} size="sm" />
        </Link>
      </div>

      {/* ── Slide-up Drawer ── */}
      <div
        ref={drawerRef}
        className="absolute left-0 right-0 z-30 mx-auto max-w-md bg-white rounded-t-2xl shadow-[0px_-8px_30px_rgba(10,36,30,0.15)] transition-[height] duration-300 ease-out overflow-hidden"
        style={{
          bottom: 0,
          height: DRAWER_HEIGHTS[drawerState],
        }}
      >
        {/* Drag handle */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => onDragStart(e.clientY)}
          onMouseUp={(e) => onDragEnd(e.clientY)}
          onTouchStart={(e) => onDragStart(e.touches[0].clientY)}
          onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientY)}
          onClick={() => {
            if (drawerState === "peek") setDrawerState("half");
            else if (drawerState === "full") setDrawerState("peek");
          }}
        >
          <div className="w-10 h-1 rounded-full bg-[#DFE0E0]" />
        </div>

        {/* Drawer content */}
        <div className="px-4 overflow-y-auto" style={{ height: "calc(100% - 36px)" }}>
          {/* Rank header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[9px] font-bold text-[#616363] uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>
                Votre classement
              </p>
              <h2 className="text-2xl font-black uppercase text-[#0A241E] leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                RANK #1,240
              </h2>
              <p className="text-xs font-semibold text-[#616363] mt-0.5">1,540 ELO</p>
            </div>
            <div className="px-4 py-2.5 rounded-full bg-[#D1EAE2] flex flex-col items-center min-w-[100px]" style={{ fontFamily: "var(--font-ui)" }}>
              <span className="text-[7.5px] font-black uppercase tracking-widest text-[#0A241E] leading-none">Prochain Palier</span>
              <span className="text-sm font-black text-[#0A241E] mt-0.5 leading-none">+20</span>
            </div>
          </div>

          <hr className="border-[#E5E7EB] mb-4" />

          {/* Segment chaud */}
          <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl space-y-3 shadow-[0px_4px_20px_rgba(10,36,30,0.05)] mb-4">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
                🔥 Segment Chaud
              </span>
              <span className="px-2 py-0.5 rounded bg-[#F9F9FF] border border-[#E5E7EB] text-[8.5px] font-black text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
                0.4 km
              </span>
            </div>
            <h3 className="text-lg font-black uppercase text-[#0A241E]" style={{ fontFamily: "var(--font-display)" }}>
              MÉTRO SOUTERRAIN
            </h3>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 p-2 bg-[#F9F9FF] border border-[#E5E7EB] rounded-xl flex items-center gap-2">
                <Avatar emoji="🐺" size="sm" />
                <div>
                  <p className="text-[7.5px] font-black uppercase text-[#616363]" style={{ fontFamily: "var(--font-ui)" }}>Boss Actuel</p>
                  <p className="text-xs font-bold text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>Alex C.</p>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[7.5px] font-black uppercase text-[#616363]" style={{ fontFamily: "var(--font-ui)" }}>
                  <span>Rétention</span><span className="text-[#0A241E]">7/10</span>
                </div>
                <div className="h-1.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-[#0A241E] rounded-full" style={{ width: "70%" }} />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setChallengeTarget("Alex C.")}
              className="w-full py-2.5 rounded-xl border border-[#0A241E] text-xs font-black uppercase text-[#0A241E] tracking-wider hover:bg-[#F9F9FF] transition-all"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              Défier le boss
            </button>
          </div>

          {/* Joueurs à proximité */}
          <h3 className="text-[10px] font-black uppercase tracking-wider text-[#0A241E] mb-2" style={{ fontFamily: "var(--font-ui)" }}>
            Joueurs à proximité
          </h3>
          <div className="space-y-2 pb-4">
            <div className="p-3 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar emoji="🦊" size="sm" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#22c55e] border-2 border-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>Sarah Miller</h4>
                  <p className="text-[9px] font-bold text-[#616363] uppercase mt-0.5">1,890 ELO · Proche</p>
                </div>
              </div>
              <button type="button" onClick={() => setChallengeTarget("Sarah Miller")} className="px-4 py-2 rounded-xl bg-[#0A241E] text-white text-[9px] font-black uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>
                Défier
              </button>
            </div>

            <div className="p-3 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar emoji="🐉" size="sm" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#BAE0D4] border-2 border-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>Marc L.</h4>
                  <p className="text-[9px] font-bold text-[#616363] uppercase mt-0.5">1,420 ELO · 2 KM</p>
                </div>
              </div>
              <button type="button" disabled className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#616363] text-[9px] font-black uppercase tracking-wider opacity-60 cursor-not-allowed" style={{ fontFamily: "var(--font-ui)" }}>
                Défier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── QR Scanner ── */}
      {isScannerOpen && (
        <QRScannerOverlay onClose={() => setIsScannerOpen(false)} />
      )}

      {/* ── Challenge modal ── */}
      {challengeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 border border-[#E5E7EB] shadow-[0px_4px_20px_rgba(10,36,30,0.08)]">
            <h3 className="text-lg font-black text-[#0A241E]" style={{ fontFamily: "var(--font-display)" }}>Défier le joueur ?</h3>
            <p className="text-xs text-[#616363] leading-relaxed">
              Voulez-vous enregistrer un match contre <span className="font-bold text-[#0A241E]">{challengeTarget}</span> ?
            </p>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setChallengeTarget(null)} className="flex-1 py-3 bg-[#F9F9FF] border border-[#E5E7EB] text-[#616363] font-bold rounded-xl text-xs" style={{ fontFamily: "var(--font-ui)" }}>
                Annuler
              </button>
              <Link href="/play" className="flex-1 py-3 bg-[#0A241E] text-white text-center font-bold rounded-xl text-xs block" style={{ fontFamily: "var(--font-ui)" }}>
                Enregistrer match
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QRScannerOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-4 p-6">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center space-y-3">
        <p className="text-3xl">📷</p>
        <p className="text-sm font-bold text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>Scanner à venir</p>
        <p className="text-xs text-[#616363]" style={{ fontFamily: "var(--font-ui)" }}>Fonctionnalité en cours de développement.</p>
        <button type="button" onClick={onClose} className="w-full py-2.5 bg-[#0A241E] text-white rounded-xl text-xs font-bold" style={{ fontFamily: "var(--font-ui)" }}>
          Fermer
        </button>
      </div>
    </div>
  );
}
