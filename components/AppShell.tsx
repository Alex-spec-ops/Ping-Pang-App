"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";
import ClubBottomNav from "./club-admin/ClubBottomNav";
import { SessionProvider } from "./SessionProvider";

// Ces paths n'affichent pas la BottomNav joueur
const NO_NAV_PATHS = ["/login", "/signup", "/club-dashboard"];

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const showNav = !NO_NAV_PATHS.some((p) => pathname.startsWith(p));
  const isMap = pathname.startsWith("/map");
  const isClubDashboard = pathname.startsWith("/club-dashboard");

  return (
    <>
      <div
        className="mx-auto flex min-h-dvh max-w-md flex-col"
        style={{
          background: isClubDashboard ? "var(--color-forest-deep)" : "#F9F9FF",
          color: isClubDashboard ? "#f6f1e3" : "var(--color-ink)",
        }}
      >
        <main className={(showNav && !isMap) || isClubDashboard ? "flex-1 pb-20" : "flex-1"}>{children}</main>
      </div>
      {isClubDashboard ? <ClubBottomNav /> : showNav ? <BottomNav /> : null}
    </>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ShellInner>{children}</ShellInner>
    </SessionProvider>
  );
}
