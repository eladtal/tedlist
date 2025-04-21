import api from './api';

/**
 * Get the current user's profile
 * @returns {Promise} - API response with user profile data
 */
export const getCurrentUserProfile = async () => {
  try {
    const response = await api.get('/users/me/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get a user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise} - API response with user profile data
 */
export const getUserProfileById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/profile`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile by ID:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update the current user's profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} - API response with updated profile
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/users/me/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error.response?.data || error;
  }
};

/**
 * Upload a profile picture
 * @param {string} imageDataUrl - Base64 encoded image data
 * @returns {Promise} - API response with uploaded image URL
 */
export const uploadProfilePicture = async (imageDataUrl) => {
  try {
    const response = await api.post('/users/me/profile-picture', { image: imageDataUrl });
    return response.data;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get user profile statistics
 * @returns {Promise} - API response with user stats
 */
export const getUserStats = async () => {
  try {
    const response = await api.get('/users/me/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get user profile with fallback to localStorage
 * @returns {Object} - User profile data
 */
export const getUserProfileWithFallback = async () => {
  try {
    // Try API first
    const response = await getCurrentUserProfile();
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.log('API profile not available, falling back to localStorage', error);
  }
  
  // Fallback to localStorage
  try {
    const savedUser = localStorage.getItem('tedlistUser');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
  } catch (localError) {
    console.error('Error accessing localStorage profile:', localError);
  }
  
  return null;
};
