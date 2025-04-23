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

const UserService = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: normalizeUser(response.data.user)
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error getting profile:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get profile'
      };
    }
  },
  
  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: normalizeUser(response.data.user)
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update profile'
      };
    }
  },
  
  // Get user public profile by ID
  getUserProfile: async (userId) => {
    try {
      if (!userId) {
        console.error('getUserProfile called with undefined userId');
        return { success: false, error: 'No user ID provided' };
      }
      
      const response = await api.get(`/users/${userId}/profile`);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: normalizeUser(response.data.user)
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get user profile'
      };
    }
  },
  
  // Check if username exists
  checkUsername: async (username) => {
    try {
      const response = await api.get(`/users/check-username?username=${username}`);
      return response.data;
    } catch (error) {
      console.error('Error checking username:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to check username'
      };
    }
  },
  
  // Get user onboarding progress
  getOnboardingProgress: async () => {
    try {
      const response = await api.get('/users/onboarding-progress');
      return response.data;
    } catch (error) {
      console.error('Error getting onboarding progress:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get onboarding progress'
      };
    }
  },
  
  // Update onboarding progress
  updateOnboardingProgress: async (progressData) => {
    try {
      const response = await api.put('/users/onboarding-progress', progressData);
      return response.data;
    } catch (error) {
      console.error('Error updating onboarding progress:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update onboarding progress'
      };
    }
  }
};

export default UserService;
