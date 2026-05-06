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

declare global { interface Window { google: any; __gmCb?: () => void } }

type VenueType = "club" | "public" | "bar";
type Surface   = "indoor" | "outdoor";
type Pricing   = "free" | "paid" | "membership";
const RADII    = [500, 1000, 2000, 5000]; // metres

const GMAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

// ─── Component ────────────────────────────────────────────────────────────────

export default function MapPageClient() {
  const mapRef       = useRef<HTMLDivElement>(null);
  const googleMap    = useRef<any>(null);
  const markerMap    = useRef<Map<string, any>>(new Map()); // venueId → Marker
  const radiusCircle = useRef<any>(null);
  const userMarker   = useRef<any>(null);
  const tempMarker   = useRef<any>(null);

  const [mapReady, setMapReady] = useState(false);

  // UI state
  const [selectedVenue, setSelectedVenue]   = useState<Venue | null>(null);
  const [checkedIn, setCheckedIn]           = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters]       = useState(false);
  const [addMode, setAddMode]               = useState<"idle" | "placing" | "form">("idle");
  const [newVenueCoords, setNewVenueCoords] = useState<[number, number] | null>(null);

  // Geolocation
  const [userPos, setUserPos]   = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);

  // Filters
  const [types, setTypes]         = useState<Set<VenueType>>(new Set());
  const [surfaces, setSurfaces]   = useState<Set<Surface>>(new Set());
  const [pricings, setPricings]   = useState<Set<Pricing>>(new Set());
  const [arrondissements, setArr] = useState<Set<number>>(new Set());
  const [radius, setRadius]       = useState<number | null>(null);

  // Add venue form
  const [newName, setNewName]           = useState("");
  const [newType, setNewType]           = useState<VenueType>("public");
  const [newSurface, setNewSurface]     = useState<Surface>("outdoor");
  const [newPricing, setNewPricing]     = useState<Pricing>("free");
  const [newDesc, setNewDesc]           = useState("");
  const [addSubmitted, setAddSubmitted] = useState(false);

  // Search
  const [searchQuery, setSearchQuery]         = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_VENUES.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.address.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q)),
    ).slice(0, 6);
  }, [searchQuery]);

  const flyToVenue = useCallback((venue: Venue) => {
    const map = googleMap.current;
    if (map) {
      map.panTo({ lat: venue.lat, lng: venue.lng });
      map.setZoom(17);
    }
    setSelectedVenue(venue);
    setSearchQuery("");
    setShowSuggestions(false);
  }, []);

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

  // ── Load Google Maps then init ────────────────────────────────────────────
  useEffect(() => {
    if (googleMap.current) return;
    let active = true;

    function loadGoogleMaps(): Promise<void> {
      // Already loaded
      if (window.google?.maps) return Promise.resolve();
      // Script already injected (Strict Mode 2nd call)
      const existing = document.querySelector('script[data-gmap]');
      if (existing) {
        return new Promise((res) => {
          existing.addEventListener("load", () => res(), { once: true });
        });
      }
      return new Promise((res) => {
        window.__gmCb = res;
        const s = document.createElement("script");
        s.setAttribute("data-gmap", "1");
        s.src = `https://maps.googleapis.com/maps/api/js?key=${GMAP_KEY}&callback=__gmCb&loading=async`;
        s.async = true;
        document.head.appendChild(s);
      });
    }

    loadGoogleMaps().then(() => {
      if (!active || !mapRef.current || googleMap.current) return;

      const gm = window.google.maps;

      const map = new gm.Map(mapRef.current, {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 13,
        disableDefaultUI: true,          // on gère nos propres contrôles
        gestureHandling: "greedy",       // scroll = zoom sur mobile
        styles: GMAP_STYLES,
      });

      // Clic sur la carte pour le mode "ajouter un lieu"
      map.addListener("click", (e: any) => {
        if (tempMarker.current?._placing) {
          const coords: [number, number] = [e.latLng.lat(), e.latLng.lng()];
          setNewVenueCoords(coords);
          setAddMode("form");

          if (tempMarker.current) tempMarker.current.setMap(null);
          const t = new gm.Marker({
            position: { lat: coords[0], lng: coords[1] },
            map,
            draggable: true,
            icon: makePinIcon("#f97316", gm),
            title: "Nouveau lieu",
          });
          t.addListener("dragend", (ev: any) => {
            setNewVenueCoords([ev.latLng.lat(), ev.latLng.lng()]);
          });
          tempMarker.current = t;
        }
      });

      googleMap.current = map;
      setMapReady(true);
    });

    return () => {
      active = false;
      if (googleMap.current) {
        // Google Maps n'a pas de .destroy() — on nettoie juste les refs
        googleMap.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync addMode → tempMarker._placing ──────────────────────────────────
  useEffect(() => {
    if (tempMarker.current) tempMarker.current._placing = addMode === "placing";
  }, [addMode]);

  // On entre en mode "placing" : signaler au clic listener
  useEffect(() => {
    if (addMode === "placing" && tempMarker.current === null) {
      // Créer un marqueur fantôme pour porter le flag _placing
      tempMarker.current = { _placing: true };
    }
  }, [addMode]);

  // ── Sync markers when filtered changes ──────────────────────────────────
  useEffect(() => {
    const gm = window.google?.maps;
    const map = googleMap.current;
    if (!gm || !map) return;

    // Supprimer tous les markers existants
    markerMap.current.forEach((m) => m.setMap(null));
    markerMap.current.clear();

    filtered.forEach((venue) => {
      const marker = new gm.Marker({
        position: { lat: venue.lat, lng: venue.lng },
        map,
        icon: makePinIcon(pinColor(venue.rating), gm),
        title: venue.name,
      });
      marker.addListener("click", () => setSelectedVenue(venue));
      markerMap.current.set(venue.id, marker);
    });
  }, [filtered, mapReady]);

  // ── Radius circle ────────────────────────────────────────────────────────
  useEffect(() => {
    const gm = window.google?.maps;
    const map = googleMap.current;
    if (!gm || !map) return;

    if (radiusCircle.current) { radiusCircle.current.setMap(null); radiusCircle.current = null; }
    if (radius && userPos) {
      radiusCircle.current = new gm.Circle({
        map,
        center: { lat: userPos[0], lng: userPos[1] },
        radius,
        strokeColor: "#10b981",
        strokeOpacity: 0.8,
        strokeWeight: 1.5,
        fillColor: "#10b981",
        fillOpacity: 0.08,
      });
    }
  }, [radius, userPos, mapReady]);

  // ── Geolocation ──────────────────────────────────────────────────────────
  const locateUser = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        setLocating(false);
        const gm  = window.google?.maps;
        const map = googleMap.current;
        if (!gm || !map) return;
        map.panTo({ lat: coords[0], lng: coords[1] });
        map.setZoom(15);
        if (userMarker.current) userMarker.current.setMap(null);
        userMarker.current = new gm.Marker({
          position: { lat: coords[0], lng: coords[1] },
          map,
          icon: {
            path: gm.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#3b82f6",
            fillOpacity: 0.9,
            strokeColor: "white",
            strokeWeight: 2.5,
          },
          title: "Vous êtes ici",
          zIndex: 999,
        });
      },
      () => setLocating(false),
    );
  }, []);

  const zoomIn  = () => { const m = googleMap.current; if (m) m.setZoom((m.getZoom() ?? 13) + 1); };
  const zoomOut = () => { const m = googleMap.current; if (m) m.setZoom((m.getZoom() ?? 13) - 1); };

  const cancelAddMode = () => {
    setAddMode("idle");
    if (tempMarker.current && typeof tempMarker.current.setMap === "function") {
      tempMarker.current.setMap(null);
    }
    tempMarker.current = null;
    setNewVenueCoords(null);
  };

  const submitAddVenue = () => {
    if (!newName.trim()) return;
    setAddSubmitted(true);
    setTimeout(() => {
      setAddMode("idle");
      setAddSubmitted(false);
      setNewName(""); setNewDesc("");
      if (tempMarker.current && typeof tempMarker.current.setMap === "function") {
        tempMarker.current.setMap(null);
      }
      tempMarker.current = null;
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
          <div className="flex flex-1 flex-col rounded-2xl bg-white/95 shadow-lg backdrop-blur dark:bg-zinc-950/95 overflow-hidden">
            {/* Search row */}
            <div className="flex items-center gap-2 px-3 py-2.5">
              <span className="text-base shrink-0">🔍</span>
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Club, terrain, adresse…"
                className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); setSearchQuery(""); setShowSuggestions(false); }}
                  className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-base leading-none"
                >
                  ✕
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowFilters(true)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
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
              )}
            </div>

            {/* Result count strip */}
            {!showSuggestions && (
              <div className="border-t border-zinc-100 px-4 py-1 dark:border-zinc-800">
                <p className="text-[10px] text-zinc-500">
                  {filtered.length} lieu{filtered.length !== 1 ? "x" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && searchResults.length > 0 && (
              <ul className="border-t border-zinc-100 dark:border-zinc-800">
                {searchResults.map((v) => (
                  <li key={v.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); flyToVenue(v); }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <span className="text-lg shrink-0">
                        {v.type === "club" ? "🏓" : v.type === "bar" ? "🍹" : "🌳"}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{v.name}</p>
                        <p className="truncate text-[11px] text-zinc-500">{v.address}</p>
                      </div>
                      <span className="ml-auto shrink-0 text-[10px] font-medium text-amber-500">
                        ★ {v.rating}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* No results */}
            {showSuggestions && searchQuery.trim().length > 0 && searchResults.length === 0 && (
              <div className="border-t border-zinc-100 px-4 py-3 text-center text-xs text-zinc-400 dark:border-zinc-800">
                Aucun lieu trouvé pour « {searchQuery.trim()} »
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Map controls (right side) ───────────────────────────────────────── */}
      <div className="absolute bottom-24 right-4 z-20 flex flex-col gap-2">
        <MapBtn label="+" title="Zoom avant"   onClick={zoomIn} />
        <MapBtn label="−" title="Zoom arrière" onClick={zoomOut} />
        <MapBtn label={locating ? "…" : "◎"} title="Me localiser" onClick={locateUser} active={!!userPos} />
      </div>

      {/* ── FAB: Add venue ──────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => addMode !== "idle" ? cancelAddMode() : setAddMode("placing")}
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
          <div className="fixed inset-0 z-40 bg-black/30" onClick={cancelAddMode} />
          <div
            className="absolute bottom-0 left-0 right-0 z-50 mx-auto max-w-md rounded-t-2xl bg-white p-5 shadow-2xl dark:bg-zinc-950"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold">Ajouter un lieu</h3>
              <button type="button" onClick={cancelAddMode}>✕</button>
            </div>

            {newVenueCoords && (
              <p className="mb-3 text-[11px] text-emerald-600 dark:text-emerald-400">
                📍 {newVenueCoords[0].toFixed(5)}, {newVenueCoords[1].toFixed(5)}
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
                  <button type="button"
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
                <FilterPill key={t}
                  label={t === "club" ? "🏓 Club" : t === "public" ? "🌳 Public" : "🍹 Bar"}
                  active={types.has(t)} onClick={() => setTypes((s) => toggle(s, t))} />
              ))}
            </FilterSection>

            <FilterSection label="Intérieur / Extérieur">
              {(["indoor","outdoor"] as Surface[]).map((s) => (
                <FilterPill key={s}
                  label={s === "indoor" ? "🏢 Intérieur" : "🌳 Extérieur"}
                  active={surfaces.has(s)} onClick={() => setSurfaces((p) => toggle(p, s))} />
              ))}
            </FilterSection>

            <FilterSection label="Tarification">
              {(["free","paid","membership"] as Pricing[]).map((p) => (
                <FilterPill key={p}
                  label={p === "free" ? "Gratuit" : p === "paid" ? "Payant" : "Licence"}
                  active={pricings.has(p)} onClick={() => setPricings((s) => toggle(s, p))} />
              ))}
            </FilterSection>

            <FilterSection label="Arrondissement">
              <div className="grid grid-cols-5 gap-1.5">
                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map((n) => (
                  <FilterPill key={n} label={`${n}e`}
                    active={arrondissements.has(n)} onClick={() => setArr((s) => toggle(s, n))} />
                ))}
              </div>
            </FilterSection>

            <FilterSection label={`Rayon${userPos ? "" : " (géoloc. requise)"}`}>
              <div className="flex gap-2 flex-wrap">
                {RADII.map((r) => (
                  <FilterPill key={r}
                    label={r < 1000 ? `${r} m` : `${r / 1000} km`}
                    active={radius === r}
                    onClick={() => { if (radius === r) { setRadius(null); return; } if (!userPos) locateUser(); setRadius(r); }} />
                ))}
              </div>
            </FilterSection>

            <button type="button" onClick={() => setShowFilters(false)}
              className="mt-3 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white">
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makePinIcon(color: string, gm: any) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16,0 C7.2,0 0,7.2 0,16 C0,24.8 16,40 16,40 C16,40 32,24.8 32,16 C32,7.2 24.8,0 16,0Z"
            fill="${color}" stroke="white" stroke-width="2.5"/>
      <circle cx="16" cy="16" r="7" fill="white" fill-opacity="0.35"/>
      <text x="16" y="21" text-anchor="middle" font-size="13" font-family="sans-serif">🏓</text>
    </svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new gm.Size(32, 40),
    anchor: new gm.Point(16, 40),
  };
}

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  next.has(value) ? next.delete(value) : next.add(value);
  return next;
}

function MapBtn({ label, title, onClick, active = false }: {
  label: string; title: string; onClick: () => void; active?: boolean;
}) {
  return (
    <button type="button" title={title} onClick={onClick}
      className={`grid h-10 w-10 place-items-center rounded-xl shadow-md text-sm font-bold transition-colors ${
        active ? "bg-emerald-600 text-white" : "bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-200"
      }`}>
      {label}
    </button>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
      }`}>
      {label}
    </button>
  );
}

// ─── Google Maps style (teinte neutre, similaire au style iOS Maps) ───────────
const GMAP_STYLES = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#e8e8e8" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9e8f5" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#e8f5e9" }] },
  { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#6b6b6b" }] },
];
