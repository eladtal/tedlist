import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create contexts
export const AdminContext = createContext();

// Custom hook to use the admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    // Return a default safe value instead of throwing an error
    return {
      isAdmin: false,
      users: [],
      items: [],
      reports: [],
      stats: {
        totalUsers: 0,
        totalItems: 0,
        activeListings: 0,
        totalTrades: 0
      },
      loading: false,
      error: null,
      fetchUsers: () => console.warn('AdminContext not initialized'),
      fetchItems: () => console.warn('AdminContext not initialized'),
      fetchReports: () => console.warn('AdminContext not initialized'),
      fetchStats: () => console.warn('AdminContext not initialized'),
      deleteUser: () => console.warn('AdminContext not initialized'),
      deleteItem: () => console.warn('AdminContext not initialized'),
      resolveReport: () => console.warn('AdminContext not initialized'),
      toggleUserRole: () => console.warn('AdminContext not initialized')
    };
  }
  return context;
};

export const AdminProvider = ({ children, adminEnabled = false }) => {
  const { currentUser } = useAuth();
  
  // Always set a default value for isAdmin
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    activeListings: 0,
    totalTrades: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Check if current user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // In a real app, this would verify with the backend
        // If admin is disabled via feature flag, no one is admin
        if (!adminEnabled) {
          setIsAdmin(false);
          return;
        }
        
        // Otherwise, check admin status
        if (currentUser && currentUser.email && 
            (currentUser.email.includes('admin') || currentUser.role === 'admin')) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [currentUser, adminEnabled]);
  
  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual API
      // In local development, we'll simulate with localStorage
      setTimeout(() => {
        const savedUsers = localStorage.getItem('tedlistUsers');
        if (savedUsers) {
          setUsers(JSON.parse(savedUsers));
        } else {
          // Sample data
          const mockUsers = [
            {
              id: '1',
              username: 'johndoe',
              email: 'john@example.com',
              profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
              role: 'user',
              createdAt: '2023-08-15T10:30:00Z',
              activeListings: 5,
              completedTrades: 12
            },
            {
              id: '2',
              username: 'janedoe',
              email: 'jane@example.com',
              profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
              role: 'user',
              createdAt: '2023-07-22T14:15:00Z',
              activeListings: 3,
              completedTrades: 7
            },
            {
              id: '3',
              username: 'admin',
              email: 'admin@example.com',
              profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
              role: 'admin',
              createdAt: '2023-06-10T09:00:00Z',
              activeListings: 0,
              completedTrades: 0
            }
          ];
          
          setUsers(mockUsers);
          localStorage.setItem('tedlistUsers', JSON.stringify(mockUsers));
        }
        
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
      setLoading(false);
    }
  };
  
  // Fetch all items
  const fetchItems = async () => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual API
      setTimeout(() => {
        const savedItems = localStorage.getItem('tedlistItems');
        if (savedItems) {
          setItems(JSON.parse(savedItems));
        } else {
          // Sample data
          const mockItems = [
            {
              id: '1',
              title: 'iPhone 13 Pro',
              description: 'Excellent condition, barely used.',
              price: 800,
              images: ['https://images.unsplash.com/photo-1592750475357-76f3da3fcb0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'],
              status: 'active',
              userId: '1',
              createdAt: '2023-08-10T15:30:00Z',
              category: 'Electronics'
            },
            {
              id: '2',
              title: 'Mountain Bike',
              description: 'Great for trails and city riding.',
              price: 350,
              images: ['https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'],
              status: 'active',
              userId: '2',
              createdAt: '2023-08-05T11:45:00Z',
              category: 'Sports'
            },
            {
              id: '3',
              title: 'Leather Jacket',
              description: 'Vintage leather jacket, size L.',
              price: 120,
              images: ['https://images.unsplash.com/photo-1605908502724-9093a79a1b39?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'],
              status: 'sold',
              userId: '1',
              createdAt: '2023-07-28T09:20:00Z',
              category: 'Clothing'
            }
          ];
          
          setItems(mockItems);
          localStorage.setItem('tedlistItems', JSON.stringify(mockItems));
        }
        
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Failed to fetch items. Please try again.');
      setLoading(false);
    }
  };
  
  // Fetch reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual API
      setTimeout(() => {
        // Sample data
        const mockReports = [
          {
            id: '1',
            itemId: '1',
            reporterId: '2',
            reason: 'Inappropriate content',
            details: 'The listing contains offensive language.',
            status: 'pending',
            createdAt: '2023-08-12T13:40:00Z'
          },
          {
            id: '2',
            itemId: '2',
            reporterId: '1',
            reason: 'Misleading information',
            details: 'The item description does not match the actual product.',
            status: 'pending',
            createdAt: '2023-08-08T10:15:00Z'
          }
        ];
        
        setReports(mockReports);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to fetch reports. Please try again.');
      setLoading(false);
    }
  };
  
  // Fetch admin dashboard stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual API
      setTimeout(() => {
        const mockStats = {
          totalUsers: users.length,
          totalItems: items.length,
          activeListings: items.filter(item => item.status === 'active').length,
          totalTrades: 19
        };
        
        setStats(mockStats);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to fetch stats. Please try again.');
      setLoading(false);
    }
  };
  
  // Delete a user
  const deleteUser = async (userId) => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual API
      setTimeout(() => {
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        localStorage.setItem('tedlistUsers', JSON.stringify(updatedUsers));
        
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
      setLoading(false);
    }
  };
  
  // Delete an item
  const deleteItem = async (itemId) => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual API
      setTimeout(() => {
        const updatedItems = items.filter(item => item.id !== itemId);
        setItems(updatedItems);
        localStorage.setItem('tedlistItems', JSON.stringify(updatedItems));
        
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item. Please try again.');
      setLoading(false);
    }
  };
  
  // Resolve a report
  const resolveReport = async (reportId) => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual API
      setTimeout(() => {
        const updatedReports = reports.map(report => 
          report.id === reportId 
            ? { ...report, status: 'resolved' } 
            : report
        );
        
        setReports(updatedReports);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error resolving report:', error);
      setError('Failed to resolve report. Please try again.');
      setLoading(false);
    }
  };
  
  // Toggle user role (admin/user)
  const toggleUserRole = async (userId) => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual API
      setTimeout(() => {
        const updatedUsers = users.map(user => 
          user.id === userId 
            ? { ...user, role: user.role === 'admin' ? 'user' : 'admin' } 
            : user
        );
        
        setUsers(updatedUsers);
        localStorage.setItem('tedlistUsers', JSON.stringify(updatedUsers));
        
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error toggling user role:', error);
      setError('Failed to update user role. Please try again.');
      setLoading(false);
    }
  };
  
  const value = {
    isAdmin,
    users,
    items,
    reports,
    stats,
    loading,
    error,
    fetchUsers,
    fetchItems,
    fetchReports,
    fetchStats,
    deleteUser,
    deleteItem,
    resolveReport,
    toggleUserRole
  };
  
  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
