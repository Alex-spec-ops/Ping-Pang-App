"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/club-dashboard",               label: "Dashboard",      icon: <img src="/icons/graphique.png" alt="Dashboard" className="w-5 h-5 object-contain brightness-0 invert" />, exact: true },
  { href: "/club-dashboard/members",        label: "Membres",        icon: <img src="/icons/membres.png" alt="Membres" className="w-5 h-5 object-contain brightness-0 invert" /> },
  { href: "/club-dashboard/tournaments",    label: "Tournois",       icon: <img src="/icons/tournoi.png" alt="Tournois" className="w-5 h-5 object-contain brightness-0 invert" /> },
  { href: "/club-dashboard/communication",  label: "Comms",          icon: <img src="/icons/promotion.png" alt="Comms" className="w-5 h-5 object-contain brightness-0 invert" /> },
  { href: "/club-dashboard/settings",       label: "Réglages",       icon: <img src="/icons/reparation.png" alt="Réglages" className="w-5 h-5 object-contain brightness-0 invert" /> },
];

export default function ClubBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: "rgba(4,18,12,0.97)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {tabs.map((t) => {
          const active = t.exact ? pathname === t.href : pathname.startsWith(t.href);
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className="flex h-16 flex-col items-center justify-center gap-1"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "9px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: active ? "var(--color-gold)" : "rgba(255,255,255,0.45)",
                }}
              >
                <span className="text-xl leading-none">{t.icon}</span>
                <span>{t.label}</span>
                {active && (
                  <span
                    className="absolute bottom-0 h-0.5 w-8"
                    style={{ background: "var(--color-gold)" }}
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
