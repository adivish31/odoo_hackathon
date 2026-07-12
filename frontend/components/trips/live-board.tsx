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

/* ── Status badge config ── */
const badgeStyles: Record<TripStatus, string> = {
  DISPATCHED:
    "bg-blue-500 text-white",
  DRAFT:
    "bg-slate-600 text-slate-100",
  COMPLETED:
    "bg-emerald-500 text-white",
  CANCELLED:
    "bg-red-500 text-white",
};

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
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Board
          </h2>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onFilterChange(tab.key)}
                className={`
                  px-3 py-1.5 rounded-md text-xs font-medium transition-all
                  ${
                    statusFilter === tab.key
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
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
          <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
            <MapPin size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No trips to show.</p>
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
      className={`
        rounded-xl border overflow-hidden transition-all duration-200
        hover:shadow-md
        ${
          isDispatched
            ? "bg-slate-800 text-white border-slate-700"
            : isDraft
              ? "bg-slate-700 text-slate-100 border-slate-600"
              : trip.status === "CANCELLED"
                ? "bg-white border-red-200"
                : "bg-white border-emerald-200"
        }
      `}
    >
      <div className="p-4">
        {/* Top row: ID + Vehicle/Driver */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p
              className={`text-xs font-mono font-bold ${isDone ? "text-slate-500" : "text-slate-400"}`}
            >
              TR-{shortId}
            </p>
            <p className="font-semibold text-sm">
              {trip.source}{" "}
              <span className={isDone ? "text-slate-400" : "text-slate-400"}>
                →
              </span>{" "}
              {trip.destination}
            </p>
          </div>

          <div className="text-right text-xs space-y-1">
            {trip.vehicle && (
              <p className="flex items-center gap-1 justify-end">
                <Truck size={12} className="opacity-60" />
                <span className={isDone ? "text-slate-500" : ""}>
                  {trip.vehicle.registrationNumber}
                </span>
              </p>
            )}
            {trip.driver && (
              <p className="flex items-center gap-1 justify-end">
                <User size={12} className="opacity-60" />
                <span className={isDone ? "text-slate-500" : ""}>
                  {trip.driver.name}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Middle row: Status badge + meta */}
        <div className="flex items-center justify-between mt-3">
          <span
            className={`
              inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
              ${badgeStyles[trip.status]}
            `}
          >
            {trip.status.charAt(0) + trip.status.slice(1).toLowerCase()}
          </span>

          <div
            className={`text-xs flex items-center gap-1 ${isDone ? "text-slate-400" : "text-slate-400"}`}
          >
            {isDispatched && trip.dispatchedAt && (
              <>
                <Clock size={12} />
                {timeAgo(trip.dispatchedAt)}
              </>
            )}
            {isDraft && (
              <span className="text-amber-400">Awaiting dispatch</span>
            )}
            {trip.status === "COMPLETED" && (
              <span className="text-emerald-600 font-medium">
                {Number(trip.actualDistanceKm || 0).toFixed(0)} km travelled
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {!isDone && (
          <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
            {isDraft && (
              <button
                onClick={() => onDispatch(trip.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition-colors"
              >
                <Play size={14} />
                Dispatch
              </button>
            )}
            {isDispatched && (
              <button
                onClick={onComplete}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
              >
                <CheckCircle2 size={14} />
                Complete
              </button>
            )}
            <button
              onClick={() => onCancel(trip.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-400/50 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-colors"
            >
              <Ban size={14} />
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
