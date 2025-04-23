import api from './api';
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
