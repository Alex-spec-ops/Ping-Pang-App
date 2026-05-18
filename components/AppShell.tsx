"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";
import ClubBottomNav from "./ClubBottomNav";
import { SessionProvider, useSession } from "./SessionProvider";

const NO_NAV_PATHS = ["/login", "/signup"];

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session, ready } = useSession();

  const showNav = !NO_NAV_PATHS.some((p) => pathname.startsWith(p));
  const inClubArea = pathname.startsWith("/club-dashboard");

  // Force club nav when navigating club dashboard, even if session mode
  // hasn't been switched yet (e.g. first arrival from the toggle).
  const useClubNav = inClubArea || (session.mode === "club" && ready);

  return (
    <>
      <div
        className="mx-auto flex min-h-dvh max-w-md flex-col"
        style={{
          background: useClubNav ? "var(--color-forest-deep)" : "#fff",
          color: useClubNav ? "#f6f1e3" : "var(--color-ink)",
        }}
      >
        <main className={showNav ? "flex-1 pb-20" : "flex-1"}>{children}</main>
      </div>
      {showNav ? useClubNav ? <ClubBottomNav /> : <BottomNav /> : null}
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
