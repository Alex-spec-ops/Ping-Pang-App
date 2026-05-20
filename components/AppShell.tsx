"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";
import { SessionProvider } from "./SessionProvider";

const NO_NAV_PATHS = ["/login", "/signup"];

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const showNav = !NO_NAV_PATHS.some((p) => pathname.startsWith(p)) && !pathname.startsWith("/map");

  return (
    <>
      <div
        className="mx-auto flex min-h-dvh max-w-md flex-col"
        style={{ background: "#fff", color: "var(--color-ink)" }}
      >
        <main className={showNav ? "flex-1 pb-20" : "flex-1"}>{children}</main>
      </div>
      {showNav ? <BottomNav /> : null}
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
