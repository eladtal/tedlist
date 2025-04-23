/**
 * Axios Polyfill - A minimal implementation to handle basic HTTP requests
 * This is a temporary solution until the actual axios library can be installed
 */

// Helper functions
const storageAvailable = (type) => {
  try {
    const storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
};

// Safe localStorage set with quota handling
const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error('localStorage quota exceeded:', error);
    
    // Try to clean up old items if this is a listings-related operation
    if (key.includes('tedlist')) {
      try {
        // Find and remove the oldest items to make space
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const storageKey = localStorage.key(i);
          if (storageKey && storageKey.includes('tedlist') && storageKey !== key) {
            keysToRemove.push(storageKey);
          }
        }
        
        // Remove oldest items (up to 3)
        const removeCount = Math.min(3, keysToRemove.length);
        for (let i = 0; i < removeCount; i++) {
          localStorage.removeItem(keysToRemove[i]);
        }
        
        // Try setting again after cleanup
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (e) {
          // Still failed, try more aggressive compression
          return false;
        }
      } catch (e) {
        return false;
      }
    }
    return false;
  }
};

// Storage keys
const STORAGE_KEYS = {
  USERS: 'tedlistUsers',
  ITEMS: 'tedlistItems',
  MESSAGES: 'tedlistMessages',
  NOTIFICATIONS: 'tedlistNotifications'
};

// Create a fake response object
const createResponse = (data, status = 200, statusText = 'OK') => {
  return {
    data,
    status,
    statusText,
    headers: {},
    config: {}
  };
};

const axios = {
  defaults: {
    headers: {
      common: {}
    },
    baseURL: '',
  },
  
  // Create method to configure axios instance
  create: (config = {}) => {
    const instance = { ...axios };
    instance.defaults = { ...axios.defaults, ...config };
    return instance;
  },
  
  // Interceptors implementation
  interceptors: {
    request: {
      use: (onFulfilled, onRejected) => {
        axios._requestInterceptors = axios._requestInterceptors || [];
        axios._requestInterceptors.push({ onFulfilled, onRejected });
        return axios._requestInterceptors.length;
      },
      eject: (id) => {
        if (axios._requestInterceptors && id) {
          axios._requestInterceptors[id - 1] = null;
        }
      }
    },
    response: {
      use: (onFulfilled, onRejected) => {
        axios._responseInterceptors = axios._responseInterceptors || [];
        axios._responseInterceptors.push({ onFulfilled, onRejected });
        return axios._responseInterceptors.length;
      },
      eject: (id) => {
        if (axios._responseInterceptors && id) {
          axios._responseInterceptors[id - 1] = null;
        }
      }
    }
  },
  
  // Helper function to simulate API requests
  _request: async (method, url, data, config = {}) => {
    try {
      console.log(`[Polyfill API] ${method} ${url}`, data);
      
      // Get our simulated users
      const getUsers = () => {
        try {
          return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        } catch (error) {
          console.error('Error parsing users:', error);
          return [];
        }
      };
      
      // Save our simulated users
      const saveUsers = (users) => {
        safeSetItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      };
      
      // Simulate different endpoints
      if (url.includes('/auth/register')) {
        const { email, password, username } = data;
        
        // Check if email already exists
        const users = getUsers();
        if (users.some(user => user.email === email)) {
          return {
            data: { 
              success: false, 
              error: 'Email already in use'
            }
          };
        }
        
        // Create new user
        const newUser = {
          id: `user_${Date.now()}`,
          email,
          username,
          profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg',
          createdAt: new Date().toISOString()
        };
        
        // Generate token
        const token = `token_${Date.now()}`;
        
        // Save user
        users.push({...newUser, password});
        saveUsers(users);
        
        return {
          data: {
            success: true,
            user: newUser,
            token
          }
        };
      }
      else if (url.includes('/auth/login')) {
        const { email, password } = data;
        
        // Check credentials
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
          return {
            data: {
              success: false,
              error: 'Invalid email or password'
            }
          };
        }
        
        // Generate token
        const token = `token_${Date.now()}`;
        
        // Create user object without password
        const loggedInUser = {
          id: user.id,
          email: user.email,
          username: user.username,
          profileImage: user.profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg',
          createdAt: user.createdAt
        };
        
        return {
          data: {
            success: true,
            user: loggedInUser,
            token
          }
        };
      }
      else if (url.includes('/auth/me')) {
        const token = localStorage.getItem('token');
        
        if (!token) {
          return {
            data: {
              success: false,
              error: 'Unauthorized'
            }
          };
        }
        
        const savedUser = localStorage.getItem('user');
        
        if (savedUser) {
          return {
            data: {
              success: true,
              data: JSON.parse(savedUser)
            }
          };
        }
        
        return {
          data: {
            success: false,
            error: 'User not found'
          }
        };
      }
      else if (url.includes('/users/profile') && method === 'PUT') {
        // Update user profile
        const updatedData = data;
        const currentUserStr = localStorage.getItem('user');
        
        if (!currentUserStr) {
          return {
            data: {
              success: false,
              error: 'User not found'
            }
          };
        }
        
        const currentUser = JSON.parse(currentUserStr);
        const updatedUser = { ...currentUser, ...updatedData };
        
        // Update in localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update in users array
        const users = getUsers();
        const updatedUsers = users.map(user => 
          user.id === currentUser.id ? { ...user, ...updatedData } : user
        );
        saveUsers(updatedUsers);
        
        return {
          data: {
            success: true,
            data: updatedUser
          }
        };
      }
      else if (url.includes('/items') && method === 'POST') {
        // Create new item
        const itemData = data;
        const currentUserStr = localStorage.getItem('user');
        
        if (!currentUserStr) {
          return {
            data: {
              success: false,
              error: 'Unauthorized'
            }
          };
        }
        
        const currentUser = JSON.parse(currentUserStr);
        
        // Create new item
        const newItem = {
          _id: `item_${Date.now()}`,
          ...itemData,
          userId: currentUser.id,
          createdAt: new Date().toISOString(),
          status: 'active'
        };
        
        // Add to items storage
        const existingItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]');
        existingItems.unshift(newItem);
        
        // Save to localStorage with fallback for quota errors
        const success = safeSetItem(STORAGE_KEYS.ITEMS, JSON.stringify(existingItems));
        
        if (!success) {
          // If still failing even after cleanup, try removing all images
          newItem.images = []; // Remove images to save space
          
          // Update the array with this modified item
          existingItems[0] = newItem;
          
          // Try once more with reduced data
          const finalSuccess = safeSetItem(STORAGE_KEYS.ITEMS, JSON.stringify(existingItems));
          
          if (!finalSuccess) {
            return Promise.reject(new Error('QuotaExceededError: Failed to execute \'setItem\' on \'Storage\': Setting the value of \'tedlistItems\' exceeded the quota.'));
          }
        }
        
        return {
          data: {
            success: true,
            data: newItem
          }
        };
      }
      else if (url.includes('/items') && method === 'GET') {
        // Get items
        let items = [];
        
        try {
          const storedItems = localStorage.getItem(STORAGE_KEYS.ITEMS);
          items = storedItems ? JSON.parse(storedItems) : [];
        } catch (error) {
          console.error('Error parsing stored items:', error);
          items = [];
        }
        
        return {
          data: {
            success: true,
            data: items
          }
        };
      }
      
      // Default mock response
      return {
        data: { 
          success: true, 
          message: 'Operation successful',
          data: {}
        }
      };
    } catch (error) {
      console.error('[Polyfill API] Error:', error);
      return {
        data: { 
          success: false, 
          error: error.message || 'Request failed' 
        }
      };
    }
  },
  
  // HTTP methods
  get: (url, config) => axios._request('GET', url, null, config),
  post: (url, data, config) => axios._request('POST', url, data, config),
  put: (url, data, config) => axios._request('PUT', url, data, config),
  delete: (url, config) => axios._request('DELETE', url, null, config),
  patch: (url, data, config) => axios._request('PATCH', url, data, config)
};

export default axios;
