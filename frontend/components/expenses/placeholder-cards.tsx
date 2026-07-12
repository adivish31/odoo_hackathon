"use client";

import {
  BarChart3,
  PieChart,
  Receipt,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const cards = [
  {
    title: "Expense Analytics",
    icon: BarChart3,
  },
  {
    title: "Fuel Consumption",
    icon: PieChart,
  },
  {
    title: "Invoices",
    icon: Receipt,
  },
];

export default function PlaceholderCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">

      {cards.map((card) => {

        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className="flex h-40 flex-col items-center justify-center border-dashed"
          >

            <Icon className="mb-4 h-12 w-12 text-slate-400" />

            <p className="font-medium text-slate-500">
              {card.title}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Recharts will be added here
            </p>

          </Card>
        );
      })}

    </div>
  );
}