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
      console.log('Fetching notifications with token:', token);
      
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
      
      console.log('Notifications response:', response.data);
      
      if (response.data?.success && Array.isArray(response.data.notifications)) {
        set({ notifications: response.data.notifications });
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

      const response = await axios.post(
        `${API_BASE_URL}/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
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
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
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
    console.log('Adding new notification:', notification);
    set(state => ({
      notifications: [notification, ...state.notifications]
    }));
    toast.success('New notification received!');
  },

  connectWebSocket: () => {
    try {
      // Prevent multiple connection attempts
      if (get().connectionStatus === 'connecting' || get().connectionStatus === 'connected') {
        console.log('Already connecting or connected, skipping connection attempt');
        return;
      }

      const token = useAuthStore.getState().token;
      console.log('Connecting WebSocket with token:', token ? 'present' : 'missing');
      
      if (!token) {
        console.error('No auth token found in store');
        return;
      }

      set({ connectionStatus: 'connecting', connectionAttempts: get().connectionAttempts + 1 });

      const wsUrl = `ws://localhost:8000/ws`;
      console.log('Attempting WebSocket connection to:', wsUrl);
      
      // Close existing socket if any
      const existingSocket = get().socket;
      if (existingSocket) {
        console.log('Closing existing socket connection');
        existingSocket.close(1000, 'New connection attempt');
      }
      
      const ws = new WebSocket(wsUrl);

      // Add connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.error('WebSocket connection timeout');
          ws.close();
          set({ 
            connectionStatus: 'disconnected',
            socket: null,
            connectionAttempts: get().connectionAttempts + 1
          });
          toast.error('Failed to connect to notification service (timeout)');
        }
      }, 5000);

      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket connection established, sending auth message');
        ws.send(JSON.stringify({
          type: 'authenticate',
          token: token
        }));
      };

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket connection closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          attempts: get().connectionAttempts
        });

        // Only update state if this is the current socket
        if (ws === get().socket) {
          set({ connectionStatus: 'disconnected', socket: null });
          
          // Only attempt reconnect for abnormal closures and if we haven't tried too many times
          if (event.code !== 1000 && event.code !== 1001 && get().connectionAttempts < 3) {
            console.log('Scheduling reconnection attempt');
            setTimeout(() => {
              // Double-check we're still disconnected before attempting reconnect
              if (get().connectionStatus === 'disconnected') {
                get().connectWebSocket();
              }
            }, 5000);
          } else if (get().connectionAttempts >= 3) {
            console.log('Maximum connection attempts reached');
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
        console.error('WebSocket error occurred:', error);
        // Only update state if this is the current socket
        if (ws === get().socket) {
          set({ 
            connectionStatus: 'disconnected',
            socket: null,
            connectionAttempts: get().connectionAttempts + 1
          });
          toast.error('Failed to connect to notification service');
        }
      };

      set({ socket: ws });
    } catch (error) {
      console.error('Error in WebSocket connection setup:', error);
      set({ 
        connectionStatus: 'disconnected',
        error: 'Failed to connect to notification service',
        socket: null,
        connectionAttempts: get().connectionAttempts + 1
      });
      toast.error('Failed to connect to notification service');
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
            toast.success('Connected to notification service');
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