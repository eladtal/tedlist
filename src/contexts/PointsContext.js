import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

// Point values for different actions
export const POINTS = {
  INVITE_FRIEND: 500,
  COMPLETE_PROFILE: 200,
  POST_ITEM: 100,
  COMPLETE_TRADE: 800,
  FIVE_STAR_RATING: 300,
  DAILY_LOGIN: 100,
  SOCIAL_SHARE: 150,
  WEEKLY_CHALLENGE: 1000,
};

// Level thresholds
export const LEVELS = {
  LEVEL_1: { name: 'New Trader', min: 0, max: 999 },
  LEVEL_2: { name: 'Casual Swapper', min: 1000, max: 4999 },
  LEVEL_3: { name: 'Trusted Trader', min: 5000, max: 9999 },
  LEVEL_4: { name: 'Elite Trader 💎', min: 10000, max: Infinity }
};

// Rewards and their costs
export const REWARDS = {
  ITEM_BOOST: { id: 'item_boost', name: '⭐ 24-hour Item Boost', description: 'Your item will appear at the top of the swipe deck for 24 hours', cost: 2000 },
  STICKER: { id: 'sticker', name: '🎨 Cosmetic Sticker', description: 'Add a special sticker to make your listings stand out', cost: 500 },
  VERIFIED_BADGE: { id: 'verified_badge', name: '🏆 Verified Trader Badge', description: 'Show everyone you\'re a trusted trader with this badge', cost: 10000 }
};

// Create context
export const PointsContext = createContext();

// Hook for using points context
export const usePoints = () => {
  return useContext(PointsContext);
};

export const PointsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(LEVELS.LEVEL_1);
  const [rewards, setRewards] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user points data on login/mount
  useEffect(() => {
    if (currentUser) {
      loadUserPoints();
    } else {
      setPoints(0);
      setLevel(LEVELS.LEVEL_1);
      setRewards([]);
      setActivityHistory([]);
      setLoading(false);
    }
  }, [currentUser]);

  // Calculate level based on points
  useEffect(() => {
    if (points >= LEVELS.LEVEL_4.min) {
      setLevel(LEVELS.LEVEL_4);
    } else if (points >= LEVELS.LEVEL_3.min) {
      setLevel(LEVELS.LEVEL_3);
    } else if (points >= LEVELS.LEVEL_2.min) {
      setLevel(LEVELS.LEVEL_2);
    } else {
      setLevel(LEVELS.LEVEL_1);
    }
  }, [points]);

  // Load user points data from localStorage
  const loadUserPoints = () => {
    try {
      setLoading(true);
      
      // Get all user points data
      const pointsData = localStorage.getItem('tedlistPoints');
      let userPointsData = {};
      
      if (pointsData) {
        const allPointsData = JSON.parse(pointsData);
        userPointsData = allPointsData[currentUser.id] || {
          points: 0,
          rewards: [],
          activityHistory: []
        };
      } else {
        userPointsData = {
          points: 0,
          rewards: [],
          activityHistory: []
        };
      }
      
      setPoints(userPointsData.points);
      setRewards(userPointsData.rewards || []);
      setActivityHistory(userPointsData.activityHistory || []);
      
      // Check for daily login bonus
      checkDailyLoginBonus();
      
    } catch (error) {
      console.error('Error loading points data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save user points data to localStorage
  const saveUserPoints = (newPoints, newRewards, newActivityHistory) => {
    try {
      const pointsData = localStorage.getItem('tedlistPoints');
      let allPointsData = {};
      
      if (pointsData) {
        allPointsData = JSON.parse(pointsData);
      }
      
      allPointsData[currentUser.id] = {
        points: newPoints,
        rewards: newRewards,
        activityHistory: newActivityHistory
      };
      
      localStorage.setItem('tedlistPoints', JSON.stringify(allPointsData));
    } catch (error) {
      console.error('Error saving points data:', error);
    }
  };

  // Add points for an action
  const addPoints = (action, pointsToAdd = null) => {
    if (!currentUser) return;
    
    const amount = pointsToAdd || POINTS[action] || 0;
    const newPoints = points + amount;
    
    // Log the activity
    const newActivity = {
      id: Date.now().toString(),
      type: 'points_earned',
      action,
      amount,
      timestamp: new Date().toISOString()
    };
    
    const newActivityHistory = [...activityHistory, newActivity];
    
    setPoints(newPoints);
    setActivityHistory(newActivityHistory);
    
    // Save to localStorage
    saveUserPoints(newPoints, rewards, newActivityHistory);
    
    return newPoints;
  };

  // Check if user should get daily login bonus
  const checkDailyLoginBonus = () => {
    if (!currentUser) return;
    
    // Check if user already got a login bonus today
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const alreadyReceivedToday = activityHistory.some(activity => {
      return activity.action === 'DAILY_LOGIN' && 
             activity.timestamp.split('T')[0] === today;
    });
    
    if (!alreadyReceivedToday) {
      addPoints('DAILY_LOGIN');
    }
  };

  // Purchase a reward with points
  const purchaseReward = (rewardId) => {
    if (!currentUser) return { success: false, message: 'User not logged in' };
    
    const reward = REWARDS[rewardId];
    if (!reward) return { success: false, message: 'Invalid reward' };
    
    // Check if user has enough points
    if (points < reward.cost) {
      return { success: false, message: 'Not enough points' };
    }
    
    // Calculate new points after purchase
    const newPoints = points - reward.cost;
    
    // Add reward to user's inventory with expiration if applicable
    const expiresAt = rewardId === 'item_boost' 
      ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      : null;
      
    const newReward = {
      id: `${rewardId}_${Date.now()}`,
      type: rewardId,
      purchasedAt: new Date().toISOString(),
      expiresAt,
      applied: false,
      appliedTo: null,
    };
    
    const newRewards = [...rewards, newReward];
    
    // Log the activity
    const newActivity = {
      id: Date.now().toString(),
      type: 'reward_purchased',
      rewardId,
      cost: reward.cost,
      timestamp: new Date().toISOString()
    };
    
    const newActivityHistory = [...activityHistory, newActivity];
    
    // Update state
    setPoints(newPoints);
    setRewards(newRewards);
    setActivityHistory(newActivityHistory);
    
    // Save to localStorage
    saveUserPoints(newPoints, newRewards, newActivityHistory);
    
    return { success: true, message: 'Reward purchased successfully', reward: newReward };
  };

  // Apply a reward to an item
  const applyReward = (rewardId, itemId) => {
    if (!currentUser) return { success: false, message: 'User not logged in' };
    
    // Find the reward in the user's inventory
    const rewardIndex = rewards.findIndex(r => r.id === rewardId && !r.applied);
    
    if (rewardIndex === -1) {
      return { success: false, message: 'Reward not found or already applied' };
    }
    
    // Update the reward
    const newRewards = [...rewards];
    newRewards[rewardIndex] = {
      ...newRewards[rewardIndex],
      applied: true,
      appliedTo: itemId,
      appliedAt: new Date().toISOString()
    };
    
    // Log the activity
    const newActivity = {
      id: Date.now().toString(),
      type: 'reward_applied',
      rewardId,
      itemId,
      timestamp: new Date().toISOString()
    };
    
    const newActivityHistory = [...activityHistory, newActivity];
    
    // Update state
    setRewards(newRewards);
    setActivityHistory(newActivityHistory);
    
    // Save to localStorage
    saveUserPoints(points, newRewards, newActivityHistory);
    
    return { success: true, message: 'Reward applied successfully' };
  };

  // Get user's current level
  const getUserLevel = () => {
    return level;
  };

  // Get progress to next level as percentage
  const getLevelProgress = () => {
    if (level === LEVELS.LEVEL_4) return 100; // Already at max level
    
    const nextLevel = Object.values(LEVELS).find(l => l.min > level.max);
    const totalPointsNeeded = nextLevel.min - level.min;
    const pointsEarned = points - level.min;
    
    return Math.min(100, Math.floor((pointsEarned / totalPointsNeeded) * 100));
  };

  // Get available rewards (not applied)
  const getAvailableRewards = () => {
    return rewards.filter(r => !r.applied && (!r.expiresAt || new Date(r.expiresAt) > new Date()));
  };

  // Get active rewards (applied and not expired)
  const getActiveRewards = () => {
    const now = new Date();
    return rewards.filter(r => 
      r.applied && (!r.expiresAt || new Date(r.expiresAt) > now)
    );
  };

  // Check if an item has an active boost
  const hasActiveBoost = (itemId) => {
    const activeBoosts = rewards.filter(r => 
      r.type === 'item_boost' && 
      r.applied && 
      r.appliedTo === itemId &&
      (!r.expiresAt || new Date(r.expiresAt) > new Date())
    );
    
    return activeBoosts.length > 0;
  };

  // Value object to provide to context consumers
  const value = {
    points,
    level,
    rewards,
    activityHistory,
    loading,
    addPoints,
    purchaseReward,
    applyReward,
    getUserLevel,
    getLevelProgress,
    getAvailableRewards,
    getActiveRewards,
    hasActiveBoost,
    POINTS,
    LEVELS,
    REWARDS
  };

  return (
    <PointsContext.Provider value={value}>
      {!loading && children}
    </PointsContext.Provider>
  );
};
