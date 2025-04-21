import api from './api';

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
