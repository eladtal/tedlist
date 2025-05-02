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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* User Stats */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary-600">{teddies}</div>
              <div className="text-sm sm:text-base text-gray-600">Teddies</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary-600">{badges.length}</div>
              <div className="text-sm sm:text-base text-gray-600">Badges</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary-600">{streak}</div>
              <div className="text-sm sm:text-base text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>

        <div className="mx-auto">
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Items</h2>
              <Link
                to="/submit"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-primary-400 to-primary-500 text-white font-medium shadow-sm hover:from-primary-500 hover:to-primary-600 transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
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
                <div className="rounded-2xl bg-pastel-yellow p-4 sm:p-8">
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
              <div className="space-y-6">
                {/* Trade Items Section */}
                {tradeItems.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Items for Trade</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tradeItems.map((item) => (
                        <div
                          key={item._id}
                          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
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
                              <div>
                                <h4 className="text-base font-medium text-gray-900 truncate">{item.title}</h4>
                                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                              </div>
                              <button
                                onClick={() => openModal(item)}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.status === 'active' ? 'bg-green-100 text-green-800' :
                                item.status === 'traded' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </span>
                              <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sell Items Section */}
                {sellItems.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Items for Sale</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sellItems.map((item) => (
                        <div
                          key={item._id}
                          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
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
                              <div>
                                <h4 className="text-base font-medium text-gray-900 truncate">{item.title}</h4>
                                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                              </div>
                              <button
                                onClick={() => openModal(item)}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.status === 'active' ? 'bg-green-100 text-green-800' :
                                item.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </span>
                              <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delete Modal */}
        {modalOpen && selectedItem && (
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Item</h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this item? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 