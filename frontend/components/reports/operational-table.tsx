import { VehicleReport } from "@/types/report";

interface Props {
  vehicles: VehicleReport[];
}

export default function OperationalInsightsTable({
  vehicles,
}: Props) {
  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <div className="p-5 border-b">
        <h2 className="text-lg font-semibold">
          Vehicle Operational Insights
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-3 text-sm">
                Registration
              </th>

              <th className="px-6 py-3 text-sm">
                Model
              </th>

              <th className="px-6 py-3 text-sm">
                Distance (km)
              </th>

              <th className="px-6 py-3 text-sm">
                Fuel Cost
              </th>

              <th className="px-6 py-3 text-sm">
                Maintenance
              </th>

              <th className="px-6 py-3 text-sm">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="px-6 py-4 font-medium">
                  {vehicle.registrationNumber}
                </td>

                <td className="px-6 py-4">
                  {vehicle.nameModel}
                </td>

                <td className="px-6 py-4">
                  {vehicle.distanceKm}
                </td>

                <td className="px-6 py-4">
                  ₹{vehicle.fuelCost}
                </td>

                <td className="px-6 py-4">
                  ₹{vehicle.maintenanceCost}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      vehicle.status === "AVAILABLE"
                        ? "bg-green-100 text-green-700"
                        : vehicle.status === "ON_TRIP"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}