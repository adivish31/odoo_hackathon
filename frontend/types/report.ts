export interface KPI {
  title: string;
  value: string | number;
  unit?: string;
  trend?: string;
}


export interface Revenue {
  month: string;
  planned: number;
  actual: number;
}


export interface VehicleCost {
  vehicleId: string;
  cost: number;
}


export interface OperationalTable {
  region: string;
  trips: number;
  fuelCost: string;
  maintenance: string;
  status: string;
}



export interface ReportResponse {

  kpis: KPI[];

  revenue: Revenue[];

  vehicles: VehicleCost[];

  operations: OperationalTable[];

}