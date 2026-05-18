export type AppMode = "player" | "club";

export const SESSION_STORAGE_KEY = "ppp.session.v1";

export type SessionState = {
  mode: AppMode;
  activeClubId: string | null;
};

export const DEFAULT_SESSION: SessionState = {
  mode: "player",
  activeClubId: null,
};

export function readSession(): SessionState {
  if (typeof window === "undefined") return DEFAULT_SESSION;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return DEFAULT_SESSION;
    const parsed = JSON.parse(raw) as Partial<SessionState>;
    return {
      mode: parsed.mode === "club" ? "club" : "player",
      activeClubId: parsed.activeClubId ?? null,
    };
  } catch {
    return DEFAULT_SESSION;
  }
}

export function writeSession(s: SessionState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(s));
}
