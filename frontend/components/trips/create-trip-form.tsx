"use client";

import { useState, useEffect, useMemo } from "react";
import { Send, XCircle, AlertTriangle } from "lucide-react";
import type { TripVehicle, TripDriver, TripCreateInput } from "@/types/trip";
import {
  getAvailableVehicles,
  getAvailableDrivers,
} from "@/services/trip.service";

interface Props {
  onTripCreated: () => void;
  onCreate: (data: TripCreateInput) => Promise<void>;
  loading?: boolean;
}

export default function CreateTripForm({
  onTripCreated,
  onCreate,
  loading,
}: Props) {
  /* ── Picker data ── */
  const [vehicles, setVehicles] = useState<TripVehicle[]>([]);
  const [drivers, setDrivers] = useState<TripDriver[]>([]);

  useEffect(() => {
    getAvailableVehicles()
      .then(setVehicles)
      .catch(() => {});
    getAvailableDrivers()
      .then(setDrivers)
      .catch(() => {});
  }, []);

  /* ── Form state ── */
  const [form, setForm] = useState({
    source: "",
    destination: "",
    vehicleId: "",
    driverId: "",
    cargoWeightKg: "",
    plannedDistanceKm: "",
  });

  const [error, setError] = useState("");

  /* ── Derived: selected vehicle for capacity check ── */
  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === form.vehicleId),
    [vehicles, form.vehicleId],
  );

  const cargoNum = Number(form.cargoWeightKg) || 0;
  const capacity = selectedVehicle
    ? Number(selectedVehicle.maxLoadCapacityKg)
    : 0;
  const overweight = selectedVehicle ? cargoNum > capacity : false;
  const overweightAmount = overweight ? cargoNum - capacity : 0;

  /* ── Handlers ── */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.source.trim()) {
      setError("Source is required.");
      return;
    }
    if (!form.destination.trim()) {
      setError("Destination is required.");
      return;
    }
    if (!form.vehicleId) {
      setError("Select a vehicle.");
      return;
    }
    if (!form.driverId) {
      setError("Select a driver.");
      return;
    }
    if (!form.cargoWeightKg || Number(form.cargoWeightKg) <= 0) {
      setError("Cargo weight must be a positive number.");
      return;
    }
    if (!form.plannedDistanceKm || Number(form.plannedDistanceKm) <= 0) {
      setError("Planned distance must be a positive number.");
      return;
    }
    if (overweight) {
      setError("Cargo exceeds vehicle capacity — dispatch blocked.");
      return;
    }

    try {
      await onCreate({
        source: form.source.trim(),
        destination: form.destination.trim(),
        vehicleId: form.vehicleId,
        driverId: form.driverId,
        cargoWeightKg: Number(form.cargoWeightKg),
        plannedDistanceKm: Number(form.plannedDistanceKm),
      });

      // Reset form
      setForm({
        source: "",
        destination: "",
        vehicleId: "",
        driverId: "",
        cargoWeightKg: "",
        plannedDistanceKm: "",
      });
      onTripCreated();
    } catch (err: any) {
      setError(
        err?.response?.data?.error || err?.message || "Failed to create trip.",
      );
    }
  }

  /* ── Filter out drivers with expired licenses (client-side guard) ── */
  const eligibleDrivers = drivers.filter((d) => {
    return new Date(d.licenseExpiryDate) >= new Date();
  });

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all";

  return (
    <div className="bg-white border rounded-xl p-6 space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Create Trip</h2>
        <Send size={20} className="text-slate-400" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Source */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Source
          </label>
          <input
            name="source"
            value={form.source}
            onChange={handleChange}
            placeholder="e.g. Gandhinagar Depot"
            className={inputClass}
          />
        </div>

        {/* Destination */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Destination
          </label>
          <input
            name="destination"
            value={form.destination}
            onChange={handleChange}
            placeholder="e.g. Ahmedabad Hub"
            className={inputClass}
          />
        </div>

        {/* Vehicle (available only) */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Vehicle (available only)
          </label>
          <select
            name="vehicleId"
            value={form.vehicleId}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select Vehicle</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nameModel} — {v.registrationNumber} (
                {Number(v.maxLoadCapacityKg)} kg capacity)
              </option>
            ))}
          </select>
        </div>

        {/* Driver (available only) */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Driver (available only)
          </label>
          <select
            name="driverId"
            value={form.driverId}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select Driver</option>
            {eligibleDrivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cargo Weight */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Cargo Weight (kg)
          </label>
          <input
            type="number"
            name="cargoWeightKg"
            value={form.cargoWeightKg}
            onChange={handleChange}
            placeholder="0"
            className={inputClass}
          />
        </div>

        {/* Planned Distance */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Planned Distance (km)
          </label>
          <input
            type="number"
            name="plannedDistanceKm"
            value={form.plannedDistanceKm}
            onChange={handleChange}
            placeholder="0"
            className={inputClass}
          />
        </div>

        {/* ── Live capacity warning (matches screenshot red box) ── */}
        {selectedVehicle && cargoNum > 0 && (
          <div
            className={`
              rounded-lg border px-4 py-3 text-sm
              ${
                overweight
                  ? "bg-red-950/5 border-red-400 text-red-700"
                  : "bg-emerald-50 border-emerald-300 text-emerald-700"
              }
            `}
          >
            <p className="font-semibold">
              Vehicle Capacity: {capacity} kg
            </p>
            <p className="font-semibold">
              Cargo Weight: {cargoNum} kg
            </p>
            {overweight ? (
              <p className="flex items-center gap-1.5 mt-1 font-bold">
                <XCircle size={16} className="text-red-600" />
                Capacity exceeded by {overweightAmount} kg — dispatch blocked
              </p>
            ) : (
              <p className="flex items-center gap-1.5 mt-1">
                ✓ Within capacity ({capacity - cargoNum} kg headroom)
              </p>
            )}
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={overweight || loading}
            className={`
              flex-1 rounded-lg py-3 text-sm font-semibold transition-all
              ${
                overweight || loading
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
              }
            `}
          >
            {loading ? "Creating…" : overweight ? "Dispatch (Disabled)" : "Create & Dispatch"}
          </button>

          <button
            type="button"
            onClick={() =>
              setForm({
                source: "",
                destination: "",
                vehicleId: "",
                driverId: "",
                cargoWeightKg: "",
                plannedDistanceKm: "",
              })
            }
            className="flex-1 rounded-lg border border-red-300 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Info note */}
      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-xs text-slate-500 leading-relaxed">
        On Complete: odometer → fuel log → expenses → Vehicle & Driver Available.
      </div>
    </div>
  );
}
