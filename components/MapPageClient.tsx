"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Avatar from "./Avatar";
import { CURRENT_USER_ID, getPlayer } from "../lib/data";

export default function MapPageClient() {
  const me = getPlayer(CURRENT_USER_ID);

  // States
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.1);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<"tout" | "segments">("tout");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [challengeTarget, setChallengeTarget] = useState<string | null>(null);

  // Refs for dragging
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  // Mouse / Touch handlers for panning
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { x: clientX, y: clientY };
    panStart.current = { ...pan };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    setPan({
      x: panStart.current.x + dx,
      y: panStart.current.y + dy,
    });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleZoom = (direction: "in" | "out") => {
    setZoom((prev) => {
      const next = direction === "in" ? prev + 0.15 : prev - 0.15;
      return Math.max(0.7, Math.min(2.5, next));
    });
  };

  const handleRecenter = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1.1);
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#c9e8f5] select-none">
      {/* 1. Interactive Stylized Vector Map */}
      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
        }}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            handleStart(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 1) {
            handleMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchEnd={handleEnd}
      >
        {/* SVG background representing coastline, water, land, roads */}
        <svg
          viewBox="0 0 800 800"
          className="w-[1200px] h-[1200px] absolute top-[-200px] left-[-200px] pointer-events-none"
        >
          {/* Water background */}
          <rect width="800" height="800" fill="#56B1E6" />

          {/* Land mass (Green Peninsula) */}
          <path
            d="M 0,300 
               C 200,280 320,180 380,0 
               L 800,0 
               L 800,800 
               C 600,800 480,720 420,500
               C 380,380 250,320 0,300 Z"
            fill="#A3E47A"
          />

          {/* Forest details (darker green circles) */}
          <circle cx="550" cy="120" r="45" fill="#8AC261" />
          <circle cx="680" cy="220" r="60" fill="#8AC261" />
          <circle cx="610" cy="380" r="50" fill="#8AC261" />
          <circle cx="490" cy="280" r="35" fill="#8AC261" />
          <circle cx="580" cy="550" r="55" fill="#8AC261" />

          {/* Roads (White curved lines) */}
          <path
            d="M 380,0 C 440,250 200,300 0,300"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 450,220 C 580,240 620,450 420,500"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 520,0 C 520,200 800,280 800,320"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 420,500 L 800,750"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>

        {/* Map pins layered on top (with relative offset positions) */}
        {/* 1. Flag Pin (Métro Souterrain) */}
        <div
          className="absolute left-[45%] top-[25%] -translate-x-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center h-10 w-10 rounded-full bg-[#000A07] border-2 border-white shadow-lg transition-transform hover:scale-110 active:scale-95"
          onClick={(e) => {
            e.stopPropagation();
            alert("Segment chaud : Métro Souterrain");
          }}
        >
          <span className="text-base">🏴</span>
        </div>

        {/* 2. User/Player Avatar Pin */}
        <div
          className="absolute left-[24%] top-[21%] -translate-x-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center h-8 w-8 rounded-full bg-[#8E9090] border-2 border-white shadow-lg transition-transform hover:scale-110 active:scale-95"
          onClick={(e) => {
            e.stopPropagation();
            alert("Sarah Miller est à proximité");
          }}
        >
          <span className="text-xs">👤</span>
        </div>
      </div>

      {/* 2. Floating action buttons on map */}
      <div className="absolute right-4 top-[20%] z-20 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleRecenter}
          className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#0A241E] shadow-xl border border-[#E5E7EB] hover:scale-105 active:scale-95 transition-all"
          title="Recentre la carte"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleZoom("in")}
          className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#0A241E] shadow-xl border border-[#E5E7EB] hover:scale-105 active:scale-95 transition-all"
          title="Zoomer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      {/* 3. Top Header Overlay */}
      <div
        className="absolute left-0 right-0 top-0 z-30 mx-auto max-w-md"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/20 to-transparent">
          <div className="flex items-center gap-2">
            <Avatar emoji={me?.avatar ?? "🐧"} size="sm" />
            <span
              className="text-base font-extrabold uppercase tracking-tight text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              PING PANG & CO.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* SCANNER pill button */}
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#000A07]/90 text-white text-[9px] font-black uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.625 13.5h.75m-.75 3h.75m-.75 3h.75M13.5 13.5h.75m-.75 3h.75m-.75 3h.75m3.75-6v-3h-3" />
              </svg>
              <span>Scanner</span>
            </button>

            {/* Settings gear */}
            <Link
              href="/profile"
              className="grid h-8 w-8 place-items-center rounded-full bg-white/90 border border-white/20 shadow-md transition-all hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#0A241E]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Bottom Drawer Sheet */}
      <div className="absolute bottom-16 left-0 right-0 z-30 mx-auto max-w-md max-h-[55dvh] overflow-y-auto bg-white rounded-t-3xl shadow-[0px_-8px_30px_rgba(10,36,30,0.12)] pb-6 flex flex-col border border-[#E5E7EB]">
        {/* Drag Handle */}
        <div className="flex justify-center py-2.5 shrink-0 bg-white sticky top-0 z-10">
          <div className="w-12 h-1 bg-[#DFE0E0] rounded-full" />
        </div>

        {/* Content Inside Drawer */}
        <div className="px-4 space-y-5">
          {/* VOTRE CLASSEMENT */}
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-[9px] font-bold text-[#616363] uppercase tracking-wider"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                Votre classement
              </p>
              <h2
                className="text-2xl font-black uppercase text-[#0A241E] leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                RANK #1,240
              </h2>
              <p className="text-xs font-semibold text-[#616363] mt-0.5">
                1,540 ELO
              </p>
            </div>
            {/* Prochain palier bubble */}
            <div
              className="px-4 py-2.5 rounded-full bg-[#D1EAE2] flex flex-col items-center justify-center min-w-[100px]"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              <span className="text-[7.5px] font-black uppercase tracking-widest text-[#0A241E] leading-none">
                Prochain Palier:
              </span>
              <span className="text-sm font-black text-[#0A241E] mt-0.5 leading-none">
                +20
              </span>
            </div>
          </div>

          <hr className="border-[#E5E7EB]" />

          {/* ACTION LOCALE */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span
                className="text-[10px] font-black uppercase tracking-wider text-[#0A241E]"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                Action locale
              </span>
              {/* Filter pills */}
              <div className="flex bg-[#F0F3FF] p-0.5 rounded-lg border border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setActiveTab("tout")}
                  className={`px-3 py-1 rounded-md text-[8.5px] font-black uppercase tracking-wider transition-colors ${
                    activeTab === "tout" ? "bg-[#0A241E] text-white" : "text-[#616363]"
                  }`}
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  Tout
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("segments")}
                  className={`px-3 py-1 rounded-md text-[8.5px] font-black uppercase tracking-wider transition-colors ${
                    activeTab === "segments" ? "bg-[#0A241E] text-white" : "text-[#616363]"
                  }`}
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  Segments
                </button>
              </div>
            </div>

            {/* Segment chaud card */}
            <div className="p-4 bg-white border border-[#E5E7EB] rounded-3xl space-y-3 shadow-[0px_4px_12px_rgba(0,0,0,0.01)]">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-xs">🏠</span>
                  <span
                    className="text-[9px] font-black uppercase tracking-widest text-[#0A241E]"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    Segment Chaud
                  </span>
                </div>
                <span
                  className="px-2 py-0.5 rounded bg-[#F0F3FF] border border-[#E5E7EB] text-[8.5px] font-black text-[#0A241E]"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  0.4 km
                </span>
              </div>

              <h3 className="text-lg font-black uppercase text-[#0A241E]" style={{ fontFamily: "var(--font-display)" }}>
                MÉTRO SOUTERRAIN
              </h3>

              <div className="flex items-center justify-between gap-4">
                {/* Boss card */}
                <div className="flex-1 p-2 bg-[#F0F3FF] border border-[#E5E7EB] rounded-xl flex items-center gap-2">
                  <div className="shrink-0 scale-90">
                    <Avatar emoji="🐺" size="sm" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[7.5px] font-black uppercase text-[#616363]" style={{ fontFamily: "var(--font-ui)" }}>
                      Boss Actuel
                    </p>
                    <p className="text-xs font-bold text-[#0A241E] truncate" style={{ fontFamily: "var(--font-ui)" }}>
                      Alex C.
                    </p>
                  </div>
                </div>

                {/* Rétention bar chart */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-center text-[7.5px] font-black uppercase text-[#616363]" style={{ fontFamily: "var(--font-ui)" }}>
                    <span>Rétention</span>
                    <span className="tabular-nums font-extrabold text-[#0A241E]">7/10</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-[#0A241E] rounded-full" style={{ width: "70%" }} />
                  </div>
                </div>
              </div>

              {/* Challenge Button */}
              <button
                type="button"
                onClick={() => setChallengeTarget("Alex C.")}
                className="w-full py-2.5 rounded-xl border border-[#0A241E] text-xs font-black uppercase text-[#0A241E] tracking-wider transition-all hover:bg-[#F9F9FF] active:scale-98"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                Défier le boss
              </button>
            </div>
          </div>

          {/* JOUEURS À PROXIMITÉ */}
          <div className="space-y-2">
            <h3
              className="text-[10px] font-black uppercase tracking-wider text-[#0A241E] mb-3"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              Joueurs à proximité
            </h3>

            {/* List */}
            <div className="space-y-2">
              {/* Player 1: Sarah Miller */}
              <div className="p-3 bg-white border border-[#E5E7EB] rounded-2xl flex items-center justify-between shadow-[0px_4px_12px_rgba(0,0,0,0.01)]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar emoji="🦊" size="sm" />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
                      Sarah Miller
                    </h4>
                    <p className="text-[9px] font-bold text-[#616363] uppercase mt-0.5">
                      1,890 ELO · Proche
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setChallengeTarget("Sarah Miller")}
                  className="px-4 py-2 rounded-lg bg-[#0A241E] text-white text-[9px] font-black uppercase tracking-wider hover:opacity-90 transition-all active:scale-95"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  Défier
                </button>
              </div>

              {/* Player 2: Marc L. */}
              <div className="p-3 bg-white border border-[#E5E7EB] rounded-2xl flex items-center justify-between shadow-[0px_4px_12px_rgba(0,0,0,0.01)]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar emoji="🐉" size="sm" />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#BAE0D4] border-2 border-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
                      Marc L.
                    </h4>
                    <p className="text-[9px] font-bold text-[#616363] uppercase mt-0.5">
                      1,420 ELO · 2 KM
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled
                  className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-[#616363] text-[9px] font-black uppercase tracking-wider opacity-60 cursor-not-allowed"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  Défier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Custom 4-Tab Bottom Nav Footer */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E5E7EB]"
        style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-around">
          {[
            { id: "suivi", label: "Suivi", icon: "📊", href: "/stats" },
            { id: "classement", label: "Classement", icon: "🏆", href: "/stats" },
            { id: "matchs", label: "Matchs", icon: "🏁", href: "/map" },
            { id: "club", label: "Club", icon: "👥", href: "/clubs" },
          ].map((tab) => {
            const active = tab.id === "matchs";
            return (
              <li key={tab.id} className="relative flex-1">
                <Link
                  href={tab.href}
                  className="flex w-full h-16 flex-col items-center justify-center gap-1 transition-all"
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: active ? "var(--color-forest)" : "var(--color-muted)",
                  }}
                >
                  <span className="text-xl leading-none">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {active && (
                    <span
                      className="absolute bottom-0 h-0.5 w-8"
                      style={{ background: "var(--color-forest)" }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 6. Scanner Overlay camera simulation */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col justify-between p-6">
          <div className="flex justify-between items-center pt-8">
            <span className="text-white font-extrabold uppercase text-xs" style={{ fontFamily: "var(--font-ui)" }}>
              Ping Pang QR Scan
            </span>
            <button
              type="button"
              onClick={() => setIsScannerOpen(false)}
              className="px-3 py-1 bg-white/20 text-white rounded-lg text-xs hover:bg-white/30"
            >
              ✕ Fermer
            </button>
          </div>

          {/* Cutout and scanning line */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 border-2 border-white/60 rounded-3xl overflow-hidden shadow-2xl">
              {/* Scan Line Laser */}
              <div
                className="absolute left-0 right-0 h-1.5 bg-green-400 opacity-80"
                style={{
                  animation: "laserScan 2.5s ease-in-out infinite",
                }}
              />
              {/* Corner markers */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-white" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-white" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-white" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-white" />
            </div>
            <p className="text-white/70 text-xs font-semibold text-center mt-6 px-4">
              Pointez l&apos;appareil photo vers un QR code Ping Pang.
            </p>
          </div>

          <div className="pb-12 text-center text-[10px] text-white/40">
            PING PANG & CO. ELITE SCANNER 1.0
          </div>
        </div>
      )}

      {/* 7. Challenge Action Registration Modal */}
      {challengeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-[#0A241E]" style={{ fontFamily: "var(--font-display)" }}>
              Défier le joueur ?
            </h3>
            <p className="text-xs text-[#616363] leading-relaxed">
              Voulez-vous enregistrer un nouveau match contre <span className="font-bold text-[#0A241E]">{challengeTarget}</span> ?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setChallengeTarget(null)}
                className="flex-1 py-3 bg-[#F0F3FF] text-[#616363] font-bold rounded-xl text-xs"
              >
                Annuler
              </button>
              <Link
                href="/play"
                className="flex-1 py-3 bg-[#0A241E] text-white text-center font-bold rounded-xl text-xs block"
              >
                Enregistrer match
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Styles for scan-line laser animation */}
      <style jsx global>{`
        @keyframes laserScan {
          0% {
            top: 0%;
          }
          50% {
            top: 100%;
          }
          100% {
            top: 0%;
          }
        }
      `}</style>
    </div>
  );
}
