"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { getFuelLogs, createFuelLog, type FuelLog } from "@/services/expense.service";
import { getVehicles } from "@/services/vehicle.service";
import { apiError } from "@/lib/api-error";
import type { Vehicle } from "@/types/vehicle";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function FuelLogTable() {
  const [logs, setLogs] = useState<FuelLog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setLogs(await getFuelLogs());
    } catch {
      setLogs([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <div className="bg-panel border border-hairline rounded-[10px] overflow-hidden">
        <div className="p-5 border-b border-hairline flex items-center justify-between">
          <h2 className="text-xl font-bold font-heading text-ink">Fuel Logs</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-reflect text-[#1A1300] px-4 py-2 rounded-[6px] text-sm font-semibold hover:brightness-110 transition"
          >
            <Plus size={16} />
            Log Fuel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-panel-raised border-b border-hairline text-left text-[0.75rem] uppercase tracking-[0.08em] font-semibold text-ink-dim">
                <th className="py-3 px-5">Vehicle</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5 text-right">Liters</th>
                <th className="py-3 px-5 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="text-[0.9375rem] text-ink">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-ink-dim font-medium">
                    No fuel logs yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-hairline last:border-none hover:bg-panel-raised transition-colors h-[52px]">
                    <td className="py-2 px-5 font-medium">{log.vehicle?.registrationNumber ?? "—"}</td>
                    <td className="py-2 px-5">{fmtDate(log.date)}</td>
                    <td className="py-2 px-5 text-right font-mono text-[0.875rem]">{Number(log.liters).toFixed(1)} L</td>
                    <td className="py-2 px-5 text-right font-mono text-[0.875rem] font-semibold text-ink">
                      ₹{Number(log.cost).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <LogFuelModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            load();
          }}
        />
      )}
    </>
  );
}

function LogFuelModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ vehicleId: "", liters: "", cost: "" });

  useEffect(() => {
    getVehicles().then(setVehicles).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.vehicleId) return setError("Please select a vehicle.");
    if (!form.liters || Number(form.liters) <= 0) return setError("Liters must be positive.");
    if (!form.cost || Number(form.cost) < 0) return setError("Cost must be valid.");

    setLoading(true);
    try {
      await createFuelLog({
        vehicleId: form.vehicleId,
        liters: Number(form.liters),
        cost: Number(form.cost),
      });
      onSuccess();
    } catch (err) {
      setError(apiError(err, "Failed to log fuel."));
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "mt-1.5 w-full rounded-[6px] border border-hairline bg-panel-raised px-3 py-2.5 text-sm text-ink outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md bg-panel rounded-[12px] border border-hairline shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-hairline">
          <h2 className="text-xl font-bold font-heading text-ink">Log Fuel Entry</h2>
          <button onClick={onClose} className="p-1 rounded-[6px] hover:bg-panel-raised text-ink-dim transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="p-3 text-sm rounded-[6px] bg-stop/10 text-stop border border-stop/30 font-medium">{error}</div>}
          
          <div>
            <label className="text-[0.75rem] font-semibold text-ink-dim uppercase tracking-[0.08em]">Vehicle</label>
            <select
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              className={inputClass}
            >
              <option value="">Select a Vehicle</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.registrationNumber} — {v.nameModel}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[0.75rem] font-semibold text-ink-dim uppercase tracking-[0.08em]">Liters</label>
              <input
                type="number"
                step="0.01"
                value={form.liters}
                onChange={(e) => setForm({ ...form, liters: e.target.value })}
                className={inputClass}
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="text-[0.75rem] font-semibold text-ink-dim uppercase tracking-[0.08em]">Cost (₹)</label>
              <input
                type="number"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                className={inputClass}
                placeholder="0"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-[6px] border border-hairline text-ink hover:bg-panel-raised transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-[6px] bg-amber text-[#1A1300] hover:brightness-110 transition-all font-semibold disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
