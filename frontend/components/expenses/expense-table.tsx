"use client";

import { ReceiptText } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const expenses = [
  {
    tripId: "TR001",
    vehicle: "VAN-05",
    toll: 120,
    other: 0,
    maintenance: "None",
    total: 120,
    status: "Available",
  },
  {
    tripId: "TR002",
    vehicle: "TRUCK-11",
    toll: 340,
    other: 150,
    maintenance: "Engine Repair",
    total: 18490,
    status: "Completed",
  },
];

export default function ExpenseTable() {
  return (
    <Card>

      <CardHeader className="flex flex-row items-center justify-between">

        <CardTitle>
          Other Expenses (Toll / Misc)
        </CardTitle>

        <Button>

          <ReceiptText className="mr-2 h-4 w-4" />

          Add Expense

        </Button>

      </CardHeader>

      <CardContent>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b text-left text-sm text-slate-500">

                <th className="pb-3">Trip ID</th>

                <th className="pb-3">Vehicle</th>

                <th className="pb-3 text-right">Toll</th>

                <th className="pb-3 text-right">Other</th>

                <th className="pb-3">Maintenance</th>

                <th className="pb-3 text-right">Total</th>

                <th className="pb-3">Status</th>

              </tr>

            </thead>

            <tbody>

              {expenses.map((expense) => (

                <tr
                  key={expense.tripId}
                  className="border-b last:border-none hover:bg-slate-50"
                >

                  <td className="py-4 font-semibold">
                    {expense.tripId}
                  </td>

                  <td>{expense.vehicle}</td>

                  <td className="text-right">
                    ₹{expense.toll.toLocaleString()}
                  </td>

                  <td className="text-right">
                    ₹{expense.other.toLocaleString()}
                  </td>

                  <td>{expense.maintenance}</td>

                  <td className="text-right font-bold">
                    ₹{expense.total.toLocaleString()}
                  </td>

                  <td>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        expense.status === "Completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {expense.status}
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