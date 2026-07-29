"use client";

import { useCallback, useEffect, useState } from "react";
import { ReceiptText, X } from "lucide-react";
import { getExpenses, createExpense, type Expense } from "@/services/expense.service";
import { getVehicles } from "@/services/vehicle.service";
import { apiError } from "@/lib/api-error";
import type { Vehicle } from "@/types/vehicle";

const CATEGORIES = ["TOLL", "PARKING", "REPAIR", "MISC"];

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ExpenseTable() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setExpenses(await getExpenses());
    } catch {
      setExpenses([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <div className="bg-panel border border-hairline rounded-[10px] overflow-hidden">
        <div className="p-5 border-b border-hairline flex items-center justify-between">
          <h2 className="text-xl font-bold font-heading text-ink">Other Expenses (Toll / Misc)</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-reflect text-[#1A1300] px-4 py-2 rounded-[6px] text-sm font-semibold hover:brightness-110 transition"
          >
            <ReceiptText size={16} />
            Add Expense
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-panel-raised border-b border-hairline text-left text-[0.75rem] uppercase tracking-[0.08em] font-semibold text-ink-dim">
                <th className="py-3 px-5">Vehicle</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-[0.9375rem] text-ink">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-ink-dim font-medium">
                    No expenses yet.
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-hairline last:border-none hover:bg-panel-raised transition-colors h-[52px]">
                    <td className="py-2 px-5 font-semibold">{expense.vehicle?.registrationNumber ?? "—"}</td>
                    <td className="py-2 px-5 capitalize">{expense.category.toLowerCase()}</td>
                    <td className="py-2 px-5">{fmtDate(expense.date)}</td>
                    <td className="py-2 px-5 text-right font-bold tabular-nums font-mono text-ink">
                      ₹{Number(expense.amount).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <AddExpenseModal
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

function AddExpenseModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ vehicleId: "", category: "TOLL", amount: "" });

  useEffect(() => {
    getVehicles().then(setVehicles).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.vehicleId) return setError("Please select a vehicle.");
    if (!CATEGORIES.includes(form.category)) return setError("Invalid category.");
    if (!form.amount || Number(form.amount) <= 0) return setError("Amount must be positive.");

    setLoading(true);
    try {
      await createExpense({
        vehicleId: form.vehicleId,
        category: form.category,
        amount: Number(form.amount),
      });
      onSuccess();
    } catch (err) {
      setError(apiError(err, "Failed to add expense."));
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "mt-1.5 w-full rounded-[6px] border border-hairline bg-panel-raised px-3 py-2.5 text-sm text-ink outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md bg-panel rounded-[12px] border border-hairline shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-hairline">
          <h2 className="text-xl font-bold font-heading text-ink">Add Expense</h2>
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
              <label className="text-[0.75rem] font-semibold text-ink-dim uppercase tracking-[0.08em]">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[0.75rem] font-semibold text-ink-dim uppercase tracking-[0.08em]">Amount (₹)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
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
              {loading ? "Saving..." : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
