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