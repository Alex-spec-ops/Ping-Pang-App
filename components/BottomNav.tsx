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
    label: "Feed",
    icon: "🏓",
    match: (p) => p === "/" || p.startsWith("/feed"),
  },
  {
    href: "/play",
    label: "Jouer",
    icon: "⚔️",
    match: (p) => p.startsWith("/play") || p.startsWith("/match"),
  },
  {
    href: "/players",
    label: "Joueurs",
    icon: "🏆",
    match: (p) => p.startsWith("/players"),
  },
  {
    href: "/profile",
    label: "Profil",
    icon: "👤",
    match: (p) => p.startsWith("/profile"),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-black/95"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {tabs.map((t) => {
          const active = t.match(pathname);
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                  active
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
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
