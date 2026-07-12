"use client";

import { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddFuelModal from "./add-fuel-modal";
import { getFuelLogs, type FuelLog } from "@/services/expense.service";

export default function FuelLogTable() {
  const [logs, setLogs] = useState<FuelLog[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const loadData = async () => {
    try {
      setAccessDenied(false);
      const data = await getFuelLogs();
      setLogs(data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAccessDenied(true);
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Fuel Logs</CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => setShowModal(true)}>
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
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Liters</th>
                  <th className="pb-3 text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {accessDenied ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 bg-red-50">
                      You do not have permission to view fuel logs.
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      No fuel logs recorded.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b last:border-none hover:bg-slate-50"
                    >
                      <td className="py-4 text-sm text-slate-600">
                        {new Date(log.date).toLocaleDateString()}
                      </td>
                      <td className="font-medium text-slate-900">
                        {log.vehicle?.registrationNumber || "-"}
                      </td>
                      <td className="text-slate-700">
                        {Number(log.liters).toFixed(2)} L
                      </td>
                      <td className="text-right font-bold text-slate-900">
                        ₹{Number(log.cost).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <AddFuelModal
          onClose={() => setShowModal(false)}
          onSuccess={loadData}
        />
      )}
    </>
  );
}