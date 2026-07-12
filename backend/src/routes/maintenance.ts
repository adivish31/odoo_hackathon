import { Router } from "express";
import { requireRole, verifyJWT } from "../middleware/auth.js";
import { maintenanceCreateSchema, maintenanceListQuery } from "../utils/validators.js";
import {
  closeMaintenance,
  listMaintenance,
  openMaintenance,
} from "../services/maintenanceService.js";

const router = Router();
router.use(verifyJWT);

// RBAC matrix: FM manages; Safety Officer + Financial Analyst view. Dispatcher: no access.
router.get(
  "/",
  requireRole("FLEET_MANAGER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"),
  async (req, res) => {
    const q = maintenanceListQuery.parse(req.query);
    res.json(await listMaintenance(q));
  },
);

router.post("/", requireRole("FLEET_MANAGER"), async (req, res) => {
  const data = maintenanceCreateSchema.parse(req.body);
  res.status(201).json(await openMaintenance(data));
});

router.post("/:id/close", requireRole("FLEET_MANAGER"), async (req, res) => {
  res.json(await closeMaintenance(req.params.id as string));
});

export default router;
