import api from './api';

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
    const response = await api.post('/auth/register', userData);
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('tedlist_token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
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
    const response = await api.post('/auth/login', credentials);
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('tedlist_token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get current logged in user profile
 * @returns {Promise} - API response with user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Log out user
 */
export const logoutUser = () => {
  localStorage.removeItem('tedlist_token');
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
    const response = await api.put('/auth/update-password', passwordData);
    
    // Update token if returned
    if (response.data.token) {
      localStorage.setItem('tedlist_token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Check if user is logged in
 * @returns {boolean} - True if user is logged in
 */
export const isLoggedIn = () => {
  return !!localStorage.getItem('tedlist_token');
};
