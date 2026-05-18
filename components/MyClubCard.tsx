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
        className="mx-4 mt-3 mb-4 p-3 text-center text-sm"
        style={{
          background: "var(--color-cream)",
          border: "var(--border-thin)",
          color: "var(--color-muted)",
          fontFamily: "var(--font-ui)",
        }}
      >
        ✓ Tu as quitté {club.name}.
      </div>
    );
  }

  const myMatches = club.myWins + club.myLosses;
  const myWinRate =
    myMatches > 0 ? Math.round((club.myWins / myMatches) * 100) : 0;

  return (
    <section className="px-4 pt-3">
      <p
        className="mb-2 text-[10px] font-bold uppercase tracking-widest"
        style={{
          color: "var(--color-forest)",
          fontFamily: "var(--font-ui)",
        }}
      >
        Mon club
      </p>

      <div
        className="overflow-hidden"
        style={{
          background: "var(--color-forest)",
          color: "#fff",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center text-2xl"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            {club.logo}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p
                className="truncate text-base font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {club.name}
              </p>
              {club.role !== "member" && (
                <span
                  className="shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{
                    background: "var(--color-gold)",
                    color: "var(--color-forest-deep)",
                    fontFamily: "var(--font-ui)",
                  }}
                >
                  {club.role}
                </span>
              )}
            </div>
            <p
              className="truncate text-[11px]"
              style={{
                color: "rgba(255,255,255,0.7)",
                fontFamily: "var(--font-ui)",
              }}
            >
              {club.countryFlag} {club.city} · #{club.rank} au classement
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div
          className="grid grid-cols-4 gap-px"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <Stat label="Membres" value={String(club.memberCount)} />
          <Stat
            label="Matchs"
            value={String(club.totalMatches)}
            hint="club"
          />
          <Stat
            label="Winrate"
            value={`${club.winRate}%`}
            hint="club"
            accent
          />
          <Stat
            label="Mes V-D"
            value={`${club.myWins}-${club.myLosses}`}
            hint={myMatches > 0 ? `${myWinRate}%` : "—"}
          />
        </div>

        {/* Actions */}
        <div
          className="flex gap-2 p-3"
          style={{ background: "var(--color-forest-deep)" }}
        >
          <Link
            href={`/club/${club.id}`}
            className="flex-1 py-2 text-center text-[11px] font-bold uppercase tracking-wider"
            style={{
              background: "var(--color-gold)",
              color: "var(--color-forest-deep)",
              fontFamily: "var(--font-ui)",
            }}
          >
            Voir le club
          </Link>
          <button
            type="button"
            onClick={() => setConfirm(true)}
            className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider"
            style={{
              background: "transparent",
              color: "#ff7676",
              border: "1px solid #ff7676",
              fontFamily: "var(--font-ui)",
            }}
          >
            Quitter
          </button>
        </div>
      </div>

      {confirm && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setConfirm(false)}
          />
          <div
            className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 p-5"
            style={{ background: "#fff", border: "var(--border-thin)" }}
          >
            <p
              className="text-base font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Quitter {club.name} ?
            </p>
            <p
              className="mt-2 text-sm"
              style={{
                color: "var(--color-muted)",
                fontFamily: "var(--font-ui)",
              }}
            >
              {club.role === "creator"
                ? "Tu es le créateur du club — quitter le club ne le supprimera pas, mais tu perdras tes droits d'admin."
                : "Tu pourras toujours rejoindre à nouveau plus tard si le club est public."}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirm(false)}
                className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider"
                style={{
                  background: "var(--color-cream)",
                  color: "var(--color-ink)",
                  border: "var(--border-thin)",
                  fontFamily: "var(--font-ui)",
                }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirm(false);
                  setHidden(true);
                }}
                className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider"
                style={{
                  background: "#c4423a",
                  color: "#fff",
                  fontFamily: "var(--font-ui)",
                }}
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

function Stat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className="p-2 text-center"
      style={{ background: "var(--color-forest)" }}
    >
      <p
        className="text-base font-bold tabular-nums"
        style={{
          color: accent ? "var(--color-gold)" : "#fff",
          fontFamily: "var(--font-display)",
        }}
      >
        {value}
      </p>
      <p
        className="text-[9px] font-bold uppercase tracking-wider"
        style={{
          color: "rgba(255,255,255,0.6)",
          fontFamily: "var(--font-ui)",
        }}
      >
        {label}
        {hint ? ` · ${hint}` : ""}
      </p>
    </div>
  );
}
