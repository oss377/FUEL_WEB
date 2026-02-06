'use client';

import { useState, useEffect } from 'react';
import { 
  FiBarChart2, 
  FiMapPin, 
  FiTruck, 
  FiCalendar, 
  FiUsers, 
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiFilter,
  FiPlus,
  FiRefreshCw,
  FiChevronDown
} from 'react-icons/fi';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import GlassCard from '@/components/GlassCard';
import AddVehicleForm from '../union/AddVehicleForm';
import AddStationForm from '../union/AddStationForm';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

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

export default function DashboardContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState('week');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddStationOpen, setIsAddStationOpen] = useState(false);
  const [isSubmittingVehicle, setIsSubmittingVehicle] = useState(false);
  const [isSubmittingStation, setIsSubmittingStation] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [totalVehicles, setTotalVehicles] = useState(42);
  const [activeStations, setActiveStations] = useState(18);
  const [teamMembers, setTeamMembers] = useState(24);

  // Mock data for charts
  const vehicleData = [
    { name: 'Mon', active: 40, maintenance: 5, inactive: 2 },
    { name: 'Tue', active: 42, maintenance: 3, inactive: 2 },
    { name: 'Wed', active: 38, maintenance: 7, inactive: 2 },
    { name: 'Thu', active: 45, maintenance: 2, inactive: 3 },
    { name: 'Fri', active: 43, maintenance: 4, inactive: 1 },
    { name: 'Sat', active: 35, maintenance: 8, inactive: 4 },
    { name: 'Sun', active: 30, maintenance: 5, inactive: 2 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 40000, expenses: 24000 },
    { month: 'Feb', revenue: 42000, expenses: 25000 },
    { month: 'Mar', revenue: 48000, expenses: 28000 },
    { month: 'Apr', revenue: 52000, expenses: 30000 },
    { month: 'May', revenue: 58000, expenses: 32000 },
    { month: 'Jun', revenue: 62000, expenses: 35000 },
  ];

  const stationData = [
    { name: 'Operational', value: 75, color: '#10B981' },
    { name: 'Maintenance', value: 15, color: '#F59E0B' },
    { name: 'Offline', value: 10, color: '#EF4444' },
  ];

  const stats = [
    { 
      label: 'Total Vehicles', 
      value: totalVehicles.toString(), 
      icon: <FiTruck />, 
      color: 'blue', 
      change: '+12%',
      trend: 'up',
      description: 'Across all stations'
    },
    { 
      label: 'Active Stations', 
      value: activeStations.toString(), 
      icon: <FiMapPin />, 
      color: 'green', 
      change: '+5%',
      trend: 'up',
      description: 'Currently operational'
    },
    { 
      label: 'Pending Reports', 
      value: '7', 
      icon: <FiBarChart2 />, 
      color: 'yellow', 
      change: '-2%',
      trend: 'down',
      description: 'Awaiting review'
    },
    { 
      label: 'Team Members', 
      value: teamMembers.toString(), 
      icon: <FiUsers />, 
      color: 'purple', 
      change: '+3%',
      trend: 'up',
      description: 'Active users'
    },
    { 
      label: 'Monthly Revenue', 
      value: '$42,580', 
      icon: <FiDollarSign />, 
      color: 'green', 
      change: '+18%',
      trend: 'up',
      description: 'This month'
    },
    { 
      label: 'Upcoming Tasks', 
      value: '15', 
      icon: <FiCalendar />, 
      color: 'orange', 
      change: '+8%',
      trend: 'up',
      description: 'For next week'
    },
  ];

  const recentActivities = [
    { 
      id: 1, 
      user: 'John Doe', 
      action: 'added new vehicle', 
      target: 'Toyota Hilux', 
      time: '10 min ago', 
      type: 'vehicle',
      status: 'success'
    },
    { 
      id: 2, 
      user: 'Sarah Smith', 
      action: 'updated station status', 
      target: 'Station #ST-003', 
      time: '25 min ago', 
      type: 'station',
      status: 'info'
    },
    { 
      id: 3, 
      user: 'Mike Johnson', 
      action: 'generated monthly report', 
      target: 'January 2024', 
      time: '1 hour ago', 
      type: 'report',
      status: 'success'
    },
    { 
      id: 4, 
      user: 'You', 
      action: 'scheduled maintenance', 
      target: 'Vehicle #VH-012', 
      time: '2 hours ago', 
      type: 'maintenance',
      status: 'warning'
    },
    { 
      id: 5, 
      user: 'Emma Wilson', 
      action: 'processed billing', 
      target: 'Invoice #INV-245', 
      time: '3 hours ago', 
      type: 'billing',
      status: 'success'
    },
  ];

  const upcomingTasks = [
    { id: 1, task: 'Vehicle Service Due', due: 'Tomorrow', priority: 'high' },
    { id: 2, task: 'Station Maintenance', due: 'In 2 days', priority: 'medium' },
    { id: 3, task: 'Monthly Report Submission', due: 'Friday', priority: 'high' },
    { id: 4, task: 'Team Meeting', due: 'Tomorrow', priority: 'low' },
    { id: 5, task: 'System Backup', due: 'Weekly', priority: 'medium' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    handleRefresh();
  };

  const handleAddVehicle = async (vehicleData: VehicleData) => {
    setIsSubmittingVehicle(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Prepare data for backend
      const vehicleWithUser = {
        vehicleId: vehicleData.vehicleId,
        licensePlate: vehicleData.licensePlate,
        model: vehicleData.model,
        brand: vehicleData.brand,
        vehicleType: vehicleData.vehicleType,
        year: vehicleData.year,
        color: vehicleData.color,
        fuelType: vehicleData.fuelType,
        status: vehicleData.status,
        driver: vehicleData.driver,
        // User registration data
        userData: {
          email: vehicleData.userRegistration.email,
          password: vehicleData.userRegistration.password,
          name: vehicleData.driver.name,
          phone: vehicleData.driver.phone,
          role: 'driver', // Default role for drivers
          vehicleId: vehicleData.vehicleId,
          autoID: `FS_WLD_${vehicleData.vehicleId}`,
          createdAt: new Date().toISOString()
        }
      };
      
      console.log('Adding vehicle with user registration:', vehicleWithUser);
      
      // In real app, you would:
      // 1. Create user in users collection with role 'driver'
      // 2. Create vehicle document with driver info
      // 3. Link user to vehicle
      
      // Update vehicle count
      setTotalVehicles(prev => prev + 1);
      
      // Add to team members count (since driver is also a user)
      setTeamMembers(prev => prev + 1);
      
      // Add to recent activities
      const newActivity = {
        id: recentActivities.length + 1,
        user: user?.name || 'You',
        action: 'added new vehicle and registered driver',
        target: `${vehicleData.brand} ${vehicleData.model} (${vehicleData.vehicleId})`,
        time: 'Just now',
        type: 'vehicle',
        status: 'success'
      };
      
      console.log('New activity:', newActivity);
      
      // Show success message
      alert(`Vehicle ${vehicleData.brand} ${vehicleData.model} added successfully!\nDriver account created with email: ${vehicleData.userRegistration.email}\nAuto ID: FS_WLD_${vehicleData.vehicleId}`);
      
      // Close the form
      setIsAddVehicleOpen(false);
      setShowAddMenu(false);
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Failed to add vehicle. Please try again.');
    } finally {
      setIsSubmittingVehicle(false);
    }
  };

  const handleAddStation = async (stationData: StationData) => {
    setIsSubmittingStation(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Prepare data for backend
      const stationWithUser = {
        stationId: stationData.stationId,
        name: stationData.name,
        stationCode: stationData.stationCode,
        type: stationData.type,
        address: stationData.address,
        city: stationData.city,
        state: stationData.state,
        zipCode: stationData.zipCode,
        country: stationData.country,
        contactPerson: stationData.contactPerson,
        contactPhone: stationData.contactPhone,
        contactEmail: stationData.contactEmail,
        capacity: stationData.capacity,
        status: stationData.status,
        operatingHours: stationData.operatingHours,
        coordinates: stationData.coordinates,
        // User registration data
        userData: {
          email: stationData.userRegistration.email,
          password: stationData.userRegistration.password,
          name: stationData.contactPerson,
          phone: stationData.contactPhone,
          role: 'station', // Default role for station managers
          stationId: stationData.stationId,
          stationName: stationData.name,
          autoID: `FS_WLD_${stationData.stationId}`,
          createdAt: new Date().toISOString()
        }
      };
      
      console.log('Adding station with user registration:', stationWithUser);
      
      // In real app, you would:
      // 1. Create user in users collection with role 'station'
      // 2. Create station document
      // 3. Link user to station
      
      // Update station count
      setActiveStations(prev => prev + 1);
      
      // Add to team members count
      setTeamMembers(prev => prev + 1);
      
      // Add to recent activities
      const newActivity = {
        id: recentActivities.length + 1,
        user: user?.name || 'You',
        action: 'added new station and registered manager',
        target: `${stationData.name} (${stationData.stationId})`,
        time: 'Just now',
        type: 'station',
        status: 'success'
      };
      
      console.log('New activity:', newActivity);
      
      // Show success message
      alert(`Station ${stationData.name} added successfully!\nManager account created with email: ${stationData.userRegistration.email}\nAuto ID: FS_WLD_${stationData.stationId}`);
      
      // Close the form
      setIsAddStationOpen(false);
      setShowAddMenu(false);
    } catch (error) {
      console.error('Error adding station:', error);
      alert('Failed to add station. Please try again.');
    } finally {
      setIsSubmittingStation(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.add-new-dropdown')) {
        setShowAddMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
              All systems operational
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's what's happening with your fleet today. Last updated: Just now
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {['day', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                  timeRange === range
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          >
            <FiRefreshCw className="text-gray-600 dark:text-gray-400" />
          </button>
          
          {/* Add New button with dropdown */}
          <div className="relative add-new-dropdown">
            <button 
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition"
            >
              <FiPlus />
              <span>Add New</span>
              <FiChevronDown className={`transition-transform ${showAddMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showAddMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 overflow-hidden">
                <button 
                  onClick={() => {
                    setIsAddVehicleOpen(true);
                    setShowAddMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                >
                  <FiTruck />
                  <span>Add Vehicle</span>
                </button>
                <button 
                  onClick={() => {
                    setIsAddStationOpen(true);
                    setShowAddMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                >
                  <FiMapPin />
                  <span>Add Station</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <GlassCard key={index} className="p-4 hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <div className="flex items-center mt-1">
                  {stat.trend === 'up' ? (
                    <FiTrendingUp className="text-green-500 mr-1" />
                  ) : (
                    <FiTrendingDown className="text-red-500 mr-1" />
                  )}
                  <span className={`text-xs ${
                    stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">from last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full ${
                stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                stat.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                'bg-orange-100 dark:bg-orange-900/30'
              } flex items-center justify-center`}>
                <div className={`${
                  stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                  stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                  stat.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                  stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                  'text-orange-600 dark:text-orange-400'
                } text-xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{stat.description}</p>
          </GlassCard>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Status Chart */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Vehicle Status Overview</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Weekly vehicle activity</p>
            </div>
            <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <FiDownload />
              <span>Export</span>
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vehicleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="active" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="maintenance" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="inactive" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Revenue Chart */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue & Expenses</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly financial overview</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-sm">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Revenue
              </span>
              <span className="flex items-center text-sm">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                Expenses
              </span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Recent Activity and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Latest updates from your team</p>
            </div>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.status === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                  activity.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                  'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  {activity.status === 'success' ? <FiCheckCircle className="text-green-600 dark:text-green-400" /> :
                   activity.status === 'warning' ? <FiAlertCircle className="text-yellow-600 dark:text-yellow-400" /> :
                   <FiClock className="text-blue-600 dark:text-blue-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 dark:text-white">
                    <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                  activity.type === 'vehicle' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                  activity.type === 'station' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                  activity.type === 'report' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                  'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                }`}>
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Stats & Pie Chart */}
        <div className="space-y-6">
          {/* Station Status Pie Chart */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Station Status</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {stationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Upcoming Tasks */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Tasks</h2>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Add Task
              </button>
            </div>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{task.task}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <FiClock className="inline mr-1" />
                      Due: {task.due}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    task.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                    task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                    'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:transform hover:-translate-y-1 transition-all duration-300">
            <FiBarChart2 className="text-2xl mb-3" />
            <span className="font-semibold">Generate Report</span>
          </button>
          <button 
            onClick={() => setIsAddVehicleOpen(true)}
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:transform hover:-translate-y-1 transition-all duration-300"
          >
            <FiTruck className="text-2xl mb-3" />
            <span className="font-semibold">Add Vehicle</span>
          </button>
          <button 
            onClick={() => setIsAddStationOpen(true)}
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:transform hover:-translate-y-1 transition-all duration-300"
          >
            <FiMapPin className="text-2xl mb-3" />
            <span className="font-semibold">Add Station</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:transform hover:-translate-y-1 transition-all duration-300">
            <FiCalendar className="text-2xl mb-3" />
            <span className="font-semibold">Schedule</span>
          </button>
        </div>
      </div>

      {/* Add Vehicle Form Modal */}
      <AddVehicleForm
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        onSubmit={handleAddVehicle}
        isLoading={isSubmittingVehicle}
      />

      {/* Add Station Form Modal */}
      <AddStationForm
        isOpen={isAddStationOpen}
        onClose={() => setIsAddStationOpen(false)}
        onSubmit={handleAddStation}
        isLoading={isSubmittingStation}
      />
    </div>
  );
}