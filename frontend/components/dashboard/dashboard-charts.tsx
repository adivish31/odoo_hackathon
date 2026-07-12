"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { DashboardResponse } from "@/services/dashboard.service";

interface Props {
  data: DashboardResponse;
}

const COLORS = {
  AVAILABLE: "#22c55e", // emerald-500
  ON_TRIP: "#3b82f6",   // blue-500
  IN_SHOP: "#f59e0b",   // amber-500
  RETIRED: "#94a3b8",   // slate-400
};

export default function DashboardCharts({ data }: Props) {
  const chartData = [
    { name: "Available", value: data.vehicles.byStatus.AVAILABLE, color: COLORS.AVAILABLE },
    { name: "On Trip", value: data.vehicles.byStatus.ON_TRIP, color: COLORS.ON_TRIP },
    { name: "In Shop", value: data.vehicles.byStatus.IN_SHOP, color: COLORS.IN_SHOP },
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Donut Chart */}
      <div className="col-span-1 rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Active Fleet Status</h3>
        <p className="text-sm text-slate-500">Excluding retired vehicles</p>
        
        <div className="mt-6 h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value} Vehicles`, "Count"]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              No active vehicles found
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions or Info (Placeholder for 2nd column) */}
      <div className="col-span-1 lg:col-span-2 rounded-xl border bg-slate-900 p-6 text-white shadow-sm flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 17h4V5H2v12h3" />
            <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
            <path d="M14 17h1" />
            <circle cx="7.5" cy="17.5" r="2.5" />
            <circle cx="17.5" cy="17.5" r="2.5" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold z-10">Welcome to TransitOps</h3>
        <p className="mt-2 max-w-md text-slate-300 z-10">
          Your fleet operations are running smoothly. Currently, {data.vehicles.onTrip} vehicles are out on deliveries with {data.drivers.onDuty} drivers on duty.
        </p>
        
        <div className="mt-8 grid grid-cols-2 gap-4 z-10 max-w-md">
          <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-400">Draft Trips</p>
            <p className="mt-1 text-2xl font-bold">{data.trips.draft}</p>
          </div>
          <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-sm font-medium text-slate-400">Completed Today</p>
            <p className="mt-1 text-2xl font-bold">{data.trips.completed}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
