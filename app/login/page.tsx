import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Connexion — PingPang",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-white dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <div className="px-6 pb-2 pt-12 text-center">
          <p className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            Ping<span className="text-emerald-500">Pang</span>
          </p>
          <p className="mt-1 text-sm text-zinc-500">Le réseau des pongistes</p>
        </div>

        <Suspense fallback={<div className="p-6 text-center text-sm text-zinc-400">Chargement…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
