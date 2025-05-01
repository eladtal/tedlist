import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { API_BASE_URL } from '../config';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-hot-toast';

interface Notification {
  _id: string;
  type: 'like' | 'match' | 'response';
  message: string;
  read: boolean;
  createdAt: string;
  itemId: {
    _id: string;
    title: string;
    images: string[];
  };
  fromUserId: {
    _id: string;
    name: string;
  };
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setNotifications(notifications.map(notification =>
        notification._id === notificationId
          ? { ...notification, read: true }
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleAcceptTrade = async (notification: Notification) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/trading/accept`,
        {
          itemId: notification.itemId._id,
          fromUserId: notification.fromUserId._id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      toast.success('Trade request accepted!');
      // Remove this notification from the list
      setNotifications(notifications.filter(n => n._id !== notification._id));
    } catch (error) {
      console.error('Error accepting trade:', error);
      toast.error('Failed to accept trade');
    }
  };

  const handleDeclineTrade = async (notification: Notification) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/trading/decline`,
        {
          itemId: notification.itemId._id,
          fromUserId: notification.fromUserId._id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      toast.success('Trade request declined');
      // Remove this notification from the list
      setNotifications(notifications.filter(n => n._id !== notification._id));
    } catch (error) {
      console.error('Error declining trade:', error);
      toast.error('Failed to decline trade');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'match':
        return '🤝';
      case 'response':
        return '💬';
      default:
        return '📬';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>
        
        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-lg shadow p-4 transition duration-150 ease-in-out ${
                  !notification.read ? 'border-l-4 border-blue-500' : ''
                }`}
                onClick={() => !notification.read && markAsRead(notification._id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    
                    {/* Item Preview */}
                    {notification.itemId && (
                      <div className="mt-3 flex items-center space-x-3 bg-gray-50 p-2 rounded-md">
                        {notification.itemId.images && notification.itemId.images[0] && (
                          <img
                            src={notification.itemId.images[0].startsWith('http') 
                              ? notification.itemId.images[0] 
                              : `${API_BASE_URL}${notification.itemId.images[0]}`}
                            alt={notification.itemId.title}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {notification.itemId.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            From: {notification.fromUserId.name}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {notification.type === 'like' && (
                      <div className="mt-3 flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptTrade(notification);
                          }}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
                        >
                          Accept Trade
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeclineTrade(notification);
                          }}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                        >
                          Decline
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/chat/${notification.fromUserId._id}`);
                          }}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                        >
                          Message
                        </button>
                      </div>
                    )}

                    {!notification.read && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications; 