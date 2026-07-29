"use client";

import { useEffect, useState } from "react";
import { Lock, Settings as SettingsIcon } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import GeneralSettings from "@/components/settings/general-settings";
import RbacTable from "@/components/settings/rbac-table";
import SettingsActions from "@/components/settings/settings-actions";
import {
  getSettings,
  saveSettings,
  resetSettings,
  DEFAULT_SETTINGS,
  type GeneralSettings as GS,
} from "@/services/settings.service";
import { getUser } from "@/lib/auth-token";
import type { SettingsData } from "@/types/settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [general, setGeneral] = useState<GS>({
    depotName: DEFAULT_SETTINGS.depotName,
    currency: DEFAULT_SETTINGS.currency,
    distanceUnit: DEFAULT_SETTINGS.distanceUnit,
  });
  const [role, setRole] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = getSettings();
    setSettings(s);
    setGeneral({ depotName: s.depotName, currency: s.currency, distanceUnit: s.distanceUnit });
    setRole(getUser<{ role?: string }>()?.role ?? "");
  }, []);

  function update(field: keyof GS, value: string) {
    setGeneral((g) => ({ ...g, [field]: value }));
    setSaved(false);
  }

  function handleSave() {
    saveSettings(general);
    setSaved(true);
  }

  function handleReset() {
    resetSettings();
    setGeneral({
      depotName: DEFAULT_SETTINGS.depotName,
      currency: DEFAULT_SETTINGS.currency,
      distanceUnit: DEFAULT_SETTINGS.distanceUnit,
    });
    setSaved(false);
  }

  // RBAC gate (PRD §7.9): Settings is Fleet Manager only.
  if (role !== null && role !== "" && role !== "FLEET_MANAGER") {
    return (
      <div className="space-y-6">
        <PageHeader
          title="System Settings"
          description="Configure fleet operations and manage permissions."
          icon={SettingsIcon}
        />
        <div className="flex items-center gap-3 rounded-xl border bg-panel p-6 text-ink-dim">
          <Lock size={20} />
          <p>Settings are available to Fleet Managers only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        description="Configure fleet operations and manage permissions."
        icon={SettingsIcon}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <GeneralSettings value={general} onChange={update} />
        </div>
        <div className="lg:col-span-2">
          <RbacTable roles={settings.roles} />
        </div>
      </div>

      <SettingsActions onSave={handleSave} onReset={handleReset} saved={saved} />
    </div>
  );
}
