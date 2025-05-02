import { create } from 'zustand';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Notification, NotificationStore } from '../types/notification';
import { toast } from 'react-hot-toast';
import { useAuthStore } from './authStore';

const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  loading: false,
  socket: null,
  error: null,
  connectionStatus: 'disconnected' as 'connected' | 'disconnected' | 'connecting',
  connectionAttempts: 0,

  fetchNotifications: async () => {
    try {
      const token = useAuthStore.getState().token;
      
      if (!token) {
        console.error('No auth token found in store');
        return;
      }

      set({ loading: true, error: null });
      const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data?.success && Array.isArray(response.data.notifications)) {
        // Transform and validate notifications
        const validNotifications = response.data.notifications
          .filter((notification: any) => {
            const hasId = notification && (notification._id || notification.user);
            if (!hasId) {
              console.error('Invalid notification structure:', notification);
            }
            return hasId;
          })
          .map((notification: any) => ({
            ...notification,
            _id: (notification._id || notification.user).toString() // Ensure _id is always a string
          }));
        
        set({ notifications: validNotifications });
      } else {
        console.error('Invalid notification data format:', response.data);
        set({ error: 'Invalid notification data format' });
      }
    } catch (error: any) {
      console.error('Error fetching notifications:', error.response || error);
      set({ error: 'Failed to fetch notifications' });
      if (error.response?.status === 401) {
        toast.error('Please log in again to view notifications');
      }
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        console.error('No auth token found in store');
        return;
      }

      if (!notificationId) {
        console.error('No notification ID provided');
        toast.error('Invalid notification');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/notifications/mark-read`,
        { notificationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        set(state => ({
          notifications: state.notifications.map(notification =>
            notification._id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        }));
      } else {
        throw new Error(response.data.message || 'Failed to mark notification as read');
      }
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      toast.error(error.response?.data?.message || 'Failed to mark notification as read');
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        console.error('No auth token found in store');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/notifications/mark-all-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        set(state => ({
          notifications: state.notifications.map(notification => ({
            ...notification,
            read: true
          }))
        }));
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  },

  addNotification: (notification: Notification) => {
    if (!notification) {
      console.error('Invalid notification data:', notification);
      return;
    }

    // Transform notification to ensure it has _id as string
    const transformedNotification = {
      ...notification,
      _id: (notification._id || notification.user).toString() // Ensure _id is always a string
    };

    if (!transformedNotification._id) {
      console.error('Invalid notification data - no ID or user:', notification);
      return;
    }
    
    set(state => ({
      notifications: [transformedNotification, ...state.notifications]
    }));
    toast.success('New notification received!');
  },

  connectWebSocket: () => {
    try {
      // Prevent multiple connection attempts
      if (get().connectionStatus === 'connecting' || get().connectionStatus === 'connected') {
        return;
      }

      const token = useAuthStore.getState().token;
      
      if (!token) {
        console.error('No auth token found in store');
        return;
      }

      set({ connectionStatus: 'connecting', connectionAttempts: get().connectionAttempts + 1 });

      // Determine WebSocket URL based on API_BASE_URL
      const wsProtocol = API_BASE_URL.startsWith('https') ? 'wss' : 'ws';
      const wsUrl = `${wsProtocol}://${API_BASE_URL.split('://')[1]}/ws`;
      
      // Close existing socket if any
      const existingSocket = get().socket;
      if (existingSocket) {
        existingSocket.close(1000, 'New connection attempt');
      }
      
      const ws = new WebSocket(wsUrl);

      // Add connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          ws.close();
          set({ 
            connectionStatus: 'disconnected',
            socket: null,
            connectionAttempts: get().connectionAttempts + 1
          });
        }
      }, 5000);

      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        ws.send(JSON.stringify({
          type: 'authenticate',
          token: token
        }));
      };

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        
        // Only update state if this is the current socket
        if (ws === get().socket) {
          set({ connectionStatus: 'disconnected', socket: null });
          
          // Only attempt reconnect for abnormal closures and if we haven't tried too many times
          if (event.code !== 1000 && event.code !== 1001 && get().connectionAttempts < 3) {
            setTimeout(() => {
              // Double-check we're still disconnected before attempting reconnect
              if (get().connectionStatus === 'disconnected') {
                get().connectWebSocket();
              }
            }, 5000);
          } else if (get().connectionAttempts >= 3) {
            set({ connectionAttempts: 0 }); // Reset attempts counter
          }
        }
      };

      ws.onmessage = (event) => {
        // Only process messages if this is the current socket
        if (ws === get().socket) {
          get().handleSocketMessage(event);
        }
      };

      ws.onerror = (error) => {
        // Only update state if this is the current socket
        if (ws === get().socket) {
          console.error('WebSocket error:', error);
          set({ 
            connectionStatus: 'disconnected',
            socket: null,
            connectionAttempts: get().connectionAttempts + 1
          });
        }
      };

      set({ socket: ws });
    } catch (error) {
      console.error('Error in notification store:', error);
      set({ error: 'Failed to connect to notification service' });
    }
  },

  disconnectWebSocket: () => {
    const { socket } = get();
    if (socket) {
      console.log('Disconnecting WebSocket');
      socket.close(1000, 'Normal closure');
      set({ 
        socket: null,
        connectionStatus: 'disconnected',
        connectionAttempts: 0
      });
    }
  },

  handleSocketMessage: (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);

      switch (data.type) {
        case 'notification':
          get().addNotification(data.data);
          break;
        case 'connection_status':
          console.log('WebSocket connection status:', data.data);
          if (data.data?.connected) {
            set({ 
              connectionStatus: 'connected',
              connectionAttempts: 0 // Reset attempts on successful connection
            });
          }
          break;
        case 'ping':
          const socket = get().socket;
          if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'pong' }));
          }
          break;
        case 'pong':
          console.log('Received pong from server');
          break;
        case 'error':
          console.error('WebSocket error:', data.message);
          set({ connectionStatus: 'disconnected' });
          toast.error(data.message);
          break;
        default:
          console.warn('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling socket message:', error);
    }
  }
}));

export { useNotificationStore }; 