import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser, 
  updatePassword
} from '../services/auth.service';

// Create the auth context
const AuthContext = createContext();

// Create a custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Function to set current user data
  const setUserData = (userData, token) => {
    setCurrentUser(userData);
    if (token) {
      localStorage.setItem('tedlistAuthToken', token);
    }
    // Also store user data for development mode
    localStorage.setItem('tedlistUser', JSON.stringify(userData));
  };
  
  // Function to clear user data on logout
  const clearUserData = () => {
    setCurrentUser(null);
    localStorage.removeItem('tedlistAuthToken');
    localStorage.removeItem('tedlistUser');
  };

  // Check if user is already logged in (using token)
  useEffect(() => {
    // Force loading state to complete after a very short delay
    // This ensures the app never stays stuck in loading state
    const forceComplete = setTimeout(() => {
      if (loading) {
        console.log('Auth context: Forcing loading completion');
        setLoading(false);
      }
    }, 1000); // Just 1 second to avoid hanging
    
    const checkLoggedInUser = async () => {
      try {
        // Development mode - simplified login check
        if (process.env.NODE_ENV === 'development') {
          // Try to get user from localStorage
          const savedUser = localStorage.getItem('tedlistUser');
          
          if (savedUser) {
            try {
              const userData = JSON.parse(savedUser);
              setCurrentUser(userData);
            } catch (error) {
              console.warn('Error parsing saved user:', error);
            }
          }
          
          // End loading state
          setLoading(false);
          return;
        }
        
        // Production mode - proper API check
        try {
          const response = await getCurrentUser();
          if (response.success && response.data) {
            setUserData(response.data, response.token);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          localStorage.removeItem('tedlistAuthToken');
        }
      } catch (error) {
        console.error('Error in auth check:', error);
      } finally {
        // Always set loading to false to avoid infinite loading
        setLoading(false);
      }
    };
    
    checkLoggedInUser();
    
    return () => clearTimeout(forceComplete);
  }, []);
  
  // Sign up function
  const signup = async (email, password, username, profileImage = null) => {
    try {
      // Development mode - simplified signup
      if (process.env.NODE_ENV === 'development') {
        const userData = {
          id: 'dev-' + Date.now(),
          email,
          username,
          profileImage: profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg',
          createdAt: new Date().toISOString()
        };
        
        const token = 'dev-token-' + Date.now();
        setUserData(userData, token);
        
        return userData;
      }
      
      // Use the API service to register user
      const userData = {
        email,
        username,
        password,
        profileImage: profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg'
      };
      
      const response = await registerUser(userData);
      
      // If successful, set current user
      if (response.success && response.user) {
        setUserData(response.user, response.token);
      }
      
      return response.user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };
  
  // Login function
  const login = async (email, password) => {
    try {
      // Development mode - simplified login
      if (process.env.NODE_ENV === 'development') {
        const userData = {
          id: 'dev-' + Date.now(),
          email,
          username: email.split('@')[0],
          profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg',
          createdAt: new Date().toISOString()
        };
        
        const token = 'dev-token-' + Date.now();
        setUserData(userData, token);
        
        return userData;
      }
      
      // Use the API service to login
      const response = await loginUser({ email, password });
      
      // If successful, set current user
      if (response.success && response.user) {
        setUserData(response.user, response.token);
      }
      
      return response.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  // Logout function
  const logout = () => {
    // Use the API service to logout
    logoutUser();
    clearUserData();
  };
  
  // Update profile function
  const updateProfile = async (profileData) => {
    if (!currentUser) return null;
    
    try {
      if (process.env.NODE_ENV === 'development') {
        // In development, just update the local user data
        const updatedUser = { ...currentUser, ...profileData };
        setUserData(updatedUser);
        return updatedUser;
      }
      
      try {
        // Try to update via API using our apiService
        const apiService = await import('../services/api').then(module => module.default);
        const response = await apiService.users.updateProfile(profileData);
        if (response.success) {
          setUserData(response.user, response.token);
          return response.user;
        }
      } catch (apiError) {
        console.warn('API update failed, using local fallback:', apiError);
        
        // Fallback to local update
        const updatedUser = { ...currentUser, ...profileData };
        
        // Update current user state
        setUserData(updatedUser);
        
        // Update in localStorage too (legacy support)
        localStorage.setItem('tedlistUser', JSON.stringify(updatedUser));
        
        return updatedUser;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };
  
  // Export all the functions and state
  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateProfile,
    loading,
    setCurrentUser, // Add direct setter for development tools
    isAdmin: currentUser && currentUser.email === 'admin@example.com'
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
