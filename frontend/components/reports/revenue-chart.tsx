"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { FleetSummary } from "@/types/report";

interface Props {
  fleet: FleetSummary;
}

export default function RevenueChart({ fleet }: Props) {
  const data = [
    {
      name: "Revenue",
      amount: fleet.totalRevenue,
    },
    {
      name: "Operational",
      amount: fleet.totalOperationalCost,
    },
    {
      name: "Fuel",
      amount: fleet.totalFuelCost,
    },
    {
      name: "Maintenance",
      amount: fleet.totalMaintenanceCost,
    },
    {
      name: "Expenses",
      amount: fleet.totalExpenses,
    },
  ];

  return (
    <div className="bg-white border rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-6">
        Fleet Financial Summary
      </h2>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="amount"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}