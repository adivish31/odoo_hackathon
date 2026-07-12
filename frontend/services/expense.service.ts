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

export interface FuelLog {
  id: string;
  vehicleId: string;
  tripId?: string;
  liters: number;
  cost: number;
  date: string;
  vehicle?: {
    registrationNumber: string;
    nameModel: string;
  };
}

export interface Expense {
  id: string;
  vehicleId: string;
  tripId?: string;
  category: "TOLL" | "PARKING" | "REPAIR" | "MISC";
  amount: number;
  date: string;
  vehicle?: {
    registrationNumber: string;
    nameModel: string;
  };
}

export async function getFuelLogs(vehicleId?: string): Promise<FuelLog[]> {
  const params = vehicleId ? { vehicleId } : {};
  const { data } = await api.get<FuelLog[]>("/fuel-logs", { params });
  return data;
}

export async function addFuelLog(payload: { vehicleId: string; tripId?: string; liters: number; cost: number; date?: string }): Promise<FuelLog> {
  const { data } = await api.post<FuelLog>("/fuel-logs", payload);
  return data;
}

export async function getExpenses(vehicleId?: string): Promise<Expense[]> {
  const params = vehicleId ? { vehicleId } : {};
  const { data } = await api.get<Expense[]>("/expenses", { params });
  return data;
}

export async function addExpense(payload: { vehicleId: string; tripId?: string; category: string; amount: number; date?: string }): Promise<Expense> {
  const { data } = await api.post<Expense>("/expenses", payload);
  return data;
}
