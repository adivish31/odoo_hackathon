"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { getVehicles } from "@/services/vehicle.service";
import type { Vehicle } from "@/types/vehicle";
import { openMaintenance } from "@/services/maintenance.service";

interface ServiceFormProps {
  onRecordAdded?: () => void;
}

export default function ServiceForm({ onRecordAdded }: ServiceFormProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    vehicleId: "",
    type: "",
    cost: "",
    description: "",
  });

  useEffect(() => {
    getVehicles().then(setVehicles).catch(console.error);
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.vehicleId || !form.type || !form.cost) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await openMaintenance({
        vehicleId: form.vehicleId,
        type: form.type,
        cost: Number(form.cost),
        description: form.description
      });
      
      setForm({ vehicleId: "", type: "", cost: "", description: "" });
      if (onRecordAdded) onRecordAdded();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to add record");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border p-6 space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">
          Log Service Record
        </h2>
        <Save size={22} className="text-slate-500" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm text-slate-600">Vehicle <span className="text-red-500">*</span></label>
          <select
            name="vehicleId"
            value={form.vehicleId}
            onChange={handleChange}
            className="w-full rounded-lg border p-2 mt-1"
            required
          >
            <option value="">Select Vehicle</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                {v.registrationNumber} - {v.nameModel}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-600">Service Type <span className="text-red-500">*</span></label>
          <input
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="Oil Change"
            className="w-full rounded-lg border p-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional details..."
            className="w-full rounded-lg border p-2 mt-1"
            rows={2}
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">Cost (₹) <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="cost"
            value={form.cost}
            onChange={handleChange}
            placeholder="0"
            className="w-full rounded-lg border p-2 mt-1"
            required
            min="0"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-70 transition-colors"
        >
          {loading ? "Saving..." : "Save Record"}
        </button>
      </form>

      <div className="rounded-lg bg-slate-100 p-4 text-sm text-slate-600">
        Vehicles logged for maintenance are automatically set to IN SHOP status and removed from the dispatch pool.
      </div>
    </div>
  );
}