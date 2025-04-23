import apiService from './api';

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

// Local storage keys
const CONVERSATIONS_STORAGE_KEY = 'tedlistMessages';
const MESSAGES_STORAGE_KEY = 'tedlistMessageDetails';
const SOCKET_AVAILABLE_KEY = 'tedlistSocketAvailable';

// Get data from localStorage
const getConversationsFromStorage = () => {
  if (!localStorageAvailable()) return [];
  
  try {
    const conversations = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
    return conversations ? JSON.parse(conversations) : [];
  } catch (e) {
    console.error('Error parsing conversations from localStorage:', e);
    return [];
  }
};

const getMessagesFromStorage = () => {
  if (!localStorageAvailable()) return {};
  
  try {
    const messages = localStorage.getItem(MESSAGES_STORAGE_KEY);
    return messages ? JSON.parse(messages) : {};
  } catch (e) {
    console.error('Error parsing messages from localStorage:', e);
    return {};
  }
};

// Save data to localStorage
const saveConversationsToStorage = (conversations) => {
  if (!localStorageAvailable()) return;
  localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(conversations));
};

const saveMessagesToStorage = (messages) => {
  if (!localStorageAvailable()) return;
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
};

// Generate unique local IDs
const generateLocalId = () => `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Socket.io polyfill for development without a real-time server
const setupSocketPolyfill = () => {
  if (typeof window.io !== 'undefined') return window.io;
  
  // Polyfill io object
  window.io = function(url, options) {
    console.log('Socket.io polyfill initialized', url, options);
    
    // Mark as unavailable for real-time
    localStorage.setItem(SOCKET_AVAILABLE_KEY, 'false');
    
    // Create a mock socket client
    const socket = {
      id: generateLocalId(),
      connected: false,
      disconnected: true,
      
      // Event handlers
      _eventHandlers: {},
      
      // Join a room
      join: function(room) {
        console.log(`Socket polyfill: Joined room ${room}`);
        this._room = room;
        return this;
      },
      
      // Listen for events
      on: function(event, callback) {
        this._eventHandlers[event] = callback;
        return this;
      },
      
      // Emit events
      emit: function(event, data) {
        console.log(`Socket polyfill: Emitted ${event}`, data);
        
        // Simulate message delivery after a short delay
        if (event === 'send-message' && data) {
          setTimeout(() => {
            // Store in localStorage
            const messages = getMessagesFromStorage();
            const conversationId = data.conversationId || data.roomId;
            
            if (!messages[conversationId]) {
              messages[conversationId] = [];
            }
            
            const newMessage = {
              id: generateLocalId(),
              text: data.text,
              senderId: data.senderId,
              conversationId,
              createdAt: new Date().toISOString()
            };
            
            messages[conversationId].push(newMessage);
            saveMessagesToStorage(messages);
            
            // Simulate receiving the message
            if (this._eventHandlers['receive-message']) {
              setTimeout(() => {
                this._eventHandlers['receive-message'](newMessage);
              }, 500);
            }
          }, 300);
        }
        
        return this;
      },
      
      // Connect
      connect: function() {
        this.connected = true;
        this.disconnected = false;
        
        if (this._eventHandlers['connect']) {
          this._eventHandlers['connect']();
        }
        
        return this;
      },
      
      // Disconnect
      disconnect: function() {
        this.connected = false;
        this.disconnected = true;
        
        if (this._eventHandlers['disconnect']) {
          this._eventHandlers['disconnect']();
        }
        
        return this;
      }
    };
    
    // Auto connect
    setTimeout(() => {
      socket.connect();
    }, 100);
    
    return socket;
  };
  
  return window.io;
};

const MessageService = {
  // Get all conversations
  getConversations: async () => {
    try {
      // Try API first
      const response = await apiService.messages.getConversations();
      return { 
        success: true, 
        data: response.data.data
      };
    } catch (error) {
      console.warn('Failed to fetch conversations from API, falling back to localStorage', error);
      
      // Fallback to localStorage
      const conversations = getConversationsFromStorage();
      
      return { 
        success: true, 
        data: conversations,
        fromCache: true
      };
    }
  },
  
  // Get messages for a conversation
  getMessages: async (conversationId) => {
    try {
      // Try API first
      const response = await apiService.messages.getMessages(conversationId);
      return { 
        success: true, 
        data: response.data.data
      };
    } catch (error) {
      console.warn(`Failed to fetch messages for conversation ${conversationId} from API, falling back to localStorage`, error);
      
      // Fallback to localStorage
      const allMessages = getMessagesFromStorage();
      const messages = allMessages[conversationId] || [];
      
      return { 
        success: true, 
        data: messages,
        fromCache: true
      };
    }
  },
  
  // Send a message
  sendMessage: async (messageData) => {
    try {
      // Try API first
      const response = await apiService.messages.sendMessage(messageData);
      return { 
        success: true, 
        data: response.data.data
      };
    } catch (error) {
      console.warn('Failed to send message via API, storing locally', error);
      
      // Generate local IDs
      const newMessageId = generateLocalId();
      const currentUser = JSON.parse(localStorage.getItem('tedlistUser') || '{}');
      
      // Create conversation if needed
      const { recipientId, text } = messageData;
      
      if (!recipientId) {
        return {
          success: false,
          error: 'Recipient ID is required'
        };
      }
      
      // Check if conversation exists
      const conversations = getConversationsFromStorage();
      let conversation = conversations.find(c => 
        (c.participants.includes(currentUser.id) && c.participants.includes(recipientId))
      );
      
      // Create new conversation if none exists
      if (!conversation) {
        conversation = {
          id: generateLocalId(),
          participants: [currentUser.id, recipientId],
          lastMessage: text,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        
        conversations.push(conversation);
        saveConversationsToStorage(conversations);
      } else {
        // Update last message in conversation
        conversation.lastMessage = text;
        conversation.updatedAt = new Date().toISOString();
        saveConversationsToStorage(conversations);
      }
      
      // Add message to conversation
      const allMessages = getMessagesFromStorage();
      
      if (!allMessages[conversation.id]) {
        allMessages[conversation.id] = [];
      }
      
      const newMessage = {
        id: newMessageId,
        text,
        senderId: currentUser.id,
        conversationId: conversation.id,
        createdAt: new Date().toISOString()
      };
      
      allMessages[conversation.id].push(newMessage);
      saveMessagesToStorage(allMessages);
      
      return { 
        success: true, 
        data: newMessage,
        fromCache: true,
        message: 'Message stored locally. It will sync when connected to the server.'
      };
    }
  },
  
  // Mark message as read
  markAsRead: async (messageId) => {
    try {
      // Try API first
      const response = await apiService.messages.markAsRead(messageId);
      return { 
        success: true, 
        data: response.data.data
      };
    } catch (error) {
      console.warn(`Failed to mark message ${messageId} as read via API, updating locally`, error);
      
      // Update message in localStorage
      const allMessages = getMessagesFromStorage();
      
      // Find message in all conversations
      let messageUpdated = false;
      
      Object.keys(allMessages).forEach(conversationId => {
        const messages = allMessages[conversationId];
        const messageIndex = messages.findIndex(m => m.id === messageId);
        
        if (messageIndex !== -1) {
          messages[messageIndex].read = true;
          messages[messageIndex].readAt = new Date().toISOString();
          messageUpdated = true;
        }
      });
      
      if (messageUpdated) {
        saveMessagesToStorage(allMessages);
        return { 
          success: true,
          fromCache: true,
          message: 'Message marked as read locally. It will sync when connected to the server.'
        };
      } else {
        return { success: false, error: 'Message not found' };
      }
    }
  },
  
  // Initialize socket.io connection for real-time chat
  initializeSocket: (url) => {
    // Ensure io is available (use polyfill if needed)
    const io = typeof window.io !== 'undefined' ? window.io : setupSocketPolyfill();
    
    // Create socket connection
    const socket = io(url || apiService.getBaseUrl(), {
      transports: ['websocket'],
      secure: true
    });
    
    return socket;
  },
  
  // Migrate locally stored messages to API
  migrateLocalMessages: async () => {
    const conversations = getConversationsFromStorage();
    const allMessages = getMessagesFromStorage();
    
    if (!conversations.length) return { success: true, migrated: 0 };
    
    let migratedConversations = 0;
    let migratedMessages = 0;
    const failed = [];
    
    // For each local conversation, create on server
    for (const conversation of conversations) {
      try {
        // Skip conversations that don't have a local ID
        if (!conversation.id.startsWith('local_')) continue;
        
        // Get messages for this conversation
        const messages = allMessages[conversation.id] || [];
        
        // Create conversation via first message
        if (messages.length > 0) {
          const firstMessage = messages[0];
          
          const recipientId = conversation.participants.find(
            id => id !== firstMessage.senderId
          );
          
          if (recipientId) {
            // Send first message to create conversation
            await apiService.messages.sendMessage({
              recipientId,
              text: firstMessage.text
            });
            
            migratedConversations++;
            migratedMessages++;
            
            // Send rest of messages
            for (let i = 1; i < messages.length; i++) {
              const message = messages[i];
              
              await apiService.messages.sendMessage({
                recipientId,
                text: message.text
              });
              
              migratedMessages++;
            }
          }
        }
      } catch (error) {
        console.error(`Failed to migrate conversation ${conversation.id}:`, error);
        failed.push(conversation.id);
      }
    }
    
    // If all conversations migrated, clear localStorage
    if (failed.length === 0) {
      localStorage.removeItem(CONVERSATIONS_STORAGE_KEY);
      localStorage.removeItem(MESSAGES_STORAGE_KEY);
    }
    
    return { 
      success: true, 
      migratedConversations,
      migratedMessages,
      failed: failed.length
    };
  }
};

export default MessageService;
