import React, { createContext, useState, useEffect, useContext } from 'react';

// Create context
export const AuthContext = createContext();

// Create a custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkLoggedInUser = () => {
      try {
        const savedUser = localStorage.getItem('tedlistUser');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedInUser();
  }, []);
  
  // Sign up function
  const signup = async (email, password, username, profileImage = null) => {
    try {
      // In a real app, this would make an API call to create a new user
      // For this demo, we'll simply create a user object and store it in localStorage
      
      // Check if email already exists
      const existingUsers = JSON.parse(localStorage.getItem('tedlistUsers') || '[]');
      const userExists = existingUsers.some(user => user.email === email);
      
      if (userExists) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        username,
        profileImage: profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg',
        createdAt: new Date().toISOString()
      };
      
      // Add to users list
      existingUsers.push({...newUser, password}); // Only store password in the users list, not in current user
      localStorage.setItem('tedlistUsers', JSON.stringify(existingUsers));
      
      // Set current user (without password)
      setCurrentUser(newUser);
      localStorage.setItem('tedlistUser', JSON.stringify(newUser));
      
      return newUser;
    } catch (error) {
      throw error;
    }
  };
  
  // Login function
  const login = async (email, password) => {
    try {
      // In a real app, this would verify credentials with an API
      // For this demo, we'll check against localStorage
      
      const existingUsers = JSON.parse(localStorage.getItem('tedlistUsers') || '[]');
      const user = existingUsers.find(user => user.email === email && user.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Create a user object without the password
      const loggedInUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      };
      
      // Set current user
      setCurrentUser(loggedInUser);
      localStorage.setItem('tedlistUser', JSON.stringify(loggedInUser));
      
      return loggedInUser;
    } catch (error) {
      throw error;
    }
  };
  
  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tedlistUser');
  };
  
  // Update profile function
  const updateProfile = (updates) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      // Update current user
      const updatedUser = { ...currentUser, ...updates };
      
      // Update in localStorage (both current user and users list)
      localStorage.setItem('tedlistUser', JSON.stringify(updatedUser));
      
      const existingUsers = JSON.parse(localStorage.getItem('tedlistUsers') || '[]');
      const updatedUsers = existingUsers.map(user => 
        user.id === currentUser.id ? { ...user, ...updates } : user
      );
      localStorage.setItem('tedlistUsers', JSON.stringify(updatedUsers));
      
      // Update state
      setCurrentUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
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
