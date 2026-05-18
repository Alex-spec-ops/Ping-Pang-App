"use client";

import Link from "next/link";
import { useSession } from "../SessionProvider";

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  clubName: string;
  clubLogo: string;
};

export default function ClubTopBar({
  title,
  subtitle,
  right,
  clubName,
  clubLogo,
}: Props) {
  const { setMode } = useSession();

  return (
    <header
      className="sticky top-0 z-30"
      style={{
        background: "var(--color-forest-deep)",
        color: "#f6f1e3",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div className="mx-auto flex max-w-md items-center gap-3 px-4 pt-3 pb-2">
        <div
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <span className="text-base">{clubLogo}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--color-gold)", fontFamily: "var(--font-ui)" }}
          >
            Mode club · admin
          </p>
          <p
            className="truncate text-sm font-semibold"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {clubName}
          </p>
        </div>
        <Link
          href="/profile"
          onClick={() => setMode("player")}
          className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={{
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#f6f1e3",
            fontFamily: "var(--font-ui)",
          }}
        >
          ← Joueur
        </Link>
      </div>
      <div className="mx-auto flex max-w-md items-end justify-between gap-3 px-4 pb-3">
        <div className="min-w-0">
          <h1
            className="truncate text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h1>
          {subtitle ? (
            <p
              className="truncate text-xs"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    </header>
  );
}
