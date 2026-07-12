import axios from "axios";
import type {
  Trip,
  TripCreateInput,
  TripCompleteInput,
  TripStatus,
  TripVehicle,
  TripDriver,
} from "@/types/trip";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/* ── Trips ── */

export async function getTrips(status?: TripStatus): Promise<Trip[]> {
  const params = status ? { status } : {};
  const res = await api.get<Trip[]>("/trips", { params });
  return res.data;
}

export async function createTrip(data: TripCreateInput): Promise<Trip> {
  const res = await api.post<Trip>("/trips", data);
  return res.data;
}

export async function dispatchTrip(id: string): Promise<Trip> {
  const res = await api.post<Trip>(`/trips/${id}/dispatch`);
  return res.data;
}

export async function completeTrip(
  id: string,
  data: TripCompleteInput,
): Promise<Trip> {
  const res = await api.post<Trip>(`/trips/${id}/complete`, data);
  return res.data;
}

export async function cancelTrip(id: string): Promise<Trip> {
  const res = await api.post<Trip>(`/trips/${id}/cancel`);
  return res.data;
}

/* ── Pickers (available assets only) ── */

export async function getAvailableVehicles(): Promise<TripVehicle[]> {
  const res = await api.get<TripVehicle[]>("/vehicles", {
    params: { status: "AVAILABLE" },
  });
  return res.data;
}

export async function getAvailableDrivers(): Promise<TripDriver[]> {
  const res = await api.get<TripDriver[]>("/drivers", {
    params: { status: "AVAILABLE" },
  });
  return res.data;
}
