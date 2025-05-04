import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '../../stores/onboardingStore';

export default function SwipeCompletion() {
  const navigate = useNavigate();
  const { completeOnboarding } = useOnboardingStore();

  const handleComplete = (destination: 'profile' | 'continue') => {
    completeOnboarding();
    if (destination === 'profile') {
      navigate('/profile');
    }
    // If continue, just close the modal and let them keep swiping
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center shadow-2xl"
        >
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-full w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            </div>
            <p className="text-sm text-gray-600 mt-2">Step 3 of 3 complete</p>
          </div>

          {/* Success Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <span className="text-5xl mb-4 inline-block">⭐</span>
            <h2 className="text-2xl font-bold mb-4">Nice start!</h2>
            <p className="text-gray-600">
              You're discovering the world of trade — keep going and watch the matches roll in.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleComplete('profile')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Go to My Profile
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleComplete('continue')}
              className="w-full bg-white text-purple-500 border-2 border-purple-500 px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300"
            >
              Keep Swiping
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 