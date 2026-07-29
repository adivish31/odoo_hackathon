"use client";

import { useState } from "react";
import {
  Play,
  CheckCircle2,
  Ban,
  Clock,
  MapPin,
  Truck,
  User,
} from "lucide-react";
import type { Trip, TripStatus, TripCompleteInput } from "@/types/trip";
import CompleteTripModal from "./complete-trip-modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { PlateChip } from "@/components/ui/plate-chip";

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${mins % 60}m`;
  return `${Math.floor(hrs / 24)}d`;
}

interface Props {
  trips: Trip[];
  onDispatch: (id: string) => void;
  onComplete: (id: string, data: TripCompleteInput) => void;
  onCancel: (id: string) => void;
  statusFilter: TripStatus | "ALL";
  onFilterChange: (f: TripStatus | "ALL") => void;
}

const filterTabs: { key: TripStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "DISPATCHED", label: "Active" },
  { key: "DRAFT", label: "Draft" },
  { key: "COMPLETED", label: "Done" },
  { key: "CANCELLED", label: "Cancelled" },
];

export default function LiveBoard({
  trips,
  onDispatch,
  onComplete,
  onCancel,
  statusFilter,
  onFilterChange,
}: Props) {
  const [completing, setCompleting] = useState<Trip | null>(null);

  const filtered =
    statusFilter === "ALL"
      ? trips
      : trips.filter((t) => t.status === statusFilter);

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-xl font-bold font-heading text-ink flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-reflect animate-pulse" />
            Live Board
          </h2>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-bitumen border border-hairline rounded-[6px] p-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onFilterChange(tab.key)}
                className={`
                  px-3 py-[6px] rounded-[4px] text-[0.75rem] font-semibold tracking-[0.08em] uppercase transition-all
                  ${
                    statusFilter === tab.key
                      ? "bg-panel-raised text-ink shadow-sm"
                      : "text-ink-dim hover:text-ink hover:bg-panel"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trip cards */}
        {filtered.length === 0 ? (
          <div className="bg-panel border border-hairline rounded-[10px] p-12 text-center text-ink-dim">
            <MapPin size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-heading text-xl font-semibold uppercase tracking-[0.01em]">No trips to show.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onDispatch={onDispatch}
                onComplete={() => setCompleting(trip)}
                onCancel={onCancel}
              />
            ))}
          </div>
        )}
      </div>

      {/* Complete Trip Modal */}
      {completing && (
        <CompleteTripModal
          tripId={completing.id}
          currentOdometer={Number(completing.vehicle.odometerKm)}
          onSubmit={(id, data) => {
            onComplete(id, data);
            setCompleting(null);
          }}
          onClose={() => setCompleting(null)}
        />
      )}
    </>
  );
}

/* ── Individual Trip Card ── */
function TripCard({
  trip,
  onDispatch,
  onComplete,
  onCancel,
}: {
  trip: Trip;
  onDispatch: (id: string) => void;
  onComplete: () => void;
  onCancel: (id: string) => void;
}) {
  const isDraft = trip.status === "DRAFT";
  const isDispatched = trip.status === "DISPATCHED";
  const isDone =
    trip.status === "COMPLETED" || trip.status === "CANCELLED";

  /* Generate a short display ID */
  const shortId = trip.id.slice(-6).toUpperCase();

  return (
    <div
      className="bg-panel border border-hairline rounded-[10px] overflow-hidden transition-all duration-200 hover:bg-panel-raised"
    >
      <div className="p-4">
        {/* Top row: ID + Vehicle/Driver */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[0.875rem] font-mono font-medium text-ink-dim">
              TR-{shortId}
            </p>
            <p className="font-semibold text-[0.9375rem] text-ink">
              {trip.source}{" "}
              <span className="text-amber mx-1">→</span>{" "}
              {trip.destination}
            </p>
          </div>

          <div className="text-right text-[0.875rem] space-y-1">
            {trip.vehicle && (
              <div className="flex items-center gap-2 justify-end">
                <Truck size={14} className="text-ink-dim" strokeWidth={1.75} />
                <PlateChip registrationNumber={trip.vehicle.registrationNumber} />
              </div>
            )}
            {trip.driver && (
              <p className="flex items-center gap-2 justify-end text-ink">
                <User size={14} className="text-ink-dim" strokeWidth={1.75} />
                <span>{trip.driver.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Center-Line Stepper Motif (Simplified) */}
        <div className="my-4 relative h-[2px] bg-transparent w-full border-t-[2px] border-dashed border-amber/40">
           {/* In a fuller implementation, this would contain the actual circles and dynamic statuses */}
        </div>

        {/* Middle row: Status badge + meta */}
        <div className="flex items-center justify-between mt-3">
          <StatusBadge status={trip.status} />

          <div className="text-[0.875rem] font-medium text-ink flex items-center gap-1.5">
            {isDispatched && trip.dispatchedAt && (
              <>
                <Clock size={14} strokeWidth={1.75} className="text-ink-dim" />
                <span>{timeAgo(trip.dispatchedAt)}</span>
              </>
            )}
            {isDraft && (
              <span className="text-caution">Awaiting dispatch</span>
            )}
            {trip.status === "COMPLETED" && (
              <span className="text-go">
                {Number(trip.actualDistanceKm || 0).toFixed(0)} km travelled
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {!isDone && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-hairline">
            {isDraft && (
              <button
                onClick={() => onDispatch(trip.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] bg-amber text-[#1A1300] hover:brightness-110 active:translate-y-[1px] text-[0.875rem] font-semibold transition-all"
              >
                <Play size={16} strokeWidth={1.75} />
                Dispatch
              </button>
            )}
            {isDispatched && (
              <button
                onClick={onComplete}
                className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] border border-hairline bg-transparent text-ink hover:bg-panel-raised text-[0.875rem] font-semibold transition-colors"
              >
                <CheckCircle2 size={16} strokeWidth={1.75} />
                Complete
              </button>
            )}
            <button
              onClick={() => onCancel(trip.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] border border-stop text-stop bg-transparent hover:bg-stop/10 text-[0.875rem] font-semibold transition-colors ml-auto"
            >
              <Ban size={16} strokeWidth={1.75} />
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
