import { Socket } from 'socket.io-client';

export interface User {
  _id: string;
  name: string;
  avatar?: string;
}

export interface Item {
  _id: string;
  title: string;
  images: string[];
  description?: string;
  condition?: string;
}

export interface Notification {
  _id: string;
  type: 'offer' | 'match' | 'message' | 'system';
  title: string;
  message: string;
  user: User;
  fromUser: User;
  item: Item;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStore {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  socket: WebSocket | null;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  connectionAttempts: number;
  
  fetchNotifications(): Promise<void>;
  markAllAsRead(): Promise<void>;
  markAsRead(notificationId: string): Promise<void>;
  addNotification(notification: Notification): void;
  connectWebSocket(): void;
  disconnectWebSocket(): void;
  handleSocketMessage(event: MessageEvent): void;
} 