"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_SESSION,
  readSession,
  writeSession,
  type AppMode,
  type SessionState,
} from "../lib/session";

type Ctx = {
  session: SessionState;
  setMode: (m: AppMode) => void;
  setActiveClub: (id: string | null) => void;
  ready: boolean;
};

const SessionCtx = createContext<Ctx | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionState>(DEFAULT_SESSION);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(readSession());
    setReady(true);
  }, []);

  const setMode = useCallback((m: AppMode) => {
    setSession((s) => {
      const next = { ...s, mode: m };
      writeSession(next);
      return next;
    });
  }, []);

  const setActiveClub = useCallback((id: string | null) => {
    setSession((s) => {
      const next = { ...s, activeClubId: id };
      writeSession(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ session, setMode, setActiveClub, ready }),
    [session, setMode, setActiveClub, ready],
  );

  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
}

export function useSession(): Ctx {
  const ctx = useContext(SessionCtx);
  if (!ctx) {
    throw new Error("useSession must be used inside SessionProvider");
  }
  return ctx;
}
