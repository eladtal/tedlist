import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import TeddyBalance from './TeddyBalance';
import { ArrowLeftIcon, HeartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL } from '../config';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-hot-toast';

interface SwipeItem {
  _id: string;
  title: string;
  description: string;
  images: string[];
  condition: string;
  type: string;
  user: {
    name: string;
    _id: string;
  };
  teddyBonus: number;
}

interface SwipeResponse {
  success: boolean;
  isMatch: boolean;
  matchedUser?: string;
  matchedItemId?: string;
  teddyBonus: number;
}

const SwipeInterface: React.FC = () => {
  const { token } = useAuthStore();
  const [items, setItems] = useState<SwipeItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [teddies, setTeddies] = useState(0);
  const [showTeddyAnimation, setShowTeddyAnimation] = useState(false);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [matchedUser, setMatchedUser] = useState<string>('');
  const [teddyBonus, setTeddyBonus] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (token) {
        console.log('SwipeInterface mounted, token available');
        await fetchItems();
      } else {
        console.log('SwipeInterface mounted, no token available');
      }
    };
    init();
  }, [token]);

  const fetchItems = async () => {
    try {
      console.log('Fetching items with token:', token);
      const response = await axios.get(`${API_BASE_URL}/api/trading/items`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Raw response from /api/trading/items:', response.data);
      
      // The response is already an array of items
      const items = Array.isArray(response.data) ? response.data : [];
      console.log('Parsed items:', items);
      
      if (items.length === 0) {
        console.log('No items available for swiping');
        setItems([]);
        setLoading(false);
        return;
      }
      
      // Ensure all items have valid image URLs
      const processedItems = items.map(item => ({
        ...item,
        images: item.images.map((img: string) => 
          img.startsWith('http') ? img : `${API_BASE_URL}${img}`
        )
      }));
      
      console.log('Processed items:', processedItems);
      setItems(processedItems);
      setCurrentIndex(0); // Reset the index when new items are loaded
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      setItems([]);
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!items.length || currentIndex >= items.length) {
      console.log('No more items to swipe');
      return;
    }

    const currentItem = items[currentIndex];
    try {
      console.log('Swiping item:', currentItem._id, 'direction:', direction);
      const response = await axios.post<SwipeResponse>(
        `${API_BASE_URL}/api/trading/swipe`,
        {
          itemId: currentItem._id,
          direction
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Swipe response:', response.data);

      // Show teddy bonus animation
      setTeddyBonus(response.data.teddyBonus);
      setTeddies(prev => prev + response.data.teddyBonus);
      setShowTeddyAnimation(true);
      setTimeout(() => setShowTeddyAnimation(false), 3000);

      if (response.data.isMatch) {
        // Show match animation
        setMatchedUser(response.data.matchedUser || '');
        setShowMatchAnimation(true);
        setTimeout(() => setShowMatchAnimation(false), 5000);
      }

      // Move to next item
      const nextIndex = currentIndex + 1;
      console.log('Moving to next item, index:', nextIndex);
      setCurrentIndex(nextIndex);

      // If we're running low on items, fetch more
      if (nextIndex >= items.length - 3) {
        console.log('Running low on items, fetching more...');
        await fetchItems();
      }
    } catch (error) {
      console.error('Error recording swipe:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
    }
  };

  const handleResetSwipes = async () => {
    try {
      console.log('Resetting swipes...');
      await axios.post(
        `${API_BASE_URL}/api/trading/reset-swipes`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Fetch items again after reset
      await fetchItems();
      setCurrentIndex(0);
      toast.success('Swipes reset successfully!');
    } catch (error) {
      console.error('Error resetting swipes:', error);
      toast.error('Failed to reset swipes');
    }
  };

  if (loading) {
    console.log('SwipeInterface is loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!items.length || currentIndex >= items.length) {
    console.log('No items available or reached end of items');
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-4">No More Items</h2>
        <p className="text-gray-600 mb-6">Check back later for more items to trade!</p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleResetSwipes}
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
          >
            Reset Swipes
          </button>
          <button
            onClick={() => navigate('/trade/select')}
            className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
          >
            Back to Items
          </button>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];
  console.log('Rendering current item:', currentItem);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/trade/select')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-6 w-6 mr-2" />
              Back to Items
            </button>
            <div className="flex items-center space-x-4">
              <TeddyBalance balance={teddies} showAnimation={showTeddyAnimation} bonus={teddyBonus} />
              <Link
                to="/dashboard"
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {showMatchAnimation && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            >
              <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4">
                <h2 className="text-3xl font-bold mb-4">It's a Match! 🎉</h2>
                <p className="text-xl mb-4">{matchedUser} likes your item too!</p>
                <p className="text-blue-500 font-bold text-2xl mb-4">+{teddyBonus} Teddies!</p>
                <button
                  onClick={() => setShowMatchAnimation(false)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
                >
                  Keep Trading
                </button>
              </div>
            </motion.div>
          )}
          
          {currentItem && (
            <motion.div
              key={currentItem._id}
              className="max-w-lg mx-auto mt-8 bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="relative pb-[100%]">
                <img
                  src={currentItem.images[0]}
                  alt={currentItem.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = 'https://placehold.co/600x400/blue/white?text=No+Image';
                    }
                  }}
                />
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  +{currentItem.teddyBonus} Teddies
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{currentItem.title}</h2>
                <p className="text-gray-600 mb-4">{currentItem.description}</p>
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {currentItem.condition}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Posted by {currentItem.user.name}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
            onClick={() => handleSwipe('left')}
          >
            <XMarkIcon className="h-8 w-8" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-teal-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
            onClick={() => handleSwipe('right')}
          >
            <HeartIcon className="h-8 w-8" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SwipeInterface; 