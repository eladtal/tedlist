/**
 * Temporary API service without Axios dependency
 * Use this until axios can be properly installed
 */

// Base API URL
const API_URL = 'https://tedlist-backend.onrender.com/api';

/**
 * Helper to get auth token
 */
const getToken = () => localStorage.getItem('tedlist_token');

/**
 * Basic fetch wrapper
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - Response data
 */
const fetchWrapper = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  // Add auth token if available
  const token = getToken();
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  
  // Add default headers
  options.headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  try {
    const response = await fetch(url, options);
    
    // Handle 401 unauthorized
    if (response.status === 401) {
      localStorage.removeItem('tedlist_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }
    
    // Parse JSON response
    const data = await response.json();
    
    // Check for API error
    if (!response.ok) {
      throw { 
        response: { 
          status: response.status, 
          data 
        },
        message: data.message || 'API error'
      };
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API request methods
export default {
  // GET request
  get: (endpoint, params = {}) => {
    // Convert params to URL query string
    const queryString = Object.keys(params).length > 0
      ? '?' + new URLSearchParams(params).toString()
      : '';
    
    return fetchWrapper(`${endpoint}${queryString}`, {
      method: 'GET'
    });
  },
  
  // POST request
  post: (endpoint, data) => {
    return fetchWrapper(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // PUT request
  put: (endpoint, data) => {
    return fetchWrapper(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  // DELETE request
  delete: (endpoint) => {
    return fetchWrapper(endpoint, {
      method: 'DELETE'
    });
  }
};
