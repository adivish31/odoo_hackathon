"use client";

import { Plus, Filter } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const fuelLogs = [
  {
    vehicle: "VAN-05",
    date: "05 Jul 2026",
    liters: "42 L",
    cost: "₹3,150",
    station: "Shell Depot Central",
    status: "Verified",
  },
  {
    vehicle: "TRUCK-11",
    date: "06 Jul 2026",
    liters: "110 L",
    cost: "₹8,400",
    station: "Highway Stop 44",
    status: "Verified",
  },
  {
    vehicle: "MINI-02",
    date: "06 Jul 2026",
    liters: "28 L",
    cost: "₹2,050",
    station: "Shell Depot Central",
    status: "Pending",
  },
];

export default function FuelLogTable() {
  return (
    <Card>

      <CardHeader className="flex flex-row items-center justify-between">

        <CardTitle>
          Fuel Logs
        </CardTitle>

        <div className="flex gap-2">

          <Button>

            <Plus className="mr-2 h-4 w-4" />

            Log Fuel

          </Button>

          <Button variant="outline">

            <Filter className="mr-2 h-4 w-4" />

            Filter

          </Button>

        </div>

      </CardHeader>

      <CardContent>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b text-left text-sm text-slate-500">

                <th className="pb-3">Vehicle</th>

                <th className="pb-3">Date</th>

                <th className="pb-3">Liters</th>

                <th className="pb-3 text-right">Cost</th>

                <th className="pb-3">Station</th>

                <th className="pb-3">Status</th>

              </tr>

            </thead>

            <tbody>

              {fuelLogs.map((log) => (

                <tr
                  key={log.vehicle}
                  className="border-b last:border-none hover:bg-slate-50"
                >

                  <td className="py-4 font-medium">
                    {log.vehicle}
                  </td>

                  <td>{log.date}</td>

                  <td>{log.liters}</td>

                  <td className="text-right font-semibold">
                    {log.cost}
                  </td>

                  <td>{log.station}</td>

                  <td>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        log.status === "Verified"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {log.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </CardContent>

    </Card>
  );
}