"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { DbClub } from "@/lib/db-types";

const PRESET_COLORS = [
  "#10b981", "#3b82f6", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#06b6d4", "#f97316",
];

const PRESET_LOGOS = ["🏛️", "⚡", "🔥", "🐯", "🦅", "🌟", "💎", "🚀"];

export default function EditClubForm({ club }: { club: DbClub }) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState(club.name);
  const [city, setCity] = useState(club.city ?? "");
  const [description, setDescription] = useState(club.description ?? "");
  const [website, setWebsite] = useState(club.website ?? "");
  const [color, setColor] = useState(club.color);
  const [logo, setLogo] = useState(club.logo ?? PRESET_LOGOS[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: updateError } = await supabase
        .from("clubs")
        .update({
          name,
          logo,
          color,
          description: description || null,
          city: city || null,
          website: website || null,
        })
        .eq("id", club.id);

      if (updateError) throw updateError;

      router.push(`/club/${club.slug}`);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
      {/* Type (non modifiable) */}
      <div className="flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900">
        <span className="text-xl">{club.type === "pro" ? "🏆" : "🏓"}</span>
        <div>
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {club.type === "pro" ? "Club Pro" : "Club Loisir"}
          </p>
          <p className="text-xs text-zinc-400">Le type ne peut pas être modifié</p>
        </div>
      </div>

      {/* Logo */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Logo (emoji)
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_LOGOS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setLogo(e)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition ${
                logo === e
                  ? "bg-emerald-100 ring-2 ring-emerald-400 dark:bg-emerald-900"
                  : "bg-zinc-100 dark:bg-zinc-800"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Couleur */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Couleur du club
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full transition ${
                color === c ? "ring-2 ring-offset-2 ring-zinc-400" : ""
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Nom */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Nom du club *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={60}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      {/* Ville */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Ville
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Paris"
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={300}
          className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      {/* Site web */}
      {club.type === "pro" && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Site web
          </label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://monclub.fr"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      )}

      {/* Preview */}
      <div
        className="flex items-center gap-3 rounded-xl p-4"
        style={{ backgroundColor: color + "18" }}
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
          style={{ backgroundColor: color + "25" }}
        >
          {logo}
        </div>
        <div>
          <p className="font-bold text-zinc-900 dark:text-zinc-100">{name}</p>
          <p className="text-xs text-zinc-500">
            {club.type === "pro" ? "🏆 Club Pro" : "🏓 Club Loisir"}
            {city ? ` · ${city}` : ""}
          </p>
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !name}
        className="rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
      >
        {loading ? "Enregistrement…" : "Enregistrer les modifications"}
      </button>
    </form>
  );
}
