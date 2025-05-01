import { useState } from 'react';
import { Menu } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useNotificationStore } from '../stores/notificationStore';
import { Notification } from '../types/notification';
import { useAuthStore } from '../stores/authStore';
import TradeDetailsModal from './TradeDetailsModal';
import { API_BASE_URL } from '../config';
import { toast } from 'react-hot-toast';

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  return imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}${imagePath}`;
};

const NotificationPanel = () => {
  const { notifications, loading, markAsRead } = useNotificationStore();
  const { token } = useAuthStore();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNotificationClick = async (notification: Notification) => {
    if (!token) {
      toast.error('Please log in to interact with notifications');
      return;
    }

    try {
      await markAsRead(notification._id);
      if (notification.type === 'offer') {
        setSelectedNotification(notification);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <Menu>
        <Menu.Button className="relative p-2 text-gray-400 hover:text-gray-500">
          <BellIcon className="h-6 w-6" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Menu.Button>

        <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`cursor-pointer p-4 hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    {notification.item && notification.item.images && notification.item.images[0] && (
                      <img
                        src={getImageUrl(notification.item.images[0])}
                        alt={notification.item.title}
                        className="h-12 w-12 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(notification.createdAt), 'MMM d, yyyy')}
                      </p>
                      {notification.item && (
                        <p className="text-xs text-gray-700 mt-1">
                          Item: {notification.item.title}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Menu.Items>
      </Menu>

      {selectedNotification && token && (
        <TradeDetailsModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          notification={selectedNotification}
          onResponseSubmitted={handleModalClose}
        />
      )}
    </div>
  );
};

export default NotificationPanel; 