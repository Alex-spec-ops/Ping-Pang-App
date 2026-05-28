"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
  href: string;
  label: string;
  icon: React.ReactNode;
  match: (path: string) => boolean;
};

const tabs: Tab[] = [
  {
    href: "/feed",
    label: "Accueil",
    icon: <img src="/icons/ping-pong.png" alt="Accueil" className="w-6 h-6 object-contain" />,
    match: (p) => p === "/" || p.startsWith("/feed"),
  },
  {
    href: "/stats",
    label: "Stats",
    icon: <img src="/icons/graphique.png" alt="Stats" className="w-6 h-6 object-contain" />,
    match: (p) => p.startsWith("/stats") || p.startsWith("/leaderboard") || p.startsWith("/u/"),
  },
  {
    href: "/map",
    label: "Carte",
    icon: <img src="/icons/tennis-de-table.png" alt="Carte" className="w-6 h-6 object-contain" />,
    match: (p) => p.startsWith("/map") || p.startsWith("/play") || p.startsWith("/match"),
  },
  {
    href: "/clubs",
    label: "Clubs",
    icon: <img src="/icons/boite-de-nuit.png" alt="Clubs" className="w-6 h-6 object-contain" />,
    match: (p) => p.startsWith("/clubs") || p.startsWith("/club"),
  },
  {
    href: "/profile",
    label: "Profil",
    icon: <img src="/icons/ping-pong-1.png" alt="Profil" className="w-6 h-6 object-contain" />,
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
                <span className="text-xl leading-none">{t.icon}</span>
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
