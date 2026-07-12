"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Vehicle, VehicleCreateInput, VehicleType } from "@/types/vehicle";

interface Props {
  initialData?: Vehicle | null;
  onSubmit: (data: VehicleCreateInput, id?: string) => Promise<void>;
  onClose: () => void;
}

export default function AddVehicleModal({ initialData, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<VehicleCreateInput>({
    registrationNumber: "",
    nameModel: "",
    type: "van",
    maxLoadCapacityKg: 0,
    odometerKm: 0,
    acquisitionCost: 0,
    region: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        registrationNumber: initialData.registrationNumber,
        nameModel: initialData.nameModel,
        type: initialData.type,
        maxLoadCapacityKg: Number(initialData.maxLoadCapacityKg),
        odometerKm: Number(initialData.odometerKm),
        acquisitionCost: Number(initialData.acquisitionCost),
        region: initialData.region || "",
      });
    }
  }, [initialData]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.registrationNumber.trim()) return setError("Registration Number is required.");
    if (!form.nameModel.trim()) return setError("Name/Model is required.");
    if (form.maxLoadCapacityKg <= 0) return setError("Capacity must be greater than 0.");
    if (form.acquisitionCost < 0) return setError("Acquisition cost cannot be negative.");

    setLoading(true);
    try {
      await onSubmit(form, initialData?.id);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }

  const isEditing = !!initialData;

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">
            {isEditing ? "Edit Vehicle" : "Add Vehicle"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors text-slate-500"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Reg No */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-sm font-medium text-slate-700">Reg. No.</label>
              <input
                name="registrationNumber"
                value={form.registrationNumber}
                onChange={handleChange}
                placeholder="GJ-01-AB-1234"
                className={inputClass}
                disabled={isEditing}
              />
            </div>

            {/* Name/Model */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-sm font-medium text-slate-700">Name/Model</label>
              <input
                name="nameModel"
                value={form.nameModel}
                onChange={handleChange}
                placeholder="Tata Ace"
                className={inputClass}
              />
            </div>

            {/* Type */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-sm font-medium text-slate-700">Type</label>
              <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
                <option value="bike">Bike</option>
                <option value="bus">Bus</option>
              </select>
            </div>

            {/* Region */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-sm font-medium text-slate-700">Region (Optional)</label>
              <input
                name="region"
                value={form.region}
                onChange={handleChange}
                placeholder="Ahmedabad"
                className={inputClass}
              />
            </div>

            {/* Capacity */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-sm font-medium text-slate-700">Capacity (kg)</label>
              <input
                type="number"
                name="maxLoadCapacityKg"
                value={form.maxLoadCapacityKg || ""}
                onChange={handleChange}
                placeholder="500"
                className={inputClass}
              />
            </div>

            {/* Acq Cost */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-sm font-medium text-slate-700">Acquisition Cost (₹)</label>
              <input
                type="number"
                name="acquisitionCost"
                value={form.acquisitionCost || ""}
                onChange={handleChange}
                placeholder="500000"
                className={inputClass}
              />
            </div>

            {/* Odometer */}
            <div className="col-span-2">
              <label className="text-sm font-medium text-slate-700">Initial Odometer (km)</label>
              <input
                type="number"
                name="odometerKm"
                value={form.odometerKm || ""}
                onChange={handleChange}
                placeholder="0"
                className={inputClass}
                disabled={isEditing}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
