"use client";

import { Truck, Activity, Users, Map } from "lucide-react";
import type { DashboardResponse } from "@/services/dashboard.service";

interface Props {
  data: DashboardResponse;
}

export default function DashboardKpis({ data }: Props) {
  const kpis = [
    {
      title: "Active Vehicles",
      value: data.vehicles.active,
      subtitle: `${data.vehicles.available} Available, ${data.vehicles.inShop} In Shop`,
      icon: <Truck className="h-5 w-5 text-blue-500" />,
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Fleet Utilization",
      value: `${data.fleetUtilizationPct}%`,
      subtitle: `${data.vehicles.onTrip} Vehicles On Trip`,
      icon: <Activity className="h-5 w-5 text-emerald-500" />,
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Active Trips",
      value: data.trips.active,
      subtitle: `${data.trips.draft} Pending Drafts`,
      icon: <Map className="h-5 w-5 text-amber-500" />,
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Drivers On Duty",
      value: data.drivers.onDuty,
      subtitle: `${data.drivers.onTrip} On Trip, ${data.drivers.available} Available`,
      icon: <Users className="h-5 w-5 text-purple-500" />,
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, i) => (
        <div key={i} className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">{kpi.title}</h3>
            <div className={`rounded-full p-2 ${kpi.bgColor}`}>{kpi.icon}</div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-slate-900">{kpi.value}</p>
            <p className="mt-1 text-sm text-slate-500">{kpi.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
