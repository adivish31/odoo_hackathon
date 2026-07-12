export interface FleetSummary {
  totalVehicles: number;
  activeVehicles: number;
  onTripVehicles: number;
  fleetUtilizationPct: number;
  totalDistanceKm: number;
  totalFuelLiters: number;
  fleetFuelEfficiencyKmPerL: number | null;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalExpenses: number;
  totalOperationalCost: number;
  totalRevenue: number;
  fleetRoi: number | null;
}

export interface VehicleReport {
  id: string;
  registrationNumber: string;
  nameModel: string;
  type: string;
  status: string;
  distanceKm: number;
  fuelLiters: number;
  fuelEfficiencyKmPerL: number | null;
  fuelCost: number;
  maintenanceCost: number;
  expenses: number;
  operationalCost: number;
  revenue: number;
  acquisitionCost: number;
  roi: number | null;
}

export interface ReportResponse {
  fleet: FleetSummary;
  vehicles: VehicleReport[];
}