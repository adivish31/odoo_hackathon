"use client";

import { Download, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/layout/page-header";

export default function ExpenseHeader() {
  return (
    <PageHeader
      title="Fuel & Expense Management"
      description="Monitor operational costs and fuel efficiency across the fleet."
      icon={Fuel}
      actions={
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      }
    />
  );
}