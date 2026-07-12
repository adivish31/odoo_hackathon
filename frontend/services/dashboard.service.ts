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

export interface DashboardResponse {
  vehicles: {
    total: number;
    active: number;
    available: number;
    onTrip: number;
    inShop: number;
    retired: number;
    byStatus: {
      AVAILABLE: number;
      ON_TRIP: number;
      IN_SHOP: number;
      RETIRED: number;
    };
  };
  trips: {
    active: number;
    draft: number;
    completed: number;
  };
  drivers: {
    onDuty: number;
    available: number;
    onTrip: number;
    offDuty: number;
    suspended: number;
  };
  fleetUtilizationPct: number;
}

export async function getDashboardKpis(query?: { type?: string; status?: string; region?: string }): Promise<DashboardResponse> {
  const params = new URLSearchParams();
  if (query?.type) params.append("type", query.type);
  if (query?.status) params.append("status", query.status);
  if (query?.region) params.append("region", query.region);

  const { data } = await api.get<DashboardResponse>("/dashboard/kpis", { params });
  return data;
}
