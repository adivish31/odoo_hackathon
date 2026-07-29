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
  
  // Extra seed data for larger mock dataset
  await prisma.vehicle.createMany({
    data: [
      { registrationNumber: "MH-12-AB-9999", nameModel: "Tata 407", type: "truck", maxLoadCapacityKg: 2500, odometerKm: 85000, acquisitionCost: 1200000, region: "South", status: "AVAILABLE" },
      { registrationNumber: "MH-14-XY-8888", nameModel: "Eicher Pro", type: "truck", maxLoadCapacityKg: 7000, odometerKm: 120000, acquisitionCost: 1800000, region: "East", status: "AVAILABLE" },
      { registrationNumber: "MH-01-ZZ-1111", nameModel: "Maruti Eeco", type: "van", maxLoadCapacityKg: 600, odometerKm: 25000, acquisitionCost: 500000, region: "West", status: "AVAILABLE" },
      { registrationNumber: "MH-02-EE-2222", nameModel: "Ashok Leyland Dost", type: "van", maxLoadCapacityKg: 1250, odometerKm: 45000, acquisitionCost: 700000, region: "North", status: "ON_TRIP" },
      { registrationNumber: "MH-43-WW-3333", nameModel: "Tata Signa", type: "truck", maxLoadCapacityKg: 40000, odometerKm: 210000, acquisitionCost: 3500000, region: "West", status: "IN_SHOP" },
      { registrationNumber: "MH-04-UU-4444", nameModel: "Hero Honda Splendor", type: "bike", maxLoadCapacityKg: 80, odometerKm: 55000, acquisitionCost: 60000, region: "South", status: "RETIRED" },
      { registrationNumber: "MH-15-VV-5555", nameModel: "Mahindra Supro", type: "van", maxLoadCapacityKg: 850, odometerKm: 12000, acquisitionCost: 550000, region: "East", status: "AVAILABLE" },
      { registrationNumber: "MH-12-QQ-6666", nameModel: "BharatBenz", type: "truck", maxLoadCapacityKg: 12000, odometerKm: 98000, acquisitionCost: 2800000, region: "North", status: "AVAILABLE" },
    ],
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

  await prisma.driver.createMany({
    data: [
      { name: "Rahul Gupta", licenseNumber: "DL-1120220149001", licenseCategory: "truck", licenseExpiryDate: daysFromNow(400), contactNumber: "9123456780", safetyScore: 92, status: "AVAILABLE" },
      { name: "Amit Kumar", licenseNumber: "DL-1220220149002", licenseCategory: "van", licenseExpiryDate: daysFromNow(500), contactNumber: "9123456781", safetyScore: 85, status: "ON_TRIP" },
      { name: "Suresh Nair", licenseNumber: "DL-1320220149003", licenseCategory: "truck", licenseExpiryDate: daysFromNow(150), contactNumber: "9123456782", safetyScore: 78, status: "OFF_DUTY" },
      { name: "Vikram Singh", licenseNumber: "DL-1420220149004", licenseCategory: "bus", licenseExpiryDate: daysFromNow(60), contactNumber: "9123456783", safetyScore: 98, status: "AVAILABLE" },
      { name: "Neha Joshi", licenseNumber: "DL-1520220149005", licenseCategory: "van", licenseExpiryDate: daysFromNow(200), contactNumber: "9123456784", safetyScore: 100, status: "AVAILABLE" },
      { name: "Mohammad Ali", licenseNumber: "DL-1620220149006", licenseCategory: "bike", licenseExpiryDate: daysFromNow(30), contactNumber: "9123456785", safetyScore: 65, status: "AVAILABLE" },
      { name: "Kiran Rao", licenseNumber: "DL-1720220149007", licenseCategory: "truck", licenseExpiryDate: daysFromNow(-10), contactNumber: "9123456786", safetyScore: 50, status: "AVAILABLE" },
    ],
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
  console.log("  14 vehicles (2 in-shop, 2 retired), 12 drivers (2 expired license, 1 suspended)");
  console.log("  3 trips (2 completed, 1 draft), 4 fuel logs, 2 maintenance logs, 3 expenses");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
