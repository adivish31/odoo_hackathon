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
    <div className="bg-panel border border-hairline rounded-[10px] p-5">
      <h3 className="text-[0.75rem] font-semibold text-ink-dim uppercase tracking-[0.08em] mb-5">
        Trip Lifecycle
      </h3>

      <div className="flex items-center justify-between relative">
        {/* Connecting line behind dots */}
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-hairline" />

        {steps.map((step, idx) => {
          const isActive = idx === activeIdx;
          const isPast = idx < activeIdx;
          const isCancelled =
            step.key === "CANCELLED" && currentStatus === "CANCELLED";

          let dotColor = "bg-panel-raised border border-hairline";
          if (isCancelled) dotColor = "bg-stop";
          else if (isActive) dotColor = "bg-reflect";
          else if (isPast) dotColor = "bg-go";

          let textColor = "text-ink-faint";
          if (isCancelled) textColor = "text-stop font-semibold";
          else if (isActive) textColor = "text-reflect font-semibold";
          else if (isPast) textColor = "text-go";

          return (
            <div
              key={step.key}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`
                  w-6 h-6 rounded-full 
                  ${dotColor}
                  transition-all duration-300
                  ${isActive ? "ring-4 ring-reflect/20 scale-110" : ""}
                  ${isCancelled ? "ring-4 ring-stop/20 scale-110" : ""}
                `}
              />
              <span
                className={`text-[0.75rem] mt-2 whitespace-nowrap ${textColor} transition-colors font-medium`}
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
