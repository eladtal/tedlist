import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function Home() {
  const { user } = useAuthStore()

  return (
    <div className="flex items-center justify-center min-h-screen w-full relative overflow-hidden bg-gray-100">
      {/* Background illustration */}
      <img 
        src="/tedlist-illustration.png" 
        alt="Tedlist background" 
        className="absolute inset-0 w-full h-full object-cover opacity-50 z-0 pointer-events-none select-none mix-blend-multiply" 
        aria-hidden="true"
      />
      <div className="w-full max-w-7xl px-6 py-16 flex flex-col items-center justify-center relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          {!user && (
            <>
              <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-800 sm:text-6xl">
                Trade, Buy, or Sell with Tedlist
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-700">
                Tedlist is your modern platform for trading, buying, or selling items with a swipe. Create lists and connect with others in your community.
              </p>
            </>
          )}
          <div className="mt-10 flex flex-col items-center justify-center gap-6">
            <Link 
              to="/trade/select" 
              className="btn btn-trade text-2xl w-60 h-20 rounded-full mb-4 shadow-lg flex items-center justify-center"
            >
              Trade-In
            </Link>
            <div className="flex flex-row gap-6">
              <Link to="/buy" className="btn btn-buy text-lg w-48">Buy</Link>
              <Link to="/sell" className="btn btn-sell text-lg w-48">Sell</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 