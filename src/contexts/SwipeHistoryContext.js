import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { usePoints } from './PointsContext';

// Create context
export const SwipeHistoryContext = createContext();

// Hook for using swipe history context
export const useSwipeHistory = () => {
  return useContext(SwipeHistoryContext);
};

export const SwipeHistoryProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { hasActiveBoost } = usePoints();
  const [swipeHistory, setSwipeHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user swipe history on login/mount
  useEffect(() => {
    if (currentUser) {
      loadSwipeHistory();
    } else {
      setSwipeHistory([]);
      setLoading(false);
    }
  }, [currentUser]);

  // Load swipe history from localStorage
  const loadSwipeHistory = () => {
    try {
      setLoading(true);
      
      // Get all user swipe history
      const swipeData = localStorage.getItem('tedlistSwipeHistory');
      let userSwipeHistory = [];
      
      if (swipeData) {
        const allSwipeData = JSON.parse(swipeData);
        userSwipeHistory = allSwipeData[currentUser.id] || [];
      }
      
      setSwipeHistory(userSwipeHistory);
    } catch (error) {
      console.error('Error loading swipe history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save swipe history to localStorage
  const saveSwipeHistory = (newSwipeHistory) => {
    try {
      const swipeData = localStorage.getItem('tedlistSwipeHistory');
      let allSwipeData = {};
      
      if (swipeData) {
        allSwipeData = JSON.parse(swipeData);
      }
      
      allSwipeData[currentUser.id] = newSwipeHistory;
      
      localStorage.setItem('tedlistSwipeHistory', JSON.stringify(allSwipeData));
    } catch (error) {
      console.error('Error saving swipe history:', error);
    }
  };

  // Add or update a swipe in history
  const recordSwipe = (itemId, direction) => {
    if (!currentUser) return;
    
    // Check if item was already swiped
    const existingSwipeIndex = swipeHistory.findIndex(swipe => swipe.itemId === itemId);
    let newSwipeHistory = [...swipeHistory];
    
    if (existingSwipeIndex >= 0) {
      // Update existing swipe
      newSwipeHistory[existingSwipeIndex] = {
        ...newSwipeHistory[existingSwipeIndex],
        direction,
        timestamp: new Date().toISOString()
      };
    } else {
      // Add new swipe
      newSwipeHistory.push({
        userId: currentUser.id,
        itemId,
        direction,
        timestamp: new Date().toISOString()
      });
    }
    
    setSwipeHistory(newSwipeHistory);
    saveSwipeHistory(newSwipeHistory);
    
    return newSwipeHistory;
  };

  // Get all of the user's swipes
  const getAllSwipes = () => {
    return swipeHistory;
  };

  // Get likes (right swipes)
  const getLikedItems = () => {
    return swipeHistory.filter(swipe => swipe.direction === 'right');
  };

  // Get passes (left swipes)
  const getPassedItems = () => {
    return swipeHistory.filter(swipe => swipe.direction === 'left');
  };

  // Check if an item has been swiped
  const hasBeenSwiped = (itemId) => {
    return swipeHistory.some(swipe => swipe.itemId === itemId);
  };

  // Get swipe direction for an item
  const getSwipeDirection = (itemId) => {
    const swipe = swipeHistory.find(swipe => swipe.itemId === itemId);
    return swipe ? swipe.direction : null;
  };

  // Sort items by swipe algorithm
  const sortItemsBySwipeAlgorithm = (items, userLevels = {}) => {
    if (!items || items.length === 0) return [];
    
    // Clone the items array to avoid mutating the original
    const sortedItems = [...items];
    
    // First, prioritize items that have not been swiped yet
    const nonSwipedItems = sortedItems.filter(item => !hasBeenSwiped(item.id));
    const swipedItems = sortedItems.filter(item => hasBeenSwiped(item.id));
    
    // For non-swiped items, prioritize:
    // 1. Items with active boosts
    // 2. Items from Elite Traders
    // 3. Items from higher level users
    nonSwipedItems.sort((a, b) => {
      // Check for active boosts first
      const aHasBoost = hasActiveBoost(a.id);
      const bHasBoost = hasActiveBoost(b.id);
      
      if (aHasBoost && !bHasBoost) return -1;
      if (!aHasBoost && bHasBoost) return 1;
      
      // Then check seller levels
      const aLevel = userLevels[a.ownerId] || 0;
      const bLevel = userLevels[b.ownerId] || 0;
      
      return bLevel - aLevel; // Higher level first
    });
    
    // For swiped items that were liked, show them after non-swiped items
    const likedItems = swipedItems.filter(item => getSwipeDirection(item.id) === 'right');
    
    // For swiped items that were passed, show them last
    const passedItems = swipedItems.filter(item => getSwipeDirection(item.id) === 'left');
    
    // Combine all sorted arrays
    return [...nonSwipedItems, ...likedItems, ...passedItems];
  };

  // Value object to provide to context consumers
  const value = {
    swipeHistory,
    loading,
    recordSwipe,
    getAllSwipes,
    getLikedItems,
    getPassedItems,
    hasBeenSwiped,
    getSwipeDirection,
    sortItemsBySwipeAlgorithm
  };

  return (
    <SwipeHistoryContext.Provider value={value}>
      {!loading && children}
    </SwipeHistoryContext.Provider>
  );
};
