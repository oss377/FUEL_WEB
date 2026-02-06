'use client';

import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit2, FiSave } from 'react-icons/fi';
import GlassCard from '@/components/GlassCard';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+251 9XX XXX XXX',
    location: 'Addis Ababa, Ethiopia',
    joinDate: 'January 15, 2024'
  });

  const handleSave = () => {
    // Save profile logic here
    setIsEditing(false);
    // Add your save logic (API call to update user profile)
  };

  const stats = [
    { label: 'Vehicles Managed', value: '42', color: 'blue' },
    { label: 'Stations Overseen', value: '18', color: 'green' },
    { label: 'Reports Generated', value: '27', color: 'purple' },
    { label: 'Tasks Completed', value: '156', color: 'yellow' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your personal information and preferences</p>
        </div>
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition"
        >
          {isEditing ? <FiSave /> : <FiEdit2 />}
          <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex items-start space-x-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
                  <FiEdit2 className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="bg-transparent border-b border-blue-500 focus:outline-none w-full"
                    />
                  ) : (
                    user?.name || 'User'
                  )}
                </h2>
                <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 mb-3">
                  <span className="flex items-center">
                    <FiUser className="mr-2" />
                    {user?.role || 'union'}
                  </span>
                  <span className="flex items-center">
                    <FiCalendar className="mr-2" />
                    Member since {profileData.joinDate}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Fleet management professional with expertise in vehicle tracking and station operations.
                </p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <FiMail className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FiPhone className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="bg-transparent border-b border-blue-500 focus:outline-none w-full"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData.phone}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <FiMapPin className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      className="bg-transparent border-b border-blue-500 focus:outline-none w-full"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profileData.location}</p>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Stats */}
        <div>
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Activity Stats</h3>
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
                    <span className={`text-${stat.color}-600 dark:text-${stat.color}-400 font-bold`}>
                      {stat.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}