// app/dashboard/stations/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase-client";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";

interface OperatingHours {
  open: string;
  close: string;
}

interface StationData {
  id?: string;
  stationId: string;
  name: string;
  stationCode: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  capacity: number;
  status: string;
  operatingHours: OperatingHours;
  createdAt?: Timestamp;
  email?: string;
  role?: string;
  uid?: string;
}

export default function StationsPage() {
  const [stations, setStations] = useState<StationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("role", "==", "station"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const stationList: StationData[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as StationData[];

        setStations(stationList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching stations:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredStations = stations.filter((station) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    return (
      station.stationId?.toLowerCase().includes(term) ||
      station.name?.toLowerCase().includes(term) ||
      station.stationCode?.toLowerCase().includes(term) ||
      station.contactEmail?.toLowerCase().includes(term) ||
      station.email?.toLowerCase().includes(term) ||
      station.city?.toLowerCase().includes(term)
    );
  });

  const handleView = (station: StationData) => {
    setSelectedStation(station);
  };

  const handleEdit = (station: StationData) => {
    alert(`Edit: ${station.name} (${station.stationId}) — not implemented yet`);
  };

  const handleDelete = (station: StationData) => {
    if (confirm(`Delete ${station.name} (${station.stationId})?`)) {
      alert("Delete action (implement deleteDoc later)");
    }
  };

  const handleToggleStatus = (station: StationData) => {
    const newStatus = station.status === "active" ? "inactive" : "active";
    alert(`Status → ${newStatus} (implement updateDoc later)`);
  };

  return (
    <div className="min-h-screen bg-gray-50/40 p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Stations Management</h1>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search by ID, name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:w-80"
          />

          <button
            onClick={() => setShowForm(true)}
            className="whitespace-nowrap rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            + Add Station
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
          </div>
        ) : filteredStations.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-gray-500">
            <p className="text-lg font-medium">
              {searchTerm ? "No matching stations found" : "No stations yet"}
            </p>
            {searchTerm && <p className="mt-1 text-sm">Try adjusting your search term</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Station ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStations.map((station) => (
                  <tr key={station.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                      {station.stationId || "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      {station.name || "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {station.email || station.contactEmail || "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {station.contactEmail || "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => handleView(station)}
                          title="View Details"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleEdit(station)}
                          title="Edit"
                          className="text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleDelete(station)}
                          title="Delete"
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleToggleStatus(station)}
                          title={station.status === "active" ? "Deactivate" : "Activate"}
                          className={`${
                            station.status === "active" ? "text-green-600 hover:text-green-800" : "text-orange-600 hover:text-orange-800"
                          } transition-colors`}
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail / View Modal */}
      {selectedStation && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedStation(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedStation.name}</h2>
                  <p className="text-blue-100 mt-1">ID: {selectedStation.stationId}</p>
                </div>
                <button
                  onClick={() => setSelectedStation(null)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Current Status</span>
                    <span
                      className={`inline-flex px-4 py-1.5 rounded-full text-sm font-medium ${
                        selectedStation.status === "active"
                          ? "bg-green-100 text-green-800"
                          : selectedStation.status === "inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedStation.status?.toUpperCase() || "UNKNOWN"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 block mb-1">Capacity</span>
                    <span className="text-xl font-semibold text-gray-900">
                      {selectedStation.capacity?.toLocaleString() || "—"} liters/units
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Station Code</label>
                      <p className="mt-1 text-gray-900">{selectedStation.stationCode || "—"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <p className="mt-1 text-gray-900 capitalize">{selectedStation.type || "—"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Person</label>
                      <p className="mt-1 text-gray-900">{selectedStation.contactPerson || "—"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="mt-1 text-gray-900">{selectedStation.contactPhone || "—"}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email (Account)</label>
                      <p className="mt-1 text-gray-900">{selectedStation.email || "—"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Email</label>
                      <p className="mt-1 text-gray-900">{selectedStation.contactEmail || "—"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Operating Hours</label>
                      <p className="mt-1 text-gray-900">
                        {selectedStation.operatingHours?.open || "—"} –{" "}
                        {selectedStation.operatingHours?.close || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">Address</label>
                  <p className="text-gray-900">
                    {selectedStation.address || "—"}
                    <br />
                    {selectedStation.city}, {selectedStation.state || ""} {selectedStation.zipCode || ""}
                    <br />
                    {selectedStation.country || "Ethiopia"}
                  </p>
                </div>
              </div>

              <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedStation(null)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleEdit(selectedStation);
                    setSelectedStation(null);
                  }}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Edit Station
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add New Station Slide-in Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full transform overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-96 lg:w-[480px] ${
          showForm ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Add New Station</h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-200 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <form className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Station ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="FS_WLD_0001"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Station Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Woldia Fuel Station"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Station Code</label>
                  <input
                    type="text"
                    placeholder="WLD01"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Type *</label>
                  <select
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  >
                    <option value="">Select type</option>
                    <option value="fuel">Fuel Station</option>
                    <option value="lpg">LPG Station</option>
                    <option value="ev">EV Charging</option>
                    <option value="service">Service Station</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Main Road, near bus station"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="Woldia"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State / Region</label>
                  <input
                    type="text"
                    placeholder="Amhara"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                  <input
                    type="text"
                    placeholder="7220"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Country *</label>
                <input
                  type="text"
                  required
                  value="Ethiopia"
                  readOnly
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-gray-700 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Mr. Abebe Kebede"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="+251 91 123 4567"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Email *</label>
                <input
                  type="email"
                  required
                  placeholder="station.woldia@example.com"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Capacity (liters / units) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="150000"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status *</label>
                  <select
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Opening Time</label>
                  <input
                    type="time"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Closing Time</label>
                  <input
                    type="time"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button className="rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white hover:bg-green-700">
                Save Station
              </button>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setShowForm(false)}
        />
      )}
    </div>
  );
}