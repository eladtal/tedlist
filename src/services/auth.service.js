import apiService from './api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.username - Username
 * @param {string} userData.password - User password
 * @returns {Promise} - API response with user data and token
 */
export const registerUser = async (userData) => {
  try {
    // Use our local mock if backend is not available in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Using local mock for registration in development mode');
      // Simulate a successful registration with mock data
      const mockResponse = {
        success: true,
        user: {
          id: 'local_' + Date.now(),
          email: userData.email,
          username: userData.username,
          profileImage: userData.profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg',
          createdAt: new Date().toISOString()
        },
        token: 'mock_token_' + Date.now()
      };
      
      // Store token in localStorage
      localStorage.setItem('tedlistAuthToken', mockResponse.token);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockResponse;
    }
    
    // Otherwise use the real API
    const response = await apiService.auth.register(userData);
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('tedlistAuthToken', response.token);
    }
    
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    // Return a structured error response
    return {
      success: false,
      message: error.message || 'Registration failed. Please try again.',
      error
    };
  }
};

/**
 * Login a user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise} - API response with user data and token
 */
export const loginUser = async (credentials) => {
  try {
    // Use our local mock if backend is not available in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Using local mock for login in development mode');
      // Simulate a successful login with mock data
      const mockResponse = {
        success: true,
        user: {
          id: 'local_user',
          email: credentials.email,
          username: credentials.email.split('@')[0],
          profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg',
          createdAt: new Date().toISOString()
        },
        token: 'mock_token_' + Date.now()
      };
      
      // Store token in localStorage
      localStorage.setItem('tedlistAuthToken', mockResponse.token);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockResponse;
    }
    
    // Otherwise use the real API
    const response = await apiService.auth.login(credentials);
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('tedlistAuthToken', response.token);
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    // Return a structured error response
    return {
      success: false,
      message: error.message || 'Login failed. Please check your credentials and try again.',
      error
    };
  }
};

/**
 * Get current logged in user profile
 * @returns {Promise} - API response with user data
 */
export const getCurrentUser = async () => {
  try {
    // If no token exists, user is not logged in
    const token = localStorage.getItem('tedlistAuthToken');
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }
    
    // Use our local mock if backend is not available in development
    if (process.env.NODE_ENV === 'development') {
      // Try to parse user from localStorage if available (for development)
      try {
        const userData = localStorage.getItem('tedlistUser');
        if (userData) {
          const user = JSON.parse(userData);
          return { success: true, data: user };
        }
      } catch (e) {
        console.warn('Failed to parse local user data:', e);
      }
      
      // Generate mock user if none found
      return {
        success: true,
        data: {
          id: 'local_user',
          email: 'user@example.com',
          username: 'local_user',
          profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg',
          createdAt: new Date().toISOString()
        }
      };
    }
    
    // Otherwise use the real API
    const response = await apiService.auth.verify();
    return { success: true, data: response.user };
  } catch (error) {
    console.error('Get current user error:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Log out user
 */
export const logoutUser = () => {
  localStorage.removeItem('tedlistAuthToken');
  localStorage.removeItem('tedlistUser'); // Also remove any user data
};

/**
 * Update user password
 * @param {Object} passwordData - Password data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @returns {Promise} - API response
 */
export const updatePassword = async (passwordData) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      // Mock successful password update
      return { success: true, message: 'Password updated successfully' };
    }
    
    const response = await apiService.auth.updatePassword(passwordData);
    return response;
  } catch (error) {
    console.error('Update password error:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to update password. Please try again.'
    };
  }
};

/**
 * Check if user is logged in
 * @returns {boolean} - True if user is logged in
 */
export const isLoggedIn = () => {
  return !!localStorage.getItem('tedlistAuthToken');
};
