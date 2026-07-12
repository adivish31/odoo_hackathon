import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";

// PRD §11: seed data must let every negative rule be demonstrated in seconds —
// 4 role accounts, 6 vehicles (1 retired + 1 in-shop), 5 drivers (1 expired + 1 suspended),
// plus completed trips / fuel / maintenance / expenses so Reports show real numbers.

const DEMO_PASSWORD = "demo123";

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 86_400_000);
}

async function main() {
  // Wipe in FK-dependency order so the seed is idempotent.
  await prisma.fuelLog.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // ---------- Users (one per role) ----------
  const [fleet, dispatcher] = await Promise.all([
    prisma.user.create({
      data: { name: "Fiona Fleet", email: "fleet@transitops.com", passwordHash, role: "FLEET_MANAGER" },
    }),
    prisma.user.create({
      data: { name: "Dan Dispatch", email: "dispatch@transitops.com", passwordHash, role: "DISPATCHER" },
    }),
    prisma.user.create({
      data: { name: "Sara Safety", email: "safety@transitops.com", passwordHash, role: "SAFETY_OFFICER" },
    }),
    prisma.user.create({
      data: { name: "Farid Finance", email: "finance@transitops.com", passwordHash, role: "FINANCIAL_ANALYST" },
    }),
  ]);

  // ---------- Vehicles (incl. 1 in-shop + 1 retired) ----------
  const van05 = await prisma.vehicle.create({
    data: { registrationNumber: "MH-01-AB-1234", nameModel: "Tata Ace — Van-05", type: "van", maxLoadCapacityKg: 500, odometerKm: 12000, acquisitionCost: 800000, region: "North", status: "AVAILABLE" },
  });
  const truck11 = await prisma.vehicle.create({
    data: { registrationNumber: "MH-02-CD-5678", nameModel: "Ashok Leyland — Truck-11", type: "truck", maxLoadCapacityKg: 5000, odometerKm: 45000, acquisitionCost: 2500000, region: "West", status: "AVAILABLE" },
  });
  const pickup03 = await prisma.vehicle.create({
    data: { registrationNumber: "MH-03-EF-9012", nameModel: "Mahindra Bolero — Pickup-03", type: "van", maxLoadCapacityKg: 750, odometerKm: 30000, acquisitionCost: 950000, region: "North", status: "AVAILABLE" },
  });
  await prisma.vehicle.create({
    data: { registrationNumber: "MH-04-GH-3456", nameModel: "Bajaj — Bike-07", type: "bike", maxLoadCapacityKg: 50, odometerKm: 8000, acquisitionCost: 120000, region: "South", status: "AVAILABLE" },
  });
  const bus01 = await prisma.vehicle.create({
    data: { registrationNumber: "MH-05-IJ-7890", nameModel: "Volvo — Bus-01", type: "bus", maxLoadCapacityKg: 2000, odometerKm: 60000, acquisitionCost: 4000000, region: "East", status: "IN_SHOP" },
  });
  await prisma.vehicle.create({
    data: { registrationNumber: "MH-06-KL-1122", nameModel: "Old Tempo — Van-99", type: "van", maxLoadCapacityKg: 400, odometerKm: 150000, acquisitionCost: 600000, region: "West", status: "RETIRED" },
  });

  // ---------- Drivers (incl. 1 expired-license + 1 suspended) ----------
  const alex = await prisma.driver.create({
    data: { name: "Alex Kumar", licenseNumber: "DL-0420110149646", licenseCategory: "van", licenseExpiryDate: daysFromNow(730), contactNumber: "9876543210", safetyScore: 95, status: "AVAILABLE" },
  });
  const priya = await prisma.driver.create({
    data: { name: "Priya Sharma", licenseNumber: "DL-0520110149647", licenseCategory: "truck", licenseExpiryDate: daysFromNow(365), contactNumber: "9876543211", safetyScore: 88, status: "AVAILABLE" },
  });
  await prisma.driver.create({
    data: { name: "Ravi Patel", licenseNumber: "DL-0620110149648", licenseCategory: "bus", licenseExpiryDate: daysFromNow(20), contactNumber: "9876543212", safetyScore: 72, status: "AVAILABLE" },
  });
  await prisma.driver.create({
    data: { name: "Sunil Verma", licenseNumber: "DL-0720110149649", licenseCategory: "van", licenseExpiryDate: daysFromNow(-30), contactNumber: "9876543213", safetyScore: 60, status: "AVAILABLE" },
  });
  await prisma.driver.create({
    data: { name: "Deepak Singh", licenseNumber: "DL-0820110149650", licenseCategory: "truck", licenseExpiryDate: daysFromNow(365), contactNumber: "9876543214", safetyScore: 40, status: "SUSPENDED" },
  });

  // ---------- Completed trips (drive Reports numbers) ----------
  const tripA = await prisma.trip.create({
    data: {
      source: "Mumbai", destination: "Pune", vehicleId: van05.id, driverId: alex.id,
      cargoWeightKg: 450, plannedDistanceKm: 150, actualDistanceKm: 155,
      fuelConsumedLiters: 18, revenue: 12000, status: "COMPLETED",
      dispatchedAt: daysFromNow(-6), completedAt: daysFromNow(-5), createdById: dispatcher.id,
    },
  });
  const tripB = await prisma.trip.create({
    data: {
      source: "Delhi", destination: "Jaipur", vehicleId: truck11.id, driverId: priya.id,
      cargoWeightKg: 3000, plannedDistanceKm: 280, actualDistanceKm: 290,
      fuelConsumedLiters: 60, revenue: 45000, status: "COMPLETED",
      dispatchedAt: daysFromNow(-4), completedAt: daysFromNow(-3), createdById: fleet.id,
    },
  });
  // One pending draft so the demo can dispatch it live.
  await prisma.trip.create({
    data: {
      source: "Bengaluru", destination: "Chennai", vehicleId: pickup03.id, driverId: alex.id,
      cargoWeightKg: 500, plannedDistanceKm: 350, status: "DRAFT", createdById: dispatcher.id,
    },
  });

  // ---------- Fuel logs ----------
  await prisma.fuelLog.createMany({
    data: [
      { vehicleId: van05.id, tripId: tripA.id, liters: 18, cost: 1980, date: daysFromNow(-5) },
      { vehicleId: van05.id, liters: 20, cost: 2200, date: daysFromNow(-2) },
      { vehicleId: truck11.id, tripId: tripB.id, liters: 60, cost: 6600, date: daysFromNow(-3) },
      { vehicleId: truck11.id, liters: 55, cost: 6050, date: daysFromNow(-1) },
    ],
  });

  // ---------- Maintenance (closed on van, open on the in-shop bus) ----------
  await prisma.maintenanceLog.create({
    data: { vehicleId: van05.id, type: "Oil Change", description: "Routine 10k service", cost: 2500, status: "CLOSED", openedAt: daysFromNow(-7), closedAt: daysFromNow(-7) },
  });
  await prisma.maintenanceLog.create({
    data: { vehicleId: bus01.id, type: "Engine Overhaul", description: "Coolant leak + head gasket", cost: 35000, status: "OPEN", openedAt: daysFromNow(-2) },
  });

  // ---------- Expenses ----------
  await prisma.expense.createMany({
    data: [
      { vehicleId: van05.id, tripId: tripA.id, category: "TOLL", amount: 300, date: daysFromNow(-5) },
      { vehicleId: truck11.id, tripId: tripB.id, category: "TOLL", amount: 800, date: daysFromNow(-3) },
      { vehicleId: truck11.id, category: "PARKING", amount: 200, date: daysFromNow(-1) },
    ],
  });

  console.log("Seed complete:");
  console.log(`  4 users (password: ${DEMO_PASSWORD})`);
  console.log("    fleet@transitops.com     (FLEET_MANAGER)");
  console.log("    dispatch@transitops.com  (DISPATCHER)");
  console.log("    safety@transitops.com    (SAFETY_OFFICER)");
  console.log("    finance@transitops.com   (FINANCIAL_ANALYST)");
  console.log("  6 vehicles (1 in-shop, 1 retired), 5 drivers (1 expired license, 1 suspended)");
  console.log("  3 trips (2 completed, 1 draft), 4 fuel logs, 2 maintenance logs, 3 expenses");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
