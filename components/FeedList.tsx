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
import { challenges, getChallengeCreator, modeLabel } from "../lib/challenges";
import type { PlayerChallenge } from "../lib/challenges";
import { CURRENT_USER_ID, getPlayer } from "../lib/data";

const FILTERS: { id: FeedFilter; label: string }[] = [
  { id: "all",     label: "Tout" },
  { id: "friends", label: "👥 Amis" },
  { id: "club",    label: "🏛 Mon club" },
  { id: "events",  label: "🏆 Événements" },
  { id: "défis",   label: "⚔️ Défis" },
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
      <div
        className="sticky top-[--feed-offset] z-20 flex items-center gap-1 px-2 py-1.5 backdrop-blur"
        style={{ borderBottom: "var(--border-thin)", background: "rgba(250,250,247,0.97)" }}
      >
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className="flex-1 py-1 transition-colors"
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.03em",
              whiteSpace: "nowrap",
              background: filter === f.id ? "var(--color-forest)" : "var(--color-line)",
              color: filter === f.id ? "#fff" : "var(--color-muted)",
            }}
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
          className="shrink-0 grid h-6 w-6 place-items-center text-xs transition-all disabled:opacity-50 ml-1"
          style={{
            border: "var(--border-thin)",
            color: "var(--color-muted)",
            animation: refreshing ? "spin 0.8s linear infinite" : undefined,
          }}
        >
          ↻
        </button>
      </div>

      {/* ── Pull indicator ─────────────────────────────── */}
      {(pullDelta > 0 || refreshing) && (
        <div
          className="flex items-center justify-center text-xs transition-all"
          style={{ height: refreshing ? 40 : pullDelta, color: "var(--color-muted)" }}
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

      {/* ── En Direct (filtre "Tout" uniquement) ── */}
      {filter === "all" && <LiveStrip />}

      {/* ── Vue Défis ──────────────────────────────────── */}
      {filter === "défis" && <AllChallengesView />}

      {/* ── Feed ───────────────────────────────────────── */}
      {filter !== "défis" && (
        <div key={`${filter}-${refreshKey}`}>
          {visible.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-3xl">🏓</p>
              <p className="mt-3 text-sm font-medium" style={{ color: "var(--color-muted)" }}>
                Aucun contenu pour ce filtre.
              </p>
            </div>
          ) : (
            <>
              {visible.map((a, i) => (
                <FeedRow key={a.id} activity={a} index={i} injectChallenges={filter === "all"} />
              ))}

              {/* ── Sentinel / load-more ────────────────── */}
              {hasMore ? (
                <div ref={sentinelRef} className="flex justify-center py-5">
                  <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-muted)" }}>
                    <span style={{ animation: "spin 1s linear infinite" }}>↻</span>
                    Chargement…
                  </div>
                </div>
              ) : (
                <p className="py-8 text-center text-xs" style={{ color: "var(--color-muted)" }}>
                  — {sorted.length} post{sorted.length > 1 ? "s" : ""} au total —
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Bandeau En Direct ─────────────────────────────────────────── */
function LiveStrip() {
  const live = challenges.filter((c) => c.status === "active");
  if (live.length === 0) return null;

  return (
    <div style={{ borderBottom: "var(--border-thin)", background: "var(--color-cream)" }}>
      <div
        className="flex items-center gap-2 px-4 pt-3 pb-1"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: "#e53e3e", boxShadow: "0 0 0 3px #e53e3e33", animation: "pulse 1.5s ease-in-out infinite" }}
        />
        <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e53e3e" }}>
          En Direct
        </span>
        <span style={{ fontSize: "11px", color: "var(--color-muted)", marginLeft: "auto" }}>
          {live.length} match{live.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-3" style={{ scrollbarWidth: "none" }}>
        {live.map((c) => {
          const creator = getChallengeCreator(c);
          const opponentPlayer = c.opponentId ? getPlayer(c.opponentId) : null;
          return (
            <div
              key={c.id}
              className="shrink-0 flex flex-col gap-2 p-3"
              style={{ width: 200, border: "var(--border-thin)", background: "#fff", borderLeft: "3px solid #e53e3e" }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col items-center gap-0.5" style={{ minWidth: 0 }}>
                  <span className="text-2xl leading-none">{creator?.avatar ?? "🏓"}</span>
                  <span className="truncate text-center" style={{ fontSize: "10px", fontWeight: 600, fontFamily: "var(--font-ui)", color: "var(--color-ink)", maxWidth: 60 }}>
                    {creator?.username ?? "—"}
                  </span>
                </div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-muted)" }}>VS</span>
                <div className="flex flex-col items-center gap-0.5" style={{ minWidth: 0 }}>
                  <span className="text-2xl leading-none">{opponentPlayer?.avatar ?? "🏓"}</span>
                  <span className="truncate text-center" style={{ fontSize: "10px", fontWeight: 600, fontFamily: "var(--font-ui)", color: "var(--color-ink)", maxWidth: 60 }}>
                    {opponentPlayer?.username ?? "—"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <span
                  className="px-1.5 py-0.5"
                  style={{ fontSize: "9px", fontWeight: 700, fontFamily: "var(--font-ui)", letterSpacing: "0.06em", textTransform: "uppercase", background: c.mode === "ranked" ? "var(--color-forest)" : "var(--color-line)", color: c.mode === "ranked" ? "#fff" : "var(--color-muted)" }}
                >
                  {modeLabel(c.mode)}
                </span>
                <span style={{ fontSize: "10px", color: "var(--color-muted)", fontFamily: "var(--font-ui)" }}>{c.format}</span>
                {c.venue && <span style={{ fontSize: "10px", color: "var(--color-muted)", fontFamily: "var(--font-ui)" }}>· 📍 {c.venue}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Section Défis (pending + open) ───────────────────────────── */

// Positions dans le feed où injecter un défi (après la carte à cet index)
const INJECT_AT = [1, 4, 8];

// Pool de défis à disperser : pending d'abord, puis open
const injectableChallenges: PlayerChallenge[] = [
  ...challenges.filter((c) => c.opponentId === CURRENT_USER_ID && c.status === "pending"),
  ...challenges.filter((c) => c.status === "open" && c.creatorId !== CURRENT_USER_ID),
];

function FeedRow({
  activity,
  index,
  injectChallenges,
}: {
  activity: Activity;
  index: number;
  injectChallenges: boolean;
}) {
  const injectIndex = INJECT_AT.indexOf(index);
  const challenge = injectChallenges && injectIndex !== -1
    ? injectableChallenges[injectIndex]
    : undefined;

  return (
    <>
      <ActivityCard activity={activity} />
      {challenge && (
        challenge.status === "pending"
          ? <PendingCard key={challenge.id} challenge={challenge} />
          : <OpenCard key={challenge.id} challenge={challenge} />
      )}
    </>
  );
}

function PendingCard({ challenge: c }: { challenge: PlayerChallenge }) {
  const [state, setState] = useState<"idle" | "accepted" | "declined">("idle");
  const creator = getChallengeCreator(c);

  if (state === "declined") return null;

  return (
    <div
      className="mx-4 mb-3 p-3 flex flex-col gap-2"
      style={{ border: "var(--border-thin)", borderLeft: "3px solid #d97706", background: "#fffbeb" }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl leading-none">{creator?.avatar ?? "🏓"}</span>
        <div className="flex flex-col" style={{ minWidth: 0 }}>
          <span style={{ fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-ui)", color: "var(--color-ink)" }}>
            {creator?.fullName ?? "Joueur"} te défie
          </span>
          <span style={{ fontSize: "11px", color: "var(--color-muted)", fontFamily: "var(--font-ui)" }}>
            {modeLabel(c.mode)} · {c.format}{c.venue ? ` · 📍 ${c.venue}` : ""}
          </span>
        </div>
        <span
          className="ml-auto shrink-0 px-1.5 py-0.5"
          style={{ fontSize: "9px", fontWeight: 700, fontFamily: "var(--font-ui)", letterSpacing: "0.06em", textTransform: "uppercase", background: "#d97706", color: "#fff" }}
        >
          En attente
        </span>
      </div>

      {c.message && (
        <p style={{ fontSize: "12px", color: "var(--color-ink)", fontStyle: "italic", margin: 0 }}>
          "{c.message}"
        </p>
      )}

      {state === "accepted" ? (
        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-forest)", fontFamily: "var(--font-ui)" }}>
          ✅ Défi accepté — bonne chance !
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setState("declined")}
            className="flex-1 py-1.5 text-xs font-semibold transition-colors"
            style={{ fontFamily: "var(--font-ui)", border: "var(--border-thin)", background: "#fff", color: "var(--color-muted)" }}
          >
            Décliner
          </button>
          <button
            type="button"
            onClick={() => setState("accepted")}
            className="flex-1 py-1.5 text-xs font-semibold transition-colors"
            style={{ fontFamily: "var(--font-ui)", background: "var(--color-forest)", color: "#fff", border: "none" }}
          >
            ✅ Accepter
          </button>
        </div>
      )}
    </div>
  );
}

function OpenCard({ challenge: c }: { challenge: PlayerChallenge }) {
  const [joined, setJoined] = useState(false);
  const creator = getChallengeCreator(c);

  return (
    <div
      className="mx-4 mb-3 p-3 flex items-center gap-3"
      style={{ border: "var(--border-thin)", borderLeft: "3px solid var(--color-forest)", background: "#fff" }}
    >
      <span className="text-xl leading-none shrink-0">{creator?.avatar ?? "🏓"}</span>
      <div className="flex flex-col flex-1" style={{ minWidth: 0 }}>
        <span style={{ fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-ui)", color: "var(--color-ink)" }}>
          {creator?.fullName ?? "Joueur"}
        </span>
        <span style={{ fontSize: "11px", color: "var(--color-muted)", fontFamily: "var(--font-ui)" }}>
          {modeLabel(c.mode)} · {c.format}{c.venue ? ` · 📍 ${c.venue}` : ""}
        </span>
        {c.message && (
          <span style={{ fontSize: "11px", color: "var(--color-muted)", fontStyle: "italic" }}>"{c.message}"</span>
        )}
      </div>
      <button
        type="button"
        onClick={() => !joined && setJoined(true)}
        disabled={joined}
        className="shrink-0 px-3 py-1.5 text-xs font-semibold transition-colors"
        style={{
          fontFamily: "var(--font-ui)",
          background: joined ? "var(--color-line)" : "var(--color-forest)",
          color: joined ? "var(--color-muted)" : "#fff",
          border: "none",
          opacity: joined ? 0.7 : 1,
        }}
      >
        {joined ? "✅ Rejoint" : "Rejoindre"}
      </button>
    </div>
  );
}

/* ── Vue complète Défis ────────────────────────────────────────── */
function AllChallengesView() {
  const active  = challenges.filter((c) => c.status === "active");
  const pending = challenges.filter((c) => c.opponentId === CURRENT_USER_ID && c.status === "pending");
  const open    = challenges.filter((c) => c.status === "open" && c.creatorId !== CURRENT_USER_ID);

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div
      className="px-4 pt-4 pb-2"
      style={{ fontFamily: "var(--font-ui)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-forest)" }}
    >
      {children}
    </div>
  );

  return (
    <div className="pb-8">
      {/* ── En cours ── */}
      {active.length > 0 && (
        <section>
          <SectionTitle>
            <span className="inline-block h-2 w-2 rounded-full mr-2" style={{ background: "#e53e3e", boxShadow: "0 0 0 3px #e53e3e33", animation: "pulse 1.5s ease-in-out infinite", verticalAlign: "middle" }} />
            En cours · {active.length}
          </SectionTitle>
          {active.map((c) => {
            const creator = getChallengeCreator(c);
            const opponent = c.opponentId ? getPlayer(c.opponentId) : null;
            return (
              <div
                key={c.id}
                className="mx-4 mb-3 p-3 flex flex-col gap-2"
                style={{ border: "var(--border-thin)", borderLeft: "3px solid #e53e3e", background: "#fff7f7" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl leading-none">{creator?.avatar ?? "🏓"}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-muted)" }}>VS</span>
                  <span className="text-2xl leading-none">{opponent?.avatar ?? "🏓"}</span>
                  <div className="flex flex-col ml-1" style={{ minWidth: 0 }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-ui)", color: "var(--color-ink)" }}>
                      {creator?.username} vs {opponent?.username ?? "—"}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--color-muted)", fontFamily: "var(--font-ui)" }}>
                      {modeLabel(c.mode)} · {c.format}{c.venue ? ` · 📍 ${c.venue}` : ""}
                    </span>
                  </div>
                  <span
                    className="ml-auto shrink-0 px-1.5 py-0.5"
                    style={{ fontSize: "9px", fontWeight: 700, fontFamily: "var(--font-ui)", letterSpacing: "0.06em", textTransform: "uppercase", background: "#e53e3e", color: "#fff" }}
                  >
                    Live
                  </span>
                </div>
                {c.message && (
                  <p style={{ fontSize: "12px", color: "var(--color-ink)", fontStyle: "italic", margin: 0 }}>"{c.message}"</p>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* ── À accepter ── */}
      {pending.length > 0 && (
        <section>
          <SectionTitle>🔔 En attente de ta réponse · {pending.length}</SectionTitle>
          {pending.map((c) => <PendingCard key={c.id} challenge={c} />)}
        </section>
      )}

      {/* ── Ouverts à rejoindre ── */}
      <section>
        <SectionTitle>🌍 Défis ouverts · {open.length}</SectionTitle>
        {open.length === 0 ? (
          <p className="px-4 pb-4 text-sm" style={{ color: "var(--color-muted)", fontFamily: "var(--font-ui)" }}>
            Aucun défi ouvert pour l'instant.
          </p>
        ) : (
          open.map((c) => <OpenCard key={c.id} challenge={c} />)
        )}
      </section>
    </div>
  );
}
