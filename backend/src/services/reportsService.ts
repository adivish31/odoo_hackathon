import { prisma } from "../lib/prisma.js";

function round(n: number, dp = 2): number {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
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

export interface ReportSummary {
  fleet: {
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
  };
  vehicles: VehicleReport[];
}

export async function getReportSummary(): Promise<ReportSummary> {
  const [vehicles, fuelByV, expenseByV, maintByV, tripByV] = await Promise.all([
    prisma.vehicle.findMany({ orderBy: { registrationNumber: "asc" } }),
    prisma.fuelLog.groupBy({ by: ["vehicleId"], _sum: { liters: true, cost: true } }),
    prisma.expense.groupBy({ by: ["vehicleId"], _sum: { amount: true } }),
    prisma.maintenanceLog.groupBy({ by: ["vehicleId"], _sum: { cost: true } }),
    prisma.trip.groupBy({
      by: ["vehicleId"],
      where: { status: "COMPLETED" },
      _sum: { actualDistanceKm: true, revenue: true },
    }),
  ]);

  const fuelMap = new Map(fuelByV.map((r) => [r.vehicleId, r._sum]));
  const expenseMap = new Map(expenseByV.map((r) => [r.vehicleId, r._sum]));
  const maintMap = new Map(maintByV.map((r) => [r.vehicleId, r._sum]));
  const tripMap = new Map(tripByV.map((r) => [r.vehicleId, r._sum]));

  const rows: VehicleReport[] = vehicles.map((v) => {
    const fuelLiters = Number(fuelMap.get(v.id)?.liters ?? 0);
    const fuelCost = Number(fuelMap.get(v.id)?.cost ?? 0);
    const expenses = Number(expenseMap.get(v.id)?.amount ?? 0);
    const maintenanceCost = Number(maintMap.get(v.id)?.cost ?? 0);
    const distanceKm = Number(tripMap.get(v.id)?.actualDistanceKm ?? 0);
    const revenue = Number(tripMap.get(v.id)?.revenue ?? 0);
    const acquisitionCost = Number(v.acquisitionCost);
    const operationalCost = fuelCost + maintenanceCost + expenses;

    return {
      id: v.id,
      registrationNumber: v.registrationNumber,
      nameModel: v.nameModel,
      type: v.type,
      status: v.status,
      distanceKm: round(distanceKm),
      fuelLiters: round(fuelLiters),
      // Fuel Efficiency = Total Distance ÷ Total Fuel Liters (km/L)
      fuelEfficiencyKmPerL: fuelLiters > 0 ? round(distanceKm / fuelLiters) : null,
      fuelCost: round(fuelCost),
      maintenanceCost: round(maintenanceCost),
      expenses: round(expenses),
      operationalCost: round(operationalCost),
      revenue: round(revenue),
      acquisitionCost: round(acquisitionCost),
      // Vehicle ROI = (Revenue − (Maintenance + Fuel)) ÷ Acquisition Cost
      roi:
        acquisitionCost > 0
          ? round((revenue - (maintenanceCost + fuelCost)) / acquisitionCost, 4)
          : null,
    };
  });

  const sum = (pick: (r: VehicleReport) => number) => rows.reduce((a, r) => a + pick(r), 0);
  const totalDistanceKm = sum((r) => r.distanceKm);
  const totalFuelLiters = sum((r) => r.fuelLiters);
  const totalFuelCost = sum((r) => r.fuelCost);
  const totalMaintenanceCost = sum((r) => r.maintenanceCost);
  const totalExpenses = sum((r) => r.expenses);
  const totalRevenue = sum((r) => r.revenue);
  const totalAcquisitionCost = sum((r) => r.acquisitionCost);

  const onTripVehicles = vehicles.filter((v) => v.status === "ON_TRIP").length;
  const activeVehicles = vehicles.filter((v) => v.status !== "RETIRED").length;

  return {
    fleet: {
      totalVehicles: vehicles.length,
      activeVehicles,
      onTripVehicles,
      fleetUtilizationPct:
        activeVehicles > 0 ? round((onTripVehicles / activeVehicles) * 100, 1) : 0,
      totalDistanceKm: round(totalDistanceKm),
      totalFuelLiters: round(totalFuelLiters),
      fleetFuelEfficiencyKmPerL:
        totalFuelLiters > 0 ? round(totalDistanceKm / totalFuelLiters) : null,
      totalFuelCost: round(totalFuelCost),
      totalMaintenanceCost: round(totalMaintenanceCost),
      totalExpenses: round(totalExpenses),
      totalOperationalCost: round(totalFuelCost + totalMaintenanceCost + totalExpenses),
      totalRevenue: round(totalRevenue),
      fleetRoi:
        totalAcquisitionCost > 0
          ? round(
              (totalRevenue - (totalMaintenanceCost + totalFuelCost)) / totalAcquisitionCost,
              4,
            )
          : null,
    },
    vehicles: rows,
  };
}
