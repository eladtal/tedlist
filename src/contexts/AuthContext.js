import React, { createContext, useState, useEffect, useContext } from 'react';
<<<<<<< HEAD
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser, 
  updatePassword
} from '../services/auth.service';
=======
import { AuthService } from '../services';
>>>>>>> temp-branch

// Create the auth context
const AuthContext = createContext();

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
  
<<<<<<< HEAD
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
=======
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
>>>>>>> temp-branch
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
  
  // Register a new user
  const signup = async (email, password, username, profileImage = null) => {
    try {
<<<<<<< HEAD
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
=======
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
>>>>>>> temp-branch
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };
  
  // Login function
  const login = async (email, password) => {
    try {
<<<<<<< HEAD
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
=======
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
>>>>>>> temp-branch
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  // Logout function
  const logout = () => {
<<<<<<< HEAD
    // Use the API service to logout
    logoutUser();
    clearUserData();
  };
  
  // Update profile function
  const updateProfile = async (profileData) => {
    if (!currentUser) return null;
    
=======
    AuthService.logout();
    setCurrentUser(null);
  };
  
  // Update profile function
  const updateProfile = async (updates) => {
>>>>>>> temp-branch
    try {
      if (process.env.NODE_ENV === 'development') {
        // In development, just update the local user data
        const updatedUser = { ...currentUser, ...profileData };
        setUserData(updatedUser);
        return updatedUser;
      }
      
<<<<<<< HEAD
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
=======
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
>>>>>>> temp-branch
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
