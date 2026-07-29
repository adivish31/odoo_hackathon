import axios from "axios";
import { getToken } from "@/lib/auth-token";
import type {
  Vehicle,
  VehicleCreateInput,
  VehicleUpdateInput,
  VehicleListFilters,
} from "@/types/vehicle";

export type { VehicleListFilters };

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export async function getVehicles(filters: VehicleListFilters = {}): Promise<Vehicle[]> {
  const params: Record<string, string> = {};
  if (filters.type && filters.type !== "ALL") params.type = filters.type;
  if (filters.status && filters.status !== "ALL") params.status = filters.status;
  if (filters.search) params.search = filters.search;
  if (filters.region) params.region = filters.region;

  const res = await api.get<Vehicle[]>("/vehicles", { params });
  return res.data;
}

export async function createVehicle(data: VehicleCreateInput): Promise<Vehicle> {
  const res = await api.post<Vehicle>("/vehicles", data);
  return res.data;
}

export async function updateVehicle(id: string, data: VehicleUpdateInput): Promise<Vehicle> {
  const res = await api.put<Vehicle>(`/vehicles/${id}`, data);
  return res.data;
}

export async function retireVehicle(id: string): Promise<Vehicle> {
  const res = await api.delete<Vehicle>(`/vehicles/${id}`);
  return res.data;
}
