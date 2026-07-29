import React from "react";
import { cn } from "@/lib/utils";

interface PlateChipProps {
  registrationNumber: string;
  className?: string;
}

export function PlateChip({ registrationNumber, className }: PlateChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-mono text-[0.875rem] font-medium leading-[1.4] tracking-[0.05em] bg-panel-raised text-ink border border-hairline rounded-[3px] px-[6px] py-[1px]",
        className
      )}
    >
      {registrationNumber}
    </span>
  );
}
