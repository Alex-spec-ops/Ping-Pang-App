"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ClubType } from "@/lib/db-types";

const PRESET_COLORS = [
  "#10b981", "#3b82f6", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#06b6d4", "#f97316",
];

const PRESET_LOGOS = ["🏛️", "⚡", "🔥", "🐯", "🦅", "🌟", "💎", "🚀"];

export default function NewClubForm({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [type, setType] = useState<ClubType | null>(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [logo, setLogo] = useState(PRESET_LOGOS[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function slugify(s: string) {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!type) return;
    setError(null);
    setLoading(true);

    try {
      const slug = slugify(name);

      const { data: club, error: clubError } = await supabase
        .from("clubs")
        .insert({
          name,
          slug,
          type,
          logo,
          color,
          description: description || null,
          city: city || null,
          website: website || null,
          created_by: userId,
        })
        .select()
        .single();

      if (clubError) throw clubError;

      await supabase.from("club_members").insert({
        club_id: club.id,
        player_id: userId,
        role: "admin",
      });

      router.push(`/club/${slug}`);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (!type) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <p className="text-center text-sm text-zinc-500">
          Quel type de club veux-tu créer ?
        </p>

        <button
          onClick={() => setType("pro")}
          className="flex flex-col gap-3 rounded-2xl border-2 border-zinc-200 p-6 text-left transition hover:border-blue-400 hover:bg-blue-50 dark:border-zinc-700 dark:hover:border-blue-500 dark:hover:bg-blue-950"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">Club Pro</p>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-600">
                Officiel
              </span>
            </div>
          </div>
          <p className="text-sm text-zinc-500">
            Club officiel affilié à la FFTT, avec licenciés et compétitions. Badge vérifié affiché sur le profil.
          </p>
        </button>

        <button
          onClick={() => setType("loisir")}
          className="flex flex-col gap-3 rounded-2xl border-2 border-zinc-200 p-6 text-left transition hover:border-emerald-400 hover:bg-emerald-50 dark:border-zinc-700 dark:hover:border-emerald-500 dark:hover:bg-emerald-950"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏓</span>
            <div>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">Club Loisir</p>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600">
                Entre potes
              </span>
            </div>
          </div>
          <p className="text-sm text-zinc-500">
            Groupe informel de joueurs, entre collègues, potes ou voisins. Parfait pour organiser des tournois sympas entre amis.
          </p>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
      <button
        type="button"
        onClick={() => setType(null)}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700"
      >
        ← Retour
      </button>

      <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
        <span className="text-2xl">{type === "pro" ? "🏆" : "🏓"}</span>
        <div>
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {type === "pro" ? "Club Pro" : "Club Loisir"}
          </p>
          <button
            type="button"
            onClick={() => setType(null)}
            className="text-xs text-zinc-400 underline"
          >
            Changer
          </button>
        </div>
      </div>

      {/* Emoji logo */}
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
          placeholder={type === "pro" ? "ASTT Bordeaux" : "Les Raquettes du Dimanche"}
          required
          maxLength={60}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900"
        />
        {name && (
          <p className="mt-1 text-xs text-zinc-400">
            URL : /club/{slugify(name)}
          </p>
        )}
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
          placeholder={
            type === "pro"
              ? "Club fondé en 1984, nous évoluons en Régionale 2…"
              : "Le club de ping du bureau, on joue tous les vendredis midi !"
          }
          rows={3}
          maxLength={300}
          className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      {/* Site web */}
      {type === "pro" && (
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

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Preview */}
      {name && (
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
              {type === "pro" ? "🏆 Club Pro" : "🏓 Club Loisir"}
              {city ? ` · ${city}` : ""}
            </p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !name}
        className="rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
      >
        {loading ? "Création…" : "Créer le club"}
      </button>
    </form>
  );
}
