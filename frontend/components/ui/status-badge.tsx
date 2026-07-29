import React from "react";
import { cn } from "@/lib/utils";

type StatusType = "go" | "caution" | "stop" | "reflect" | "faint";

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
}

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  // Infer type from status string if not provided
  let inferredType: StatusType = "faint";
  const s = status.toUpperCase();

  if (["AVAILABLE", "COMPLETED", "OPEN_FOR_WORK", "GO"].includes(s)) {
    inferredType = "go";
  } else if (["ON_TRIP", "DISPATCHED", "IN_PROGRESS", "REFLECT"].includes(s)) {
    inferredType = "reflect";
  } else if (["IN_SHOP", "DRAFT", "WARNING", "CAUTION"].includes(s) || s.includes("EXPIRING")) {
    inferredType = "caution";
  } else if (["SUSPENDED", "EXPIRED", "CANCELLED", "BLOCKED", "STOP"].includes(s)) {
    inferredType = "stop";
  } else if (["RETIRED", "OFF_DUTY", "FAINT"].includes(s)) {
    inferredType = "faint";
  }

  // Define maps for the specific colors
  const colorMap: Record<StatusType, { bg: string; border: string; text: string }> = {
    go: { bg: "bg-go/14", border: "border-go/30", text: "text-go" },
    reflect: { bg: "bg-reflect/14", border: "border-reflect/30", text: "text-reflect" },
    caution: { bg: "bg-caution/14", border: "border-caution/30", text: "text-caution" },
    stop: { bg: "bg-stop/14", border: "border-stop/30", text: "text-stop" },
    faint: { bg: "bg-ink-faint/14", border: "border-ink-faint/30", text: "text-ink-faint" },
  };

  const colors = colorMap[type || inferredType];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[4px] border px-2 py-[2px] text-[0.75rem] font-semibold uppercase tracking-[0.08em] leading-[1.2]",
        colors.bg,
        colors.border,
        colors.text,
        className
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
