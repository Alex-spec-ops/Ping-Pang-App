"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
  href: string;
  label: string;
  icon: React.ReactNode;
  match: (path: string) => boolean;
};

function RecordIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="10" stroke={color} strokeWidth="2" />
      <circle cx="11" cy="11" r="5" fill={color} />
    </svg>
  );
}

const tabs: Tab[] = [
  { href: "/feed",    label: "Feed",        icon: "🏓", match: (p) => p === "/" || p.startsWith("/feed") },
  { href: "/map",     label: "Carte",       icon: "🗺",  match: (p) => p.startsWith("/map") },
  { href: "/play",    label: "Enregistrer", icon: null,  match: (p) => p.startsWith("/play") || p.startsWith("/match") },
  { href: "/profile", label: "Profil",      icon: "👤", match: (p) => p.startsWith("/profile") },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        borderTop: "1px solid var(--color-line)",
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {tabs.map((t) => {
          const active = t.match(pathname);
          const color = active ? "var(--color-forest)" : "var(--color-muted)";
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className="flex h-16 flex-col items-center justify-center gap-1 transition-colors"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color,
                }}
              >
                {t.href === "/play"
                  ? <RecordIcon color={color} />
                  : <span className="text-xl leading-none">{t.icon}</span>
                }
                <span>{t.label}</span>
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
  );
}
