"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, Route } from "lucide-react";

import TripLifecycle from "@/components/trips/trip-lifecycle";
import CreateTripForm from "@/components/trips/create-trip-form";
import LiveBoard from "@/components/trips/live-board";

import {
  getTrips,
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
} from "@/services/trip.service";

import type {
  Trip,
  TripStatus,
  TripCreateInput,
  TripCompleteInput,
} from "@/types/trip";

export default function TripsPage() {
  /* ── State ── */
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<TripStatus | "ALL">("ALL");

  /* Figure out the "most interesting" status for the lifecycle stepper */
  const latestTrip = trips[0];
  const lifecycleStatus: TripStatus = latestTrip?.status ?? "DRAFT";

  /* ── Data fetching ── */
  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load trips.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  /* ── Mutations ── */
  async function handleCreate(data: TripCreateInput) {
    setCreating(true);
    try {
      const trip = await createTrip(data);
      // Auto-dispatch after creation
      try {
        await dispatchTrip(trip.id);
      } catch {
        // If dispatch fails (e.g. race condition), trip remains as DRAFT — that's fine
      }
      await fetchTrips();
    } finally {
      setCreating(false);
    }
  }

  async function handleDispatch(id: string) {
    try {
      await dispatchTrip(id);
      await fetchTrips();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Dispatch failed.");
    }
  }

  async function handleComplete(id: string, data: TripCompleteInput) {
    try {
      await completeTrip(id, data);
      await fetchTrips();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Complete failed.");
    }
  }

  async function handleCancel(id: string) {
    if (!confirm("Cancel this trip?")) return;
    try {
      await cancelTrip(id);
      await fetchTrips();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Cancel failed.");
    }
  }

  /* ── Counts for header ── */
  const activeCount = trips.filter((t) => t.status === "DISPATCHED").length;
  const draftCount = trips.filter((t) => t.status === "DRAFT").length;

  return (
    <div className="space-y-6">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Route size={28} className="text-blue-600" />
            Trip Dispatcher
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Create, dispatch, and manage trips across your fleet.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Quick stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              {activeCount} Active
            </div>
            <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full font-semibold">
              {draftCount} Draft
            </div>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm hover:bg-slate-50 transition-colors">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* ═══ Error banner ═══ */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ═══ Main layout: two columns ═══ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left column: Lifecycle + Create Form */}
        <div className="lg:col-span-5 space-y-5">
          <TripLifecycle currentStatus={lifecycleStatus} />
          <CreateTripForm
            onTripCreated={fetchTrips}
            onCreate={handleCreate}
            loading={creating}
          />
        </div>

        {/* Right column: Live Board */}
        <div className="lg:col-span-7">
          <LiveBoard
            trips={trips}
            onDispatch={handleDispatch}
            onComplete={handleComplete}
            onCancel={handleCancel}
            statusFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        </div>
      </div>
    </div>
  );
}
