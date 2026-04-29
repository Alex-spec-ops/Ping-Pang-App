"use client";

import { useState } from "react";
import ActivityCard from "./ActivityCard";
import { getMatch } from "../lib/data";
import { isCompetitive, type Activity } from "../lib/types";

type Filter = "all" | "competitive" | "casual";

export default function FeedList({ items }: { items: Activity[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = items.filter((a) => {
    if (filter === "all") return true;
    if (a.kind !== "match") return false;
    if (!a.matchId) return false;
    const match = getMatch(a.matchId);
    if (!match) return false;
    return filter === "competitive"
      ? isCompetitive(match.mode)
      : !isCompetitive(match.mode);
  });

  return (
    <>
      <div className="sticky top-[--feed-offset] z-20 flex gap-2 overflow-x-auto border-b border-zinc-100 bg-white/95 px-4 py-2 backdrop-blur dark:border-zinc-800 dark:bg-black/95">
        <Pill
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="Tout"
        />
        <Pill
          active={filter === "competitive"}
          onClick={() => setFilter("competitive")}
          label="🏆 Compétitif"
          activeClass="bg-emerald-600 text-white"
        />
        <Pill
          active={filter === "casual"}
          onClick={() => setFilter("casual")}
          label="🤝 Amical"
          activeClass="bg-zinc-700 text-white dark:bg-white dark:text-black"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-zinc-500">
          Aucune activité pour ce filtre.
        </p>
      ) : (
        <div>
          {filtered.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
      )}
    </>
  );
}

function Pill({
  active,
  onClick,
  label,
  activeClass = "bg-zinc-900 text-white dark:bg-white dark:text-black",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  activeClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? activeClass
          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
      }`}
    >
      {label}
    </button>
  );
}
