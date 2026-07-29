import axios from "axios";
import { getToken } from "@/lib/auth-token";
import type { MaintenanceData, ServiceRecord } from "@/types/maintenance";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface BackendMaintLog {
  id: string;
  vehicleId: string;
  type: string;
  description?: string | null;
  cost: string | number;
  status: "OPEN" | "CLOSED";
  openedAt: string;
  closedAt?: string | null;
  vehicle?: { registrationNumber: string; nameModel: string; status: string };
}

function mapRecord(m: BackendMaintLog): ServiceRecord {
  return {
    id: m.id,
    vehicle: m.vehicle?.registrationNumber ?? "—",
    model: m.vehicle?.nameModel ?? "",
    service: m.type,
    cost: Number(m.cost),
    status: m.status === "OPEN" ? "IN SHOP" : "COMPLETED",
    date: new Date(m.openedAt).toISOString().slice(0, 10),
  };
}

export async function getMaintenance(): Promise<MaintenanceData> {
  const res = await api.get<BackendMaintLog[]>("/maintenance");
  const logs = res.data;
  const records = logs.map(mapRecord);

  const totalSpend = logs.reduce((sum, m) => sum + Number(m.cost), 0);
  const open = logs.filter((m) => m.status === "OPEN").length;

  const kpis = [
    { title: "Total Spend", value: `₹${totalSpend.toLocaleString("en-IN")}`, icon: "payments" },
    { title: "Units In Shop", value: String(open).padStart(2, "0"), icon: "precision_manufacturing" },
    { title: "Open Records", value: String(open).padStart(2, "0"), icon: "warning" },
  ];

  return { kpis, records };
}

export interface CreateMaintenanceInput {
  vehicleId: string;
  type: string;
  cost: number;
  description?: string;
}

export async function createMaintenance(data: CreateMaintenanceInput) {
  const res = await api.post("/maintenance", data);
  return res.data;
}

export async function closeMaintenance(id: string) {
  const res = await api.post(`/maintenance/${id}/close`);
  return res.data;
}
