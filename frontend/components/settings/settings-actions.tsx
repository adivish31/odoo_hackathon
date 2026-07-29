"use client";

import { Check } from "lucide-react";

export default function SettingsActions({
  onSave,
  onReset,
  saved,
}: {
  onSave: () => void;
  onReset: () => void;
  saved: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
      <button onClick={onSave} className="bg-reflect text-[#1A1300] font-semibold px-8 py-3 rounded-[6px] hover:brightness-110 transition-all active:scale-[0.98]">
        Save Changes
      </button>

      <button onClick={onReset} className="border border-hairline text-ink bg-panel-raised px-8 py-3 font-semibold rounded-[6px] hover:bg-hairline transition-colors">
        Reset Defaults
      </button>

      {saved && (
        <span className="flex items-center gap-1.5 text-sm font-semibold text-go bg-go/10 px-3 py-1.5 rounded-[4px]">
          <Check size={16} strokeWidth={2.5} />
          Settings saved.
        </span>
      )}
    </div>
  );
}
