import axios from "axios";
import { getToken } from "@/lib/auth-token";
import type { ReportResponse } from "@/types/report";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface VehicleReport {
  id: string;
  registrationNumber: string;
  nameModel: string;
  type: string;
  status: string;
  distanceKm: number;
  fuelLiters: number;
  fuelEfficiencyKmPerL: number | null;
  fuelCost: number;
  maintenanceCost: number;
  expenses: number;
  operationalCost: number;
  revenue: number;
  acquisitionCost: number;
  roi: number | null;
}

interface Summary {
  fleet: {
    activeVehicles: number;
    onTripVehicles: number;
    fleetUtilizationPct: number;
    totalFuelLiters: number;
    fleetFuelEfficiencyKmPerL: number | null;
    totalOperationalCost: number;
    totalRevenue: number;
    fleetRoi: number | null;
  };
  vehicles: VehicleReport[];
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export async function getReports(): Promise<ReportResponse> {
  const { data } = await api.get<Summary>("/reports/summary");
  const f = data.fleet;

  const kpis = [
    {
      title: "Fuel Efficiency",
      value: f.fleetFuelEfficiencyKmPerL ?? 0,
      unit: "km/l",
      trend: `${Math.round(f.totalFuelLiters).toLocaleString("en-IN")} L used`,
    },
    {
      title: "Fleet Utilization",
      value: f.fleetUtilizationPct,
      unit: "%",
      trend: `${f.onTripVehicles}/${f.activeVehicles} on trip`,
    },
    {
      title: "Operational Cost",
      value: inr(f.totalOperationalCost),
      trend: "fuel + maintenance + expenses",
    },
    {
      title: "Vehicle ROI",
      value: f.fleetRoi != null ? Number((f.fleetRoi * 100).toFixed(1)) : 0,
      unit: "%",
      trend: `revenue ${inr(f.totalRevenue)}`,
    },
  ];

  const active = data.vehicles.filter((v) => v.operationalCost > 0 || v.revenue > 0);

  const revenue = active.map((v) => ({
    month: v.registrationNumber,
    planned: Math.round(v.operationalCost),
    actual: Math.round(v.revenue),
  }));

  const vehicles = [...data.vehicles]
    .sort((a, b) => b.operationalCost - a.operationalCost)
    .slice(0, 5)
    .map((v) => ({ vehicleId: v.registrationNumber, cost: Math.round(v.operationalCost) }));

  const operations = active.slice(0, 6).map((v) => ({
    region: v.registrationNumber,
    trips: Math.round(v.distanceKm),
    fuelCost: inr(v.fuelCost),
    maintenance: inr(v.maintenanceCost),
    status: v.status,
  }));

  return { kpis, revenue, vehicles, operations };
}

export async function downloadReportCsv(): Promise<void> {
  const res = await api.get("/reports/export.csv", { responseType: "blob" });
  const url = URL.createObjectURL(res.data as Blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transitops-report.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
