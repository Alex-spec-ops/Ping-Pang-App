"use client";

import { useState } from "react";

export default function StatsTabs({
  stats,
  ranking,
}: {
  stats: React.ReactNode;
  ranking: React.ReactNode;
}) {
  const [tab, setTab] = useState<"stats" | "ranking">("stats");

  return (
    <>
      <div
        className="sticky z-20 grid grid-cols-2 backdrop-blur"
        style={{
          top: "calc(env(safe-area-inset-top) + 56px)",
          background: "rgba(250,250,247,0.97)",
          borderBottom: "var(--border-thin)",
        }}
      >
        {[
          { id: "stats", label: "📊 Mes stats" },
          { id: "ranking", label: "🏆 Classement" },
        ].map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as "stats" | "ranking")}
              className="py-3 text-[11px] font-bold uppercase tracking-widest transition-colors"
              style={{
                fontFamily: "var(--font-ui)",
                background: active ? "var(--color-forest)" : "transparent",
                color: active ? "#fff" : "var(--color-muted)",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "stats" ? stats : ranking}
    </>
  );
}
