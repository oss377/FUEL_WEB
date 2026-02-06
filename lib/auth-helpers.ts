// Simple auth helper for development
export const mockAuth = {
  login: async (email: string, password: string) => {
    // Mock login for development
    if (process.env.NODE_ENV === 'development') {
      return {
        success: true,
        user: {
          uid: 'dev-user-id',
          email: email,
          name: 'Test User',
          emailVerified: true,
          role: 'union'
        }
      };
    }
    
    return { success: false, error: 'Not implemented' };
  },
  
  register: async (email: string, password: string, name: string) => {
    // Mock registration for development
    if (process.env.NODE_ENV === 'development') {
      return {
        success: true,
        user: {
          uid: 'dev-user-id-' + Date.now(),
          email: email,
          name: name,
          emailVerified: false,
          role: 'union'
        }
      };
    }
    
    return { success: false, error: 'Not implemented' };
  }
};