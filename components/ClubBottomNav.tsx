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
    href: "/club-dashboard",
    label: "Tableau",
    icon: "📊",
    match: (p) => p === "/club-dashboard",
  },
  {
    href: "/club-dashboard/members",
    label: "Membres",
    icon: "👥",
    match: (p) => p.startsWith("/club-dashboard/members"),
  },
  {
    href: "/club-dashboard/tournaments",
    label: "Tournois",
    icon: "🏆",
    match: (p) => p.startsWith("/club-dashboard/tournaments"),
  },
  {
    href: "/club-dashboard/territory",
    label: "Territoire",
    icon: "👑",
    match: (p) => p.startsWith("/club-dashboard/territory"),
  },
  {
    href: "/club-dashboard/communication",
    label: "Comm",
    icon: "📣",
    match: (p) => p.startsWith("/club-dashboard/communication"),
  },
  {
    href: "/club-dashboard/settings",
    label: "Réglages",
    icon: "⚙️",
    match: (p) => p.startsWith("/club-dashboard/settings"),
  },
];

export default function ClubBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(14,61,46,0.97)",
        backdropFilter: "blur(12px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {tabs.map((t) => {
          const active = t.match(pathname);
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className="flex h-16 flex-col items-center justify-center gap-1 transition-colors"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: active ? "var(--color-gold)" : "rgba(255,255,255,0.65)",
                }}
              >
                <span className="text-xl leading-none">{t.icon}</span>
                <span>{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
