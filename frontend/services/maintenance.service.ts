import axios from "axios";

const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4005") + "/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  type: string;
  description?: string;
  cost: number;
  status: "OPEN" | "CLOSED";
  openedAt: string;
  closedAt?: string;
  vehicle?: {
    id: string;
    registrationNumber: string;
    nameModel: string;
    status: string;
  };
}

export async function listMaintenance(filters?: { vehicleId?: string; status?: "OPEN" | "CLOSED" }): Promise<MaintenanceLog[]> {
  const params = filters || {};
  const { data } = await api.get<MaintenanceLog[]>("/maintenance", { params });
  return data;
}

export async function openMaintenance(payload: { vehicleId: string; type: string; description?: string; cost: number }): Promise<MaintenanceLog> {
  const { data } = await api.post<MaintenanceLog>("/maintenance", payload);
  return data;
}

export async function closeMaintenance(id: string): Promise<MaintenanceLog> {
  const { data } = await api.post<MaintenanceLog>(`/maintenance/${id}/close`);
  return data;
}