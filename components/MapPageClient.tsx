"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Venue } from "../lib/venues";
import {
  venues as ALL_VENUES,
  getVenueReviews,
  distanceKm,
  pinColor,
} from "../lib/venues";
import VenueSheet from "./VenueSheet";

// ─── Types ────────────────────────────────────────────────────────────────────

declare global { interface Window { L: any } }

type VenueType = "club" | "public" | "bar";
type Surface   = "indoor" | "outdoor";
type Pricing   = "free" | "paid" | "membership";
const RADII    = [500, 1000, 2000, 5000]; // metres

// ─── Component ────────────────────────────────────────────────────────────────

export default function MapPageClient() {
  const mapRef         = useRef<HTMLDivElement>(null);
  const leafletMap     = useRef<any>(null);
  const clusterGroup   = useRef<any>(null);
  const markerMap      = useRef<Map<string, any>>(new Map());
  const radiusCircle   = useRef<any>(null);
  const tempMarker     = useRef<any>(null);
  const addModeRef     = useRef<"idle" | "placing">("idle");

  const [mapReady, setMapReady] = useState(false);

  // UI state
  const [selectedVenue, setSelectedVenue]   = useState<Venue | null>(null);
  const [checkedIn, setCheckedIn]           = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters]       = useState(false);
  const [addMode, setAddMode]               = useState<"idle" | "placing" | "form">("idle");
  const [newVenueCoords, setNewVenueCoords] = useState<[number, number] | null>(null);

  // Geolocation
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);

  // Filters
  const [types, setTypes]                 = useState<Set<VenueType>>(new Set());
  const [surfaces, setSurfaces]           = useState<Set<Surface>>(new Set());
  const [pricings, setPricings]           = useState<Set<Pricing>>(new Set());
  const [arrondissements, setArr]         = useState<Set<number>>(new Set());
  const [radius, setRadius]               = useState<number | null>(null);

  // Add venue form
  const [newName, setNewName]         = useState("");
  const [newType, setNewType]         = useState<VenueType>("public");
  const [newSurface, setNewSurface]   = useState<Surface>("outdoor");
  const [newPricing, setNewPricing]   = useState<Pricing>("free");
  const [newDesc, setNewDesc]         = useState("");
  const [addSubmitted, setAddSubmitted] = useState(false);

  // Filtered venues
  const filtered = useMemo(() => {
    return ALL_VENUES.filter((v) => {
      if (types.size > 0 && !types.has(v.type)) return false;
      if (surfaces.size > 0 && !surfaces.has(v.surface)) return false;
      if (pricings.size > 0 && !pricings.has(v.pricing)) return false;
      if (arrondissements.size > 0 && !arrondissements.has(v.arrondissement)) return false;
      if (radius !== null && userPos) {
        const d = distanceKm(userPos[0], userPos[1], v.lat, v.lng) * 1000;
        if (d > radius) return false;
      }
      return true;
    });
  }, [types, surfaces, pricings, arrondissements, radius, userPos]);

  // ── Load Leaflet scripts then init map (single effect avoids race condition) ──
  useEffect(() => {
    // Guard: only run once even under React Strict Mode double-invocation
    if (leafletMap.current) return;

    function addStyle(href: string) {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const l = document.createElement("link");
      l.rel = "stylesheet"; l.href = href;
      document.head.appendChild(l);
    }

    // loadScript waits for the real "load" event.
    // It marks executed scripts with ._x so repeated calls resolve instantly.
    type MarkedScript = HTMLScriptElement & { _x?: true };
    function loadScript(src: string): Promise<void> {
      return new Promise((res) => {
        const existing = document.querySelector(
          `script[src="${src}"]`,
        ) as MarkedScript | null;
        if (existing) {
          if (existing._x) { res(); return; }          // already executed
          existing.addEventListener("load", res, { once: true }); // still loading
          return;
        }
        const s = document.createElement("script") as MarkedScript;
        s.src = src;
        s.onload = () => { s._x = true; res(); };
        document.head.appendChild(s);
      });
    }

    addStyle("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
    addStyle("https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css");
    addStyle("https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css");

    // Track whether this effect invocation is still active
    let active = true;

    loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js")
      .then(() =>
        loadScript(
          "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js",
        ),
      )
      .then(() => {
        if (!active || !mapRef.current || leafletMap.current) return;

        const L = window.L;
        if (!L) return; // should never happen after awaiting load, but guard anyway

        const map = L.map(mapRef.current, {
          center: [48.8566, 2.3522],
          zoom: 13,
          zoomControl: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        const group = L.markerClusterGroup({ maxClusterRadius: 50 });
        group.addTo(map);
        clusterGroup.current = group;
        leafletMap.current = map;

        map.on("click", (e: any) => {
          if (addModeRef.current === "placing") {
            const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
            setNewVenueCoords(coords);
            setAddMode("form");
            if (tempMarker.current) tempMarker.current.remove();
            tempMarker.current = L.marker(coords, { draggable: true }).addTo(map);
            tempMarker.current.on("dragend", (ev: any) => {
              const ll = ev.target.getLatLng();
              setNewVenueCoords([ll.lat, ll.lng]);
            });
          }
        });

        setMapReady(true);
      });

    return () => {
      active = false;
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        clusterGroup.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync addModeRef ─────────────────────────────────────────────────────────
  useEffect(() => {
    addModeRef.current = addMode === "placing" ? "placing" : "idle";
  }, [addMode]);

  // ── Update markers when filtered venues change ──────────────────────────────
  useEffect(() => {
    const L = window.L;
    const group = clusterGroup.current;
    if (!L || !group) return;

    group.clearLayers();
    markerMap.current.clear();

    filtered.forEach((venue) => {
      const color = pinColor(venue.rating);
      const icon = L.divIcon({
        html: `<div style="
          width:38px;height:44px;position:relative;cursor:pointer;
        "><div style="
          position:absolute;bottom:0;left:50%;
          transform:translateX(-50%) rotate(-45deg);
          width:34px;height:34px;
          background:${color};
          border-radius:50% 50% 50% 0;
          border:2.5px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,.35);
          display:flex;align-items:center;justify-content:center;
        "><span style="transform:rotate(45deg);font-size:17px;display:block;margin:2px 0 0 1px">🏓</span></div></div>`,
        className: "",
        iconSize: [38, 44],
        iconAnchor: [19, 44],
        popupAnchor: [0, -44],
      });

      const marker = L.marker([venue.lat, venue.lng], { icon });
      marker.on("click", () => setSelectedVenue(venue));
      group.addLayer(marker);
      markerMap.current.set(venue.id, marker);
    });
  }, [filtered]);

  // ── Radius circle ────────────────────────────────────────────────────────────
  useEffect(() => {
    const L = window.L;
    const map = leafletMap.current;
    if (!L || !map) return;
    if (radiusCircle.current) { radiusCircle.current.remove(); radiusCircle.current = null; }
    if (radius && userPos) {
      radiusCircle.current = L.circle(userPos, {
        radius,
        color: "#10b981",
        fillColor: "#10b981",
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: "6 4",
      }).addTo(map);
    }
  }, [radius, userPos]);

  // ── Geolocation ─────────────────────────────────────────────────────────────
  const locateUser = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        setLocating(false);
        const L = window.L;
        const map = leafletMap.current;
        if (!L || !map) return;
        map.flyTo(coords, 15, { animate: true, duration: 1.2 });
        L.circleMarker(coords, {
          radius: 8, color: "#3b82f6", fillColor: "#3b82f6",
          fillOpacity: 0.9, weight: 2.5,
        }).addTo(map).bindPopup("Vous êtes ici").openPopup();
      },
      () => setLocating(false),
    );
  }, []);

  const submitAddVenue = () => {
    if (!newName.trim()) return;
    setAddSubmitted(true);
    setTimeout(() => {
      setAddMode("idle");
      setAddSubmitted(false);
      setNewName(""); setNewDesc("");
      if (tempMarker.current) { tempMarker.current.remove(); tempMarker.current = null; }
      setNewVenueCoords(null);
    }, 2000);
  };

  const activeFiltersCount =
    types.size + surfaces.size + pricings.size + arrondissements.size + (radius ? 1 : 0);

  return (
    <div className="relative" style={{ height: "calc(100dvh - 80px)" }}>
      {/* ── Map container ──────────────────────────────────────────────────── */}
      <div ref={mapRef} className="h-full w-full" />

      {/* Loading overlay */}
      {!mapReady && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900">
          <span className="text-4xl" style={{ animation: "spin 1s linear infinite" }}>⟳</span>
          <p className="mt-3 text-sm text-zinc-500">Chargement de la carte…</p>
        </div>
      )}

      {/* ── Top bar overlay ─────────────────────────────────────────────────── */}
      <div
        className="absolute left-0 right-0 top-0 z-20 mx-auto max-w-md"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex items-center gap-2 px-4 pt-3 pb-2">
          <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur dark:bg-zinc-950/95">
            <span className="text-base">🏓</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">Tables à Paris</p>
              <p className="text-[10px] text-zinc-500">
                {filtered.length} lieu{filtered.length !== 1 ? "x" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeFiltersCount > 0
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              }`}
            >
              ⚙ Filtres
              {activeFiltersCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/25 text-[9px] font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Map controls (right side) ───────────────────────────────────────── */}
      <div className="absolute bottom-24 right-4 z-20 flex flex-col gap-2">
        {/* Zoom in */}
        <MapBtn label="+" title="Zoom avant" onClick={() => leafletMap.current?.zoomIn()} />
        {/* Zoom out */}
        <MapBtn label="−" title="Zoom arrière" onClick={() => leafletMap.current?.zoomOut()} />
        {/* Locate */}
        <MapBtn
          label={locating ? "…" : "◎"}
          title="Me localiser"
          onClick={locateUser}
          active={!!userPos}
        />
      </div>

      {/* ── FAB: Add venue ──────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => {
          if (addMode !== "idle") {
            setAddMode("idle");
            if (tempMarker.current) { tempMarker.current.remove(); tempMarker.current = null; }
            setNewVenueCoords(null);
          } else {
            setAddMode("placing");
          }
        }}
        className={`absolute bottom-24 left-4 z-20 flex h-12 w-12 items-center justify-center rounded-full shadow-xl text-white text-xl transition-colors ${
          addMode !== "idle" ? "bg-rose-600" : "bg-emerald-600"
        }`}
        title={addMode !== "idle" ? "Annuler" : "Ajouter un lieu"}
      >
        {addMode !== "idle" ? "✕" : "+"}
      </button>

      {/* ── Add venue instructions ──────────────────────────────────────────── */}
      {addMode === "placing" && (
        <div className="absolute bottom-40 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-zinc-900/90 px-4 py-2.5 text-sm font-medium text-white backdrop-blur shadow-xl">
          📍 Appuyez sur la carte pour placer le lieu
        </div>
      )}

      {/* ── Add venue form ──────────────────────────────────────────────────── */}
      {addMode === "form" && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setAddMode("idle")} />
          <div
            className="absolute bottom-0 left-0 right-0 z-50 mx-auto max-w-md rounded-t-2xl bg-white p-5 shadow-2xl dark:bg-zinc-950"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold">Ajouter un lieu</h3>
              <button type="button" onClick={() => { setAddMode("idle"); if (tempMarker.current) { tempMarker.current.remove(); tempMarker.current = null; } }}>✕</button>
            </div>

            {newVenueCoords && (
              <p className="mb-3 text-[11px] text-emerald-600 dark:text-emerald-400">
                📍 Position : {newVenueCoords[0].toFixed(5)}, {newVenueCoords[1].toFixed(5)}
                <span className="ml-2 text-zinc-400">(glissez le pin pour ajuster)</span>
              </p>
            )}

            <div className="space-y-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nom du lieu *"
                className="w-full rounded-xl bg-zinc-50 px-3 py-2.5 text-sm ring-1 ring-zinc-200 outline-none focus:ring-emerald-400 dark:bg-zinc-900 dark:ring-zinc-700"
              />
              <div className="grid grid-cols-3 gap-2">
                {(["public","club","bar"] as VenueType[]).map((t) => (
                  <button key={t} type="button" onClick={() => setNewType(t)}
                    className={`rounded-xl py-2 text-xs font-semibold capitalize transition-colors ${newType === t ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800"}`}>
                    {t === "club" ? "🏓 Club" : t === "public" ? "🌳 Public" : "🍹 Bar"}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(["indoor","outdoor"] as Surface[]).map((s) => (
                  <button key={s} type="button" onClick={() => setNewSurface(s)}
                    className={`rounded-xl py-2 text-xs font-semibold transition-colors ${newSurface === s ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800"}`}>
                    {s === "indoor" ? "🏢 Intérieur" : "🌳 Extérieur"}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["free","paid","membership"] as Pricing[]).map((p) => (
                  <button key={p} type="button" onClick={() => setNewPricing(p)}
                    className={`rounded-xl py-2 text-xs font-semibold transition-colors ${newPricing === p ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800"}`}>
                    {p === "free" ? "Gratuit" : p === "paid" ? "Payant" : "Licence"}
                  </button>
                ))}
              </div>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Description (optionnel)"
                rows={2}
                className="w-full resize-none rounded-xl bg-zinc-50 px-3 py-2.5 text-sm ring-1 ring-zinc-200 outline-none focus:ring-emerald-400 dark:bg-zinc-900 dark:ring-zinc-700"
              />
            </div>

            {addSubmitted ? (
              <div className="mt-4 rounded-xl bg-emerald-50 px-3 py-3 text-center text-sm font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                ✓ Lieu soumis — en attente de validation manuelle.
              </div>
            ) : (
              <button
                type="button"
                onClick={submitAddVenue}
                disabled={!newName.trim() || !newVenueCoords}
                className="mt-4 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white disabled:opacity-40"
              >
                Soumettre pour validation
              </button>
            )}
          </div>
        </>
      )}

      {/* ── Filter panel ────────────────────────────────────────────────────── */}
      {showFilters && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setShowFilters(false)} />
          <div
            className="absolute bottom-0 left-0 right-0 z-50 mx-auto max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl dark:bg-zinc-950"
            style={{ maxHeight: "80vh", paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold">Filtres</h3>
              <div className="flex gap-2">
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={() => { setTypes(new Set()); setSurfaces(new Set()); setPricings(new Set()); setArr(new Set()); setRadius(null); }}
                    className="text-xs font-semibold text-rose-500"
                  >
                    Réinitialiser
                  </button>
                )}
                <button type="button" onClick={() => setShowFilters(false)}>✕</button>
              </div>
            </div>

            <FilterSection label="Type de lieu">
              {(["club","public","bar"] as VenueType[]).map((t) => (
                <FilterPill
                  key={t}
                  label={t === "club" ? "🏓 Club" : t === "public" ? "🌳 Public" : "🍹 Bar"}
                  active={types.has(t)}
                  onClick={() => setTypes((s) => toggle(s, t))}
                />
              ))}
            </FilterSection>

            <FilterSection label="Intérieur / Extérieur">
              {(["indoor","outdoor"] as Surface[]).map((s) => (
                <FilterPill
                  key={s}
                  label={s === "indoor" ? "🏢 Intérieur" : "🌳 Extérieur"}
                  active={surfaces.has(s)}
                  onClick={() => setSurfaces((p) => toggle(p, s))}
                />
              ))}
            </FilterSection>

            <FilterSection label="Tarification">
              {(["free","paid","membership"] as Pricing[]).map((p) => (
                <FilterPill
                  key={p}
                  label={p === "free" ? "Gratuit" : p === "paid" ? "Payant" : "Licence"}
                  active={pricings.has(p)}
                  onClick={() => setPricings((s) => toggle(s, p))}
                />
              ))}
            </FilterSection>

            <FilterSection label="Arrondissement">
              <div className="grid grid-cols-5 gap-1.5">
                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map((n) => (
                  <FilterPill
                    key={n}
                    label={`${n}e`}
                    active={arrondissements.has(n)}
                    onClick={() => setArr((s) => toggle(s, n))}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection label={`Rayon de recherche${userPos ? "" : " (géoloc. requise)"}`}>
              <div className="flex gap-2 flex-wrap">
                {RADII.map((r) => (
                  <FilterPill
                    key={r}
                    label={r < 1000 ? `${r} m` : `${r / 1000} km`}
                    active={radius === r}
                    onClick={() => {
                      if (radius === r) { setRadius(null); return; }
                      if (!userPos) { locateUser(); }
                      setRadius(r);
                    }}
                  />
                ))}
              </div>
            </FilterSection>

            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="mt-3 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white"
            >
              Appliquer ({filtered.length} résultat{filtered.length !== 1 ? "s" : ""})
            </button>
          </div>
        </>
      )}

      {/* ── Venue bottom sheet ──────────────────────────────────────────────── */}
      {selectedVenue && (
        <VenueSheet
          venue={selectedVenue}
          reviews={getVenueReviews(selectedVenue.id)}
          isOpen={!!selectedVenue}
          onClose={() => setSelectedVenue(null)}
          onCheckin={(id) => setCheckedIn((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; })}
          checkedIn={checkedIn.has(selectedVenue.id)}
        />
      )}
    </div>
  );
}

// ─── Small helpers ─────────────────────────────────────────────────────────────

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  next.has(value) ? next.delete(value) : next.add(value);
  return next;
}

function MapBtn({
  label, title, onClick, active = false,
}: {
  label: string; title: string; onClick: () => void; active?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`grid h-10 w-10 place-items-center rounded-xl shadow-md text-sm font-bold transition-colors ${
        active
          ? "bg-emerald-600 text-white"
          : "bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-200"
      }`}
    >
      {label}
    </button>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-emerald-600 text-white"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
      }`}
    >
      {label}
    </button>
  );
}
