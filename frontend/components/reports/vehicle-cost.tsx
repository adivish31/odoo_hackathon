import { VehicleReport } from "@/types/report";

interface Props {
  vehicles: VehicleReport[];
}

export default function VehicleCostCard({ vehicles }: Props) {
  const sortedVehicles = [...vehicles]
    .sort((a, b) => b.operationalCost - a.operationalCost)
    .slice(0, 5);

  const maxCost =
    sortedVehicles.length > 0
      ? Math.max(...sortedVehicles.map((v) => v.operationalCost))
      : 1;

  return (
    <div className="bg-white border rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-6">
        Top Costliest Vehicles
      </h2>

      {sortedVehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className="mb-5"
        >
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              {vehicle.registrationNumber}
            </span>

            <span>
              ₹{vehicle.operationalCost.toLocaleString()}
            </span>
          </div>

          <div className="h-2 bg-slate-200 rounded-full mt-2">
            <div
              className="h-full bg-red-500 rounded-full"
              style={{
                width: `${(vehicle.operationalCost / maxCost) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}