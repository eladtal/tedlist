import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { API_BASE_URL } from '../config'
import { useUserStore } from '../stores/userStore'
import { useNotificationStore } from '../stores/notificationStore'
import MyItemsSection, { Item } from '../components/MyItemsSection'

export default function Dashboard() {
  const { token } = useAuthStore()
  const { notifications } = useNotificationStore()
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
        const response = await fetch(`${API_BASE_URL}/api/items/user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to fetch items')
        }
        const data = await response.json()
        if (!data.items || !Array.isArray(data.items)) {
          throw new Error('Invalid data format: items array not found')
        }
        console.log('Items loaded on Dashboard page:', data.items);
        setItems(data.items)
        setError(null)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    fetchItems()
  }, [token])

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

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 mb-12 px-4 sm:px-8">
      <div className="max-w-full">
        {/* User Stats */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-[#69db7c]">{teddies}</div>
              <div className="text-xs sm:text-sm text-gray-600">Teddies</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-[#b197fc]">{badges.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Badges</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-[#ffa8a8]">{streak}</div>
              <div className="text-xs sm:text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="card bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Items</h2>
              <Link
                to="/submit"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-[#82e297] to-[#69db7c] text-white font-medium shadow-sm hover:from-[#69db7c] hover:to-[#51cf66] transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
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
                  <div className="h-8 w-8 mb-4 rounded-full bg-[#d3f9d8]"></div>
                  <div className="text-[#69db7c]">Loading your items...</div>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="mt-4 text-center">
                <div className="rounded-2xl bg-[#f8f9fa] p-4 sm:p-8">
                  <p className="text-gray-600 mb-4">You don't have any items yet.</p>
                  <Link
                    to="/submit"
                    className="inline-flex items-center text-[#69db7c] hover:text-[#51cf66] font-medium"
                  >
                    Submit your first item
                    <span aria-hidden="true" className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            ) : (
              <MyItemsSection items={items} onDelete={openModal} showTradeButton />
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