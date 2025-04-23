import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/auth.service';

// Create auth context
export const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth Provider component
export const AuthProvider = ({ children, adminEnabled = true }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Initial load - check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        // First check localStorage for user data
        const storedUser = AuthService.getCurrentUser();
        
        if (storedUser) {
          setCurrentUser(storedUser);
          
          // Check if user is admin
          setIsAdmin(checkUserIsAdmin(storedUser));
          
          // Verify token with server if available
          try {
            const response = await AuthService.fetchCurrentUser();
            if (response.success && response.user) {
              setCurrentUser(response.user);
              setIsAdmin(checkUserIsAdmin(response.user));
            }
          } catch (error) {
            console.warn('Failed to verify token with server, using stored user data');
          }
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setAuthError(error.message || 'Authentication error');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);
  
  // Function to check if a user is an admin
  const checkUserIsAdmin = (user) => {
    if (!adminEnabled) return false;
    
    // Admin check logic
    if (!user) return false;
    
    // Check for explicit admin flag
    if (user.isAdmin === true) return true;
    
    // Check for admin role
    if (user.role === 'admin') return true;
    
    // Check email domain for admin access (example: @admin.com)
    if (user.email && user.email.endsWith('@admin.com')) return true;
    
    return false;
  };
  
  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      const response = await AuthService.register(userData);
      
      if (response.success) {
        setCurrentUser(response.user);
        setIsAdmin(checkUserIsAdmin(response.user));
        return { success: true, user: response.user };
      } else {
        setAuthError(response.error || 'Registration failed');
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      const response = await AuthService.login(email, password);
      
      if (response.success) {
        setCurrentUser(response.user);
        setIsAdmin(checkUserIsAdmin(response.user));
        return { success: true, user: response.user };
      } else {
        setAuthError(response.error || 'Login failed');
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  // Logout user
  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setIsAdmin(false);
    setAuthError(null);
  };
  
  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    
    try {
      const response = await AuthService.updateProfile(profileData);
      
      if (response.success) {
        // Update current user with new profile data
        const updatedUser = { ...currentUser, ...response.user };
        setCurrentUser(updatedUser);
        return { success: true, user: updatedUser };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // For demo or development - set a user directly
  const setUser = (user) => {
    if (user) {
      setCurrentUser(user);
      setIsAdmin(checkUserIsAdmin(user));
      // Store in localStorage for persistence
      AuthService.updateUserData(user);
    } else {
      logout();
    }
  };
  
  // Update password
  const updatePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    
    try {
      const response = await AuthService.updatePassword({ currentPassword, newPassword });
      
      if (response.success) {
        return { success: true, message: response.message || 'Password updated successfully' };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Context value
  const authContextValue = {
    currentUser,
    loading,
    authError,
    isAdmin,
    register,
    login,
    logout,
    updateProfile,
    updatePassword,
    setCurrentUser: setUser // Alias for development/testing
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
