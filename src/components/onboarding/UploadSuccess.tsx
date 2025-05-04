import React from 'react';
import { Link } from 'react-router-dom';
import { useOnboardingStore } from '../../stores/onboardingStore';

interface UploadSuccessProps {
  imageUrl?: string;
  onClose?: () => void;
}

export default function UploadSuccess({ imageUrl, onClose }: UploadSuccessProps) {
  const { markFirstItemUploaded } = useOnboardingStore();

  React.useEffect(() => {
    markFirstItemUploaded();
  }, [markFirstItemUploaded]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto w-48 h-48 relative">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Uploaded item"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No preview available</span>
                </div>
              )}
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Item Uploaded Successfully! 🎉
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Your item has been added to the marketplace. Start swiping to find items to trade!
          </p>
          <div className="flex flex-col space-y-3">
            <Link
              to="/swipe"
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              onClick={onClose}
            >
              Start Swiping
            </Link>
            <button
              type="button"
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              onClick={onClose}
            >
              Add Another Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 