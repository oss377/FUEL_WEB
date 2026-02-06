'use client';

import { useState } from 'react';
import { FiTruck, FiUser, FiX, FiSave, FiLoader, FiLock, FiMail } from 'react-icons/fi';
import GlassCard from '../GlassCard';
import { generateVehicleID } from '@/utils/idGenerator';

interface AddVehicleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleData) => void;
  isLoading?: boolean;
}

interface VehicleData {
  vehicleId: string;
  licensePlate: string;
  model: string;
  brand: string;
  vehicleType: string;
  year: number;
  color: string;
  fuelType: string;
  status: string;
  driver: {
    name: string;
    licenseNumber: string;
    phone: string;
    email: string;
    address: string;
  };
  userRegistration: {
    email: string;
    password: string;
    confirmPassword: string;
  };
}

const initialFormData: VehicleData = {
  vehicleId: generateVehicleID(),
  licensePlate: '',
  model: '',
  brand: '',
  vehicleType: 'truck',
  year: new Date().getFullYear(),
  color: '',
  fuelType: 'diesel',
  status: 'active',
  driver: {
    name: '',
    licenseNumber: '',
    phone: '',
    email: '',
    address: ''
  },
  userRegistration: {
    email: '',
    password: '',
    confirmPassword: ''
  }
};

const vehicleTypes = [
  { value: 'truck', label: 'Truck' },
  { value: 'van', label: 'Van' },
  { value: 'car', label: 'Car' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'bus', label: 'Bus' }
];

const fuelTypes = [
  { value: 'diesel', label: 'Diesel' },
  { value: 'petrol', label: 'Petrol' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'cng', label: 'CNG' }
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'inactive', label: 'Inactive' }
];

export default function AddVehicleForm({ isOpen, onClose, onSubmit, isLoading = false }: AddVehicleFormProps) {
  const [formData, setFormData] = useState<VehicleData>(initialFormData);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.userRegistration.password !== formData.userRegistration.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (formData.userRegistration.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    setPasswordError('');
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('driver.')) {
      const driverField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        driver: {
          ...prev.driver,
          [driverField]: value
        }
      }));
    } else if (name.startsWith('userRegistration.')) {
      const userField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        userRegistration: {
          ...prev.userRegistration,
          [userField]: value
        }
      }));
      // Clear password error when user types
      if (userField === 'confirmPassword' || userField === 'password') {
        setPasswordError('');
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'year' ? parseInt(value) : value
      }));
    }
  };

  const handleReset = () => {
    setFormData({
      ...initialFormData,
      vehicleId: generateVehicleID()
    });
    setPasswordError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-5xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          <GlassCard className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <FiTruck className="text-blue-600 dark:text-blue-400 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Add New Vehicle
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Register a new vehicle with driver account
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                  ID: {formData.vehicleId}
                </span>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <FiX className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Vehicle Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiTruck className="mr-2" />
                    Vehicle Information
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      License Plate *
                    </label>
                    <input
                      type="text"
                      name="licensePlate"
                      value={formData.licensePlate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                      placeholder="ABC-1234"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Brand *
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                        placeholder="Toyota"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Model *
                      </label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                        placeholder="Hilux"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Vehicle Type *
                      </label>
                      <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                      >
                        {vehicleTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Year *
                      </label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        min="2000"
                        max={new Date().getFullYear() + 1}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Color
                      </label>
                      <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                        placeholder="White"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Fuel Type *
                      </label>
                      <select
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                      >
                        {fuelTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Driver Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiUser className="mr-2" />
                    Driver Information
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Driver Name *
                    </label>
                    <input
                      type="text"
                      name="driver.name"
                      value={formData.driver.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Driver License Number *
                    </label>
                    <input
                      type="text"
                      name="driver.licenseNumber"
                      value={formData.driver.licenseNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                      placeholder="DL1234567890"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="driver.phone"
                        value={formData.driver.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                        placeholder="+1234567890"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="driver.email"
                        value={formData.driver.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                        placeholder="driver@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address
                    </label>
                    <textarea
                      name="driver.address"
                      value={formData.driver.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white resize-none"
                      placeholder="Enter driver's address"
                    />
                  </div>
                </div>

                {/* User Registration */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiLock className="mr-2" />
                    Account Registration
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email for Account *
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="email"
                        name="userRegistration.email"
                        value={formData.userRegistration.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                        placeholder="driver.account@example.com"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      This will be used for driver login
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="password"
                        name="userRegistration.password"
                        value={formData.userRegistration.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="password"
                        name="userRegistration.confirmPassword"
                        value={formData.userRegistration.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                        placeholder="••••••••"
                      />
                    </div>
                    {passwordError && (
                      <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                    )}
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Role Assignment</h5>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      This driver will be automatically assigned the <span className="font-bold">"driver"</span> role.
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
                      Permissions include: vehicle management, route viewing, and reporting.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    handleReset();
                    onClose();
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <FiLoader className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FiSave />
                      <span>Add Vehicle & Register Driver</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}