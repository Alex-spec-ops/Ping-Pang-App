"use client";

import { useTransition, useState } from "react";
import { confirmMatch, disputeMatch } from "@/lib/actions/match";

type MatchProfile = { id: string; username: string; full_name: string | null; avatar: string | null; rating: number } | null;

type PendingMatch = {
  id: string;
  score_a: number;
  score_b: number;
  set_scores: Array<{ a: number; b: number }> | null;
  played_at: string;
  submitted_by: string;
  player_a: MatchProfile;
  player_b: MatchProfile;
  winner: { id: string; username: string } | null;
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "< 1h";
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}j`;
}

export default function PendingMatchList({
  matches,
  currentUserId,
}: {
  matches: PendingMatch[];
  currentUserId?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [actionId, setActionId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleAction(matchId: string, action: "confirm" | "dispute") {
    setActionId(matchId + action);
    setErrors((e) => ({ ...e, [matchId]: "" }));

    startTransition(async () => {
      const result =
        action === "confirm"
          ? await confirmMatch(matchId)
          : await disputeMatch(matchId);

      if (!result.ok) {
        setErrors((e) => ({ ...e, [matchId]: result.error }));
      }
      setActionId(null);
    });
  }

  if (matches.length === 0) {
    return (
      <p className="p-8 text-center text-sm text-zinc-400">
        Aucun match en attente de confirmation.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
      {matches.map((m) => {
        const pa = m.player_a;
        const pb = m.player_b;
        const isMyTurn = !currentUserId || m.submitted_by !== currentUserId;

        return (
          <li key={m.id} className="px-4 py-4">
            {/* Joueurs + score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{pa?.avatar ?? "🏓"}</span>
                <div>
                  <p className="text-sm font-semibold">
                    {pa?.full_name ?? pa?.username}
                  </p>
                  <p className="text-xs text-zinc-400">{pa?.rating} ELO</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg font-bold">
                  {m.score_a} – {m.score_b}
                </p>
                <p className="text-xs text-zinc-400">{timeAgo(m.played_at)}</p>
              </div>

              <div className="flex items-center gap-2 text-right">
                <div>
                  <p className="text-sm font-semibold">
                    {pb?.full_name ?? pb?.username}
                  </p>
                  <p className="text-xs text-zinc-400">{pb?.rating} ELO</p>
                </div>
                <span className="text-xl">{pb?.avatar ?? "🏓"}</span>
              </div>
            </div>

            {/* Soumis par */}
            <p className="mt-1 text-center text-xs text-zinc-400">
              Soumis par @{m.submitted_by === pa?.id ? pa?.username : pb?.username}
            </p>

            {/* Scores sets */}
            {m.set_scores && m.set_scores.length > 0 && (
              <p className="mt-1 text-center text-xs text-zinc-400">
                {m.set_scores.map((s, i) => `${s.a}-${s.b}`).join(", ")}
              </p>
            )}

            {/* Erreur */}
            {errors[m.id] && (
              <p className="mt-2 text-center text-xs text-red-500">
                {errors[m.id]}
              </p>
            )}

            {/* Actions */}
            {isMyTurn && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleAction(m.id, "confirm")}
                  disabled={isPending && actionId?.startsWith(m.id)}
                  className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {actionId === m.id + "confirm" ? "…" : "Confirmer"}
                </button>
                <button
                  onClick={() => handleAction(m.id, "dispute")}
                  disabled={isPending && actionId?.startsWith(m.id)}
                  className="flex-1 rounded-lg border border-red-200 py-2 text-sm font-medium text-red-600 disabled:opacity-50 dark:border-red-800"
                >
                  {actionId === m.id + "dispute" ? "…" : "Contester"}
                </button>
              </div>
            )}

            {!isMyTurn && (
              <p className="mt-3 text-center text-xs text-zinc-400 italic">
                En attente de réponse de ton adversaire
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
