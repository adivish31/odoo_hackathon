import { Router } from "express";
import { requireRole, verifyJWT } from "../middleware/auth.js";
import { getReportSummary } from "../services/reportsService.js";
import { toCsv } from "../utils/csv.js";

const router = Router();
router.use(verifyJWT);

// RBAC matrix: FM + Financial Analyst full; Safety Officer view. Dispatcher: no access.
const canView = requireRole("FLEET_MANAGER", "FINANCIAL_ANALYST", "SAFETY_OFFICER");

router.get("/summary", canView, async (_req, res) => {
  res.json(await getReportSummary());
});

router.get("/export.csv", canView, async (_req, res) => {
  const { vehicles } = await getReportSummary();
  const headers = [
    "Registration",
    "Model",
    "Type",
    "Status",
    "Distance (km)",
    "Fuel (L)",
    "Fuel Efficiency (km/L)",
    "Fuel Cost",
    "Maintenance Cost",
    "Expenses",
    "Operational Cost",
    "Revenue",
    "Acquisition Cost",
    "ROI",
  ];
  const rows = vehicles.map((v) => [
    v.registrationNumber,
    v.nameModel,
    v.type,
    v.status,
    v.distanceKm,
    v.fuelLiters,
    v.fuelEfficiencyKmPerL ?? "N/A",
    v.fuelCost,
    v.maintenanceCost,
    v.expenses,
    v.operationalCost,
    v.revenue,
    v.acquisitionCost,
    v.roi ?? "N/A",
  ]);

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="transitops-report.csv"');
  res.send(toCsv(headers, rows));
});

export default router;
