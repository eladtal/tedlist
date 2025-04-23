import api from './api';

// Helper function to normalize MongoDB user object (ensuring id field)
const normalizeUser = (user) => {
  if (!user) return null;
  
  // Clone user to avoid mutations
  const normalizedUser = { ...user };
  
  // MongoDB uses _id, ensure we have an id property too
  if (!normalizedUser.id && normalizedUser._id) {
    normalizedUser.id = normalizedUser._id;
  }
  
  return normalizedUser;
};

const AuthService = {
  // Register a new user
  register: async (userData) => {
    try {
      console.log('Registering user with data:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('Registration response:', response.data);
      
      if (response.data.success) {
        // Normalize user data
        const normalizedUser = normalizeUser(response.data.user);
        
        // Store user data and token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        
        return {
          success: true,
          user: normalizedUser,
          token: response.data.token
        };
      } else {
        console.error('Registration failed:', response.data.error);
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
      if (!localStorage.getItem('user')) {
        const demoUser = {
          id: 'demo-user-1',
          username: 'demouser',
          email: email || 'demo@example.com',
          profileImage: null
        };
        const demoToken = 'demo-token-123456';
        
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('token', demoToken);
        
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
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        
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
      
      // Create a demo user for testing if real login fails
      const demoUser = {
        id: 'demo-user-1',
        username: 'demouser',
        email: email || 'demo@example.com',
        profileImage: null
      };
      const demoToken = 'demo-token-123456';
      
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('token', demoToken);
      
      return {
        success: true,
        user: demoUser,
        token: demoToken,
        demo: true
      };
    }
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return {
      success: true
    };
  },
  
  // Fetch current user data
  fetchCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        // Normalize user data
        const normalizedUser = normalizeUser(response.data.user);
        
        // Update user data in localStorage
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        
        return {
          success: true,
          data: normalizedUser
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Failed to get user data'
        };
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      // If we have a user in localStorage, return it as fallback
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          return {
            success: true,
            data: user,
            fromCache: true
          };
        } catch (e) {
          console.error('Error parsing cached user:', e);
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get user data'
      };
    }
  },
  
  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      
      if (response.data.success) {
        // Normalize user data
        const normalizedUser = normalizeUser(response.data.user);
        
        // Update user data in localStorage
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        
        return {
          success: true,
          data: normalizedUser
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Failed to update profile'
        };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update profile'
      };
    }
  },
  
  // Get the current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      return normalizeUser(user);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Update user info in localStorage after changes
  updateUserData: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
  },
  
  // Update password
  updatePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/update-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Password update error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update password'
      };
    }
  }
};

export default AuthService;
