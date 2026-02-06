'use client';

import { useState } from 'react';
import { FiUser, FiX, FiSave, FiLoader, FiMail, FiLock, FiShield } from 'react-icons/fi';
import GlassCard from '../GlassCard';
import { generateAutoID } from '@/utils/idGenerator';

interface AddMemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MemberData) => void;
  isLoading?: boolean;
}

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

const initialFormData: MemberData = {
  memberId: generateAutoID('ADM'),
  name: '',
  email: '',
  phone: '',
  role: 'admin', // Default role is admin
  department: 'administration',
  userRegistration: {
    email: '',
    password: '',
    confirmPassword: ''
  }
};

const roles = [
  { value: 'admin', label: 'Administrator' },
  { value: 'superadmin', label: 'Super Administrator' },
  { value: 'manager', label: 'Manager' },
  { value: 'auditor', label: 'Auditor' }
];

const departments = [
  { value: 'administration', label: 'Administration' },
  { value: 'operations', label: 'Operations' },
  { value: 'finance', label: 'Finance' },
  { value: 'security', label: 'Security' },
  { value: 'it', label: 'IT Department' }
];

export default function AddMemberForm({ isOpen, onClose, onSubmit, isLoading = false }: AddMemberFormProps) {
  const [formData, setFormData] = useState<MemberData>(initialFormData);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.userRegistration.password !== formData.userRegistration.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (formData.userRegistration.password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    
    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.userRegistration.password)) {
      setPasswordError('Password must contain uppercase, lowercase, number, and special character');
      return;
    }
    
    setPasswordError('');
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('userRegistration.')) {
      const userField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        userRegistration: {
          ...prev.userRegistration,
          [userField]: value
        }
      }));
      if (userField === 'confirmPassword' || userField === 'password') {
        setPasswordError('');
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleReset = () => {
    setFormData({
      ...initialFormData,
      memberId: generateAutoID('ADM')
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
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          <GlassCard className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                  <FiShield className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Add Administrator Member
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Register a new admin with full system access
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 text-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-800 dark:text-blue-300 rounded-full">
                  ID: {formData.memberId}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiUser className="mr-2" />
                    Personal Information
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                        placeholder="john.doe@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Account & Role Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiShield className="mr-2" />
                    Account & Role
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                    >
                      {departments.map(dept => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      System Role *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Default role is Administrator
                    </p>
                  </div>

                  {/* Account Creation */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-3">System Account Credentials</h5>
                    
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Login Email *
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
                          placeholder="admin.account@company.com"
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
                          minLength={8}
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                          placeholder="••••••••"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Min 8 characters with uppercase, lowercase, number & special character
                      </p>
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
                          minLength={8}
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                          placeholder="••••••••"
                        />
                      </div>
                      {passwordError && (
                        <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Permissions Info */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Administrator Permissions</h5>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Full system access and configuration</li>
                  <li>• User management and role assignment</li>
                  <li>• System settings and security configuration</li>
                  <li>• View all analytics and reports</li>
                  <li>• Manage all stations and vehicles</li>
                  <li>• Audit logs and system monitoring</li>
                </ul>
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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <FiSave />
                      <span>Add Administrator</span>
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