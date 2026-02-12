// app/dashboard/stations/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";                     // ← add this
import { db } from "@/lib/firebase-client";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

type Station = {
  id: string;              // Firestore doc ID
  stationId?: string;
  name?: string;
  stationCode?: string;
  type?: string;
  city?: string;
  contactEmail?: string;
  email?: string;
  status?: string;
  capacity?: number;
  address?: string;
  contactPerson?: string;
  contactPhone?: string;
  operatingHours?: { open: string; close: string };
  // add more fields you want to show in detail
};

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("role", "==", "station"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Station[];
      setStations(list);
      setLoading(false);
    }, err => {
      console.error(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!stations.length) return <div className="p-8 text-center">No stations found</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Stations Management</h1>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Station ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Code</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">City</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stations.map(station => (
              <tr key={station.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {station.stationId || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {station.name || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {station.stationCode || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {station.city || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {station.email || station.contactEmail || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    station.status === "active" ? "bg-green-100 text-green-800" :
                    station.status === "inactive" ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {station.status || "unknown"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <Link
                    href={`/dashboard/reports/${station.stationId}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    More...
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}