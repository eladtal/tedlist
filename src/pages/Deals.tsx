import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { API_BASE_URL } from '../config';
import { useAuthStore } from '../stores/authStore';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Deal {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  receiver: {
    _id: string;
    name: string;
    avatar?: string;
  };
  senderItems: Array<{
    _id: string;
    title: string;
    images: string[];
  }>;
  receiverItems: Array<{
    _id: string;
    title: string;
    images: string[];
  }>;
  status: 'pending' | 'accepted' | 'declined' | 'countered' | 'completed';
  lastActivityAt: string;
  teddiesEarned?: number;
}

const DealCard: React.FC<{ deal: Deal }> = ({ deal }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'countered': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = () => {
    navigate(`/my-deals/${deal._id}`);
  };

  // Determine if the current user is the sender
  const isSender = user?._id === deal.sender._id;
  const counterparty = isSender ? deal.receiver : deal.sender;
  const userItems = isSender ? deal.senderItems : deal.receiverItems;
  const counterpartyItems = isSender ? deal.receiverItems : deal.senderItems;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {userItems[0]?.images?.[0] && (
              <img
                src={`${API_BASE_URL}${userItems[0].images[0]}`}
                alt={userItems[0].title}
                className="w-16 h-16 object-cover rounded-md"
              />
            )}
            <div className="flex items-center">
              <span className="text-gray-500 mx-2">↔️</span>
              {counterpartyItems[0]?.images?.[0] && (
                <img
                  src={`${API_BASE_URL}${counterpartyItems[0].images[0]}`}
                  alt={counterpartyItems[0].title}
                  className="w-16 h-16 object-cover rounded-md"
                />
              )}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{counterparty.name}</h3>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deal.status)} mt-1`}>
              {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {format(new Date(deal.lastActivityAt), 'MMM d, yyyy h:mm a')}
            </p>
            {deal.status === 'completed' && deal.teddiesEarned && (
              <p className="text-sm text-green-600 font-medium mt-1">
                +{deal.teddiesEarned} Teddies earned
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleViewDetails}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {deal.status === 'completed' ? 'Leave Feedback' : 'View Details'}
        </button>
      </div>
    </div>
  );
};

const MyDeals: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('sent');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        console.log('Fetching deals:', {
          tab: selectedTab,
          url: `${API_BASE_URL}/api/deals/${selectedTab}`,
          token
        });

        const response = await axios.get(
          `${API_BASE_URL}/api/deals/${selectedTab}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        console.log('Deals API response:', {
          status: response.status,
          data: response.data
        });

        setDeals(response.data);
      } catch (error: any) {
        console.error('Error fetching deals:', error.response || error);
        toast.error('Failed to fetch deals');
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [selectedTab, token]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📦</span>
          <h1 className="text-2xl font-semibold text-gray-900">My Deals</h1>
        </div>
        <button
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          <FunnelIcon className="h-5 w-5 mr-2" />
          Filters
        </button>
      </div>

      <div className="bg-gray-100 p-1 rounded-lg mb-6">
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setSelectedTab('sent')}
            className={`py-2 text-sm font-medium rounded-md ${
              selectedTab === 'sent'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sent Offers
          </button>
          <button
            onClick={() => setSelectedTab('received')}
            className={`py-2 text-sm font-medium rounded-md ${
              selectedTab === 'received'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Received & Accepted
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No deals to show</p>
          <p className="text-sm text-gray-400 mt-2">
            {selectedTab === 'sent' 
              ? 'Start trading to see your deals here!'
              : 'When others accept your trades, they\'ll appear here!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {deals.map(deal => (
            <DealCard key={deal._id} deal={deal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDeals; 