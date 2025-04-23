import apiService from './api';
import { compressImage } from '../utils/imageUtils';

// Helper for localStorage access with feature detection
const localStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Local storage key for items
const ITEMS_STORAGE_KEY = 'tedlistItems';

// Get items from localStorage
const getItemsFromStorage = () => {
  if (!localStorageAvailable()) return [];
  
  try {
    const items = localStorage.getItem(ITEMS_STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  } catch (e) {
    console.error('Error parsing items from localStorage:', e);
    return [];
  }
};

// Save items to localStorage
const saveItemsToStorage = (items) => {
  if (!localStorageAvailable()) return;
  localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
};

// Generate a unique local ID
const generateLocalId = () => `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const ItemService = {
  // Get all items
  getAll: async (params = {}) => {
    try {
      // Try API first
      const response = await apiService.items.getAll(params);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.warn('Failed to fetch items from API, falling back to localStorage', error);
      
      // Fallback to localStorage
      const items = getItemsFromStorage();
      
      // Apply simple filters if provided
      let filtered = [...items];
      
      if (params.category) {
        filtered = filtered.filter(item => item.category === params.category);
      }
      
      if (params.minPrice) {
        filtered = filtered.filter(item => item.price >= parseFloat(params.minPrice));
      }
      
      if (params.maxPrice) {
        filtered = filtered.filter(item => item.price <= parseFloat(params.maxPrice));
      }
      
      return { 
        success: true, 
        data: filtered,
        fromCache: true
      };
    }
  },
  
  // Get item by ID
  getById: async (id) => {
    try {
      // Try API first
      const response = await apiService.items.getById(id);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.warn(`Failed to fetch item ${id} from API, falling back to localStorage`, error);
      
      // Fallback to localStorage
      const items = getItemsFromStorage();
      const item = items.find(item => item.id === id);
      
      if (item) {
        return { success: true, data: item, fromCache: true };
      } else {
        return { success: false, error: 'Item not found' };
      }
    }
  },
  
  // Create a new item
  create: async (itemData, uploadImages = true) => {
    // Create unique local ID for the item (will be replaced by backend ID if API call succeeds)
    const localId = generateLocalId();
    
    // Compress images if provided and uploadImages is true
    let processedItemData = { ...itemData };
    
    if (uploadImages && itemData.images && itemData.images.length > 0) {
      try {
        // Compress images if they're not already URLs
        const processedImages = await Promise.all(
          itemData.images.map(async (image) => {
            if (typeof image === 'string' && image.startsWith('http')) {
              return image; // Already a URL, no need to process
            }
            return await compressImage(image, 800, 0.7);
          })
        );
        
        processedItemData.images = processedImages;
      } catch (error) {
        console.error('Error compressing images:', error);
        // Continue with original images if compression fails
      }
    }
    
    try {
      // Add the owner (current user) if not provided
      if (!processedItemData.owner) {
        const currentUser = JSON.parse(localStorage.getItem('tedlistUser') || '{}');
        processedItemData.owner = currentUser.id;
      }
      
      // Try API first
      const response = await apiService.items.create(processedItemData);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.warn('Failed to create item via API, falling back to localStorage', error);
      
      // Fallback to localStorage
      const items = getItemsFromStorage();
      const currentUser = JSON.parse(localStorage.getItem('tedlistUser') || '{}');
      
      // Create a local item
      const newItem = {
        ...processedItemData,
        id: localId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: currentUser.id,
        // Add user details for UI display
        user: {
          id: currentUser.id,
          username: currentUser.username,
          profileImage: currentUser.profileImage
        }
      };
      
      // Save to localStorage
      saveItemsToStorage([newItem, ...items]);
      
      return { 
        success: true, 
        data: newItem,
        fromCache: true,
        message: 'Item saved locally. It will sync when connected to the server.'
      };
    }
  },
  
  // Update an item
  update: async (id, itemData) => {
    try {
      // Try API first
      const response = await apiService.items.update(id, itemData);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.warn(`Failed to update item ${id} via API, falling back to localStorage`, error);
      
      // Fallback to localStorage
      const items = getItemsFromStorage();
      const itemIndex = items.findIndex(item => item.id === id);
      
      if (itemIndex !== -1) {
        // Update the item
        const updatedItem = {
          ...items[itemIndex],
          ...itemData,
          updatedAt: new Date().toISOString()
        };
        
        items[itemIndex] = updatedItem;
        saveItemsToStorage(items);
        
        return { 
          success: true, 
          data: updatedItem,
          fromCache: true,
          message: 'Item updated locally. It will sync when connected to the server.'
        };
      } else {
        return { success: false, error: 'Item not found' };
      }
    }
  },
  
  // Delete an item
  delete: async (id) => {
    try {
      // Try API first
      await apiService.items.delete(id);
      return { success: true };
    } catch (error) {
      console.warn(`Failed to delete item ${id} via API, falling back to localStorage`, error);
      
      // Fallback to localStorage
      const items = getItemsFromStorage();
      const filteredItems = items.filter(item => item.id !== id);
      
      if (items.length !== filteredItems.length) {
        saveItemsToStorage(filteredItems);
        return { 
          success: true,
          fromCache: true,
          message: 'Item deleted locally. It will sync when connected to the server.'
        };
      } else {
        return { success: false, error: 'Item not found' };
      }
    }
  },
  
  // Get items by user
  getByUser: async (userId) => {
    try {
      // Try API first
      const response = await apiService.items.getByUser(userId);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.warn(`Failed to fetch items for user ${userId} from API, falling back to localStorage`, error);
      
      // Fallback to localStorage
      const items = getItemsFromStorage();
      const userItems = items.filter(item => item.owner === userId);
      
      return { 
        success: true, 
        data: userItems,
        fromCache: true
      };
    }
  },
  
  // Get items for swiping
  getForSwipe: async () => {
    try {
      // Try API first
      const response = await apiService.items.getForSwipe();
      return { success: true, data: response.data.data };
    } catch (error) {
      console.warn('Failed to fetch swipe items from API, falling back to localStorage', error);
      
      // Fallback to localStorage - get all items except user's own
      const items = getItemsFromStorage();
      const currentUser = JSON.parse(localStorage.getItem('tedlistUser') || '{}');
      
      // Filter out user's own items
      const swipeItems = items.filter(item => item.owner !== currentUser.id);
      
      return { 
        success: true, 
        data: swipeItems,
        fromCache: true
      };
    }
  },
  
  // Swipe on an item
  swipeItem: async (itemId, direction) => {
    try {
      // Try API first
      const response = await apiService.items.swipe(itemId, direction);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.warn(`Failed to register swipe for item ${itemId} via API, storing locally`, error);
      
      // Store swipe locally
      const currentUser = JSON.parse(localStorage.getItem('tedlistUser') || '{}');
      const swipes = JSON.parse(localStorage.getItem('tedlistSwipes') || '[]');
      
      // Add swipe
      swipes.push({
        itemId,
        userId: currentUser.id,
        direction,
        timestamp: new Date().toISOString()
      });
      
      localStorage.setItem('tedlistSwipes', JSON.stringify(swipes));
      
      return { 
        success: true,
        fromCache: true,
        message: 'Swipe stored locally. It will sync when connected to the server.'
      };
    }
  },
  
  // Get user's liked items
  getLikedItems: async () => {
    try {
      // Try API first
      const response = await apiService.items.getLiked();
      return { success: true, data: response.data.data };
    } catch (error) {
      console.warn('Failed to fetch liked items from API, falling back to localStorage', error);
      
      // Fallback to localStorage
      const items = getItemsFromStorage();
      const swipes = JSON.parse(localStorage.getItem('tedlistSwipes') || '[]');
      const currentUser = JSON.parse(localStorage.getItem('tedlistUser') || '{}');
      
      // Get IDs of liked items
      const likedItemIds = swipes
        .filter(swipe => swipe.userId === currentUser.id && swipe.direction === 'right')
        .map(swipe => swipe.itemId);
      
      // Get liked items
      const likedItems = items.filter(item => likedItemIds.includes(item.id));
      
      return { 
        success: true, 
        data: likedItems,
        fromCache: true
      };
    }
  },
  
  // Migrate locally stored items to API
  migrateLocalItems: async () => {
    const items = getItemsFromStorage();
    if (!items.length) return { success: true, migrated: 0 };
    
    let migrated = 0;
    const failed = [];
    
    for (const item of items) {
      try {
        // Skip items that don't have a local ID (meaning they're already synced)
        if (!item.id.startsWith('local_')) continue;
        
        // Create item via API
        const result = await apiService.items.create({
          ...item,
          id: undefined // Remove local ID for creation
        });
        
        migrated++;
      } catch (error) {
        console.error(`Failed to migrate item ${item.id}:`, error);
        failed.push(item.id);
      }
    }
    
    // If all items migrated, clear localStorage
    if (failed.length === 0) {
      localStorage.removeItem(ITEMS_STORAGE_KEY);
    } else {
      // Keep failed items in localStorage
      const remainingItems = items.filter(item => failed.includes(item.id));
      saveItemsToStorage(remainingItems);
    }
    
    return { 
      success: true, 
      migrated,
      failed: failed.length
    };
  }
};

export default ItemService;
