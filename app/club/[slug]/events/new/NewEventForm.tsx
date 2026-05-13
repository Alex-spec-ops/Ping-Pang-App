"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { EventType } from "@/lib/db-types";

export default function NewEventForm({
  clubId,
  clubSlug,
  userId,
}: {
  clubId: string;
  clubSlug: string;
  userId: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [type, setType] = useState<EventType>("casual");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("14:00");
  const [location, setLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const datetime = new Date(`${date}T${time}`).toISOString();

      const { data: event, error: eventError } = await supabase
        .from("events")
        .insert({
          club_id: clubId,
          name,
          description: description || null,
          type,
          date: datetime,
          location: location || null,
          max_participants: maxParticipants ? parseInt(maxParticipants) : null,
          created_by: userId,
        })
        .select()
        .single();

      if (eventError) throw eventError;

      if (type === "tournament") {
        await supabase.from("tournaments").insert({
          event_id: event.id,
          format: "round_robin",
          status: "upcoming",
        });
      }

      router.push(`/club/${clubSlug}/events`);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const EVENT_TYPES: { value: EventType; label: string; icon: string; desc: string }[] = [
    { value: "casual", label: "Match amical", icon: "🏓", desc: "Sessions libres entre membres" },
    { value: "tournament", label: "Tournoi", icon: "🏆", desc: "Compétition avec classement" },
    { value: "training", label: "Entraînement", icon: "🎯", desc: "Session d'entraînement collectif" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
      {/* Type */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Type d&apos;événement
        </label>
        <div className="flex flex-col gap-2">
          {EVENT_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${
                type === t.value
                  ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950"
                  : "border-zinc-200 dark:border-zinc-700"
              }`}
            >
              <span className="text-2xl">{t.icon}</span>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t.label}</p>
                <p className="text-xs text-zinc-500">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Nom */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Nom *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={
            type === "tournament"
              ? "Tournoi de printemps 2026"
              : type === "training"
                ? "Entraînement du vendredi"
                : "Match amical du mercredi"
          }
          required
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      {/* Date et heure */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Date *
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            min={new Date().toISOString().split("T")[0]}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="w-28">
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Heure
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>

      {/* Lieu */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Lieu
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Salle des sports, 12 rue de la Paix"
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      {/* Nb participants (tournoi) */}
      {type === "tournament" && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Nombre max de participants
          </label>
          <input
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            placeholder="16"
            min={2}
            max={128}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      )}

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          maxLength={300}
          placeholder="Infos supplémentaires…"
          className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !name || !date}
        className="rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
      >
        {loading ? "Création…" : "Créer l'événement"}
      </button>
    </form>
  );
}
