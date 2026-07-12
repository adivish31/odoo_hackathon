"use client";

import type { TripStatus } from "@/types/trip";

const steps: { key: TripStatus; label: string }[] = [
  { key: "DRAFT", label: "Draft" },
  { key: "DISPATCHED", label: "Dispatched" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

const statusIndex: Record<TripStatus, number> = {
  DRAFT: 0,
  DISPATCHED: 1,
  COMPLETED: 2,
  CANCELLED: 3,
};

export default function TripLifecycle({
  currentStatus,
}: {
  currentStatus: TripStatus;
}) {
  const activeIdx = statusIndex[currentStatus];

  return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-5">
        Trip Lifecycle
      </h3>

      <div className="flex items-center justify-between relative">
        {/* Connecting line behind dots */}
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-slate-200" />

        {steps.map((step, idx) => {
          const isActive = idx === activeIdx;
          const isPast = idx < activeIdx;
          const isCancelled =
            step.key === "CANCELLED" && currentStatus === "CANCELLED";

          let dotColor = "bg-slate-300";
          if (isCancelled) dotColor = "bg-red-500";
          else if (isActive) dotColor = "bg-blue-500";
          else if (isPast) dotColor = "bg-emerald-500";

          let textColor = "text-slate-400";
          if (isCancelled) textColor = "text-red-600 font-semibold";
          else if (isActive) textColor = "text-blue-600 font-semibold";
          else if (isPast) textColor = "text-emerald-600";

          return (
            <div
              key={step.key}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`
                  w-6 h-6 rounded-full border-2 
                  ${isActive || isPast || isCancelled ? "border-transparent" : "border-slate-300"}
                  ${dotColor}
                  transition-all duration-300
                  ${isActive ? "ring-4 ring-blue-100 scale-110" : ""}
                  ${isCancelled ? "ring-4 ring-red-100 scale-110" : ""}
                `}
              />
              <span
                className={`text-xs mt-2 whitespace-nowrap ${textColor} transition-colors`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
