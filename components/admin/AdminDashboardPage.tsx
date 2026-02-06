'use client';

import { useState } from 'react';
import { 
  FiUsers, 
  FiSettings, 
  FiShield, 
  FiBarChart2, 
  FiDollarSign,
  FiBell,
  FiActivity,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiPlus
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import GlassCard from '@/components/GlassCard';
import AddMemberForm from '@/components/admin/AddMemberForm';

interface MemberData {
  memberId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  userRegistration: {
    email: string;
    password: string;
    confirmPassword: string;
  };
}

export default function AdminDashboardPage() {
  const { user, userData } = useAuth();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isSubmittingMember, setIsSubmittingMember] = useState(false);
  const [totalUsers, setTotalUsers] = useState(1248);

  const adminStats = [
    { label: 'Total Users', value: totalUsers.toLocaleString(), icon: <FiUsers />, color: 'blue', change: '+12%' },
    { label: 'Active Stations', value: '156', icon: <FiActivity />, color: 'green', change: '+8%' },
    { label: 'Total Revenue', value: '$124,580', icon: <FiDollarSign />, color: 'purple', change: '+24%' },
    { label: 'System Uptime', value: '99.9%', icon: <FiCheckCircle />, color: 'green', change: '0.1%' },
    { label: 'Pending Approvals', value: '28', icon: <FiAlertCircle />, color: 'yellow', change: '-5%' },
    { label: 'Active Sessions', value: '342', icon: <FiTrendingUp />, color: 'blue', change: '+15%' },
  ];

  const adminActions = [
    { label: 'User Management', icon: <FiUsers />, color: 'from-blue-500 to-cyan-500', href: '/admin/users' },
    { label: 'System Settings', icon: <FiSettings />, color: 'from-purple-500 to-pink-500', href: '/admin/settings' },
    { label: 'Security Logs', icon: <FiShield />, color: 'from-green-500 to-emerald-500', href: '/admin/security' },
    { label: 'Analytics', icon: <FiBarChart2 />, color: 'from-yellow-500 to-orange-500', href: '/admin/analytics' },
  ];

  const recentActivities = [
    { id: 1, user: 'Admin User', action: 'added new admin', target: 'Sarah Johnson', time: '10 min ago' },
    { id: 2, user: 'System', action: 'performed backup', target: 'Database Backup', time: '1 hour ago' },
    { id: 3, user: 'John Doe', action: 'requested role change', target: 'To Manager', time: '2 hours ago' },
    { id: 4, user: 'System', action: 'updated settings', target: 'Security Policies', time: '3 hours ago' },
    { id: 5, user: 'Emma Wilson', action: 'created report', target: 'Monthly Analytics', time: '4 hours ago' },
  ];

  const handleAddMember = async (memberData: MemberData) => {
    setIsSubmittingMember(true);
    
    try {
      // Simulate API call - In real app, you would:
      // 1. Create user in Firebase Authentication
      // 2. Add user to Firestore users collection with admin role
      // 3. Generate auto ID with FS_WLD_ prefix
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Prepare data for backend
      const memberWithUser = {
        memberId: memberData.memberId,
        name: memberData.name,
        email: memberData.email,
        phone: memberData.phone,
        role: memberData.role,
        department: memberData.department,
        // User registration data
        userData: {
          uid: `admin_${Date.now()}`, // In real app, this comes from Firebase Auth
          email: memberData.userRegistration.email,
          password: memberData.userRegistration.password,
          displayName: memberData.name,
          role: memberData.role, // Default is admin
          department: memberData.department,
          autoID: `FS_WLD_${memberData.memberId}`,
          isAdmin: true,
          permissions: ['all'], // Full system access
          createdAt: new Date().toISOString(),
          createdBy: userData?.uid || user?.uid || 'system'
        }
      };
      
      console.log('Adding admin member with authentication:', memberWithUser);
      
      // In real app, you would make API calls here:
      // 1. Create user in Firebase Authentication
      // 2. Add user document to Firestore users collection
      // 3. Set custom claims for admin role
      
      // Update user count
      setTotalUsers(prev => prev + 1);
      
      // Add to recent activities
      const newActivity = {
        id: recentActivities.length + 1,
        user: userData?.name || 'You',
        action: 'added new administrator',
        target: `${memberData.name} (${memberData.role})`,
        time: 'Just now',
        type: 'admin',
        status: 'success'
      };
      
      console.log('New activity:', newActivity);
      
      // Show success message
      alert(`Administrator ${memberData.name} added successfully!\nAccount created with email: ${memberData.userRegistration.email}\nAuto ID: FS_WLD_${memberData.memberId}\nRole: ${memberData.role}`);
      
      // Close the form
      setIsAddMemberOpen(false);
    } catch (error) {
      console.error('Error adding admin member:', error);
      alert('Failed to add administrator. Please try again.');
    } finally {
      setIsSubmittingMember(false);
    }
  };

  // Get user name from userData or user object
  const userName = userData?.name || user?.displayName || 'Admin';

  return (
    <>
      {/* Admin Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back, {userName}! Here's what's happening with your system today.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
              Administrator
            </span>
            <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
              System: Online
            </span>
            <button 
              onClick={() => setIsAddMemberOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition"
            >
              <FiPlus />
              <span>Add Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {adminStats.map((stat, index) => (
          <GlassCard key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stat.change}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-full ${stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' : stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' : stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'} flex items-center justify-center`}>
                <div className={`${stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : stat.color === 'green' ? 'text-green-600 dark:text-green-400' : stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          <button 
            onClick={() => setIsAddMemberOpen(true)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            <FiPlus className="mr-1" />
            Add New Admin
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {adminActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className={`bg-gradient-to-r ${action.color} text-white p-6 rounded-2xl text-center hover:transform hover:-translate-y-1 transition-all duration-300 block`}
            >
              <div className="text-2xl mb-3">{action.icon}</div>
              <span className="font-semibold">{action.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent System Activities */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent System Activities</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Admin actions and system events</p>
            </div>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                  <FiBell className="text-blue-500 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">
                    <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* System Status */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Authentication Service</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Firebase Auth Running</p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-600 dark:text-green-400 font-medium">Online</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Database</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Firestore Connected</p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-600 dark:text-green-400 font-medium">Online</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">User Management</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{totalUsers} users registered</p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Security</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">All admin roles verified</p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-blue-600 dark:text-blue-400 font-medium">Secure</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Add Member Form Modal */}
      <AddMemberForm
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onSubmit={handleAddMember}
        isLoading={isSubmittingMember}
      />
    </>
  );
}