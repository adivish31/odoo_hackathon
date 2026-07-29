"use client";

import { SlidersHorizontal } from "lucide-react";
import type { GeneralSettings as GS } from "@/services/settings.service";

export default function GeneralSettings({
  value,
  onChange,
}: {
  value: GS;
  onChange: (field: keyof GS, value: string) => void;
}) {
  return (
    <div className="bg-panel border border-hairline rounded-[10px] p-6 space-y-6">
      <h2 className="font-bold text-xl font-heading text-ink flex items-center gap-2">
        <SlidersHorizontal size={20} className="text-ink-dim" />
        General
      </h2>

      <div>
        <label className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-dim">DEPOT NAME</label>
        <input
          value={value.depotName}
          onChange={(e) => onChange("depotName", e.target.value)}
          className="mt-2 w-full rounded-[6px] border border-hairline bg-panel-raised px-4 py-2 text-ink focus:border-amber focus:ring-1 focus:ring-amber outline-none transition-all"
        />
      </div>

      <div>
        <label className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-dim">CURRENCY</label>
        <select
          value={value.currency}
          onChange={(e) => onChange("currency", e.target.value)}
          className="mt-2 w-full rounded-[6px] border border-hairline bg-panel-raised px-4 py-2 text-ink focus:border-amber focus:ring-1 focus:ring-amber outline-none transition-all"
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      <div>
        <label className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-dim">DISTANCE UNIT</label>
        <div className="flex gap-3 mt-3">
          {["Kilometers", "Miles"].map((unit) => (
            <button
              key={unit}
              type="button"
              onClick={() => onChange("distanceUnit", unit)}
              className={`flex-1 border border-hairline rounded-[6px] py-3 text-[0.9375rem] font-semibold transition-all ${
                value.distanceUnit === unit ? "bg-reflect text-[#1A1300] border-reflect" : "text-ink-dim hover:text-ink hover:bg-panel-raised"
              }`}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
