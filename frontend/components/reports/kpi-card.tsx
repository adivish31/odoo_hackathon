import {
  Fuel,
  BarChart3,
  Wallet,
  TrendingUp,
} from "lucide-react";

import { FleetSummary } from "@/types/report";

interface Props {
  title:
    | "Fuel Efficiency"
    | "Fleet Utilization"
    | "Operational Cost"
    | "Vehicle ROI";
  fleet: FleetSummary;
}

const iconMap = {
  "Fuel Efficiency": Fuel,
  "Fleet Utilization": BarChart3,
  "Operational Cost": Wallet,
  "Vehicle ROI": TrendingUp,
};

export default function KpiCard({ title, fleet }: Props) {
  const Icon = iconMap[title];

  let value: string | number = "";
  let unit = "";

  switch (title) {
    case "Fuel Efficiency":
      value = fleet.fleetFuelEfficiencyKmPerL ?? 0;
      unit = "km/L";
      break;

    case "Fleet Utilization":
      value = fleet.fleetUtilizationPct;
      unit = "%";
      break;

    case "Operational Cost":
      value = `₹${fleet.totalOperationalCost.toLocaleString()}`;
      break;

    case "Vehicle ROI":
      value = `${((fleet.fleetRoi ?? 0) * 100).toFixed(2)}`;
      unit = "%";
      break;
  }

  return (
    <div className="bg-white rounded-xl border p-5">
      <div className="flex justify-between">
        <p className="text-sm text-slate-500">{title}</p>

        <Icon size={22} className="text-blue-600" />
      </div>

      <h2 className="text-3xl font-bold mt-5">
        {value}
        {unit && (
          <span className="text-lg text-slate-400 ml-1">
            {unit}
          </span>
        )}
      </h2>
    </div>
  );
}