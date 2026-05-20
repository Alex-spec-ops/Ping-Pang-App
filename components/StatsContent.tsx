"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Avatar from "./Avatar";
import { CURRENT_USER_ID, getPlayer } from "../lib/data";
import { getAnalytics } from "../lib/stats";

export default function StatsContent() {
  const me = getPlayer(CURRENT_USER_ID);
  const s = getAnalytics();

  // Tab & dynamic data states
  const [timeFilter, setTimeFilter] = useState<"1S" | "1M" | "1A">("1M");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Equipment state
  const [equipment, setEquipment] = useState({
    brand: "Butterfly",
    model: "Viscaria ALC",
    forehand: "Dignics 09C (2.1mm)",
    backhand: "Tenergy 05 (2.1mm)",
    weight: "188g",
    state: 75,
  });

  // Load equipment from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("pingpang_equipment");
    if (saved) {
      try {
        setEquipment(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved equipment settings:", e);
      }
    }
  }, []);

  const handleSaveEquipment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated = {
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      forehand: formData.get("forehand") as string,
      backhand: formData.get("backhand") as string,
      weight: formData.get("weight") as string,
      state: parseInt(formData.get("state") as string, 10) || 75,
    };
    setEquipment(updated);
    localStorage.setItem("pingpang_equipment", JSON.stringify(updated));
    setIsEditModalOpen(false);
  };

  // Progression Chart Data
  const chartData = {
    "1S": [1420, 1435, 1430, 1445, 1440, 1458, 1465, 1487],
    "1M": [1320, 1350, 1390, 1375, 1410, 1435, 1450, 1487],
    "1A": [1150, 1220, 1260, 1300, 1380, 1410, 1450, 1487],
  };

  const activePoints = chartData[timeFilter];
  const maxPoint = Math.max(...activePoints);
  const minPoint = Math.min(...activePoints);
  const spread = maxPoint - minPoint || 1;

  return (
    <div className="space-y-6 pb-6">
      {/* 1. Header (User profile, name, settings gear) */}
      <header className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-3">
          <Avatar emoji={me?.avatar ?? "🐧"} size="sm" />
          <span
            className="text-base font-extrabold uppercase tracking-tight text-[#0A241E]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ping Pang & Co.
          </span>
        </div>
        <Link
          href="/profile"
          className="grid h-10 w-10 place-items-center rounded-full bg-white border border-[#E5E7EB] transition-all hover:scale-105"
          aria-label="Paramètres"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5 text-[#0A241E]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </header>

      {/* 2. Réserver une table button */}
      <section className="px-4">
        <Link
          href="/play"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#000A07] text-white font-extrabold uppercase tracking-widest text-xs shadow-lg transition-transform active:scale-95"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          <span>🗓️</span> RÉSERVER UNE TABLE
        </Link>
      </section>

      {/* 3. Hero title */}
      <section className="px-4">
        <h1
          className="text-5xl font-black uppercase tracking-tight text-[#0A241E] leading-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          SUIVI
        </h1>
        <p className="text-sm font-semibold text-[#616363] mt-1.5">
          Semaine du 24 oct. au 30 oct.
        </p>
      </section>

      {/* 4. KPI Grid */}
      <section className="px-4 grid grid-cols-2 gap-3">
        {/* Sessions this week */}
        <div className="flex flex-col justify-between p-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.01)]">
          <p
            className="text-[9px] font-bold text-[#616363] uppercase tracking-wider leading-tight"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            Sessions cette semaine
          </p>
          <div className="mt-3">
            <span
              className="text-4xl font-extrabold text-[#0A241E] tabular-nums"
              style={{ fontFamily: "var(--font-display)" }}
            >
              4
            </span>
            <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-[#0A241E]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-3 h-3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
              <span>+1 depuis la semaine dernière</span>
            </div>
          </div>
        </div>

        {/* Total Hours */}
        <div className="flex flex-col justify-between p-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.01)]">
          <p
            className="text-[9px] font-bold text-[#616363] uppercase tracking-wider leading-tight"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            Heures totales
          </p>
          <div className="mt-3">
            <span
              className="text-4xl font-extrabold text-[#0A241E] tabular-nums"
              style={{ fontFamily: "var(--font-display)" }}
            >
              8.5
            </span>
            <p className="mt-2 text-[10px] font-bold text-[#616363]">
              Objectif: 10h
            </p>
          </div>
        </div>

        {/* Current streak */}
        <div className="flex flex-col justify-between p-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.01)]">
          <p
            className="text-[9px] font-bold text-[#616363] uppercase tracking-wider leading-tight"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            Série actuelle
          </p>
          <div className="mt-3">
            <div>
              <span
                className="text-3xl font-extrabold text-[#0A241E]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                3
              </span>
              <span
                className="ml-1 text-xs font-black uppercase text-[#0A241E]"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                jours
              </span>
            </div>
            <div className="flex gap-1 mt-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-5 w-2.5 bg-[#0A241E] rounded-xs" />
              ))}
              {[4, 5].map((i) => (
                <div key={i} className="h-5 w-2.5 bg-[#DFE0E0] rounded-xs" />
              ))}
            </div>
          </div>
        </div>

        {/* Win Rate */}
        <div className="flex flex-col justify-between p-4 bg-[#0A241E] rounded-2xl shadow-[0px_8px_16px_rgba(10,36,30,0.15)] text-white">
          <p
            className="text-[9px] font-bold text-[#728D84] uppercase tracking-wider leading-tight"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            Taux de victoire
          </p>
          <div className="mt-3">
            <span
              className="text-4xl font-extrabold tabular-nums"
              style={{ fontFamily: "var(--font-display)" }}
            >
              68%
            </span>
            <p className="mt-2 text-[10px] font-bold text-[#728D84]">
              20 derniers matchs
            </p>
          </div>
        </div>
      </section>

      {/* 5. Sponsored Challenges */}
      <section className="px-4">
        <div className="p-4 bg-[#F0F3FF] border border-[#E5E7EB] rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🏆</span>
              <span
                className="text-[10px] font-black uppercase tracking-widest text-[#0A241E]"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                Défis sponsorisés
              </span>
            </div>
            <span
              className="px-2 py-0.5 rounded-full bg-[#0A241E] text-white text-[8px] font-black uppercase tracking-widest"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              Récompenses de performance Ping Pang
            </span>
          </div>

          <div className="space-y-2">
            {/* Challenge 1 */}
            <div className="p-3 bg-white border border-[#E5E7EB] rounded-2xl flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
                    30 Matchs ce mois-ci
                  </h4>
                  <p className="text-[9px] text-[#616363] mt-0.5">
                    Récompense : Grip de performance
                  </p>
                </div>
                <span className="text-xs font-extrabold text-[#0A241E] tabular-nums" style={{ fontFamily: "var(--font-display)" }}>
                  22/30
                </span>
              </div>
              <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                <div className="h-full bg-[#0A241E] rounded-full" style={{ width: "73.3%" }} />
              </div>
            </div>

            {/* Challenge 2 */}
            <div className="p-3 bg-white border border-[#E5E7EB] rounded-2xl flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
                    10h d&apos;exercices de jambes
                  </h4>
                  <p className="text-[9px] text-[#616363] mt-0.5">
                    Récompense : T-shirt exclusif membre
                  </p>
                </div>
                <span className="text-xs font-extrabold text-[#0A241E] tabular-nums" style={{ fontFamily: "var(--font-display)" }}>
                  8.5/10
                </span>
              </div>
              <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                <div className="h-full bg-[#0A241E] rounded-full" style={{ width: "85%" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Progression Chart */}
      <section className="px-4">
        <div className="p-4 bg-white border border-[#E5E7EB] rounded-3xl space-y-4 shadow-[0px_4px_12px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-[9px] font-bold text-[#616363] uppercase tracking-wider"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                Indice de performance
              </p>
              <h3
                className="text-lg font-extrabold text-[#0A241E] mt-0.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Progression
              </h3>
            </div>
            <div className="flex bg-[#F0F3FF] p-1 rounded-xl">
              {(["1S", "1M", "1A"] as const).map((filter) => {
                const active = timeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setTimeFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all uppercase ${
                      active ? "bg-[#0A241E] text-white" : "text-[#616363] hover:text-[#0A241E]"
                    }`}
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="pt-2">
            <svg viewBox="0 0 320 120" className="w-full h-auto overflow-visible">
              {/* Dotted threshold line */}
              <line
                x1="0"
                y1="35"
                x2="320"
                y2="35"
                stroke="#E5E7EB"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1="0"
                y1="75"
                x2="320"
                y2="75"
                stroke="#E5E7EB"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* Render bars */}
              {activePoints.map((point, index) => {
                // Map point ELO to SVG Y coordinate (from y=20 to y=100)
                const percent = (point - minPoint) / spread;
                const barHeight = Math.max(12, percent * 75);
                const barY = 100 - barHeight;
                const barWidth = 22;
                const gap = 16;
                const barX = index * (barWidth + gap) + 12;
                const isLast = index === activePoints.length - 1;

                return (
                  <g key={index} className="group cursor-pointer">
                    <title>{`${point} ELO`}</title>
                    {/* Bar rectangle */}
                    <rect
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      rx="4"
                      fill={isLast ? "#0A241E" : "#E2E8F8"}
                      className="transition-all duration-300 hover:opacity-90"
                    />
                  </g>
                );
              })}

              {/* Baseline */}
              <line x1="0" y1="102" x2="320" y2="102" stroke="#E5E7EB" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </section>

      {/* 7. Activity Log */}
      <section className="px-4">
        <div className="p-4 bg-white border border-[#E5E7EB] rounded-3xl space-y-4 shadow-[0px_4px_12px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-[9px] font-bold text-[#616363] uppercase tracking-wider"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                Journal d&apos;activité
              </p>
              <h3
                className="text-lg font-extrabold text-[#0A241E] mt-0.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Dernières Sessions
              </h3>
            </div>
            <Link
              href="/feed"
              className="text-[9px] font-black uppercase tracking-wider text-[#0A241E] hover:underline flex items-center gap-1"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              <span>Tout voir</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="divide-y divide-[#E5E7EB] -mx-4">
            {/* Session 1 */}
            <div className="px-4 py-3 flex items-center justify-between hover:bg-[#F9F9FF] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#E2E8F8] flex items-center justify-center text-[#0A241E] font-bold text-lg">
                  🔀
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
                      Exercices de jambes
                    </h4>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase tracking-wider">
                      Intense
                    </span>
                  </div>
                  <p className="text-[9px] font-bold text-[#616363] uppercase mt-0.5">
                    Aujourd&apos;hui · 1H 30M
                  </p>
                </div>
              </div>
              <span className="text-[#616363] text-sm">➔</span>
            </div>

            {/* Session 2 */}
            <div className="px-4 py-3 flex items-center justify-between hover:bg-[#F9F9FF] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#E2E8F8] flex items-center justify-center text-[#0A241E] font-bold text-lg">
                  🏳️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
                      Match d&apos;entraînement vs Leo
                    </h4>
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[8px] font-black uppercase tracking-wider">
                      Match
                    </span>
                  </div>
                  <p className="text-[9px] font-bold text-[#616363] uppercase mt-0.5">
                    Hier · 2H 00M
                  </p>
                </div>
              </div>
              <span className="text-[#616363] text-sm">➔</span>
            </div>

            {/* Session 3 */}
            <div className="px-4 py-3 flex items-center justify-between hover:bg-[#F9F9FF] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#E2E8F8] flex items-center justify-center text-[#0A241E] font-bold text-lg">
                  🔄
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
                      Suivi service
                    </h4>
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[8px] font-black uppercase tracking-wider">
                      Léger
                    </span>
                  </div>
                  <p className="text-[9px] font-bold text-[#616363] uppercase mt-0.5">
                    26 OCT. · 0H 45M
                  </p>
                </div>
              </div>
              <span className="text-[#616363] text-sm">➔</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Equipment ("Matériel") */}
      <section className="px-4">
        <div className="p-4 bg-white border border-[#E5E7EB] rounded-3xl space-y-4 shadow-[0px_4px_12px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-[9px] font-bold text-[#616363] uppercase tracking-wider"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                Équipement
              </p>
              <h3
                className="text-lg font-extrabold text-[#0A241E] mt-0.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Matériel
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="grid h-8 w-8 place-items-center rounded-xl bg-[#F0F3FF] border border-[#E5E7EB] hover:scale-105 transition-all text-[#0A241E]"
              aria-label="Modifier le matériel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.83 20.013a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
            </button>
          </div>

          <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden bg-[#0A241E] text-white relative shadow-inner">
            {/* Racket background image */}
            <div className="h-44 w-full bg-cover bg-center relative" style={{ backgroundImage: `url('/racket_equipment.png')` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A241E] via-[#0A241E]/40 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h4 className="text-xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {equipment.brand}
                </h4>
                <p className="text-xs text-[#728D84] font-semibold mt-0.5">
                  {equipment.model}
                </p>
              </div>
            </div>

            {/* Spec list */}
            <div className="p-4 space-y-4">
              <ul className="space-y-2.5 text-xs">
                <li className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[#728D84] font-bold flex items-center gap-1.5">
                    <span className="text-red-500">🔴</span> Coup droit
                  </span>
                  <span className="font-extrabold tracking-tight">{equipment.forehand}</span>
                </li>
                <li className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[#728D84] font-bold flex items-center gap-1.5">
                    <span className="text-blue-400">🔵</span> Revers
                  </span>
                  <span className="font-extrabold tracking-tight">{equipment.backhand}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-[#728D84] font-bold flex items-center gap-1.5">
                    <span>⚖️</span> Poids
                  </span>
                  <span className="font-extrabold tracking-tight tabular-nums">{equipment.weight}</span>
                </li>
              </ul>

              {/* Progress gauge */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider" style={{ fontFamily: "var(--font-ui)" }}>
                  <span className="text-[#728D84]">État du revêtement</span>
                  <span className="tabular-nums">{equipment.state}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${equipment.state}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#728D84] leading-relaxed mt-1">
                  Environ {Math.round(equipment.state * 0.27)} heures de jeu restantes estimées avant remplacement recommandé.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Interactive Equipment Edit Drawer Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs">
          {/* Overlay click to close */}
          <div className="absolute inset-0" onClick={() => setIsEditModalOpen(false)} />

          <div
            className="relative w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl space-y-6 z-10"
            style={{
              animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center -mt-2">
              <div className="w-12 h-1 bg-[#DFE0E0] rounded-full" />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A241E]" style={{ fontFamily: "var(--font-ui)" }}>
                  Modifier
                </p>
                <h3 className="text-xl font-extrabold text-[#0A241E]" style={{ fontFamily: "var(--font-display)" }}>
                  Matériel de jeu
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="h-8 w-8 rounded-full bg-[#F0F3FF] flex items-center justify-center font-bold text-sm text-[#0A241E]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveEquipment} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="brand" className="text-[10px] font-black uppercase text-[#616363]" style={{ fontFamily: "var(--font-ui)" }}>
                    Marque
                  </label>
                  <input
                    id="brand"
                    name="brand"
                    type="text"
                    defaultValue={equipment.brand}
                    required
                    className="w-full px-3 py-2 border border-[#E5E7EB] bg-[#F9F9FF] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A241E]"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="model" className="text-[10px] font-black uppercase text-[#616363]" style={{ fontFamily: "var(--font-ui)" }}>
                    Modèle
                  </label>
                  <input
                    id="model"
                    name="model"
                    type="text"
                    defaultValue={equipment.model}
                    required
                    className="w-full px-3 py-2 border border-[#E5E7EB] bg-[#F9F9FF] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A241E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="forehand" className="text-[10px] font-black uppercase text-[#616363]" style={{ fontFamily: "var(--font-ui)" }}>
                  Coup droit (Revêtement)
                </label>
                <input
                  id="forehand"
                  name="forehand"
                  type="text"
                  defaultValue={equipment.forehand}
                  required
                  className="w-full px-3 py-2 border border-[#E5E7EB] bg-[#F9F9FF] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A241E]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="backhand" className="text-[10px] font-black uppercase text-[#616363]" style={{ fontFamily: "var(--font-ui)" }}>
                  Revers (Revêtement)
                </label>
                <input
                  id="backhand"
                  name="backhand"
                  type="text"
                  defaultValue={equipment.backhand}
                  required
                  className="w-full px-3 py-2 border border-[#E5E7EB] bg-[#F9F9FF] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A241E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="weight" className="text-[10px] font-black uppercase text-[#616363]" style={{ fontFamily: "var(--font-ui)" }}>
                    Poids (g)
                  </label>
                  <input
                    id="weight"
                    name="weight"
                    type="text"
                    defaultValue={equipment.weight}
                    required
                    className="w-full px-3 py-2 border border-[#E5E7EB] bg-[#F9F9FF] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A241E]"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="state" className="text-[10px] font-black uppercase text-[#616363]" style={{ fontFamily: "var(--font-ui)" }}>
                    État du revêtement (%)
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="number"
                    min="1"
                    max="100"
                    defaultValue={equipment.state}
                    required
                    className="w-full px-3 py-2 border border-[#E5E7EB] bg-[#F9F9FF] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A241E]"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 bg-[#F0F3FF] border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#616363] hover:bg-[#E2E8F8]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0A241E] text-white rounded-xl text-xs font-bold hover:opacity-90"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slide up animation CSS */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
