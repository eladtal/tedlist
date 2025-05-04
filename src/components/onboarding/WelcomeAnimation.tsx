import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '../../stores/onboardingStore';

export default function WelcomeAnimation() {
  const navigate = useNavigate();
  const { setCurrentStep } = useOnboardingStore();

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const handleContinue = () => {
    setCurrentStep(2);
    navigate('/submit-item');
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
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4">Welcome to Tedlist, Trader!</h2>
            
            {/* Coins Animation */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="my-6"
            >
              <span className="text-4xl">🎉</span>
              <p className="text-lg mt-2">
                You've received <span className="font-bold text-yellow-500">50 Teddies Coins</span> for joining.
              </p>
            </motion.div>
            
            <p className="text-gray-600 mb-6">Let's get started.</p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Upload Your First Item
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 