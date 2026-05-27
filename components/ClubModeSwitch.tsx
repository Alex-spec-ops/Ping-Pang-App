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
    <section className="px-4 pt-3 pb-1 border-b border-[#E5E7EB]">
      <p
        className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#0A241E]"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        Vous gérez {adminClubs.length} club{adminClubs.length > 1 ? "s" : ""}
      </p>
      <div className="space-y-2 pb-3">
        {adminClubs.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => activate(c.id)}
            className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:translate-y-[-1px] hover:shadow-[0px_4px_20px_rgba(10,36,30,0.05)]"
            style={{ background: "#fff", border: "1px solid #E5E7EB" }}
          >
            <span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xl"
              style={{ background: "#F9F9FF", border: "1px solid #E5E7EB" }}
            >
              {c.logo}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-sm font-semibold text-[#0A241E]"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {c.name}
              </p>
              <p
                className="truncate text-[10px] font-bold uppercase tracking-widest text-zinc-500"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                Mode admin · {c.role}
              </p>
            </div>
            <span className="text-sm font-bold text-[#0A241E]">→</span>
          </button>
        ))}
      </div>
    </section>
  );
}
