import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

// Notification types
export const NOTIFICATION_TYPES = {
  TRADE_OFFER: 'trade_offer',
  TRADE_DECLINED: 'trade_declined',
  FEEDBACK_REQUEST: 'feedback_request',
  TRADE_ACCEPTED: 'trade_accepted',
  MESSAGE_RECEIVED: 'message_received',
  SYSTEM: 'system'
};

// Create notification context
export const NotificationContext = createContext();

// Hook for using notification context
export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load notifications when user changes
  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
    }
  }, [currentUser]);

  // Update unread count when notifications change
  useEffect(() => {
    if (notifications) {
      const count = notifications.filter(notif => !notif.read).length;
      setUnreadCount(count);
    }
  }, [notifications]);

  // Load notifications from localStorage
  const loadNotifications = () => {
    try {
      setLoading(true);
      
      const notificationsData = localStorage.getItem('tedlistNotifications');
      let userNotifications = [];
      
      if (notificationsData) {
        const allNotificationsData = JSON.parse(notificationsData);
        userNotifications = allNotificationsData[currentUser.id] || [];
      }
      
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save notifications to localStorage
  const saveNotifications = (newNotifications) => {
    try {
      const notificationsData = localStorage.getItem('tedlistNotifications');
      let allNotificationsData = {};
      
      if (notificationsData) {
        allNotificationsData = JSON.parse(notificationsData);
      }
      
      allNotificationsData[currentUser.id] = newNotifications;
      
      localStorage.setItem('tedlistNotifications', JSON.stringify(allNotificationsData));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  // Add a new notification
  const addNotification = (notification) => {
    if (!currentUser) return null;
    
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    const newNotifications = [newNotification, ...notifications];
    setNotifications(newNotifications);
    saveNotifications(newNotifications);
    
    return newNotification;
  };

  // Add a trade offer notification
  const addTradeOfferNotification = (fromUser, userItem, theirItem) => {
    return addNotification({
      type: NOTIFICATION_TYPES.TRADE_OFFER,
      fromUser,
      userItem,
      theirItem,
      actionTaken: false,
      action: null
    });
  };

  // Add a trade declined notification with optional feedback request
  const addTradeDeclinedNotification = (fromUser, userItem, theirItem) => {
    return addNotification({
      type: NOTIFICATION_TYPES.TRADE_DECLINED,
      fromUser,
      userItem,
      theirItem,
      actionTaken: false,
      action: null,
      feedbackRequested: false
    });
  };

  // Add a feedback request notification
  const addFeedbackRequestNotification = (fromUser, userItem, theirItem, tradeId) => {
    return addNotification({
      type: NOTIFICATION_TYPES.FEEDBACK_REQUEST,
      fromUser,
      userItem,
      theirItem,
      tradeId,
      actionTaken: false,
      action: null
    });
  };

  // Mark a notification as read
  const markAsRead = (notificationId) => {
    const newNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });
    
    setNotifications(newNotifications);
    saveNotifications(newNotifications);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const newNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(newNotifications);
    saveNotifications(newNotifications);
  };

  // Update a notification's action
  const updateNotificationAction = (notificationId, action) => {
    const newNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return { 
          ...notification, 
          actionTaken: true,
          action,
          actionTimestamp: new Date().toISOString()
        };
      }
      return notification;
    });
    
    setNotifications(newNotifications);
    saveNotifications(newNotifications);
  };

  // Request feedback for a declined trade
  const requestFeedback = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    
    if (!notification || notification.type !== NOTIFICATION_TYPES.TRADE_DECLINED) {
      return { success: false, message: 'Invalid notification' };
    }
    
    const newNotifications = notifications.map(n => {
      if (n.id === notificationId) {
        return {
          ...n,
          feedbackRequested: true,
          feedbackRequestTimestamp: new Date().toISOString()
        };
      }
      return n;
    });
    
    setNotifications(newNotifications);
    saveNotifications(newNotifications);
    
    return { success: true, notification };
  };

  // Remove a notification
  const removeNotification = (notificationId) => {
    const newNotifications = notifications.filter(n => n.id !== notificationId);
    setNotifications(newNotifications);
    saveNotifications(newNotifications);
  };

  // Get all unread notifications
  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.read);
  };

  // Get all trade offer notifications that require action
  const getPendingTradeOffers = () => {
    return notifications.filter(
      notification => notification.type === NOTIFICATION_TYPES.TRADE_OFFER && !notification.actionTaken
    );
  };

  // Get all feedback request notifications that require action
  const getPendingFeedbackRequests = () => {
    return notifications.filter(
      notification => notification.type === NOTIFICATION_TYPES.FEEDBACK_REQUEST && !notification.actionTaken
    );
  };

  // Value object for context consumers
  const value = {
    notifications,
    unreadCount,
    loading,
    addNotification,
    addTradeOfferNotification,
    addTradeDeclinedNotification,
    addFeedbackRequestNotification,
    markAsRead,
    markAllAsRead,
    updateNotificationAction,
    requestFeedback,
    removeNotification,
    getUnreadNotifications,
    getPendingTradeOffers,
    getPendingFeedbackRequests,
    NOTIFICATION_TYPES
  };

  return (
    <NotificationContext.Provider value={value}>
      {!loading && children}
    </NotificationContext.Provider>
  );
};
