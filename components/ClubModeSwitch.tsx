"use client";

import { useRouter } from "next/navigation";
import { useSession } from "./SessionProvider";

type ClubItem = {
  id: string;
  name: string;
  logo: string;
  role: "creator" | "admin" | "member";
};

export default function ClubModeSwitch({ clubs }: { clubs: ClubItem[] }) {
  const { setMode, setActiveClub } = useSession();
  const router = useRouter();
  const adminClubs = clubs.filter(
    (c) => c.role === "creator" || c.role === "admin",
  );

  if (adminClubs.length === 0) return null;

  function activate(clubId: string) {
    setActiveClub(clubId);
    setMode("club");
    router.push("/club-dashboard");
  }

  return (
    <section className="border-b" style={{ borderColor: "var(--color-line)" }}>
      <div className="px-4 py-4">
        <p
          className="mb-2 text-[10px] font-bold uppercase tracking-widest"
          style={{
            color: "var(--color-forest)",
            fontFamily: "var(--font-ui)",
          }}
        >
          Vous gérez {adminClubs.length} club{adminClubs.length > 1 ? "s" : ""}
        </p>
        <div className="space-y-2">
          {adminClubs.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => activate(c.id)}
              className="flex w-full items-center gap-3 p-3 text-left transition-colors"
              style={{
                background: "var(--color-forest-deep)",
                color: "#f6f1e3",
              }}
            >
              <span
                className="grid h-10 w-10 place-items-center text-xl"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                {c.logo}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-semibold"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {c.name}
                </p>
                <p
                  className="truncate text-[10px] font-bold uppercase tracking-widest"
                  style={{
                    color: "var(--color-gold)",
                    fontFamily: "var(--font-ui)",
                  }}
                >
                  Ouvrir le mode admin · {c.role}
                </p>
              </div>
              <span
                className="text-lg"
                style={{ color: "var(--color-gold)" }}
              >
                →
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
