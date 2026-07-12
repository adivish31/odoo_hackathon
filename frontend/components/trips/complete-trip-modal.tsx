"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { TripCompleteInput } from "@/types/trip";

interface Props {
  tripId: string;
  currentOdometer: number;
  onSubmit: (id: string, data: TripCompleteInput) => void;
  onClose: () => void;
}

export default function CompleteTripModal({
  tripId,
  currentOdometer,
  onSubmit,
  onClose,
}: Props) {
  const [form, setForm] = useState({
    finalOdometerKm: "",
    fuelConsumedLiters: "",
    revenue: "",
  });
  const [error, setError] = useState("");

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const finalOdo = Number(form.finalOdometerKm);
    const fuel = Number(form.fuelConsumedLiters);
    const rev = Number(form.revenue);

    if (!finalOdo || finalOdo <= 0) {
      setError("Enter a valid final odometer reading.");
      return;
    }
    if (finalOdo < currentOdometer) {
      setError(
        `Final odometer (${finalOdo} km) cannot be below the current reading (${currentOdometer} km).`,
      );
      return;
    }
    if (!fuel || fuel <= 0) {
      setError("Enter a valid fuel consumed value.");
      return;
    }

    onSubmit(tripId, {
      finalOdometerKm: finalOdo,
      fuelConsumedLiters: fuel,
      revenue: rev || 0,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Complete Trip</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Current odometer: {currentOdometer.toLocaleString()} km
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Final Odometer */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Final Odometer (km)
            </label>
            <input
              type="number"
              step="0.1"
              value={form.finalOdometerKm}
              onChange={(e) =>
                setForm({ ...form, finalOdometerKm: e.target.value })
              }
              placeholder={String(currentOdometer + 50)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* Fuel Consumed */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Fuel Consumed (liters)
            </label>
            <input
              type="number"
              step="0.1"
              value={form.fuelConsumedLiters}
              onChange={(e) =>
                setForm({ ...form, fuelConsumedLiters: e.target.value })
              }
              placeholder="e.g. 35"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* Revenue */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Revenue (₹)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.revenue}
              onChange={(e) => setForm({ ...form, revenue: e.target.value })}
              placeholder="0"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              Mark Completed
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
