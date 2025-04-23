import api from './api';
<<<<<<< HEAD

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
=======
import polyfillSocketIO from '../utils/socket-io-polyfill';
import AuthService from './auth.service';
import apiConfig from '../config/api.config';

// Always use the polyfill since the real socket.io-client isn't available
const io = polyfillSocketIO;

// Socket.io connection
let socket = null;

// Connect to socket server
const connectSocket = () => {
  if (!socket) {
    const API_URL = apiConfig.apiUrl || 'http://localhost:5000';
    const socketUrl = 'http://localhost:5000'; // Base URL without /api path
    
    socket = io(socketUrl, {
      auth: {
        token: localStorage.getItem('token')
      }
    });
    
    // Setup basic event listeners
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }
  
  return socket;
};

const MessageService = {
  // Initialize socket connection
  initSocket: () => {
    return connectSocket();
  },
  
  // Disconnect socket
  disconnectSocket: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },
  
  // Join a chat room
  joinChatRoom: (roomId) => {
    const socket = connectSocket();
    socket.emit('join-room', roomId);
    return socket;
  },
  
  // Send a message
  sendMessage: (roomId, message) => {
    const socket = connectSocket();
    
    const messageData = {
      roomId,
      ...message,
      timestamp: new Date().toISOString()
    };
    
    socket.emit('send-message', messageData);
    return messageData;
  },
  
  // Handle typing indicator
  sendTypingStatus: (roomId, isTyping) => {
    const socket = connectSocket();
    
    const typingData = {
      roomId,
      isTyping,
      user: AuthService.getCurrentUser(),
      timestamp: new Date().toISOString()
    };
    
    socket.emit('typing', typingData);
  },
  
  // Listen for new messages
  onReceiveMessage: (callback) => {
    const socket = connectSocket();
    socket.on('receive-message', (data) => {
      callback(data);
    });
  },
  
  // Listen for typing indicator
  onUserTyping: (callback) => {
    const socket = connectSocket();
    socket.on('user-typing', (data) => {
      callback(data);
    });
  },
  
  // Get conversation list for current user
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },
  
  // Get messages for a specific conversation
  getMessages: async (conversationId) => {
    const response = await api.get(`/messages/${conversationId}`);
    return response.data;
  },
  
  // Start a new conversation with a user
  startConversation: async (userId) => {
    const response = await api.post('/messages/conversations', { userId });
    return response.data;
  }
};

export default MessageService;
>>>>>>> temp-branch
