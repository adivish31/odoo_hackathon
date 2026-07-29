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

interface VehicleRef {
  registrationNumber: string;
  nameModel: string;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  tripId?: string | null;
  liters: string | number;
  cost: string | number;
  date: string;
  vehicle?: VehicleRef;
}

export interface Expense {
  id: string;
  vehicleId: string;
  tripId?: string | null;
  category: "TOLL" | "PARKING" | "REPAIR" | "MISC";
  amount: string | number;
  date: string;
  vehicle?: VehicleRef;
}

export async function getFuelLogs(): Promise<FuelLog[]> {
  const res = await api.get<FuelLog[]>("/fuel-logs");
  return res.data;
}

export async function getExpenses(): Promise<Expense[]> {
  const res = await api.get<Expense[]>("/expenses");
  return res.data;
}

export async function createFuelLog(data: { vehicleId: string; liters: number; cost: number }) {
  const res = await api.post("/fuel-logs", data);
  return res.data;
}

export async function createExpense(data: {
  vehicleId: string;
  category: string;
  amount: number;
}) {
  const res = await api.post("/expenses", data);
  return res.data;
}
