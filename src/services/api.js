import axios from 'axios';

// API base URL - points to your Render backend
const API_URL = 'https://tedlist-backend.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tedlist_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized errors (expired token, etc.)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('tedlist_token');
      // Optionally redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
