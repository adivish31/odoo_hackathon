import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireRole, verifyJWT } from "../middleware/auth.js";
import { expenseListQuery, expenseSchema } from "../utils/validators.js";
import { assertTripAccess, assertVehicleExists } from "../utils/logAccess.js";

const router = Router();
router.use(verifyJWT);

// RBAC matrix: FM, Dispatcher, Financial Analyst. Safety Officer: no access.
const canLog = requireRole("FLEET_MANAGER", "DISPATCHER", "FINANCIAL_ANALYST");

router.get("/", canLog, async (req, res) => {
  const q = expenseListQuery.parse(req.query);
  const expenses = await prisma.expense.findMany({
    where: {
      ...(q.vehicleId && { vehicleId: q.vehicleId }),
      ...(q.category && { category: q.category }),
    },
    include: { vehicle: true },
    orderBy: { date: "desc" },
  });
  res.json(expenses);
});

router.post("/", canLog, async (req, res) => {
  const data = expenseSchema.parse(req.body);
  await assertVehicleExists(data.vehicleId);
  if (data.tripId) await assertTripAccess(data.tripId, req.user!);
  const expense = await prisma.expense.create({ data });
  res.status(201).json(expense);
});

export default router;
