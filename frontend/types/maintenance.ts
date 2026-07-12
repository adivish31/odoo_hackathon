export interface ServiceRecord {
  id: string;
  vehicle: string;
  model: string;
  service: string;
  cost: number;
  status: "IN SHOP" | "COMPLETED" | "AVAILABLE";
  date: string;
}


export interface MaintenanceKPI {
  title: string;
  value: string;
  icon: string;
}


export interface MaintenanceData {
  kpis: MaintenanceKPI[];
  records: ServiceRecord[];
}