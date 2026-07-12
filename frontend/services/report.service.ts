import axios from "axios";
import { ReportResponse } from "@/types/report";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function getReports(): Promise<ReportResponse> {
  const res = await api.get<ReportResponse>("/reports/summary");
  return res.data;
}

export async function exportReportCsv() {
  const res = await api.get("/reports/export.csv", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(
    new Blob([res.data], { type: "text/csv" })
  );

  const link = document.createElement("a");
  link.href = url;
  link.download = "transitops-report.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
}