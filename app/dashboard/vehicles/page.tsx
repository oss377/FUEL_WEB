'use client';

import { FiTruck, FiPlus, FiFilter, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import GlassCard from '@/components/GlassCard';

export default function VehiclesPage() {
  const vehicles = [
    { id: 1, name: 'Toyota Hilux', type: 'Pickup Truck', status: 'Active', location: 'Addis Ababa', lastService: '2024-01-15' },
    { id: 2, name: 'Isuzu Truck', type: 'Cargo Truck', status: 'Active', location: 'Adama', lastService: '2024-01-10' },
    { id: 3, name: 'Mitsubishi Pajero', type: 'SUV', status: 'Maintenance', location: 'Bahir Dar', lastService: '2024-01-05' },
    { id: 4, name: 'Toyota Coaster', type: 'Bus', status: 'Active', location: 'Mekelle', lastService: '2024-01-18' },
    { id: 5, name: 'Volvo Truck', type: 'Heavy Truck', status: 'Inactive', location: 'Hawassa', lastService: '2023-12-20' },
    { id: 6, name: 'Ford Ranger', type: 'Pickup Truck', status: 'Active', location: 'Dire Dawa', lastService: '2024-01-12' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vehicles</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your fleet vehicles</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <FiFilter />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition">
            <FiPlus />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <GlassCard key={vehicle.id} className="p-6 hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <FiTruck className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{vehicle.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{vehicle.type}</p>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                vehicle.status === 'Active' 
                  ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                  : vehicle.status === 'Maintenance'
                  ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                  : 'bg-red-500/20 text-red-600 dark:text-red-400'
              }`}>
                {vehicle.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="w-24">Location:</span>
                <span className="font-medium text-gray-900 dark:text-white">{vehicle.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="w-24">Last Service:</span>
                <span className="font-medium text-gray-900 dark:text-white">{vehicle.lastService}</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition">
                <FiEye />
              </button>
              <button className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg transition">
                <FiEdit2 />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition">
                <FiTrash2 />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}