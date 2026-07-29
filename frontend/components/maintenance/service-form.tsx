"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { getVehicles } from "@/services/vehicle.service";
import { createMaintenance } from "@/services/maintenance.service";
import type { Vehicle } from "@/types/vehicle";
import { apiError } from "@/lib/api-error";

export default function ServiceForm({ onCreated }: { onCreated: () => void }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [form, setForm] = useState({ vehicleId: "", type: "", cost: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Only AVAILABLE / IN_SHOP vehicles can enter maintenance (backend rejects on-trip / retired).
  useEffect(() => {
    getVehicles()
      .then((all) =>
        setVehicles(all.filter((v) => v.status === "AVAILABLE" || v.status === "IN_SHOP")),
      )
      .catch(() => setVehicles([]));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.vehicleId) return setError("Please select a vehicle.");
    if (!form.type.trim()) return setError("Service type is required.");
    if (Number(form.cost) < 0) return setError("Cost cannot be negative.");

    setLoading(true);
    try {
      await createMaintenance({
        vehicleId: form.vehicleId,
        type: form.type,
        cost: Number(form.cost) || 0,
        description: form.description || undefined,
      });
      setForm({ vehicleId: "", type: "", cost: "", description: "" });
      onCreated();
    } catch (err) {
      setError(apiError(err, "Failed to log service record."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-panel rounded-[10px] border border-hairline p-6 space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-heading text-ink">Log Service Record</h2>
        <Save size={22} className="text-ink-dim" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-ink">Vehicle</label>
          <select
            name="vehicleId"
            value={form.vehicleId}
            onChange={handleChange}
            className="w-full rounded-[6px] border border-hairline bg-panel-raised text-ink p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-amber"
          >
            <option value="">Select Vehicle</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.registrationNumber} — {v.nameModel}
                {v.status === "IN_SHOP" ? " (in shop)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Service Type</label>
          <input
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="Oil Change"
            className="w-full rounded-[6px] border border-hairline bg-panel-raised text-ink p-2 mt-1 placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-amber"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink">Cost (₹)</label>
            <input
              type="number"
              name="cost"
              value={form.cost}
              onChange={handleChange}
              placeholder="0"
              className="w-full rounded-[6px] border border-hairline bg-panel-raised text-ink p-2 mt-1 placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-amber"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Notes (optional)</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Routine service"
              className="w-full rounded-[6px] border border-hairline bg-panel-raised text-ink p-2 mt-1 placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-amber"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-[6px] bg-stop/10 border border-stop/30 px-3 py-2 text-sm text-stop">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full rounded-[6px] bg-amber py-3 text-[#1A1300] font-semibold hover:brightness-110 disabled:opacity-50 transition"
        >
          {loading ? "Saving…" : "Save Record"}
        </button>
      </form>

      <div className="rounded-[6px] bg-panel-raised p-4 text-sm text-ink-dim border border-hairline/50">
        Vehicles in shop are automatically removed from the dispatch pool.
      </div>
    </div>
  );
}
