// app/dashboard/stations/[stationId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase-client";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
  DocumentData,
} from "firebase/firestore";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

interface Preorder {
  id: string;
  completedAt?: Timestamp;
  completedBy?: string;
  createdAt?: Timestamp;
  driverEmail?: string;
  driverName?: string;
  driverPlate?: string;
  driverUid?: string;
  fuelType?: string;
  isCustomAmount?: boolean;
  liters?: number;
  maxOrderLimit?: number;
  positionInQueue?: number | null;
  pricePerLiter?: number;
  pumpId?: string;
  pumpName?: string;
  pumpNumber?: string;
  qrScannedAt?: Timestamp;
  stationId?: string;
  stationName?: string;
  status?: string;
  totalAmount?: number;
}

interface Station {
  id: string;
  stationId: string;
  name?: string;
  // ... other station fields if needed
}

// ──────────────────────────────────────────────
// Helper: format Firebase Timestamp using native JS (no date-fns)
// ──────────────────────────────────────────────

function formatTimestamp(ts?: Timestamp): string {
  if (!ts || !ts.toDate) return "—";

  const date = ts.toDate();

  // You can customize the format here
  // Example 1: "01 Feb 2026 09:43"
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).replace(",", ""); // removes comma after date

  // Alternative style (more verbose):
  // return date.toLocaleDateString("en-GB") + " at " + date.toLocaleTimeString("en-GB", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  //   hour12: false,
  // });
}

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────

export default function StationDetailPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const router = useRouter();

  const [station, setStation] = useState<Station | null>(null);
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [loadingStation, setLoadingStation] = useState(true);
  const [loadingPreorders, setLoadingPreorders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch station basic info (optional)
  useEffect(() => {
    if (!stationId) return;

    const q = query(
      collection(db, "users"),
      where("stationId", "==", stationId),
      where("role", "==", "station")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      if (snap.empty) {
        setError("Station not found");
        setLoadingStation(false);
        return;
      }
      const doc = snap.docs[0];
      setStation({
        id: doc.id,
        stationId: doc.data().stationId,
        name: doc.data().name,
      });
      setLoadingStation(false);
    }, (err) => {
      console.error(err);
      setError("Failed to load station");
      setLoadingStation(false);
    });

    return () => unsubscribe();
  }, [stationId]);

  // Real-time completed preorders
  useEffect(() => {
    if (!stationId) return;

    const q = query(
      collection(db, "preorders"),
      where("stationId", "==", stationId),
      where("status", "==", "completed"),
      orderBy("completedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Preorder[];

      setPreorders(list);
      setLoadingPreorders(false);
    }, (err) => {
      console.error("Preorders error:", err);
      setError("Failed to load preorders");
      setLoadingPreorders(false);
    });

    return () => unsubscribe();
  }, [stationId]);

  const isLoading = loadingStation || loadingPreorders;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push("/dashboard/stations")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ← Back to Stations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {station?.name || "Station"} – {stationId}
            </h1>
            <p className="text-gray-600 mt-1">Completed Pre-orders</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/stations")}
            className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            ← Back
          </button>
        </div>

        {/* Content */}
        {preorders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <p className="text-gray-500 text-lg">
              No completed pre-orders found for this station.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Driver</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Plate</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fuel</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Liters</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price/L</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Completed</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Pump</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {preorders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatTimestamp(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{order.driverName || "—"}</div>
                          <div className="text-sm text-gray-500">{order.driverEmail || "—"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.driverPlate || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {order.fuelType || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.liters != null ? order.liters.toLocaleString() : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.pricePerLiter != null ? order.pricePerLiter.toLocaleString() : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {order.totalAmount != null ? order.totalAmount.toLocaleString() : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatTimestamp(order.completedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.pumpName || "—"} ({order.pumpNumber || "—"})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}