// API Service for Tedlist
// Uses fetch API with axios-like interface for HTTP requests

// Determine the base URL based on environment
const getBaseUrl = () => {
  // Check for explicit environment variable first
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Default fallbacks based on environment
  if (process.env.NODE_ENV === 'production') {
    return 'https://tedlist-backend.onrender.com';
  } else {
    return 'http://localhost:5000';
  }
};

// Base URL for API requests
const BASE_URL = getBaseUrl();

// Default timeout in ms
const DEFAULT_TIMEOUT = 15000;

// Get authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('tedlistAuthToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Create a simple fetch wrapper with interceptors (similar to axios)
const api = {
  // Main request method
  async request(config) {
    try {
      const { url, method = 'GET', data, headers = {}, timeout = DEFAULT_TIMEOUT } = config;
      
      // Construct full URL
      const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
      
      // Prepare fetch options
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...headers
        },
        credentials: 'include' // Include cookies for CORS
      };
      
      // Add body if it's not a GET request
      if (method !== 'GET' && data) {
        options.body = JSON.stringify(data);
      }
      
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Request timeout after ${timeout}ms`)), timeout);
      });
      
      // Fetch with timeout
      const response = await Promise.race([
        fetch(fullUrl, options),
        timeoutPromise
      ]);
      
      // Parse JSON response or get text
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
      
      // Handle unsuccessful responses
      if (!response.ok) {
        // Handle unauthorized response (401)
        if (response.status === 401) {
          // Clear authentication data
          localStorage.removeItem('tedlistAuthToken');
          localStorage.removeItem('tedlistUser');
          
          // Force page reload if specified
          if (config.reloadOnUnauthorized) {
            window.location.href = '/login';
          }
        }
        
        throw {
          status: response.status,
          data: responseData,
          message: responseData.error || `HTTP error ${response.status}`
        };
      }
      
      return { data: responseData, status: response.status };
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },
  
  // HTTP method shortcuts
  async get(url, config = {}) {
    return this.request({ ...config, url, method: 'GET' });
  },
  
  async post(url, data, config = {}) {
    return this.request({ ...config, url, method: 'POST', data });
  },
  
  async put(url, data, config = {}) {
    return this.request({ ...config, url, method: 'PUT', data });
  },
  
  async delete(url, config = {}) {
    return this.request({ ...config, url, method: 'DELETE' });
  },
  
  async patch(url, data, config = {}) {
    return this.request({ ...config, url, method: 'PATCH', data });
  }
};

// API service methods
const apiService = {
  // Authentication
  auth: {
    register(userData) {
      return api.post('/auth/register', userData);
    },
    
    login(credentials) {
      return api.post('/auth/login', credentials);
    },
    
    verify() {
      return api.get('/auth/me');
    },
    
    updateProfile(userData) {
      return api.put('/users/profile', userData);
    },
    
    updatePassword(passwordData) {
      return api.put('/auth/password', passwordData);
    }
  },
  
  // Items
  items: {
    getAll(params = {}) {
      const queryString = new URLSearchParams(params).toString();
      return api.get(`/items${queryString ? '?' + queryString : ''}`);
    },
    
    getById(id) {
      return api.get(`/items/${id}`);
    },
    
    create(itemData) {
      return api.post('/items', itemData);
    },
    
    update(id, itemData) {
      return api.put(`/items/${id}`, itemData);
    },
    
    delete(id) {
      return api.delete(`/items/${id}`);
    },
    
    getByUser(userId) {
      return api.get(`/items/user/${userId}`);
    },
    
    search(query) {
      return api.get(`/items/search?q=${encodeURIComponent(query)}`);
    },
    
    uploadImage(formData) {
      return api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Remove Content-Type header as browser will set it with boundary
        transformRequest: (data, headers) => {
          delete headers['Content-Type'];
          return data;
        }
      });
    },
    
    getForSwipe() {
      return api.get('/items/swipe');
    },
    
    swipe(itemId, direction) {
      return api.post(`/items/${itemId}/swipe`, { direction });
    },
    
    getLiked() {
      return api.get('/items/liked');
    }
  },
  
  // Messages
  messages: {
    getConversations() {
      return api.get('/messages');
    },
    
    getMessages(conversationId) {
      return api.get(`/messages/${conversationId}`);
    },
    
    sendMessage(data) {
      return api.post('/messages', data);
    },
    
    markAsRead(messageId) {
      return api.put(`/messages/${messageId}/read`);
    }
  },
  
  // Users
  users: {
    getProfile(userId) {
      return api.get(`/users/${userId}`);
    },
    
    updateProfile(userData) {
      return api.put('/users/profile', userData);
    },
    
    getAll() {
      return api.get('/users');
    },
    
    checkUsername(username) {
      return api.get(`/users/check-username/${username}`);
    }
  },
  
  // System
  system: {
    health() {
      return api.get('/health');
    },
    
    ping() {
      return api.get('/ping');
    }
  }
};

export default apiService;
