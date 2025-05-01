import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface TeddyBalanceProps {
  balance: number;
  showAnimation: boolean;
  bonus?: number;
}

const TeddyBalance: React.FC<TeddyBalanceProps> = ({ balance, showAnimation, bonus }) => {
  const teddyIcon = '🧸';

  React.useEffect(() => {
    if (showAnimation) {
      toast.success(`${teddyIcon} +${balance} Teddies!`, {
        duration: 3000,
        icon: '🎉',
        style: {
          background: '#FFF5F7',
          color: '#4A5568',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      });
    }
  }, [balance, showAnimation]);

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md">
        <span className="text-2xl">{teddyIcon}</span>
        <span className="font-bold text-gray-700">{balance}</span>
      </div>
      
      <AnimatePresence>
        {showAnimation && bonus && bonus > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap"
          >
            +{bonus} Teddies!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeddyBalance; 