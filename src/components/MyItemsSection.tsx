import { useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getImageUrl } from '../utils/imageUtils';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export interface Item {
  _id: string;
  title: string;
  description: string;
  images: string[];
  condition: string;
  status: string;
  userId: string;
  type: 'trade' | 'sell';
  createdAt: string;
}

interface MyItemsSectionProps {
  items: Item[];
  onDelete?: (item: Item) => void;
  showTradeButton?: boolean;
}

export default function MyItemsSection({ items, onDelete, showTradeButton }: MyItemsSectionProps) {
  const tradeItems = items.filter(item => item.type === 'trade');
  const sellItems = items.filter(item => item.type === 'sell');
  const navigate = useNavigate();
  const { token } = useAuthStore();
  
  console.log('MyItemsSection props:', { 
    itemsCount: items.length, 
    tradeItemsCount: tradeItems.length, 
    showTradeButton, 
    tradeItemsStatuses: tradeItems.map(item => item.status)
  });

  const handleTradeItem = async (item: Item) => {
    try {
      // Start the trading session with this item
      await axios.post(`${API_BASE_URL}/api/trading/start`, { 
        itemId: item._id 
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Navigate to the swiping interface
      navigate('/trade/swipe');
    } catch (error) {
      console.error('Error starting trade session:', error);
      toast.error('Failed to start trading. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Trade Items Section */}
      {tradeItems.length > 0 && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {tradeItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden w-full flex flex-col items-center p-2"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {item.images && item.images[0] && (
                    <img
                      src={getImageUrl(item.images[0])}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                <div className="w-full mt-2">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-medium text-gray-900 truncate text-center">{item.title}</h4>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2 text-center">{item.description}</p>
                    </div>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="ml-2 text-gray-400 hover:text-gray-500 flex-shrink-0"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      item.status === 'active' ? 'bg-green-100 text-green-800' :
                      item.status === 'traded' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                  {showTradeButton && (
                    <button
                      onClick={() => handleTradeItem(item)}
                      className="mt-2 block w-full text-center rounded-md bg-[#69db7c] py-1 text-xs text-white font-medium hover:bg-[#51cf66] transition-colors"
                    >
                      Trade this item
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sell Items Section */}
      {sellItems.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Items for Sale</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sellItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden w-full"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {item.images && item.images[0] && (
                    <img
                      src={getImageUrl(item.images[0])}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base font-medium text-gray-900 truncate">{item.title}</h4>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                    </div>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="ml-2 text-gray-400 hover:text-gray-500 flex-shrink-0"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'active' ? 'bg-green-100 text-green-800' :
                      item.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 