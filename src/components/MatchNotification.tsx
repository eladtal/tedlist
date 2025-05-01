import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useUserStore } from '../stores/userStore'

interface MatchNotificationProps {
  isOpen: boolean
  onClose: () => void
  matchedUser: string
  matchedItem: string
}

const MatchNotification = ({ isOpen, onClose, matchedUser, matchedItem }: MatchNotificationProps) => {
  const { addTeddies } = useUserStore()

  const handleShare = () => {
    // Create a shareable image/text
    const shareText = `🎉 I just matched with ${matchedUser} on Tedlist! We're trading ${matchedItem}. Join me on Tedlist! #TedlistTrading`
    
    // Add social sharing functionality here
    if (navigator.share) {
      navigator.share({
        title: 'Tedlist Match!',
        text: shareText,
        url: window.location.origin
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText)
      alert('Share text copied to clipboard!')
    }
  }

  if (isOpen) {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 }
    })
    addTeddies(50) // Award 50 Teddies for a match
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Match Found!</h2>
            <p className="text-gray-600 mb-6">
              You've matched with {matchedUser} for {matchedItem}
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={handleShare}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Share Your Match
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Continue Trading
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MatchNotification 