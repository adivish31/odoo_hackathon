"use client";

import { useState, useEffect, useMemo } from "react";
import { Send, XCircle, AlertTriangle } from "lucide-react";
import type { TripVehicle, TripDriver, TripCreateInput } from "@/types/trip";
import {
  getAvailableVehicles,
  getAvailableDrivers,
} from "@/services/trip.service";
import { apiError } from "@/lib/api-error";

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
    } catch (err) {
      setError(apiError(err, "Failed to create trip."));
    }
  }

  /* ── Filter out drivers with expired licenses (client-side guard) ── */
  const eligibleDrivers = drivers.filter((d) => {
    return new Date(d.licenseExpiryDate) >= new Date();
  });

  const inputClass =
    "mt-1 w-full rounded-[6px] border border-hairline bg-panel-raised px-3 py-2.5 text-[0.9375rem] text-ink focus:border-amber focus:ring-1 focus:ring-amber outline-none transition-all placeholder:text-ink-faint";

  return (
    <div className="bg-panel border border-hairline rounded-[10px] p-6 space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-heading text-ink">Create Trip</h2>
        <Send size={20} className="text-ink-dim" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Source */}
        <div>
          <label className="text-[0.75rem] font-semibold text-ink-dim uppercase tracking-[0.08em]">
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
          <label className="text-[0.75rem] font-semibold text-ink-dim uppercase tracking-[0.08em]">
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
          <label className="text-[0.75rem] font-semibold text-ink-dim uppercase tracking-[0.08em]">
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
          <label className="text-[0.75rem] font-semibold text-ink-dim uppercase tracking-[0.08em]">
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
          <label className="text-[0.75rem] font-semibold text-ink-dim uppercase tracking-[0.08em]">
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
          <label className="text-[0.75rem] font-semibold text-ink-dim uppercase tracking-[0.08em]">
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
              rounded-[6px] border px-4 py-3 text-sm
              ${
                overweight
                  ? "bg-stop/10 border-stop/30 text-stop"
                  : "bg-go/10 border-go/30 text-go"
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
                <XCircle size={16} className="text-stop" />
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
          <div className="rounded-[6px] bg-stop/10 border border-stop/30 px-4 py-3 text-sm text-stop flex items-start gap-2">
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
              flex-1 rounded-[6px] py-3 text-[0.9375rem] font-semibold transition-all
              ${
                overweight || loading
                  ? "bg-panel-raised text-ink-faint border border-hairline cursor-not-allowed"
                  : "bg-amber text-[#1A1300] hover:brightness-110 active:scale-[0.98]"
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
            className="flex-1 rounded-[6px] border border-stop/50 py-3 text-[0.9375rem] font-semibold text-stop hover:bg-stop/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Info note */}
      <div className="rounded-[6px] bg-panel-raised border border-hairline p-4 text-[0.75rem] text-ink-dim leading-relaxed">
        On Complete: odometer → fuel log → expenses → Vehicle & Driver Available.
      </div>
    </div>
  );
}
