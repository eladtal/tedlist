import api from './api';

// Helper function to normalize MongoDB user object (ensuring id field)
const normalizeUser = (user) => {
  if (!user) return null;
  
  // Clone the user object to avoid modifying the original
  const normalized = { ...user };
  
  // Ensure the user has an id (MongoDB uses _id)
  if (!normalized.id && normalized._id) {
    normalized.id = normalized._id;
  }
  
  return normalized;
};

const AuthService = {
  // Register a new user
  register: async (userData) => {
    try {
      // For development without backend
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock registration in development mode');
        
        // Create a demo user
        const mockUser = {
          id: 'demo-user-' + Date.now(),
          username: userData.username,
          email: userData.email,
          profileImage: userData.profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg',
          createdAt: new Date().toISOString()
        };
        
        const token = 'demo-token-' + Date.now();
        
        // Store in localStorage
        localStorage.setItem('tedlistUser', JSON.stringify(mockUser));
        localStorage.setItem('tedlistAuthToken', token);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          success: true,
          user: mockUser,
          token
        };
      }
      
      // Call the actual API
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        // Normalize user data
        const normalizedUser = normalizeUser(response.data.user);
        
        // Store user data and token in localStorage
        localStorage.setItem('tedlistAuthToken', response.data.token);
        localStorage.setItem('tedlistUser', JSON.stringify(normalizedUser));
        
        return {
          success: true,
          user: normalizedUser,
          token: response.data.token
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Registration failed'
      };
    }
  },
  
  // Login user
  login: async (email, password) => {
    try {
      // Create a demo user if localStorage is empty (for testing)
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock login in development mode');
        const demoUser = {
          id: 'demo-user-1',
          username: 'demouser',
          email: email || 'demo@example.com',
          profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg'
        };
        const demoToken = 'demo-token-123456';
        
        localStorage.setItem('tedlistUser', JSON.stringify(demoUser));
        localStorage.setItem('tedlistAuthToken', demoToken);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          success: true,
          user: demoUser,
          token: demoToken
        };
      }
      
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        // Normalize user data
        const normalizedUser = normalizeUser(response.data.user);
        
        // Store user data and token in localStorage
        localStorage.setItem('tedlistAuthToken', response.data.token);
        localStorage.setItem('tedlistUser', JSON.stringify(normalizedUser));
        
        return {
          success: true,
          user: normalizedUser,
          token: response.data.token
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Invalid credentials'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Login failed'
      };
    }
  },
  
  // Logout user
  logout: () => {
    // Clear localStorage
    localStorage.removeItem('tedlistAuthToken');
    localStorage.removeItem('tedlistUser');
    
    // Note: For a real API, you might want to invalidate the token on the server
    return { success: true };
  },
  
  // Fetch current user data
  fetchCurrentUser: async () => {
    try {
      const token = localStorage.getItem('tedlistAuthToken');
      
      if (!token) {
        return { 
          success: false, 
          error: 'No authentication token found' 
        };
      }
      
      // For development without backend
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock current user in development mode');
        
        // Try to get user from localStorage
        const userData = localStorage.getItem('tedlistUser');
        
        if (userData) {
          try {
            const user = JSON.parse(userData);
            return { success: true, user };
          } catch (e) {
            console.warn('Failed to parse user data from localStorage');
          }
        }
        
        // If no user in localStorage, create a mock one
        const mockUser = {
          id: 'demo-user-1',
          username: 'demouser',
          email: 'demo@example.com',
          profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg'
        };
        
        localStorage.setItem('tedlistUser', JSON.stringify(mockUser));
        
        return { success: true, user: mockUser };
      }
      
      // Call the actual API
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        const normalizedUser = normalizeUser(response.data.user);
        
        // Update user data in localStorage
        localStorage.setItem('tedlistUser', JSON.stringify(normalizedUser));
        
        return { success: true, user: normalizedUser };
      } else {
        return { 
          success: false, 
          error: response.data.error || 'Failed to fetch user data' 
        };
      }
    } catch (error) {
      console.error('Fetch current user error:', error);
      
      // Clear token if unauthorized
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('tedlistAuthToken');
        localStorage.removeItem('tedlistUser');
      }
      
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Failed to fetch user data'
      };
    }
  },
  
  // Update user profile
  updateProfile: async (profileData) => {
    try {
      // For development without backend
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock update profile in development mode');
        
        // Get current user from localStorage
        const userData = localStorage.getItem('tedlistUser');
        let user = userData ? JSON.parse(userData) : {};
        
        // Update user data
        user = { ...user, ...profileData, updatedAt: new Date().toISOString() };
        
        // Save back to localStorage
        localStorage.setItem('tedlistUser', JSON.stringify(user));
        
        return { success: true, user };
      }
      
      // Call the actual API
      const response = await api.put('/users/profile', profileData);
      
      if (response.data.success) {
        const normalizedUser = normalizeUser(response.data.data);
        
        // Update user data in localStorage
        localStorage.setItem('tedlistUser', JSON.stringify(normalizedUser));
        
        return { success: true, user: normalizedUser };
      } else {
        return { 
          success: false, 
          error: response.data.error || 'Failed to update profile' 
        };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Failed to update profile'
      };
    }
  },
  
  // Get the current user from localStorage
  getCurrentUser: () => {
    try {
      const userData = localStorage.getItem('tedlistUser');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('tedlistAuthToken');
  },
  
  // Update user info in localStorage after changes
  updateUserData: (userData) => {
    localStorage.setItem('tedlistUser', JSON.stringify(userData));
  },
  
  // Update password
  updatePassword: async (passwordData) => {
    try {
      // For development without backend
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock update password in development mode');
        return { success: true, message: 'Password updated successfully' };
      }
      
      // Call the actual API
      const response = await api.put('/auth/password', passwordData);
      
      return response.data;
    } catch (error) {
      console.error('Update password error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Failed to update password'
      };
    }
  }
};

export default AuthService;
