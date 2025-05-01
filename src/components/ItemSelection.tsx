import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore';
import { API_BASE_URL } from '../config';

interface Item {
  _id: string;
  title: string;
  description: string;
  images: string[];
  condition: string;
  type: string;
}

const ItemSelection: React.FC = () => {
  const { token } = useAuthStore();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        console.log('Fetching user items with token:', token);
        const response = await axios.get(`${API_BASE_URL}/api/items/user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Raw response from /api/items/user:', response.data);
        
        // Filter only items that are available for trading
        const tradeItems = response.data.items.filter((item: Item) => item.type === 'trade');
        console.log('Filtered trade items:', tradeItems);
        
        setItems(tradeItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        if (axios.isAxiosError(error)) {
          console.error('Response data:', error.response?.data);
          console.error('Response status:', error.response?.status);
        }
        setLoading(false);
      }
    };

    if (token) {
      console.log('Token available, fetching items...');
      fetchUserItems();
    } else {
      console.log('No token available');
    }
  }, [token]);

  const handleItemSelect = async (itemId: string) => {
    try {
      console.log('Starting trade session for item:', itemId);
      // Store the selected item in the session/state management
      const response = await axios.post(`${API_BASE_URL}/api/trading/start`, { 
        itemId 
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Trade session response:', response.data);
      
      // Navigate to the swiping page
      console.log('Navigating to swipe page...');
      navigate('/trade/swipe');
    } catch (error) {
      console.error('Error starting trade session:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Choose an Item to Trade</h1>
            <div className="flex items-center space-x-4">
              <Link
                to="/submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Add New Item
              </Link>
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
        <div className="max-w-4xl mx-auto">
          {items.length === 0 ? (
            <div className="text-center bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-4">No Items Available for Trading</h2>
              <p className="text-gray-600 mb-6">Add your first item to start trading!</p>
              <Link
                to="/submit"
                className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors inline-flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Upload Your First Item
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6 text-center">
                Select an item you'd like to trade. You can add more items anytime.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <motion.div
                    key={item._id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer
                      ${selectedItem === item._id ? 'ring-2 ring-blue-500' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedItem(item._id);
                      handleItemSelect(item._id);
                    }}
                  >
                    <div className="relative h-48 w-full bg-gray-100">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0].startsWith('/uploads/') ? `${API_BASE_URL}${item.images[0]}` : item.images[0]}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            // Only try to set fallback once to prevent infinite loop
                            const target = e.target as HTMLImageElement;
                            if (!target.dataset.fallback) {
                              target.dataset.fallback = 'true';
                              target.src = '/placeholder-image.png';
                            }
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.condition}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemSelection; 