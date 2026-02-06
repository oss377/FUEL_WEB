'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FiMail, 
  FiLock, 
  FiUser, 
  FiAlertCircle, 
  FiEye, 
  FiEyeOff, 
  FiCheck,
  FiShield,
  FiAlertTriangle,
  FiRefreshCw
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthFormProps {
  type: 'login' | 'register' | 'reset';
}

const InputField = ({
  name,
  label,
  type = 'text',
  icon: Icon,
  value,
  onChange,
  disabled,
  required = true,
  validationError,
  showToggle = false,
  showPassword,
  onToggleShowPassword,
}: {
  name: string;
  label: string;
  type?: string;
  icon: React.ElementType;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  required?: boolean;
  validationError?: string;
  showToggle?: boolean;
  showPassword?: boolean;
  onToggleShowPassword?: () => void;
}) => {
  const isPassword = type === 'password';

  return (
    <div>
      <label className="block text-gray-700 dark:text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`w-full pl-12 pr-12 py-3 bg-white/50 dark:bg-white/5 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition disabled:opacity-50 ${
            validationError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder={isPassword ? '••••••••' : `Enter your ${label.toLowerCase()}`}
          minLength={isPassword ? 6 : undefined}
        />
        {showToggle && onToggleShowPassword && (
          <button type="button" onClick={onToggleShowPassword} disabled={disabled} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white disabled:opacity-50">
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      {validationError && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
          <FiAlertTriangle className="w-3 h-3 mr-1" />
          {validationError}
        </motion.div>
      )}
    </div>
  );
};

export default function AuthForm({ type }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [networkError, setNetworkError] = useState(false);
  const router = useRouter();
  const { user, userRole, login, register, resetPassword } = useAuth();
  const { t } = useLanguage();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (userRole === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, userRole, router]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if ((type === 'login' || type === 'register') && !formData.password) {
      errors.password = 'Password is required';
    } else if (type === 'register' && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Name validation for registration
    if (type === 'register' && !formData.name.trim()) {
      errors.name = 'Full name is required';
    }

    // Confirm password validation
    if (type === 'register' && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Terms acceptance validation
    if (type === 'register' && !termsAccepted) {
      errors.terms = 'You must accept the Terms & Conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearErrors = () => {
    setError('');
    setNetworkError(false);
    setValidationErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    // Validate form first
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setNetworkError(false);

    try {
      if (type === 'register') {
        const result = await register(formData.email, formData.password, formData.name);
        
        if (result.success) {
          setSuccess('🎉 Registration successful! You will be redirected to dashboard...');
          setFormData({ email: '', password: '', name: '', confirmPassword: '' });
          setTermsAccepted(false);
          
          // Redirect union users to dashboard after registration
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          handleApiError(result.error || 'Registration failed. Please try again.');
        }
      } else if (type === 'login') {
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          setSuccess('✅ Login successful! Redirecting...');
          setFormData({ email: '', password: '', name: '', confirmPassword: '' });
          
          // Redirect based on user role
          setTimeout(() => {
            if (userRole === 'admin') {
              router.push('/admin');
            } else {
              router.push('/dashboard');
            }
          }, 1500);
        } else {
          handleApiError(result.error || 'Login failed. Please check your credentials.');
        }
      } else if (type === 'reset') {
        const result = await resetPassword(formData.email);
        
        if (result.success) {
          setSuccess('📧 Password reset email sent! Check your inbox.');
          setFormData({ email: '', password: '', name: '', confirmPassword: '' });
        } else {
          handleApiError(result.error || 'Failed to send reset email. Please try again.');
        }
      }
    } catch (err: any) {
      // Check for network errors
      if (err.message?.includes('Network') || err.message?.includes('fetch')) {
        setNetworkError(true);
        setError('Network error. Please check your internet connection and try again.');
      } else {
        handleApiError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (errorMessage: string) => {
    // Check for specific Firebase/API error codes and provide user-friendly messages
    const errorMap: Record<string, string> = {
      // Firebase Auth errors
      'auth/email-already-in-use': 'This email is already registered. Please use a different email.',
      'auth/email-already-exists': 'This email is already registered. Please use a different email.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your internet connection.',
      'auth/user-disabled': 'This account has been disabled. Please contact support.',
      'auth/invalid-credential': 'Invalid email or password.',
      
      // API specific errors
      'Email already registered': 'This email is already registered. Please use a different email.',
      'Invalid email or password': 'Invalid email or password.',
      'Account has been disabled': 'This account has been disabled. Please contact support.',
      'Password verification failed': 'Password verification failed. Please try again.',
      'All fields are required': 'Please fill in all required fields.',
      'No token provided': 'Session expired. Please log in again.',
      'Authentication failed': 'Authentication failed. Please try again.',
      'User not found': 'User account not found.',
      'Unauthorized': 'Session expired. Please log in again.',
    };

    // Try to find a matching error message
    const matchedError = Object.keys(errorMap).find(code => 
      errorMessage.toLowerCase().includes(code.toLowerCase().replace('auth/', ''))
    );

    setError(matchedError ? errorMap[matchedError] : errorMessage);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'login': return t('auth.signIn');
      case 'register': return t('auth.signUp');
      case 'reset': return t('auth.resetPassword');
      default: return '';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'login': return 'Sign in to access your dashboard';
      case 'register': return 'Join us to manage your fleet efficiently';
      case 'reset': return 'Enter your email to reset your password';
      default: return '';
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'login': return loading ? 'Signing In...' : t('auth.signIn');
      case 'register': return loading ? 'Creating Account...' : t('auth.signUp');
      case 'reset': return loading ? 'Sending Email...' : t('auth.resetPassword');
      default: return '';
    }
  };

  const retryConnection = () => {
    clearErrors();
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="backdrop-blur-xl bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-2xl p-8 shadow-2xl"
      >
        {/* Network Error Banner */}
        {networkError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <FiAlertTriangle className="text-yellow-500 text-xl" />
              <div>
                <p className="font-medium text-yellow-700 dark:text-yellow-300">Connection Issue</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Unable to connect to authentication service</p>
              </div>
            </div>
            <button
              onClick={retryConnection}
              className="px-4 py-2 bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition flex items-center space-x-2"
            >
              <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
              <span>Retry</span>
            </button>
          </motion.div>
        )}

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getTitle()}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {getDescription()}
          </p>
          {type === 'register' && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              All new users are assigned the "union" role by default
            </p>
          )}
        </div>

        {error && !networkError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-3"
          >
            <FiAlertCircle className="text-red-500 dark:text-red-400 text-xl flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-700 dark:text-red-300">Authentication Error</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start space-x-3"
          >
            <FiCheck className="text-green-500 dark:text-green-400 text-xl flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-700 dark:text-green-300">Success</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">{success}</p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'register' && (
            <InputField
              name="name"
              label={t('auth.fullName')}
              value={formData.name}
              onChange={handleChange}
              disabled={loading || networkError}
              validationError={validationErrors.name}
              icon={FiUser}
              required
            />
          )}

          <InputField
            name="email"
            label={t('auth.email')}
            value={formData.email}
            onChange={handleChange}
            disabled={loading || networkError}
            validationError={validationErrors.email}
            type="email"
            icon={FiMail}
            required
          />

          {(type === 'login' || type === 'register') && (
            <>
              <InputField
                name="password"
                label={t('auth.password')}
                type="password"
                icon={FiLock}
                value={formData.password}
                onChange={handleChange}
                disabled={loading || networkError}
                validationError={validationErrors.password}
                showToggle
                required
                showPassword={showPassword}
                onToggleShowPassword={() => setShowPassword(!showPassword)}
              />

              {type === 'register' && (
                <InputField
                  name="confirmPassword"
                  label={t('auth.confirmPassword')}
                  type="password"
                  icon={FiLock}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading || networkError}
                  validationError={validationErrors.confirmPassword}
                  showToggle
                  required
                  showPassword={showConfirmPassword}
                  onToggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              )}
            </>
          )}

          {type === 'register' && (
            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (validationErrors.terms) {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.terms;
                        return newErrors;
                      });
                    }
                  }}
                  disabled={loading || networkError}
                  className={`w-4 h-4 rounded focus:ring-2 focus:ring-offset-2 ${
                    validationErrors.terms 
                      ? 'border-red-500 text-red-600 focus:ring-red-500' 
                      : 'border-gray-300 text-blue-600 focus:ring-blue-500'
                  }`}
                />
              </div>
              <div className="text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
                  I accept the{' '}
                  <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Terms & Conditions
                  </Link>
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  By registering, you agree to our terms and acknowledge our privacy policy.
                </p>
                {validationErrors.terms && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"
                  >
                    <FiAlertTriangle className="w-3 h-3 mr-1" />
                    {validationErrors.terms}
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {type === 'login' && (
            <div className="text-right">
              <Link 
                href="/reset-password" 
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm transition font-medium"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>
          )}

          <motion.button
            type="submit"
            disabled={loading || networkError || (type === 'register' && !termsAccepted)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {getButtonText()}
              </>
            ) : (
              getButtonText()
            )}
          </motion.button>

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {type === 'login' && t('auth.noAccount')}
              {type === 'register' && t('auth.haveAccount')}
              {type === 'reset' && t('auth.rememberPassword')}
              <Link 
                href={type === 'login' ? '/register' : 
                      type === 'register' ? '/login' : 
                      '/login'}
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 ml-2 transition font-medium"
              >
                {type === 'login' && t('auth.signUp')}
                {type === 'register' && t('auth.signIn')}
                {type === 'reset' && t('auth.backToLogin')}
              </Link>
            </p>
          </div>
        </form>

        {/* Role Information Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          {type === 'register' ? (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <FiShield className="text-blue-500 dark:text-blue-400 text-xl" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                  About "union" role
                </h3>
              </div>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  <span>Access to view vehicles, stations, and reports</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  <span>Basic dashboard with analytics</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                  <span>Can request elevated permissions from admin</span>
                </li>
              </ul>
              <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  <span className="font-medium">Note:</span> User data is stored securely in Firebase Firestore
                  with proper authentication and authorization rules.
                </p>
              </div>
            </div>
          ) : type === 'login' && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-900/30 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                📋 After successful login:
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-purple-600 dark:text-purple-400">Admin users</span> → Redirected to Admin Dashboard
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-blue-600 dark:text-blue-400">Union users</span> → Redirected to User Dashboard
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Demo Credentials (for development only) */}
      {process.env.NODE_ENV === 'development' && type === 'login' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-gradient-to-r from-gray-900 to-black rounded-lg border border-gray-800"
        >
          <p className="text-sm text-gray-400 mb-2 font-medium">🔐 Demo Credentials (Development Only):</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-500">Test Admin Account:</p>
              <p className="text-white">admin@test.com</p>
              <p className="text-gray-300">Password: Admin@123</p>
            </div>
            <div>
              <p className="text-gray-500">Test Union Account:</p>
              <p className="text-white">union@test.com</p>
              <p className="text-gray-300">Password: Union@123</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              <span className="font-medium">Note:</span> These credentials will create real Firebase accounts
              and store user data in Firestore with appropriate roles.
            </p>
          </div>
        </motion.div>
      )}

      {/* API Status Indicator */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <div className={`w-2 h-2 rounded-full ${networkError ? 'bg-red-500' : 'bg-green-500'}`}></div>
          <span>Authentication API: {networkError ? 'Offline' : 'Online'}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Powered by Firebase Authentication & Next.js API Routes
        </p>
      </div>
    </div>
  );
}