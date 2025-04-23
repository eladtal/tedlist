/**
 * Socket.IO Polyfill - A minimal implementation to handle real-time communication
 * This is a temporary solution until the actual socket.io-client library can be installed
 */

// Mock implementation of Socket.IO client
const io = (url, options = {}) => {
  const socket = {
    id: `socket_${Date.now()}`,
    connected: false,
    disconnected: true,
    
    // Event listeners
    _listeners: {},
    
    // Connect to server
    connect: function() {
      if (this.disconnected) {
        this.connected = true;
        this.disconnected = false;
        this._emit('connect');
        console.log(`Socket connected to ${url}`);
        return this;
      }
      return this;
    },
    
    // Disconnect from server
    disconnect: function() {
      if (this.connected) {
        this.connected = false;
        this.disconnected = true;
        this._emit('disconnect');
        console.log('Socket disconnected');
      }
      return this;
    },
    
    // Register event listeners
    on: function(event, callback) {
      if (!this._listeners[event]) {
        this._listeners[event] = [];
      }
      this._listeners[event].push(callback);
      return this;
    },
    
    // Remove event listeners
    off: function(event, callback) {
      if (this._listeners[event]) {
        if (callback) {
          this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
        } else {
          delete this._listeners[event];
        }
      }
      return this;
    },
    
    // Emit events to server
    emit: function(event, ...args) {
      console.log(`Socket emitting '${event}'`, ...args);
      
      // Simulate message echo if it's a chat message
      if (event === 'message' && args[0]) {
        // Simulate response after a small delay
        setTimeout(() => {
          this._emit('message', {
            ...args[0],
            id: `msg_${Date.now()}`,
            sender: args[0].sender,
            received: true,
            timestamp: new Date().toISOString()
          });
        }, 500);
      }
      
      return this;
    },
    
    // Internal method to trigger events
    _emit: function(event, ...args) {
      if (this._listeners[event]) {
        this._listeners[event].forEach(callback => {
          try {
            callback(...args);
          } catch (err) {
            console.error(`Error in '${event}' listener:`, err);
          }
        });
      }
      return this;
    }
  };
  
  // Auto-connect if autoConnect option is not explicitly set to false
  if (options.autoConnect !== false) {
    setTimeout(() => socket.connect(), 100);
  }
  
  return socket;
};

export default io;
