'use client';

import { useState } from 'react';
import { FiMapPin, FiX, FiSave, FiLoader, FiNavigation, FiMail, FiLock, FiUsers } from 'react-icons/fi';
import GlassCard from '../GlassCard';
import { generateStationID } from '@/utils/idGenerator';

interface AddStationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StationData) => void;
  isLoading?: boolean;
}

interface StationData {
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
  operatingHours: {
    open: string;
    close: string;
  };
  coordinates: {
    latitude: string;
    longitude: string;
  };
  userRegistration: {
    email: string;
    password: string;
    confirmPassword: string;
  };
}

const initialFormData: StationData = {
  stationId: generateStationID(),
  name: '',
  stationCode: '',
  type: 'charging',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  contactPerson: '',
  contactPhone: '',
  contactEmail: '',
  capacity: 10,
  status: 'active',
  operatingHours: {
    open: '08:00',
    close: '20:00'
  },
  coordinates: {
    latitude: '',
    longitude: ''
  },
  userRegistration: {
    email: '',
    password: '',
    confirmPassword: ''
  }
};

const stationTypes = [
  { value: 'charging', label: 'Charging Station' },
  { value: 'service', label: 'Service Station' },
  { value: 'parking', label: 'Parking Station' },
  { value: 'dispatch', label: 'Dispatch Center' },
  { value: 'warehouse', label: 'Warehouse' }
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'planned', label: 'Planned' }
];

export default function AddStationForm({ isOpen, onClose, onSubmit, isLoading = false }: AddStationFormProps) {
  const [formData, setFormData] = useState<StationData>(initialFormData);
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
    
    if (name.startsWith('operatingHours.')) {
      const timeField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [timeField]: value
        }
      }));
    } else if (name.startsWith('coordinates.')) {
      const coordField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [coordField]: value
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
        [name]: name === 'capacity' ? parseInt(value) : value
      }));
    }
  };

  const handleReset = () => {
    setFormData({
      ...initialFormData,
      stationId: generateStationID()
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
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <FiMapPin className="text-green-600 dark:text-green-400 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Add New Station
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Register a new station with manager account
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                  ID: {formData.stationId}
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
                {/* Station Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiMapPin className="mr-2" />
                    Station Information
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Station Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                      placeholder="Main Charging Station"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Station Code *
                      </label>
                      <input
                        type="text"
                        name="stationCode"
                        value={formData.stationCode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                        placeholder="ST-001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Station Type *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                      >
                        {stationTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                        placeholder="NY"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact & Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiNavigation className="mr-2" />
                    Contact & Details
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                        placeholder="10001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                        placeholder="United States"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                      placeholder="contact@station.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Capacity (Vehicles) *
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        min="1"
                        max="100"
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                      />
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
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                      >
                        {statusOptions.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* User Registration & Additional Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiUsers className="mr-2" />
                    Account & Additional Details
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Opening Time *
                      </label>
                      <input
                        type="time"
                        name="operatingHours.open"
                        value={formData.operatingHours.open}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Closing Time *
                      </label>
                      <input
                        type="time"
                        name="operatingHours.close"
                        value={formData.operatingHours.close}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Latitude
                      </label>
                      <input
                        type="text"
                        name="coordinates.latitude"
                        value={formData.coordinates.latitude}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                        placeholder="40.7128"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Longitude
                      </label>
                      <input
                        type="text"
                        name="coordinates.longitude"
                        value={formData.coordinates.longitude}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                        placeholder="-74.0060"
                      />
                    </div>
                  </div>

                  {/* User Registration */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Station Manager Account</h5>
                    
                    <div className="mb-3">
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
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                          placeholder="manager@station.com"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
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
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
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
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white"
                          placeholder="••••••••"
                        />
                      </div>
                      {passwordError && (
                        <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                      )}
                    </div>

                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-300">
                        This account will be assigned the <span className="font-bold">"station"</span> role with permissions to manage this station.
                      </p>
                    </div>
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
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <FiLoader className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FiSave />
                      <span>Add Station & Create Account</span>
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