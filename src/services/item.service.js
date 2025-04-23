import api from './api';
<<<<<<< HEAD

/**
 * Get all items with optional filtering
 * @param {Object} params - Query parameters
 * @returns {Promise} - API response with items
 */
export const getAllItems = async (params = {}) => {
  try {
    const response = await api.get('/items', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get a specific item by ID
 * @param {string} itemId - Item ID
 * @returns {Promise} - API response with item data
 */
export const getItemById = async (itemId) => {
  try {
    const response = await api.get(`/items/${itemId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get items for a specific user
 * @param {string} userId - User ID
 * @returns {Promise} - API response with user's items
 */
export const getUserItems = async (userId) => {
  try {
    const response = await api.get(`/items/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new item
 * @param {Object} itemData - Item data
 * @returns {Promise} - API response with created item
 */
export const createItem = async (itemData) => {
  try {
    const response = await api.post('/items', itemData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update an existing item
 * @param {string} itemId - Item ID
 * @param {Object} itemData - Updated item data
 * @returns {Promise} - API response with updated item
 */
export const updateItem = async (itemId, itemData) => {
  try {
    const response = await api.put(`/items/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete an item
 * @param {string} itemId - Item ID
 * @returns {Promise} - API response
 */
export const deleteItem = async (itemId) => {
  try {
    const response = await api.delete(`/items/${itemId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Register a swipe on an item
 * @param {string} itemId - Item ID
 * @param {string} direction - Swipe direction ('left' or 'right')
 * @returns {Promise} - API response
 */
export const swipeItem = async (itemId, direction) => {
  try {
    const response = await api.post(`/items/${itemId}/swipe`, { direction });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fallback method to handle transition from localStorage to API
 * This will attempt to use the API first, but fall back to localStorage if needed
 */
export const getItemsWithFallback = async () => {
  try {
    // Try to get items from API first
    const response = await getAllItems();
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.log('API not available yet, falling back to localStorage', error);
  }

  // Fallback to localStorage
  const savedItems = localStorage.getItem('tedlistItems');
  if (savedItems) {
    return JSON.parse(savedItems);
  }
  
  // Return empty array if nothing found
  return [];
};
=======
import { compressImage } from '../utils/image-utils';

const ItemService = {
  // Get all items with optional filters
  getItems: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      const response = await api.get(`/items?${queryParams.toString()}`);
      console.log('MongoDB items response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching items from MongoDB:', error);
      return { items: [] };
    }
  },
  
  // Get a single item by ID
  getItem: async (id) => {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching item ${id} from MongoDB:`, error);
      throw error;
    }
  },
  
  // Create a new item listing
  createItem: async (itemData) => {
    try {
      console.log('Creating item in MongoDB:', itemData);
      const response = await api.post('/items', itemData);
      return response.data;
    } catch (error) {
      console.error('Error creating item in MongoDB:', error);
      throw error;
    }
  },
  
  // Update an existing item
  updateItem: async (id, itemData) => {
    try {
      const response = await api.put(`/items/${id}`, itemData);
      return response.data;
    } catch (error) {
      console.error(`Error updating item ${id} in MongoDB:`, error);
      throw error;
    }
  },
  
  // Delete an item
  deleteItem: async (id) => {
    try {
      const response = await api.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting item ${id} from MongoDB:`, error);
      throw error;
    }
  },
  
  // Get items for a specific user
  getUserItems: async (userId) => {
    try {
      if (!userId) {
        console.error('getUserItems called with undefined userId');
        return { items: [] }; // Return empty array as fallback
      }
      const response = await api.get(`/items/user/${userId}`);
      console.log(`MongoDB items for user ${userId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching items for user ${userId} from MongoDB:`, error);
      return { items: [] };
    }
  },
  
  // Get items for current user
  getMyItems: async () => {
    try {
      // Try to get user from localStorage
      let user;
      try {
        const userString = localStorage.getItem('user');
        if (!userString) {
          console.error('No user found in localStorage');
          return { items: [] };
        }
        
        user = JSON.parse(userString);
        // Check if user object has an id property (MongoDB uses _id)
        const userId = user.id || user._id;
        
        if (!userId) {
          console.error('User object has no id:', user);
          return { items: [] };
        }
        
        return await ItemService.getUserItems(userId);
      } catch (error) {
        console.error('Error getting user items:', error);
        return { items: [] };
      }
    } catch (error) {
      console.error('Error in getMyItems:', error);
      return { items: [] };
    }
  },
  
  // Process photos for item creation/update
  processPhotos: async (photos) => {
    try {
      // If photos is an array of objects with preview property (from our form),
      // convert them to base64 strings for the API
      if (!Array.isArray(photos)) {
        console.error('Photos is not an array:', photos);
        return { success: false, error: 'Invalid photos format' };
      }
      
      // Ensure we're compressing images to keep MongoDB payload sizes reasonable
      const processedPhotos = await Promise.all(photos.map(async photo => {
        // If it's already a string (base64), return it
        if (typeof photo === 'string') return photo;
        
        // If it's an object with a preview property that's a string, return that
        if (photo && typeof photo.preview === 'string') return photo.preview;
        
        // If it's a File object, compress it
        if (photo && photo.file instanceof File) {
          try {
            const compressed = await compressImage(photo.file, 0.5); // Use our compression utility
            return await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(compressed);
            });
          } catch (err) {
            console.error('Error compressing photo:', err);
            // If compression fails, try to use the original file
            if (photo.file) {
              return await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(photo.file);
              });
            }
          }
        }
        
        // If all else fails, return null (this photo will be filtered out)
        return null;
      }));
      
      // Filter out any null values
      const validPhotos = processedPhotos.filter(Boolean);
      
      console.log(`Processed ${validPhotos.length} photos for MongoDB upload`);
      return { success: true, data: validPhotos };
    } catch (error) {
      console.error('Error processing photos for MongoDB:', error);
      return { success: false, error: 'Failed to process photos' };
    }
  }
};

export default ItemService;
>>>>>>> temp-branch
