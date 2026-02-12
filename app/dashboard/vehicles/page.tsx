// app/dashboard/drivers/page.tsx
// Restored original UI/UX style + icons-only actions + removed Plate & Added columns

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
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  PencilIcon,
  EyeIcon,
  TrashIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";

interface Driver {
  id: string;
  driverName?: string;
  email?: string;
  phoneNumber?: string;
  status?: "active" | "inactive" | "maintenance";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  // vehicle fields are kept for form/view but not shown in table
  licensePlate?: string;
  brand?: string;
  model?: string;
  vehicleType?: string;
  year?: number;
  color?: string;
  fuelType?: string;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form state (for add/edit)
  const [formData, setFormData] = useState({
    driverName: "",
    email: "",
    phoneNumber: "",
    licensePlate: "",
    brand: "",
    model: "",
    vehicleType: "",
    year: "",
    color: "",
    fuelType: "",
    status: "active",
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [viewDriver, setViewDriver] = useState<Driver | null>(null);

  // Real-time fetch
  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("role", "==", "driver"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const driverList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Driver[];
        setDrivers(driverList);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredDrivers = drivers.filter((driver) => {
    const search = searchTerm.toLowerCase().trim();
    const name = (driver.driverName || "").toLowerCase();
    const email = (driver.email || "").toLowerCase();
    return name.includes(search) || email.includes(search);
  });

  const openAdd = () => {
    setEditId(null);
    setViewDriver(null);
    setFormData({
      driverName: "",
      email: "",
      phoneNumber: "",
      licensePlate: "",
      brand: "",
      model: "",
      vehicleType: "",
      year: "",
      color: "",
      fuelType: "",
      status: "active",
    });
    setShowForm(true);
  };

  const openEdit = (driver: Driver) => {
    setEditId(driver.id);
    setViewDriver(null);
    setFormData({
      driverName: driver.driverName || "",
      email: driver.email || "",
      phoneNumber: driver.phoneNumber || "",
      licensePlate: driver.licensePlate || "",
      brand: driver.brand || "",
      model: driver.model || "",
      vehicleType: driver.vehicleType || "",
      year: driver.year ? String(driver.year) : "",
      color: driver.color || "",
      fuelType: driver.fuelType || "",
      status: driver.status || "active",
    });
    setShowForm(true);
  };

  const openView = (driver: Driver) => {
    setViewDriver(driver);
    setEditId(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.driverName || !formData.email || !formData.licensePlate) {
      alert("Name, email and license plate are required.");
      return;
    }

    const data = {
      ...formData,
      year: formData.year ? Number(formData.year) : null,
      role: "driver",
      updatedAt: serverTimestamp(),
      ...(editId === null && { createdAt: serverTimestamp() }),
    };

    try {
      if (editId) {
        await updateDoc(doc(db, "users", editId), data);
      } else {
        const newDocRef = doc(collection(db, "users"));
        await setDoc(newDocRef, data);
      }
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Save failed – check console");
    }
  };

  const handleDelete = async (id: string, name?: string) => {
    if (!confirm(`Delete driver ${name || ""}?`)) return;
    try {
      await deleteDoc(doc(db, "users", id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const toggleStatus = async (driver: Driver) => {
    const newStatus = driver.status === "active" ? "inactive" : "active";
    try {
      await updateDoc(doc(db, "users", driver.id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/40 p-6">
      {/* Header + controls – original style */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:w-72"
          />

          <button
            onClick={openAdd}
            className="whitespace-nowrap rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Add Driver
          </button>
        </div>
      </div>

      {/* Table – original card style, but without Plate & Added */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-gray-500">
            <p className="text-lg font-medium">
              {searchTerm ? "No matching drivers" : "No drivers yet"}
            </p>
            {searchTerm && <p className="mt-1 text-sm">Try a different search term</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDrivers.map((driver) => {
                  const isActive = driver.status !== "inactive";

                  return (
                    <tr key={driver.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                        {driver.driverName || "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {driver.email || "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {driver.phoneNumber || "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => openView(driver)}
                            className="text-gray-500 hover:text-blue-600"
                            title="View details"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => openEdit(driver)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => toggleStatus(driver)}
                            className={
                              isActive
                                ? "text-amber-600 hover:text-amber-800"
                                : "text-green-600 hover:text-green-800"
                            }
                            title={isActive ? "Deactivate" : "Activate"}
                          >
                            <PowerIcon className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => handleDelete(driver.id, driver.driverName)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Slide-in form / view drawer – original style ─── */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full transform bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-96 lg:w-1/3 ${
          showForm ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {viewDriver
                  ? "Driver Details"
                  : editId
                  ? "Edit Driver"
                  : "Add New Driver"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-200"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {viewDriver ? (
              // ── View mode ──
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Driver Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{viewDriver.driverName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{viewDriver.email || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{viewDriver.phoneNumber || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium mt-1 ${
                          viewDriver.status !== "inactive"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {viewDriver.status || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Vehicle Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">License Plate</p>
                      <p className="font-medium">{viewDriver.licensePlate || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Brand / Model</p>
                      <p className="font-medium">
                        {viewDriver.brand} {viewDriver.model ? `/ ${viewDriver.model}` : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-medium">{viewDriver.year || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Color</p>
                      <p className="font-medium">{viewDriver.color || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // ── Add / Edit form – original input style ──
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.driverName}
                    onChange={(e) =>
                      setFormData({ ...formData, driverName: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="Misgan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="oo@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="096555888"
                  />
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Vehicle Information
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        License Plate *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.licensePlate}
                        onChange={(e) =>
                          setFormData({ ...formData, licensePlate: e.target.value })
                        }
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        placeholder="FCS 6433"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        placeholder="Toyota"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Model
                      </label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) =>
                          setFormData({ ...formData, model: e.target.value })
                        }
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        placeholder="Corolla"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Year
                      </label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) =>
                          setFormData({ ...formData, year: e.target.value })
                        }
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        placeholder="2022"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Color
                      </label>
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) =>
                          setFormData({ ...formData, color: e.target.value })
                        }
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        placeholder="Silver"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Fuel Type
                      </label>
                      <select
                        value={formData.fuelType}
                        onChange={(e) =>
                          setFormData({ ...formData, fuelType: e.target.value })
                        }
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      >
                        <option value="">Select fuel type</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Electric">Electric</option>
                      </select>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          {!viewDriver && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700"
                >
                  {editId ? "Update Driver" : "Save Driver"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dark overlay */}
      {showForm && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setShowForm(false)}
        />
      )}
    </div>
  );
}