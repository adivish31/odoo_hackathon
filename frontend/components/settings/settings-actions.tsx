"use client";

import { useState } from "react";

export default function SettingsActions() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Settings saved successfully!");
    }, 800);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset to default settings?")) {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg flex items-center justify-center min-w-[160px]"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

      <button
        onClick={handleReset}
        disabled={saving}
        className="border px-8 py-3 rounded-lg"
      >
        Reset Defaults
      </button>
    </div>
  );
}