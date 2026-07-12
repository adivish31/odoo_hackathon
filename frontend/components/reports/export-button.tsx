"use client";

import { Download } from "lucide-react";
import { exportReportCsv } from "@/services/report.service";

export default function ExportButton() {
  return (
    <button
      onClick={exportReportCsv}
      className="
        flex
        w-full
        sm:w-auto
        items-center
        justify-center
        gap-2
        rounded-lg
        bg-blue-600
        px-4
        py-2
        text-sm
        text-white
      "
    >
      <Download size={18} />
      Export CSV
    </button>
  );
}