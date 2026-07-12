"use client";

import { IndianRupee } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function ExpenseSummary() {
  return (
    <Card className="border-0 bg-slate-900 text-white shadow-xl">

      <CardContent className="flex flex-col gap-8 p-8 md:flex-row md:items-center md:justify-between">

        {/* Left */}

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Aggregate Operational Cost
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Total Operational Cost
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Fuel + Maintenance + Toll + Miscellaneous Expenses
          </p>

        </div>

        {/* Right */}

        <div className="text-right">

          <div className="mb-2 flex items-center justify-end gap-2">

            <IndianRupee className="h-7 w-7 text-yellow-400" />

            <span className="text-5xl font-bold tracking-tight text-yellow-400">
              34,070
            </span>

          </div>

          <p className="text-sm text-slate-300">
            July 2026
          </p>

        </div>

      </CardContent>

    </Card>
  );
}