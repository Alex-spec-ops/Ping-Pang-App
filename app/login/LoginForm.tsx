"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "choose" | "player-login" | "club-login";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/feed";

  const [mode, setMode] = useState<Mode>("choose");
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;

        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            username: username || email.split("@")[0],
            full_name: null,
            avatar: null,
            rating: 1200,
            matches_played: 0,
            matches_won: 0,
          });
        }

        if (!data.session) {
          setEmailSent(true);
          return;
        }

        if (mode === "club-login") {
          router.push("/club/new");
        } else {
          router.push(next);
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;

        if (mode === "club-login") {
          router.push("/clubs");
        } else {
          router.push(next);
        }
      }

      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (mode === "choose") {
    return (
      <div className="flex flex-col gap-4 p-6">
        <p className="text-center text-sm text-zinc-500">
          Choisis ton profil pour continuer
        </p>

        <button
          onClick={() => setMode("player-login")}
          className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-zinc-200 p-6 text-left transition-all hover:border-emerald-400 hover:bg-emerald-50 dark:border-zinc-700 dark:hover:border-emerald-500 dark:hover:bg-emerald-950"
        >
          <span className="text-5xl">🏓</span>
          <div className="text-center">
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Je suis joueur</p>
            <p className="mt-1 text-sm text-zinc-500">
              Suis tes matchs, ton ELO, défie d&apos;autres joueurs
            </p>
          </div>
        </button>

        <button
          onClick={() => setMode("club-login")}
          className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-zinc-200 p-6 text-left transition-all hover:border-blue-400 hover:bg-blue-50 dark:border-zinc-700 dark:hover:border-blue-500 dark:hover:bg-blue-950"
        >
          <span className="text-5xl">🏛️</span>
          <div className="text-center">
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Je représente un club</p>
            <p className="mt-1 text-sm text-zinc-500">
              Gère ton club, crée des tournois et des événements
            </p>
          </div>
        </button>
      </div>
    );
  }

  if (emailSent) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <span className="text-5xl">📧</span>
        <p className="font-semibold text-zinc-800 dark:text-zinc-200">Vérifie ta boite mail</p>
        <p className="text-sm text-zinc-500">
          Un lien de confirmation a été envoyé à <strong>{email}</strong>. Clique dessus pour activer ton compte.
        </p>
        <button
          onClick={() => setEmailSent(false)}
          className="text-sm text-zinc-400 underline"
        >
          ← Retour
        </button>
      </div>
    );
  }

  const isClub = mode === "club-login";
  const accentColor = isClub ? "blue" : "emerald";

  return (
    <div className="flex flex-col gap-6 p-6">
      <button
        onClick={() => setMode("choose")}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700"
      >
        ← Retour
      </button>

      <div className="flex flex-col items-center gap-2">
        <span className="text-4xl">{isClub ? "🏛️" : "🏓"}</span>
        <p className="font-semibold text-zinc-700 dark:text-zinc-300">
          {isClub ? "Espace Club" : "Espace Joueur"}
        </p>
      </div>

      <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
        <button
          onClick={() => setIsSignup(false)}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            !isSignup
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
              : "text-zinc-500"
          }`}
        >
          Se connecter
        </button>
        <button
          onClick={() => setIsSignup(true)}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            isSignup
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
              : "text-zinc-500"
          }`}
        >
          S&apos;inscrire
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isSignup && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Pseudo
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ton_pseudo"
              required
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="toi@exemple.fr"
            required
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`rounded-xl py-3 text-sm font-semibold text-white transition disabled:opacity-50 ${
            accentColor === "blue"
              ? "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
              : "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700"
          }`}
        >
          {loading
            ? "Chargement…"
            : isSignup
              ? isClub
                ? "Créer mon compte et configurer mon club →"
                : "Créer mon compte"
              : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
