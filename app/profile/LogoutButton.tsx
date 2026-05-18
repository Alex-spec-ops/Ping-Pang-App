"use client";

import { useRouter } from "next/navigation";
import { SESSION_STORAGE_KEY } from "../../lib/session";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full py-3 text-sm font-bold uppercase tracking-wider"
      style={{
        background: "transparent",
        color: "#c4423a",
        border: "1px solid #c4423a",
        fontFamily: "var(--font-ui)",
      }}
    >
      🚪 Se déconnecter
    </button>
  );
}
