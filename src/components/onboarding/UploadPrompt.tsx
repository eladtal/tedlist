import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '../../stores/onboardingStore';

export default function UploadPrompt() {
  const navigate = useNavigate();

  const handleUpload = () => {
    // Navigate to the submit page
    navigate('/submit');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md mx-auto"
      >
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-full w-1/3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          </div>
          <p className="text-sm text-gray-600 mt-2">Step 2 of 3</p>
        </div>

        {/* Ghost Item Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border-2 border-dashed border-gray-300 mb-8 cursor-pointer"
          onClick={handleUpload}
        >
          <div className="bg-gray-100 h-48 rounded-lg mb-4 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          </div>
        </motion.div>

        {/* Text Content */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Let's add your first item for trade</h2>
          <p className="text-gray-600">
            The more you list, the better your matches.
          </p>
        </div>

        {/* Upload Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUpload}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Upload Item
        </motion.button>
      </motion.div>
    </div>
  );
} 