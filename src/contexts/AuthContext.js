import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthService } from '../services';

// Create context
export const AuthContext = createContext();

// Create a custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Helper function to normalize user object to ensure it has an 'id' property
const normalizeUser = (user) => {
  if (!user) return null;
  
  // Create a new object to avoid mutating the original
  const normalizedUser = { ...user };
  
  // Ensure user has an id property (MongoDB uses _id)
  if (!normalizedUser.id && normalizedUser._id) {
    normalizedUser.id = normalizedUser._id;
  }
  
  return normalizedUser;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Set current user with normalization
  const setNormalizedUser = (user) => {
    const normalizedUser = normalizeUser(user);
    setCurrentUser(normalizedUser);
    
    // Also update localStorage if needed
    if (normalizedUser) {
      localStorage.setItem('user', JSON.stringify(normalizedUser));
    }
  };
  
  // Check if user is already logged in (from token)
  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        // Get user from localStorage (saved by AuthService)
        const savedUser = AuthService.getCurrentUser();
        
        if (savedUser && AuthService.isAuthenticated()) {
          // Set the current user from localStorage initially (normalized)
          setNormalizedUser(savedUser);
          
          // If we have a token, verify it by fetching current user data
          try {
            const response = await AuthService.fetchCurrentUser();
            if (response.success) {
              setNormalizedUser(response.data);
            } else {
              // If token is invalid, log out
              AuthService.logout();
              setCurrentUser(null);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            // Don't log out on connection errors, so app can work offline
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedInUser();
  }, []);
  
  // Register a new user
  const signup = async (email, password, username, profileImage = null) => {
    try {
      console.log('Registering user with production backend on tedlist.onrender.com');
      const userData = {
        email,
        username,
        password
      };
      
      // Use the AuthService to register the user
      const result = await AuthService.register(userData);
      
      if (result.success) {
        // Set current user from the response (normalized)
        setNormalizedUser(result.user);
        
        // If profile image was provided, update it
        if (profileImage) {
          await updateProfile({ profileImage });
        }
        
        return normalizeUser(result.user);
      } else {
        throw new Error(result.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };
  
  // Login function
  const login = async (email, password) => {
    try {
      console.log('Logging in with production backend on tedlist.onrender.com');
      const result = await AuthService.login(email, password);
      
      if (result.success) {
        // Set current user from the response (normalized)
        setNormalizedUser(result.user);
        
        // If this is a demo login, show a notification
        if (result.demo) {
          console.warn('Using demo login as fallback - production server unreachable');
        }
        
        return normalizeUser(result.user);
      } else {
        throw new Error(result.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  // Logout function
  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };
  
  // Update profile function
  const updateProfile = async (updates) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      // Use the AuthService to update profile
      const response = await AuthService.updateProfile(updates);
      
      if (response.success) {
        // Update context state with new user data
        setNormalizedUser(response.data);
        return normalizeUser(response.data);
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };
  
  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateProfile,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
