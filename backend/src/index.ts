import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import vehiclesRouter from "./routes/vehicles.js";
import driversRouter from "./routes/drivers.js";
import tripsRouter from "./routes/trips.js";
import maintenanceRouter from "./routes/maintenance.js";
import fuelRouter from "./routes/fuel.js";
import expensesRouter from "./routes/expenses.js";
import dashboardRouter from "./routes/dashboard.js";
import reportsRouter from "./routes/reports.js";
import { errorHandler, notFound } from "./middleware/error.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/vehicles", vehiclesRouter);
app.use("/api/drivers", driversRouter);
app.use("/api/trips", tripsRouter);
app.use("/api/maintenance", maintenanceRouter);
app.use("/api/fuel-logs", fuelRouter);
app.use("/api/expenses", expensesRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/reports", reportsRouter);

app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`TransitOps API listening on http://localhost:${port}`);
});
