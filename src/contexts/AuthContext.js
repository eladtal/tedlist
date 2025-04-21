import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser, 
  isLoggedIn 
} from '../services/auth.service';

// Create context
export const AuthContext = createContext();

// Create a custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in (using token)
  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        if (isLoggedIn()) {
          // Token exists, fetch current user data
          const response = await getCurrentUser();
          if (response.success && response.data) {
            setCurrentUser(response.data);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // If there's an error with the token, remove it
        localStorage.removeItem('tedlist_token');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedInUser();
  }, []);
  
  // Sign up function
  const signup = async (email, password, username, profileImage = null) => {
    try {
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
        setCurrentUser(response.user);
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
      // Use the API service to login
      const response = await loginUser({ email, password });
      
      // If successful, set current user
      if (response.success && response.user) {
        setCurrentUser(response.user);
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
    setCurrentUser(null);
  };
  
  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      // In a real app with API, we'd make an API call here
      // For now, update locally but prepare for future API integration
      const api = await import('../services/api').then(module => module.default);
      
      try {
        // Try to update via API if available
        const response = await api.put('/users/profile', profileData);
        if (response.data.success) {
          setCurrentUser(response.data.user);
          return response.data.user;
        }
      } catch (apiError) {
        console.log('API not yet available, falling back to localStorage', apiError);
        
        // Fallback to localStorage for now
        if (currentUser) {
          const updatedUser = { ...currentUser, ...profileData };
          
          // Update current user state
          setCurrentUser(updatedUser);
          
          // Update in localStorage too (legacy support)
          localStorage.setItem('tedlistUser', JSON.stringify(updatedUser));
          
          // Update in users list (legacy support)
          const existingUsers = JSON.parse(localStorage.getItem('tedlistUsers') || '[]');
          const updatedUsers = existingUsers.map(user => 
            user.id === currentUser.id ? { ...user, ...profileData } : user
          );
          localStorage.setItem('tedlistUsers', JSON.stringify(updatedUsers));
          
          return updatedUser;
        }
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };
  
  // Context value
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
