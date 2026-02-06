'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithCustomToken, 
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

// Add UserData interface for better typing
interface UserData {
  uid: string;
  email: string;
  name: string;
  emailVerified: boolean;
  role: string;
  createdAt?: any;
  updatedAt?: any;
  lastLogin?: any;
  // Add other fields from your Firestore document
}

interface AuthContextType {
  user: User | null;
  userRole: string;
  userData: UserData | null; // Add userData to context
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; userData?: UserData }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string; userData?: UserData }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>; // Add method to refresh user data
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null); // Add userData state
  const [loading, setLoading] = useState(true);

  // Function to fetch user data from API
  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/auth/user-data?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data.userData);
        console.log('📊 User data fetched:', data.userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = firebaseOnAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get ID token to access custom claims
        try {
          const idTokenResult = await user.getIdTokenResult(true);
          const role = idTokenResult.claims.role as string || 'union';
          console.log('🔐 User role from token:', role);
          console.log('🔐 All claims:', idTokenResult.claims);
          setUserRole(role);
          
          // Fetch user data from database
          await fetchUserData(user.uid);
        } catch (error) {
          console.error('Error getting user role:', error);
          setUserRole('union');
        }
      } else {
        setUserRole('');
        setUserData(null);
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.details || 'Login failed'
        };
      }

      console.log('✅ Login successful, user data:', data.user);

      // Sign in with the custom token
      await signInWithCustomToken(auth, data.customToken);
      
      // Set user data from API response
      if (data.user) {
        setUserData(data.user);
      }
      
      return { 
        success: true,
        userData: data.user 
      };

    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      if (error.message?.includes('Network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.code === 'auth/invalid-custom-token') {
        errorMessage = 'Session token expired. Please try again.';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Registration failed'
        };
      }

      // Auto-login after registration
      if (data.customToken) {
        await signInWithCustomToken(auth, data.customToken);
        
        // Set user data from API response
        if (data.user) {
          setUserData(data.user);
        }
      }
      
      return { 
        success: true,
        userData: data.user 
      };

    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      if (error.message?.includes('Network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      
      return {
        success: true
      };
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      let errorMessage = 'Failed to send reset email';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUserData(null);
      setUserRole('');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to refresh user data
  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.uid);
    }
  };

  const value = {
    user,
    userRole,
    userData, // Include userData in context
    loading,
    login,
    register,
    resetPassword,
    logout,
    refreshUserData, // Add refresh function
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};