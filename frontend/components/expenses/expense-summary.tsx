"use client";

import { useEffect, useState } from "react";
import { IndianRupee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getReports } from "@/services/report.service";

export default function ExpenseSummary() {
  const [total, setTotal] = useState<number | null>(null);

  // Total operational cost = fuel + maintenance + expenses (computed by the backend).
  useEffect(() => {
    getReports()
      .then((r) => {
        const opCost = r.kpis.find((k) => k.title === "Operational Cost")?.value;
        const num = typeof opCost === "string" ? Number(opCost.replace(/[^0-9.]/g, "")) : Number(opCost);
        setTotal(Number.isFinite(num) ? num : 0);
      })
      .catch(() => setTotal(0));
  }, []);

  return (
    <Card className="border border-hairline bg-panel rounded-[10px] shadow-sm">
      <CardContent className="flex flex-col gap-8 p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-dim">
            Aggregate Operational Cost
          </p>
          <h2 className="mt-3 text-3xl font-bold font-heading text-ink">Total Operational Cost</h2>
          <p className="mt-2 text-[0.875rem] text-ink-faint">
            Fuel + Maintenance + Toll + Miscellaneous Expenses
          </p>
        </div>

        <div className="text-right">
          <div className="mb-2 flex items-center justify-end gap-2">
            <IndianRupee className="h-7 w-7 text-amber" />
            <span className="text-5xl font-bold tracking-tight text-ink font-mono">
              {total === null ? "…" : total.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-[0.875rem] text-ink-dim">Fleet-wide</p>
        </div>
      </CardContent>
    </Card>
  );
}
