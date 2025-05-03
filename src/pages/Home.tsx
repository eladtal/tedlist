import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config'
import MyItemsSection, { Item } from '../components/MyItemsSection'
import { ArrowPathRoundedSquareIcon, ShoppingBagIcon, BriefcaseIcon } from '@heroicons/react/24/solid'

export default function Home() {
  const { user, token } = useAuthStore()
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return;
    setIsLoading(true)
    fetch(`${API_BASE_URL}/api/items/user`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const itemsArray = Array.isArray(data.items) ? data.items : [];
        console.log('Items loaded on Home page:', itemsArray);
        setItems(itemsArray);
        setError(null);
      })
      .catch(() => setError('Failed to load your items'))
      .finally(() => setIsLoading(false))
  }, [user, token])

  // Example XP data (replace with real data if available)
  const xp = 120;
  const xpGoal = 500;
  const topTrader = user ? user.name : 'You'; // Replace with real top trader if available

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#f0f7ff] to-[#eef2ff]">
      <div className="w-full max-w-2xl mx-auto mt-24 mb-10 flex flex-col items-center">
        <div className="w-full rounded-[2.5rem] border border-[#dbeafe] shadow-xl bg-gradient-to-br from-[#f0f9ff] via-[#f5f7ff] to-[#f3f4ff] px-6 py-10 relative overflow-hidden">
          <div className="w-full text-center mt-6 mb-8">
            {user ? (
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#b197fc] to-[#7950f2]">
                    Hey {user.name}!
                  </span>
                </h1>
                <p className="text-2xl font-medium text-gray-700 mt-2">What would you like to do today?</p>
              </div>
            ) : (
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-2">
                Welcome to <span className="text-[#b197fc]">Ted</span><span className="text-[#69db7c]">l</span><span className="text-[#ffa8a8]">ist</span>!
              </h1>
            )}
          </div>

          {/* XP Progress & Achievements */}
          <div className="w-full flex flex-col items-center mb-8">
            <div className="w-full max-w-xs mx-auto rounded-2xl bg-white/80 shadow p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-700">XP Progress</span>
                <span className="text-xs text-gray-500">{xp} of {xpGoal} XP</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#69db7c] rounded-full transition-all"
                  style={{ width: `${Math.min(100, (xp / xpGoal) * 100)}%` }}
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[#d3f9d8] text-[#2b8a3e] rounded-lg px-2 py-1 text-xs font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 01.894.553l1.382 2.8 3.09.45a1 1 0 01.554 1.706l-2.236 2.18.528 3.08a1 1 0 01-1.451 1.054L10 12.347l-2.767 1.456A1 1 0 015.782 12.75l.528-3.08-2.236-2.18a1 1 0 01.554-1.706l3.09-.45L9.106 2.553A1 1 0 0110 2z" /></svg>
                  Top Trader of the Week
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-4 mt-8 mb-8">
            <Link
              to="/trade/select"
              className="flex items-center gap-3 justify-center rounded-xl bg-[#d3f9d8] hover:bg-[#b2f2bb] text-[#2b8a3e] font-semibold text-lg py-4 shadow transition-all"
            >
              <ArrowPathRoundedSquareIcon className="h-7 w-7" />
              Trade an Item
            </Link>
            
            {/* Buy button (greyed out) */}
            <div className="relative">
              <div
                className="flex items-center gap-3 justify-center rounded-xl bg-gray-100 text-gray-400 font-semibold text-lg py-4 shadow-sm cursor-not-allowed"
              >
                <ShoppingBagIcon className="h-7 w-7" />
                Buy Something
              </div>
              <span className="absolute -top-2 right-3 text-xs bg-gray-200 text-gray-500 rounded px-2 py-0.5">Coming Soon</span>
            </div>
            
            {/* Sell button (greyed out) */}
            <div className="relative">
              <div
                className="flex items-center gap-3 justify-center rounded-xl bg-gray-100 text-gray-400 font-semibold text-lg py-4 shadow-sm cursor-not-allowed"
              >
                <BriefcaseIcon className="h-7 w-7" />
                Sell an Item
              </div>
              <span className="absolute -top-2 right-3 text-xs bg-gray-200 text-gray-500 rounded px-2 py-0.5">Coming Soon</span>
            </div>
          </div>

          {/* Popular Picks placeholder */}
          <div className="w-full">
            {/* TODO: Add Popular Picks carousel here */}
          </div>
          {user && (
            <div className="w-full max-w-4xl mx-auto mt-12">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">My Items</h2>
              {isLoading ? (
                <div className="text-center text-gray-500">Loading your items...</div>
              ) : error ? (
                <div className="text-center text-red-500">{error}</div>
              ) : items.length === 0 ? (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">You don't have any items yet.</p>
                  <Link to="/submit" className="inline-block mt-2 text-[#69db7c] hover:text-[#51cf66]">
                    Submit your first item →
                  </Link>
                </div>
              ) : (
                <MyItemsSection items={items} showTradeButton />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 