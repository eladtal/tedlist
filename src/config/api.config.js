/**
 * API Configuration
 * 
 * This file centralizes API configuration and makes it easy to switch
 * between development, production, and polyfill environments.
 */

// API modes
export const API_MODES = {
  POLYFILL: 'polyfill',  // Uses our polyfill implementation (localStorage)
  LOCAL: 'local',        // Uses a locally running backend server
  PRODUCTION: 'production' // Uses a deployed backend server
};

// Current API mode - set to PRODUCTION to use deployed backend
export const CURRENT_API_MODE = API_MODES.PRODUCTION;

// API configuration based on mode
export const API_CONFIG = {
  [API_MODES.POLYFILL]: {
    apiMode: API_MODES.POLYFILL,
    apiUrl: null, // No real API URL for polyfill
    socketUrl: null // No real socket URL for polyfill
  },
  [API_MODES.LOCAL]: {
    apiMode: API_MODES.LOCAL,
    apiUrl: 'http://localhost:5000/api',
    socketUrl: 'http://localhost:5000'
  },
  [API_MODES.PRODUCTION]: {
    apiMode: API_MODES.PRODUCTION,
    apiUrl: 'https://tedlist.onrender.com/api',
    socketUrl: 'https://tedlist.onrender.com'
  }
};

// Export the configuration for the current mode
const currentConfig = API_CONFIG[CURRENT_API_MODE];

if (!currentConfig) {
  console.error(`Invalid API mode: ${CURRENT_API_MODE}`);
}

export default currentConfig;