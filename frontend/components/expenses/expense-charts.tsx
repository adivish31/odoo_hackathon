"use client";

import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { getExpenses, getFuelLogs, type Expense, type FuelLog } from "@/services/expense.service";

const COLORS = {
  reflect: "var(--reflect)",
  go: "var(--go)",
  caution: "var(--caution)",
  stop: "var(--stop)",
  faint: "var(--ink-faint)",
};

export default function ExpenseCharts() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);

  useEffect(() => {
    getExpenses().then(setExpenses).catch(() => {});
    getFuelLogs().then(setFuelLogs).catch(() => {});
  }, []);

  // Aggregated data for Expense Analytics (by category)
  const expenseData = useMemo(() => {
    const data: Record<string, number> = {
      TOLL: 0,
      PARKING: 0,
      REPAIR: 0,
      MISC: 0,
    };
    expenses.forEach((e) => {
      data[e.category] += Number(e.amount) || 0;
    });

    return [
      { name: "Toll", amount: data.TOLL, fill: COLORS.reflect },
      { name: "Parking", amount: data.PARKING, fill: COLORS.go },
      { name: "Repair", amount: data.REPAIR, fill: COLORS.caution },
      { name: "Misc", amount: data.MISC, fill: COLORS.faint },
    ];
  }, [expenses]);

  // Aggregated data for Fuel Consumption (by date)
  const fuelData = useMemo(() => {
    const data: Record<string, number> = {};
    fuelLogs.forEach((f) => {
      const date = new Date(f.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      data[date] = (data[date] || 0) + (Number(f.cost) || 0);
    });

    const sortedDates = Object.keys(data).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return sortedDates.map((date) => ({
      date,
      cost: data[date],
    }));
  }, [fuelLogs]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-panel border border-hairline p-3 rounded-[6px] shadow-lg">
          <p className="text-[0.875rem] font-medium text-ink">
            {`${payload[0].payload.name || payload[0].payload.date}: ₹${payload[0].value.toLocaleString("en-IN")}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Expense Analytics */}
      <div className="bg-panel border border-hairline rounded-[10px] p-5">
        <h3 className="text-[0.75rem] font-semibold text-ink-dim uppercase tracking-[0.08em] mb-5">
          Expense Breakdown
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--hairline)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--ink-faint)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--ink-faint)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--panel-raised)" }} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fuel Consumption */}
      <div className="bg-panel border border-hairline rounded-[10px] p-5">
        <h3 className="text-[0.75rem] font-semibold text-ink-dim uppercase tracking-[0.08em] mb-5">
          Fuel Cost Trend
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fuelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.reflect} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.reflect} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--hairline)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--ink-faint)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--ink-faint)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cost" stroke={COLORS.reflect} fillOpacity={1} fill="url(#colorCost)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
