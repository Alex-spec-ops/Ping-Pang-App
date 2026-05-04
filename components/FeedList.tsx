"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import ActivityCard from "./ActivityCard";
import { applyFilter, getPage, PAGE_SIZE, sortFeed, type FeedFilter } from "../lib/feed";
import type { Activity } from "../lib/types";

const FILTERS: { id: FeedFilter; label: string }[] = [
  { id: "all",     label: "Tout" },
  { id: "friends", label: "👥 Amis" },
  { id: "club",    label: "🏛 Mon club" },
  { id: "events",  label: "🏆 Événements" },
];

export default function FeedList({ items }: { items: Activity[] }) {
  const [filter, setFilter] = useState<FeedFilter>("all");
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [, startTransition] = useTransition();

  // Pull-to-refresh state
  const [pullDelta, setPullDelta] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Sorted + filtered feed
  const sorted = sortFeed(applyFilter(items, filter));
  const { items: visible, hasMore } = getPage(sorted, page);

  // Sentinel for infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startTransition(() => setPage((p) => p + 1));
        }
      },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore]);

  // Reset page on filter change
  useEffect(() => setPage(0), [filter]);

  // Simulate refresh
  const doRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshKey((k) => k + 1);
      setRefreshing(false);
    }, 900);
  }, []);

  // Touch pull-to-refresh
  function onTouchStart(e: React.TouchEvent) {
    if (listRef.current && listRef.current.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  }
  function onTouchMove(e: React.TouchEvent) {
    if (touchStartY.current === null) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) setPullDelta(Math.min(delta * 0.45, 72));
  }
  function onTouchEnd() {
    if (pullDelta > 52) doRefresh();
    setPullDelta(0);
    touchStartY.current = null;
  }

  return (
    <div
      ref={listRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Filter bar ─────────────────────────────────── */}
      <div className="sticky top-[--feed-offset] z-20 flex items-center gap-2 overflow-x-auto border-b border-zinc-100 bg-white/95 px-4 py-2 backdrop-blur dark:border-zinc-800 dark:bg-black/95">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f.id
                ? f.id === "events"
                  ? "bg-emerald-600 text-white"
                  : f.id === "friends"
                  ? "bg-violet-600 text-white"
                  : f.id === "club"
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-900 text-white dark:bg-white dark:text-black"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {f.label}
          </button>
        ))}

        {/* Refresh button */}
        <button
          type="button"
          onClick={doRefresh}
          disabled={refreshing}
          aria-label="Actualiser"
          className="ml-auto shrink-0 grid h-7 w-7 place-items-center rounded-full bg-zinc-100 text-sm text-zinc-600 transition-all hover:bg-zinc-200 disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-300"
          style={{
            animation: refreshing ? "spin 0.8s linear infinite" : undefined,
          }}
        >
          ↻
        </button>
      </div>

      {/* ── Pull indicator ─────────────────────────────── */}
      {(pullDelta > 0 || refreshing) && (
        <div
          className="flex items-center justify-center text-xs text-zinc-400 transition-all"
          style={{ height: refreshing ? 40 : pullDelta }}
        >
          <span
            style={{
              animation: refreshing ? "spin 0.8s linear infinite" : undefined,
              opacity: refreshing || pullDelta > 20 ? 1 : 0,
            }}
          >
            ↻
          </span>
          <span className="ml-1.5">
            {refreshing ? "Actualisation…" : pullDelta > 52 ? "Relâcher" : "Tirer pour actualiser"}
          </span>
        </div>
      )}

      {/* ── Feed ───────────────────────────────────────── */}
      <div key={`${filter}-${refreshKey}`}>
        {visible.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-3xl">🏓</p>
            <p className="mt-3 text-sm font-medium text-zinc-500">
              Aucun contenu pour ce filtre.
            </p>
          </div>
        ) : (
          <>
            {visible.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))}

            {/* ── Sentinel / load-more ────────────────── */}
            {hasMore ? (
              <div ref={sentinelRef} className="flex justify-center py-5">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span style={{ animation: "spin 1s linear infinite" }}>↻</span>
                  Chargement…
                </div>
              </div>
            ) : (
              <p className="py-8 text-center text-xs text-zinc-400">
                — {sorted.length} post{sorted.length > 1 ? "s" : ""} au total —
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
