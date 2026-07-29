import axios from "axios";
import { getToken } from "@/lib/auth-token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface DashboardKpis {
  vehicles: {
    total: number;
    active: number;
    available: number;
    onTrip: number;
    inShop: number;
    retired: number;
    byStatus: Record<string, number>;
  };
  trips: { active: number; draft: number; completed: number };
  drivers: {
    onDuty: number;
    available: number;
    onTrip: number;
    offDuty: number;
    suspended: number;
  };
  fleetUtilizationPct: number;
}

export async function getDashboardKpis(): Promise<DashboardKpis> {
  const res = await api.get<DashboardKpis>("/dashboard/kpis");
  return res.data;
}
