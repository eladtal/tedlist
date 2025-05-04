import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuthStore } from '../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { HiOutlineThumbUp, HiOutlineThumbDown } from 'react-icons/hi';

interface Item {
  id: string;
  title: string;
  description: string;
  condition: string;
  images: string[];
  type: 'trade' | 'sell';
  userId: string;
}

// Placeholder component to avoid repeated error messages
const ItemImage = ({ src, alt }: { src: string; alt: string }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Pre-validate the image URL
  const isValidImageUrl = (url: string) => {
    return url && 
           typeof url === 'string' && 
           url.startsWith(API_BASE_URL) && 
           url.includes('/uploads/');
  };

  // If the URL is invalid, don't even try to load it
  if (!isValidImageUrl(src)) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <span className="text-gray-400">Image Not Available</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <span className="text-gray-400">Image Not Found</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-100">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
};

export default function Swipe() {
  const [items, setItems] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/items/available`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const items = response.data;
        console.log('Items from response:', items);
        setItems(items);
        
        if (items.length === 0) {
          toast('No items available for swiping yet! 🔍');
        }
      } catch (err: any) {
        console.error('Error fetching items:', err);
        const errorMsg = err.response?.data?.error || 'Failed to load items';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchItems();
    } else {
      setError('Please log in to view items');
      setLoading(false);
    }
  }, [token]);

  const handleSwipe = async (liked: boolean) => {
    if (currentIndex >= items.length) return;

    const currentItem = items[currentIndex];
    
    try {
      // TODO: Implement the actual like/dislike API call here
      if (liked) {
        toast.success('Liked! 👍');
        // await axios.post(`${API_BASE_URL}/api/trading/like/${currentItem.id}`);
      } else {
        toast('Maybe next time! 👎');
        // await axios.post(`${API_BASE_URL}/api/trading/dislike/${currentItem.id}`);
      }
      
      // Move to next item
      setCurrentIndex(prev => prev + 1);
      
      // If we've reached the end, show a message
      if (currentIndex === items.length - 1) {
        toast('No more items to show! Check back later 🎉');
      }
    } catch (err) {
      console.error('Error processing swipe:', err);
      toast.error('Failed to process your choice. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-8">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">No Items Available</h2>
          <p className="text-gray-600 mb-6">
            There are no items available for swiping right now. Check back later or add more items!
          </p>
          <Link
            to="/submit"
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Add Your First Item
          </Link>
        </div>
      </div>
    );
  }

  // If we've swiped through all items
  if (currentIndex >= items.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-8">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">You're All Caught Up!</h2>
          <p className="text-gray-600 mb-6">
            You've seen all available items. Check back later for more!
          </p>
          <Link
            to="/submit"
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Add Your Own Item
          </Link>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Find Your Match</h1>
          <p className="text-gray-600">Item {currentIndex + 1} of {items.length}</p>
        </div>

        {/* Current Item Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="relative h-64">
              <ItemImage
                src={currentItem.images?.[0] || ''}
                alt={currentItem.title}
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{currentItem.title}</h3>
              <p className="text-gray-600 mb-4">{currentItem.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-purple-600">
                  Condition: {currentItem.condition}
                </span>
                <span className="text-sm font-medium text-pink-600">
                  {currentItem.type === 'trade' ? 'For Trade' : 'For Sale'}
                </span>
              </div>

              {/* Swipe Controls */}
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => handleSwipe(false)}
                  className="p-4 bg-red-100 rounded-full text-red-500 hover:bg-red-200 transition-colors"
                >
                  <HiOutlineThumbDown className="w-8 h-8" />
                </button>
                <button
                  onClick={() => handleSwipe(true)}
                  className="p-4 bg-green-100 rounded-full text-green-500 hover:bg-green-200 transition-colors"
                >
                  <HiOutlineThumbUp className="w-8 h-8" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 