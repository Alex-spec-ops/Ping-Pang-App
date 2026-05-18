"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
  href: string;
  label: string;
  icon: string;
  match: (path: string) => boolean;
};

const tabs: Tab[] = [
  {
    href: "/feed",
    label: "Accueil",
    icon: "🏠",
    match: (p) => p === "/" || p.startsWith("/feed"),
  },
  {
    href: "/play",
    label: "Enregistrer",
    icon: "⊕",
    match: (p) => p.startsWith("/play") || p.startsWith("/map") || p.startsWith("/match"),
  },
  {
    href: "/stats",
    label: "Stats",
    icon: "📊",
    match: (p) => p.startsWith("/stats") || p.startsWith("/leaderboard") || p.startsWith("/u/"),
  },
  {
    href: "/clubs",
    label: "Clubs",
    icon: "🏛️",
    match: (p) => p.startsWith("/clubs") || p.startsWith("/club"),
  },
  {
    href: "/profile",
    label: "Profil",
    icon: "👤",
    match: (p) => p.startsWith("/profile") || p.startsWith("/players"),
  },
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
          const isCenter = t.href === "/play";
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className="relative flex h-16 flex-col items-center justify-center gap-1 transition-colors"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color,
                }}
              >
                {isCenter ? (
                  <span
                    className="grid h-9 w-9 place-items-center text-lg leading-none"
                    style={{
                      background: active
                        ? "var(--color-forest)"
                        : "var(--color-ink)",
                      color: "#fff",
                    }}
                  >
                    {t.icon}
                  </span>
                ) : (
                  <span className="text-xl leading-none">{t.icon}</span>
                )}
                <span>{t.label}</span>
                {active && !isCenter && (
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
