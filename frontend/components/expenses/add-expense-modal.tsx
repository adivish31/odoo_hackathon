"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { addExpense } from "@/services/expense.service";
import { getVehicles } from "@/services/vehicle.service";
import type { Vehicle } from "@/types/vehicle";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddExpenseModal({ onClose, onSuccess }: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleId, setVehicleId] = useState("");
  const [category, setCategory] = useState("TOLL");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getVehicles().then(setVehicles).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await addExpense({
        vehicleId,
        category,
        amount: Number(amount),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Add Expense</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Vehicle</label>
            <select
              required
              className="w-full rounded-lg border p-2.5 outline-none focus:border-blue-500"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registrationNumber} - {v.nameModel}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
            <select
              required
              className="w-full rounded-lg border p-2.5 outline-none focus:border-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="TOLL">Toll</option>
              <option value="PARKING">Parking</option>
              <option value="REPAIR">Repair</option>
              <option value="MISC">Miscellaneous</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Amount (₹)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="w-full rounded-lg border p-2.5 outline-none focus:border-blue-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 150"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? "Saving..." : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
