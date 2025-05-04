import { motion } from 'framer-motion';
import { useOnboardingStore } from '../../stores/onboardingStore';

export default function SwipeTutorial() {
  const { currentStep } = useOnboardingStore();

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-xl p-4 shadow-lg mb-6 max-w-md mx-auto"
    >
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-gray-200 rounded-full">
          <div className="h-full w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
        </div>
        <p className="text-sm text-gray-600 mt-2">Step {currentStep} of 3: Explore the marketplace</p>
      </div>

      {/* Tutorial Content */}
      <div className="text-center mb-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center space-x-8 mb-6"
        >
          {/* Swipe Left Illustration */}
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">Swipe Left<br />to Pass</p>
          </div>

          {/* Swipe Right Illustration */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">Swipe Right<br />to Like</p>
          </div>
        </motion.div>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-700"
        >
          Swipe right on items you like. If someone swipes right on yours too — it's a match!
        </motion.p>
      </div>
    </motion.div>
  );
} 