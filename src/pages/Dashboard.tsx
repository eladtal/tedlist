import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { PlusIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline'
import { API_BASE_URL } from '../config'
import { useUserStore } from '../stores/userStore'
import { useNotificationStore } from '../stores/notificationStore'
import { getImageUrl } from '../utils/imageUtils'

interface Item {
  _id: string
  title: string
  description: string
  images: string[]
  condition: string
  status: string
  userId: string
  type: 'trade' | 'sell'
  createdAt: string
}

export default function Dashboard() {
  const { user, token } = useAuthStore()
  const { notifications } = useNotificationStore()
  console.log('Dashboard mounted - User:', user, 'Token:', token) // Debug log
  
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { teddies, badges, streak } = useUserStore()

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log('API Base URL:', API_BASE_URL) // Debug log
        console.log('Fetching items with token:', token) // Debug log
        const response = await fetch(`${API_BASE_URL}/api/items/user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        console.log('Response status:', response.status) // Debug log
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to fetch items')
        }
        const data = await response.json()
        console.log('Fetched items - Raw data:', data)
        if (!data.items || !Array.isArray(data.items)) {
          throw new Error('Invalid data format: items array not found')
        }
        console.log('First item data:', data.items[0])
        setItems(data.items)
        setError(null)
      } catch (error) {
        console.error('Failed to fetch items:', error)
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    fetchItems()
  }, [token])

  // Add effect to update items when notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      const lastNotification = notifications[0];
      if (lastNotification.type === 'match' && lastNotification.item) {
        setItems(prevItems => 
          prevItems.map(item => 
            item._id === lastNotification.item?._id 
              ? { ...item, status: 'traded' }
              : item
          )
        );
      }
    }
  }, [notifications]);

  const openModal = (item: Item) => {
    setSelectedItem(item)
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setSelectedItem(null)
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    setDeleting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/items/${selectedItem._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to delete item')
      setItems(items.filter(i => i._id !== selectedItem._id))
      closeModal()
    } catch (err) {
      alert('Failed to delete item.')
    } finally {
      setDeleting(false)
    }
  }

  // Separate items by type
  const tradeItems = items.filter(item => item.type === 'trade')
  const sellItems = items.filter(item => item.type === 'sell')

  // Fix date display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* User Stats */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{teddies}</div>
              <div className="text-gray-600">Teddies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{badges.length}</div>
              <div className="text-gray-600">Badges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{streak}</div>
              <div className="text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Items</h2>
              <Link
                to="/submit"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-primary-400 to-primary-500 text-white font-medium shadow-sm hover:from-primary-500 hover:to-primary-600 transition-all duration-200 transform hover:scale-105"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Item
              </Link>
            </div>

            {error ? (
              <div className="mt-4 rounded-xl bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : isLoading ? (
              <div className="mt-4 text-center text-gray-500">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-8 w-8 mb-4 rounded-full bg-primary-200"></div>
                  <div className="text-primary-400">Loading your items...</div>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="mt-4 text-center">
                <div className="rounded-2xl bg-pastel-yellow p-8">
                  <p className="text-gray-600 mb-4">You don't have any items yet.</p>
                  <Link
                    to="/submit"
                    className="inline-flex items-center text-primary-600 hover:text-primary-500 font-medium"
                  >
                    Submit your first item
                    <span aria-hidden="true" className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-pastel-blue mb-2">Trade-In Items</h3>
                <div className="mt-2 mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {tradeItems.length === 0 ? (
                    <div className="col-span-full text-center text-gray-400">No trade-in items.</div>
                  ) : tradeItems.map((item) => (
                    <div
                      key={item._id}
                      className="group relative flex flex-col overflow-hidden card transition-all duration-200 hover:shadow-lg hover:scale-[1.03] cursor-pointer"
                      onClick={() => openModal(item)}
                    >
                      <div className="aspect-w-3 aspect-h-2 bg-pastel-blue/30 relative overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={getImageUrl(item.images[0])}
                            alt={item.title}
                            className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-pastel-blue to-pastel-purple">
                            <span className="text-white/80">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col space-y-3 p-6">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between mt-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize
                            ${item.status === 'available' ? 'bg-pastel-green text-green-800' : 
                              item.status === 'pending' ? 'bg-pastel-yellow text-yellow-800' : 
                              'bg-pastel-purple text-purple-800'}`}>
                            {item.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="text-lg font-bold text-pastel-pink mb-2 mt-8">Sell Items</h3>
                <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sellItems.length === 0 ? (
                    <div className="col-span-full text-center text-gray-400">No sell items.</div>
                  ) : sellItems.map((item) => (
                    <div
                      key={item._id}
                      className="group relative flex flex-col overflow-hidden card transition-all duration-200 hover:shadow-lg hover:scale-[1.03] cursor-pointer"
                      onClick={() => openModal(item)}
                    >
                      <div className="aspect-w-3 aspect-h-2 bg-pastel-pink/30 relative overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={getImageUrl(item.images[0])}
                            alt={item.title}
                            className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-pastel-pink to-pastel-yellow">
                            <span className="text-white/80">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col space-y-3 p-6">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between mt-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize
                            ${item.status === 'available' ? 'bg-pastel-green text-green-800' : 
                              item.status === 'pending' ? 'bg-pastel-yellow text-yellow-800' : 
                              'bg-pastel-purple text-purple-800'}`}>
                            {item.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal for item details */}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="card max-w-md w-full relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"><XMarkIcon className="h-6 w-6" /></button>
            <div className="mb-4">
              {selectedItem.images && selectedItem.images.length > 0 ? (
                <img src={getImageUrl(selectedItem.images[0])} alt={selectedItem.title} className="w-full h-48 object-cover rounded-xl mb-2" />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-pastel-blue/30 rounded-xl mb-2 text-gray-400">No image</div>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>
            <p className="mb-2 text-gray-700">{selectedItem.description}</p>
            <div className="mb-2 flex flex-wrap gap-2">
              <span className="inline-block bg-pastel-green/60 text-green-800 rounded-full px-3 py-1 text-xs font-medium">{selectedItem.condition}</span>
              <span className="inline-block bg-pastel-yellow/60 text-yellow-800 rounded-full px-3 py-1 text-xs font-medium">{selectedItem.status}</span>
              <span className="inline-block bg-pastel-purple/60 text-purple-800 rounded-full px-3 py-1 text-xs font-medium">{formatDate(selectedItem.createdAt)}</span>
            </div>
            <button onClick={handleDelete} disabled={deleting} className="btn btn-secondary mt-4 flex items-center justify-center w-full disabled:opacity-50">
              <TrashIcon className="h-5 w-5 mr-2" />
              {deleting ? 'Deleting...' : 'Delete Item'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 