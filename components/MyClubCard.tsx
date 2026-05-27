"use client";

import Link from "next/link";
import { useState } from "react";

export type MyClubInfo = {
  id: string;
  name: string;
  logo: string;
  color: string;
  city: string;
  countryFlag: string;
  role: "creator" | "admin" | "member";
  rank: number;
  memberCount: number;
  totalMatches: number;
  winRate: number;
  myWins: number;
  myLosses: number;
};

export default function MyClubCard({ club }: { club: MyClubInfo }) {
  const [hidden, setHidden] = useState(false);
  const [confirm, setConfirm] = useState(false);

  if (hidden) {
    return (
      <div
        className="mx-4 mt-3 mb-4 rounded-xl p-3 text-center text-sm"
        style={{ background: "#F9F9FF", border: "1px solid #E5E7EB", color: "#616363", fontFamily: "var(--font-ui)" }}
      >
        ✓ Tu as quitté {club.name}.
      </div>
    );
  }

  const myMatches = club.myWins + club.myLosses;
  const myWinRate = myMatches > 0 ? Math.round((club.myWins / myMatches) * 100) : 0;

  return (
    <section className="px-4 pt-3">
      <p
        className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#0A241E]"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        Mon club
      </p>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        {/* Header */}
        <div
          className="flex items-center gap-3 p-4"
          style={{ background: "#0A241E", color: "#fff" }}
        >
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            {club.logo}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-base font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {club.name}
              </p>
              {club.role !== "member" && (
                <span
                  className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{ background: "var(--color-gold)", color: "#0A241E", fontFamily: "var(--font-ui)" }}
                >
                  {club.role}
                </span>
              )}
            </div>
            <p
              className="truncate text-[11px]"
              style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-ui)" }}
            >
              {club.countryFlag} {club.city} · #{club.rank} au classement
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 divide-x divide-[#E5E7EB] border-t border-[#E5E7EB]">
          <Stat label="Membres" value={String(club.memberCount)} />
          <Stat label="Matchs" value={String(club.totalMatches)} />
          <Stat label="Winrate" value={`${club.winRate}%`} accent />
          <Stat
            label="Mes V-D"
            value={`${club.myWins}-${club.myLosses}`}
            hint={myMatches > 0 ? `${myWinRate}%` : "—"}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-[#E5E7EB] p-3">
          <Link
            href={`/club/${club.id}`}
            className="flex-1 rounded-xl py-2 text-center text-[11px] font-bold uppercase tracking-wider text-white"
            style={{ background: "#0A241E", fontFamily: "var(--font-ui)" }}
          >
            Voir le club
          </Link>
          <button
            type="button"
            onClick={() => setConfirm(true)}
            className="rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-wider"
            style={{ background: "transparent", color: "#BA1A1A", border: "1px solid #BA1A1A", fontFamily: "var(--font-ui)" }}
          >
            Quitter
          </button>
        </div>
      </div>

      {confirm && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setConfirm(false)} />
          <div
            className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl p-5"
            style={{ background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 4px 20px rgba(10,36,30,0.1)" }}
          >
            <p className="text-base font-bold text-[#0A241E]" style={{ fontFamily: "var(--font-display)" }}>
              Quitter {club.name} ?
            </p>
            <p className="mt-2 text-sm text-zinc-500" style={{ fontFamily: "var(--font-ui)" }}>
              {club.role === "creator"
                ? "Tu es le créateur du club — quitter le club ne le supprimera pas, mais tu perdras tes droits d'admin."
                : "Tu pourras toujours rejoindre à nouveau plus tard si le club est public."}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirm(false)}
                className="rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-wider"
                style={{ background: "#F9F9FF", color: "#616363", border: "1px solid #E5E7EB", fontFamily: "var(--font-ui)" }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => { setConfirm(false); setHidden(true); }}
                className="rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-wider"
                style={{ background: "#BA1A1A", color: "#fff", fontFamily: "var(--font-ui)" }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function Stat({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className="p-2 text-center">
      <p
        className="text-base font-bold tabular-nums"
        style={{ color: accent ? "#0A241E" : "#0A241E", fontFamily: "var(--font-display)" }}
      >
        {value}
      </p>
      <p
        className="text-[9px] font-bold uppercase tracking-wider text-zinc-500"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        {label}{hint ? ` · ${hint}` : ""}
      </p>
    </div>
  );
}
