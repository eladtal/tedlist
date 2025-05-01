// Get the API base URL from environment variables or use a default
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? 'https://tedlist-backend.onrender.com' : 'http://localhost:8000');

// WebSocket URL based on API base URL
export const WS_URL = API_BASE_URL.replace(/^http/, 'ws'); 