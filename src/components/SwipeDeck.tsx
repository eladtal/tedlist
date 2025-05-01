import { useState } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { useUserStore } from '../stores/userStore'
import confetti from 'canvas-confetti'
import { createMatch } from '../api/matches'

interface Item {
  id: string
  title: string
  image: string
  description: string
  owner: string
}

interface SwipeDeckProps {
  items: Item[]
  onMatch: (item: Item) => void
}

const SwipeDeck = ({ items, onMatch }: SwipeDeckProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { addTeddies } = useUserStore()

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100
    const item = items[currentIndex]

    if (info.offset.x > threshold) {
      // Swiped right
      try {
        await createMatch(item.id, 'current-user-item-id') // Replace with actual current user's item ID
        addTeddies(1) // Award 1 Teddy for swiping
        triggerSwipeAnimation('right')
        onMatch(item)
      } catch (error) {
        console.error('Failed to create match:', error)
      }
    } else if (info.offset.x < -threshold) {
      // Swiped left
      addTeddies(1) // Award 1 Teddy for swiping
      triggerSwipeAnimation('left')
    }

    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const triggerSwipeAnimation = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? 1 : -1
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { x, y: 0.6 }
    })
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">No items available to swipe.</p>
      </div>
    )
  }

  const currentItem = items[currentIndex]

  const handleSwipe = (direction: string) => {
    if (!currentItem) return;
    
    if (direction === 'right') {
      handleLike();
    } else {
      handleSkip();
    }
  };

  return (
    <div className="relative h-96">
      <motion.div
        key={currentItem.id}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        className="absolute w-full h-full bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={currentItem.image}
          alt={currentItem.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold">{currentItem.title}</h3>
          <p className="text-gray-600 mt-2">{currentItem.description}</p>
          <p className="text-sm text-gray-500 mt-2">From: {currentItem.owner}</p>
        </div>
      </motion.div>
    </div>
  )
}

export default SwipeDeck 