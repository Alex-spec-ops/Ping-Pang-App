"use client";

import { useState, useTransition } from "react";
import { submitMatch } from "@/lib/actions/match";

type Profile = { id: string; username: string; full_name: string | null; avatar: string | null };

export default function NewMatchForm({ profiles }: { profiles: Profile[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [opponentId, setOpponentId] = useState("");
  const [winnerId, setWinnerId] = useState<"me" | "opponent">("me");
  // sets: tableau de { a, b }
  const [sets, setSets] = useState([{ a: "", b: "" }]);

  function addSet() {
    setSets((s) => [...s, { a: "", b: "" }]);
  }
  function removeSet(i: number) {
    setSets((s) => s.filter((_, idx) => idx !== i));
  }
  function updateSet(i: number, side: "a" | "b", val: string) {
    setSets((s) => s.map((set, idx) => (idx === i ? { ...set, [side]: val } : set)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const scoreA = sets.filter((s) => parseInt(s.a) > parseInt(s.b)).length;
    const scoreB = sets.filter((s) => parseInt(s.b) > parseInt(s.a)).length;

    startTransition(async () => {
      const result = await submitMatch({
        player_b_id: opponentId,
        winner_id: winnerId === "me" ? "ME_PLACEHOLDER" : opponentId,
        score_a: scoreA,
        score_b: scoreB,
        set_scores: sets.map((s) => ({ a: parseInt(s.a) || 0, b: parseInt(s.b) || 0 })),
        played_at: new Date().toISOString(),
      });

      if (!result.ok) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  }

  if (success) {
    return (
      <div className="p-6 text-center">
        <p className="text-4xl">🏓</p>
        <p className="mt-4 font-semibold text-zinc-900 dark:text-zinc-100">
          Match soumis !
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          En attente de confirmation par ton adversaire.
        </p>
        <a
          href="/matches/pending"
          className="mt-6 inline-block rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white"
        >
          Voir les matchs en attente
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {/* Adversaire */}
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Adversaire
        </label>
        <select
          required
          value={opponentId}
          onChange={(e) => setOpponentId(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">Sélectionner un joueur…</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.avatar} {p.full_name ?? p.username} (@{p.username})
            </option>
          ))}
        </select>
      </div>

      {/* Gagnant */}
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Gagnant
        </label>
        <div className="flex gap-3">
          {(["me", "opponent"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setWinnerId(v)}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                winnerId === v
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-zinc-200 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
              }`}
            >
              {v === "me" ? "Moi" : "Adversaire"}
            </button>
          ))}
        </div>
      </div>

      {/* Sets */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Scores par set
        </label>
        <div className="space-y-2">
          {sets.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-10 text-center text-xs text-zinc-400">Set {i + 1}</span>
              <input
                type="number"
                min={0}
                max={20}
                placeholder="Moi"
                value={s.a}
                onChange={(e) => updateSet(i, "a", e.target.value)}
                className="w-16 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-center text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <span className="text-zinc-400">–</span>
              <input
                type="number"
                min={0}
                max={20}
                placeholder="Adv."
                value={s.b}
                onChange={(e) => updateSet(i, "b", e.target.value)}
                className="w-16 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-center text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              {sets.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSet(i)}
                  className="text-zinc-400 hover:text-red-500"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {sets.length < 7 && (
          <button
            type="button"
            onClick={addSet}
            className="mt-2 text-sm text-emerald-600 hover:underline"
          >
            + Ajouter un set
          </button>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || !opponentId}
        className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {isPending ? "Envoi…" : "Soumettre le match"}
      </button>
    </form>
  );
}
