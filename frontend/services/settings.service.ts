import type { RolePermission, SettingsData } from "@/types/settings";

const STORAGE_KEY = "transitops-settings";

// Canonical RBAC policy — mirrors the role rules enforced by the Express backend.
const RBAC: RolePermission[] = [
  { role: "Fleet Manager", fleet: "full", drivers: "full", trips: "full", expenses: "full", analytics: "full" },
  { role: "Dispatcher", fleet: "read", drivers: "read", trips: "full", expenses: "full", analytics: "none" },
  { role: "Safety Officer", fleet: "read", drivers: "full", trips: "none", expenses: "none", analytics: "read" },
  { role: "Financial Analyst", fleet: "read", drivers: "read", trips: "none", expenses: "full", analytics: "full" },
];

export type GeneralSettings = Pick<SettingsData, "depotName" | "currency" | "distanceUnit">;

export const DEFAULT_SETTINGS: SettingsData = {
  depotName: "Gandhinagar Depot G-24",
  currency: "INR",
  distanceUnit: "Kilometers",
  roles: RBAC,
};

// No backend settings endpoint exists — general prefs persist in localStorage.
export function getSettings(): SettingsData {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<GeneralSettings>;
      return { ...DEFAULT_SETTINGS, ...saved, roles: RBAC };
    }
  } catch {
    /* ignore malformed storage */
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(general: GeneralSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(general));
}

export function resetSettings(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
