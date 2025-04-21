import api from './api';
import { getItemsWithFallback } from './item.service';

/**
 * Get all items that can be swiped, with filtering options
 * @param {Object} params - Query parameters for filtering
 * @param {string} params.listingType - Filter by listing type (sale, trade, free)
 * @param {boolean} params.hideMyItems - Whether to hide the current user's items
 * @returns {Promise} - API response with items
 */
export const getSwipeItems = async (params = {}) => {
  try {
    const response = await api.get('/items/swipe', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching swipe items:', error);
    throw error.response?.data || error;
  }
};

/**
 * Record a swipe action on an item
 * @param {string} itemId - The ID of the item being swiped
 * @param {string} direction - The swipe direction ('left' or 'right')
 * @returns {Promise} - API response
 */
export const recordSwipe = async (itemId, direction) => {
  try {
    const response = await api.post(`/items/${itemId}/swipe`, { direction });
    return response.data;
  } catch (error) {
    console.error('Error recording swipe:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get all swipes for the current user
 * @returns {Promise} - API response with user's swipes
 */
export const getUserSwipes = async () => {
  try {
    const response = await api.get('/users/me/swipes');
    return response.data;
  } catch (error) {
    console.error('Error fetching user swipes:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get items with fallback to localStorage and sample data
 * This helps with the transition from localStorage to API
 * @param {Object} params - Filter parameters
 * @returns {Array} - Array of items
 */
export const getSwipeItemsWithFallback = async (params = {}) => {
  try {
    // Try using the API first
    const response = await getSwipeItems(params);
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.log('API not available, falling back to localStorage', error);
  }
  
  // Fallback to localStorage + sample data
  try {
    // Get items from localStorage through our item service
    const items = await getItemsWithFallback();
    
    // Sample items to ensure we always have content to swipe
    const sampleItems = [
      {
        id: 's1',
        title: 'Vintage Record Player',
        price: 'For Trade',
        description: 'Vintage record player in great working condition. Looking to trade for audio equipment or books.',
        images: ['https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'],
        owner: 'David',
        ownerId: 'user1',
        listingType: 'trade'
      },
      {
        id: 's2',
        title: 'Professional Camera Lenses',
        price: '₪ 1,200',
        description: 'Set of professional camera lenses in excellent condition.',
        images: ['https://images.unsplash.com/photo-1520549233664-03f65c1d1327?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'],
        owner: 'Maya',
        ownerId: 'user2',
        listingType: 'sale'
      },
      {
        id: 's3',
        title: 'Handcrafted Ceramic Set',
        price: 'For Trade',
        description: 'Beautiful handcrafted ceramic plates and bowls. Each piece is unique. Looking to trade for home decor or plants.',
        images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'],
        owner: 'Noa',
        ownerId: 'user3',
        listingType: 'trade'
      },
      {
        id: 's4',
        title: 'Vintage Comic Book Collection',
        price: '₪ 800',
        description: 'Collection of well-preserved vintage comic books from the 80s and 90s.',
        images: ['https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'],
        owner: 'Dan',
        ownerId: 'user4',
        listingType: 'sale'
      },
      {
        id: 's5',
        title: 'Professional DJ Equipment',
        price: 'For Trade',
        description: 'Professional DJ setup including mixer and controllers. Everything in great condition. Looking for musical instruments or audio gear.',
        images: ['https://images.unsplash.com/photo-1571510649755-66c9eb133540?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'],
        owner: 'Yael',
        ownerId: 'user5',
        listingType: 'trade'
      }
    ];

    // Combine and filter items
    const allItems = [...items, ...sampleItems];
    
    // Apply filters
    let filteredItems = allItems;
    
    // Filter by type if specified
    if (params.listingType && params.listingType !== 'all') {
      filteredItems = filteredItems.filter(item => item.listingType === params.listingType);
    }
    
    // Filter by user if specified
    if (params.hideMyItems && params.currentUserId) {
      filteredItems = filteredItems.filter(item => 
        item.ownerId !== params.currentUserId && 
        item.userId !== params.currentUserId
      );
    }
    
    return filteredItems;
  } catch (error) {
    console.error('Error with fallback items:', error);
    return [];
  }
};

/**
 * Get user swipes with fallback to localStorage
 * @param {string} userId - User ID
 * @returns {Array} - Array of user swipes
 */
export const getUserSwipesWithFallback = async (userId) => {
  try {
    // Try using the API first
    const response = await getUserSwipes();
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.log('API not available, falling back to localStorage', error);
  }
  
  // Fallback to localStorage
  try {
    const savedSwipes = localStorage.getItem('tedlistSwipes');
    if (savedSwipes) {
      const allSwipes = JSON.parse(savedSwipes);
      return allSwipes[userId] || [];
    }
  } catch (error) {
    console.error('Error accessing localStorage swipes:', error);
  }
  
  return [];
};
