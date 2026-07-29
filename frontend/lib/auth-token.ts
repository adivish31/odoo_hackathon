/**
 * Single source of truth for the JWT + current user.
 *
 * The login form stores credentials in sessionStorage (session-only) or
 * localStorage ("remember me"). Readers must therefore check BOTH stores —
 * doing so here keeps every service in sync and prevents the "logged in but
 * 401 Authentication required" mismatch.
 */

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function getUser<T = Record<string, unknown>>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setAuth(token: string, user: unknown, remember: boolean): void {
  if (typeof window === "undefined") return;
  const primary = remember ? localStorage : sessionStorage;
  const other = remember ? sessionStorage : localStorage;
  primary.setItem(TOKEN_KEY, token);
  primary.setItem(USER_KEY, JSON.stringify(user));
  // Clear the other store so a stale token can never shadow the fresh one.
  other.removeItem(TOKEN_KEY);
  other.removeItem(USER_KEY);
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}
