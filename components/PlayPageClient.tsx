"use client";

import { useState } from "react";
import MapPageClient from "./MapPageClient";
import RegisterMatchClient from "./RegisterMatchClient";

export default function PlayPageClient() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative h-dvh overflow-hidden">
      {/* Map fills the screen */}
      <div className="absolute inset-0">
        <MapPageClient />
      </div>

      {/* Hint banner (top, above safe area) */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-10 px-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)" }}
      >
        <div
          className="pointer-events-auto mx-auto flex max-w-md items-center gap-2 px-3 py-2"
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(8px)",
            border: "var(--border-thin)",
            fontFamily: "var(--font-ui)",
          }}
        >
          <span className="text-base">📍</span>
          <p className="text-[11px] leading-tight">
            <span className="font-bold">Trouve une table</span> autour de toi, puis
            <span className="font-bold"> enregistre ton match</span> (amical ou
            classé).
          </p>
        </div>
      </div>

      {/* FAB above bottom nav */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute right-4 z-20 flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wider shadow-lg"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 88px)",
          background: "var(--color-forest)",
          color: "#fff",
          fontFamily: "var(--font-ui)",
        }}
      >
        <span className="text-lg leading-none">⊕</span>
        Enregistrer un match
      </button>

      {/* Bottom sheet */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-h-[85dvh] max-w-md flex-col bg-white shadow-2xl"
            style={{
              borderTop: "2px solid var(--color-forest)",
              animation: "slideUp 0.25s var(--ease-out)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "var(--border-thin)" }}
            >
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{
                    color: "var(--color-forest)",
                    fontFamily: "var(--font-ui)",
                  }}
                >
                  Enregistrer un match
                </p>
                <p
                  className="text-base font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Amical ou classé ?
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="grid h-9 w-9 place-items-center text-lg"
                style={{
                  background: "var(--color-cream)",
                  border: "var(--border-thin)",
                }}
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto pb-20">
              <RegisterMatchClient />
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
