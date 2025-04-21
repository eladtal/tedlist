import api from './api';

/**
 * Get all conversations for the current user
 * @returns {Promise} - API response with conversations data
 */
export const getConversations = async () => {
  try {
    const response = await api.get('/messages/conversations');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get messages for a specific conversation
 * @param {string} conversationId - Conversation ID
 * @returns {Promise} - API response with messages
 */
export const getMessagesByConversation = async (conversationId) => {
  try {
    const response = await api.get(`/messages/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error.response?.data || error;
  }
};

/**
 * Send a new message
 * @param {Object} messageData - Message data
 * @param {string} messageData.recipientId - Recipient user ID
 * @param {string} messageData.itemId - Optional item ID if message is about an item
 * @param {string} messageData.content - Message content
 * @returns {Promise} - API response with created message
 */
export const sendMessage = async (messageData) => {
  try {
    const response = await api.post('/messages', messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error.response?.data || error;
  }
};

/**
 * Mark conversation as read
 * @param {string} conversationId - Conversation ID
 * @returns {Promise} - API response
 */
export const markConversationAsRead = async (conversationId) => {
  try {
    const response = await api.put(`/messages/conversations/${conversationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    throw error.response?.data || error;
  }
};

/**
 * Delete a conversation
 * @param {string} conversationId - Conversation ID
 * @returns {Promise} - API response
 */
export const deleteConversation = async (conversationId) => {
  try {
    const response = await api.delete(`/messages/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get messages with fallback to localStorage
 * This helps with the transition from localStorage to API
 */
export const getConversationsWithFallback = async () => {
  try {
    // Try using the API first
    const response = await getConversations();
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.log('API not available, falling back to localStorage', error);
  }
  
  // Fallback to localStorage
  try {
    const savedMessages = localStorage.getItem('tedlistMessages');
    if (savedMessages) {
      return JSON.parse(savedMessages);
    }
  } catch (localError) {
    console.error('Error accessing localStorage messages:', localError);
  }
  
  return [];
};
