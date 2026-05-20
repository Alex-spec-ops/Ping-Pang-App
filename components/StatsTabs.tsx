"use client";

import { useState } from "react";

type Tab = {
  id: string;
  label: string;
  icon: string;
  content: React.ReactNode;
};

export default function StatsTabs({ tabs }: { tabs: Tab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);

  return (
    <>
      <nav
        className="sticky top-0 z-30 border-b border-[#E5E7EB]"
        style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
        }}
      >
        <ul className="mx-auto flex max-w-md items-stretch">
          {tabs.map((tab) => {
            const active = activeId === tab.id;
            return (
              <li key={tab.id} className="relative flex-1">
                <button
                  type="button"
                  onClick={() => setActiveId(tab.id)}
                  className="flex w-full h-12 items-center justify-center gap-1.5 transition-all"
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: active ? "var(--color-forest)" : "var(--color-muted)",
                  }}
                >
                  <span className="text-sm leading-none">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {active && (
                    <span
                      className="absolute bottom-0 h-0.5 w-8"
                      style={{ background: "var(--color-forest)" }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {tabs.map((tab) => (
        <div key={tab.id} hidden={activeId !== tab.id}>
          {tab.content}
        </div>
      ))}
    </>
  );
}
