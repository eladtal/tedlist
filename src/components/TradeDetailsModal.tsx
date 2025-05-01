import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { Notification } from '../types/notification';

interface TradeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification;
  onResponseSubmitted: () => void;
}

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  return imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}${imagePath}`;
};

const TradeDetailsModal: React.FC<TradeDetailsModalProps> = ({
  isOpen,
  onClose,
  notification,
  onResponseSubmitted
}) => {
  const { token } = useAuthStore();

  const handleResponse = async (accept: boolean) => {
    try {
      const endpoint = accept ? 'accept' : 'decline';
      await axios.post(
        `${API_BASE_URL}/api/trading/${endpoint}`,
        {
          itemId: notification.item._id,
          fromUserId: notification.fromUser._id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success(accept ? 'Trade accepted!' : 'Trade declined');
      onResponseSubmitted();
      onClose();
    } catch (error) {
      console.error('Error responding to trade:', error);
      toast.error('Failed to respond to trade request');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-xl bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Trade Request Details
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center space-x-4">
              {notification.fromUser.avatar ? (
                <img
                  src={getImageUrl(notification.fromUser.avatar)}
                  alt={notification.fromUser.name}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xl text-gray-500">
                    {notification.fromUser.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {notification.fromUser.name}
                </h3>
                <p className="text-sm text-gray-500">
                  wants to trade with you
                </p>
              </div>
            </div>

            {/* Item Details */}
            <div className="flex items-start space-x-4">
              {notification.item.images && notification.item.images[0] && (
                <img
                  src={getImageUrl(notification.item.images[0])}
                  alt={notification.item.title}
                  className="h-24 w-24 object-cover rounded-lg"
                />
              )}
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  {notification.item.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {notification.item.description}
                </p>
                {notification.item.condition && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                    {notification.item.condition}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => handleResponse(true)}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Accept Trade
              </button>
              <button
                onClick={() => handleResponse(false)}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TradeDetailsModal; 