import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

// Create the context
export const AdminContext = createContext();

// Custom hook to use the admin context
export const useAdmin = () => {
  return useContext(AdminContext);
};

export const AdminProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if current user is an admin
  useEffect(() => {
    if (currentUser) {
      const checkAdminStatus = () => {
        // Explicitly grant admin access to talbion3@gmail.com
        if (currentUser.email === 'talbion3@gmail.com') {
          setIsAdmin(true);
          
          // Make sure the user is marked as admin in localStorage
          try {
            const savedUsers = localStorage.getItem('tedlistUsers');
            let allUsers = [];
            
            if (savedUsers) {
              allUsers = JSON.parse(savedUsers);
              
              // Check if user already exists
              const userIndex = allUsers.findIndex(user => user.id === currentUser.id);
              
              if (userIndex >= 0) {
                // Update existing user
                if (allUsers[userIndex].role !== 'admin') {
                  allUsers[userIndex] = {
                    ...allUsers[userIndex],
                    role: 'admin',
                    updatedAt: new Date().toISOString()
                  };
                  localStorage.setItem('tedlistUsers', JSON.stringify(allUsers));
                }
              }
            }
          } catch (error) {
            console.error('Error updating admin status:', error);
          }
          
          return;
        }
        
        // For all other users, check admin status in localStorage
        try {
          const savedUsers = localStorage.getItem('tedlistUsers');
          
          if (savedUsers) {
            const parsedUsers = JSON.parse(savedUsers);
            
            // Check if current user is marked as admin
            const userIsAdmin = parsedUsers.some(user => 
              user.id === currentUser.id && user.role === 'admin'
            );
            
            // If no users are marked as admin, let's make the first user an admin
            if (parsedUsers.length > 0 && !parsedUsers.some(user => user.role === 'admin')) {
              if (currentUser.id === parsedUsers[0].id) {
                setIsAdmin(true);
                
                // Update the user record to include admin role
                updateUser(currentUser.id, { role: 'admin' });
                return;
              }
            }
            
            setIsAdmin(userIsAdmin);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      };
      
      checkAdminStatus();
      loadUsers();
    } else {
      setIsAdmin(false);
    }
  }, [currentUser]);

  // Load all users from localStorage
  const loadUsers = () => {
    setLoading(true);
    try {
      const savedUsers = localStorage.getItem('tedlistUsers');
      
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        setUsers(parsedUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new user
  const addUser = (newUser) => {
    try {
      // Generate a new ID for the user
      const userId = `user_${Date.now()}`;
      
      // Create a new user object
      const user = {
        ...newUser,
        id: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to local state
      const updatedUsers = [...users, user];
      setUsers(updatedUsers);
      
      // Save to localStorage
      localStorage.setItem('tedlistUsers', JSON.stringify(updatedUsers));
      
      return { success: true, user };
    } catch (error) {
      console.error('Error adding user:', error);
      return { success: false, error: error.message };
    }
  };

  // Update a user
  const updateUser = (userId, updates) => {
    try {
      // Find and update the user in local state
      let userFound = false;
      
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          userFound = true;
          return {
            ...user,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return user;
      });
      
      if (!userFound) {
        return { success: false, error: 'User not found' };
      }
      
      // Update local state
      setUsers(updatedUsers);
      
      // Save to localStorage
      localStorage.setItem('tedlistUsers', JSON.stringify(updatedUsers));
      
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  };

  // Delete a user
  const deleteUser = (userId) => {
    try {
      // Filter out the user from local state
      const updatedUsers = users.filter(user => user.id !== userId);
      
      if (updatedUsers.length === users.length) {
        return { success: false, error: 'User not found' };
      }
      
      // Update local state
      setUsers(updatedUsers);
      
      // Save to localStorage
      localStorage.setItem('tedlistUsers', JSON.stringify(updatedUsers));
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.message };
    }
  };

  // Get a single user by ID
  const getUserById = (userId) => {
    return users.find(user => user.id === userId) || null;
  };

  // Get all users
  const getAllUsers = () => {
    return users;
  };

  // Make a user an admin
  const setUserAsAdmin = (userId) => {
    return updateUser(userId, { role: 'admin' });
  };

  // Remove admin privileges from a user
  const removeAdminRole = (userId) => {
    return updateUser(userId, { role: 'user' });
  };

  // Export all the functions and state
  const value = {
    isAdmin,
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    getAllUsers,
    setUserAsAdmin,
    removeAdminRole
  };

  return (
    <AdminContext.Provider value={value}>
      {!loading && children}
    </AdminContext.Provider>
  );
};
