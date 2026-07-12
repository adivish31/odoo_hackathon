"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExpenseHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      {/* Left */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Fuel & Expense Management
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Monitor operational costs and fuel efficiency across the fleet.
        </p>
      </div>

      {/* Right */}

      <Button
        variant="outline"
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Export Report
      </Button>
    </div>
  );
}