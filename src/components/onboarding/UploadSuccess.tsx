import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '../../stores/onboardingStore';

interface UploadSuccessProps {
  itemImage?: string;
}

export default function UploadSuccess({ itemImage }: UploadSuccessProps) {
  const navigate = useNavigate();
  const { setCurrentStep, markFirstItemUploaded } = useOnboardingStore();

  useEffect(() => {
    markFirstItemUploaded();
  }, [markFirstItemUploaded]);

  const handleContinue = () => {
    setCurrentStep(3);
    navigate('/swipe');
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
              <div className="h-full w-2/3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            </div>
            <p className="text-sm text-gray-600 mt-2">Step 2 of 3 complete</p>
          </div>

          {/* Success Animation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            {itemImage ? (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden"
              >
                <img src={itemImage} alt="Uploaded item" className="w-full h-full object-cover" />
              </motion.div>
            ) : (
              <span className="text-5xl mb-4 inline-block">✨</span>
            )}
            
            <h2 className="text-2xl font-bold mb-2">Great! Your item is live.</h2>
            
            {/* Coin Reward Animation */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-lg text-yellow-500 font-semibold mb-4"
            >
              🧸 You've earned 30 Teddies Coins
            </motion.div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Swiping
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 