<<<<<<< HEAD
// API Service for Tedlist
// Uses native fetch API for HTTP requests

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

// Timeout duration for requests in milliseconds
const TIMEOUT_DURATION = 15000;

// Helper function to add auth token to headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('tedlistAuthToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper function to handle request timeouts
const timeoutPromise = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });
};

// Generic fetch with error handling, retries, and timeout
const fetchWithConfig = async (url, options = {}) => {
  // Add authorization token if available
  const authHeaders = getAuthHeaders();
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...options.headers,
  };
  
  // Full request config
  const config = {
    ...options,
    headers,
  };
  
  try {
    // Add timeout to fetch request
    const fetchPromise = fetch(url, config);
    const response = await Promise.race([
      fetchPromise,
      timeoutPromise(TIMEOUT_DURATION)
    ]);
    
    // Handle unauthorized response
    if (response.status === 401) {
      localStorage.removeItem('tedlistAuthToken');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }
    
    // Parse JSON response
    const data = await response.json();
    
    // Handle error response
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    // For network errors, implement basic retry logic
    if (error.message.includes('network') && !options._retryCount) {
      const retryOptions = {
        ...options,
        _retryCount: 1,
      };
      
      console.warn('Network error, retrying request...');
      return fetchWithConfig(url, retryOptions);
    }
    
    console.error('API request failed:', error);
    throw error;
  }
};

// API service methods
const apiService = {
  // Authentication
  auth: {
    register: (userData) => 
      fetchWithConfig(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
      
    login: (credentials) => 
      fetchWithConfig(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
      
    verify: () => 
      fetchWithConfig(`${BASE_URL}/api/auth/verify`, {
        method: 'GET',
      }),
      
    updateProfile: (userData) => 
      fetchWithConfig(`${BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      }),
  },
  
  // Items
  items: {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return fetchWithConfig(`${BASE_URL}/api/items?${queryString}`, {
        method: 'GET',
      });
    },
    
    getById: (id) => 
      fetchWithConfig(`${BASE_URL}/api/items/${id}`, {
        method: 'GET',
      }),
      
    create: (itemData) => 
      fetchWithConfig(`${BASE_URL}/api/items`, {
        method: 'POST',
        body: JSON.stringify(itemData),
      }),
      
    update: (id, itemData) => 
      fetchWithConfig(`${BASE_URL}/api/items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(itemData),
      }),
      
    delete: (id) => 
      fetchWithConfig(`${BASE_URL}/api/items/${id}`, {
        method: 'DELETE',
      }),
      
    getByUser: (userId) => 
      fetchWithConfig(`${BASE_URL}/api/items/user/${userId}`, {
        method: 'GET',
      }),
      
    search: (query) => 
      fetchWithConfig(`${BASE_URL}/api/items/search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
      }),
      
    uploadImage: (formData) => 
      fetchWithConfig(`${BASE_URL}/api/items/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type when uploading files
          // Browser will set it with boundary for multipart/form-data
          'Content-Type': undefined,
        },
      }),
  },
  
  // Messages
  messages: {
    getConversations: () => 
      fetchWithConfig(`${BASE_URL}/api/messages/conversations`, {
        method: 'GET',
      }),
      
    getMessages: (conversationId) => 
      fetchWithConfig(`${BASE_URL}/api/messages/conversations/${conversationId}`, {
        method: 'GET',
      }),
      
    sendMessage: (data) => 
      fetchWithConfig(`${BASE_URL}/api/messages`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      
    markAsRead: (messageId) => 
      fetchWithConfig(`${BASE_URL}/api/messages/${messageId}/read`, {
        method: 'PUT',
      }),
  },
  
  // Users
  users: {
    getProfile: (userId) => 
      fetchWithConfig(`${BASE_URL}/api/users/${userId}`, {
        method: 'GET',
      }),
      
    updateProfile: (userData) => 
      fetchWithConfig(`${BASE_URL}/api/users/profile`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      }),
      
    getAll: () => 
      fetchWithConfig(`${BASE_URL}/api/users`, {
        method: 'GET',
      }),
  },
  
  // System
  system: {
    health: () => 
      fetchWithConfig(`${BASE_URL}/health`, {
        method: 'GET',
      }),
      
    ping: () => 
      fetchWithConfig(`${BASE_URL}/api/ping`, {
        method: 'GET',
      }),
  }
};

export default apiService;
=======
// Use redaxios which is a tiny axios-compatible API built on fetch
import axios from 'redaxios';
import apiConfig from '../config/api.config';

// Create an axios instance with base URL and default headers
const API_URL = apiConfig.apiUrl || 'https://tedlist.onrender.com/api';

console.log('API configuration:', {
  mode: apiConfig.apiMode,
  url: API_URL,
  client: 'redaxios' // Using redaxios instead of axios
});

// Create API instance with proper CORS headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  credentials: 'include', // Important for CORS with credentials
  mode: 'cors'
});

// Save original fetch for later use
const originalFetch = window.fetch;

// Request interceptor for adding auth token
const originalRequest = api.request;
api.request = (config) => {
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Add Authorization header if token exists
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Added token to request:', `Bearer ${token.substring(0, 15)}...`);
  } else {
    console.warn('No auth token found in localStorage');
  }
  
  return originalRequest(config);
};

// Configure fetch to include credentials
window.fetch = function(url, options = {}) {
  // Make sure credentials are included in all fetch requests
  options.credentials = 'include';
  
  // Add CORS mode
  options.mode = 'cors';
  
  // Add Authorization header if token exists
  const token = localStorage.getItem('token');
  if (token) {
    options.headers = options.headers || {};
    options.headers.Authorization = `Bearer ${token}`;
  }
  
  // If URL is relative and we have a base URL, prepend it
  if (url.startsWith('/') && API_URL) {
    url = API_URL + url;
  }
  
  console.log(`Fetch request to ${url}`, options);
  return originalFetch(url, options);
};

// Response handling
api.interceptors = {
  response: {
    use: (fulfilled, rejected) => {
      // Save the current modified fetch
      const currentFetch = window.fetch;
      
      window.fetch = async (...args) => {
        try {
          const response = await currentFetch(...args);
          const clonedResponse = response.clone();
          
          if (fulfilled && response.ok) {
            try {
              const data = await clonedResponse.json();
              console.log(`API Response: ${response.status} ${args[0]}`, data);
            } catch (e) {
              // Response might not be JSON
            }
          } else if (!response.ok) {
            console.error(`API Error Response: ${response.status} ${args[0]}`);
            
            // Handle 401 Unauthorized - redirect to login
            if (response.status === 401) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              // Only redirect if not already on login page
              if (window.location.pathname !== '/login') {
                window.location.href = '/login';
              }
            }
          }
          
          return response;
        } catch (error) {
          console.error('Response error:', error);
          
          if (rejected) {
            rejected(error);
          }
          
          throw error;
        }
      };
    }
  }
};

export default api;
>>>>>>> temp-branch
