import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

// Trade interaction statuses
export const TRADE_STATUS = {
  PENDING: 'pending',        // Initial offer, waiting for response
  ACCEPTED: 'accepted',      // Trade was accepted
  DECLINED: 'declined',      // Trade was declined
  FEEDBACK_REQUESTED: 'feedback_requested', // User A requested feedback
  FEEDBACK_DECLINED: 'feedback_declined',   // User B declined to give feedback
  FEEDBACK_ACCEPTED: 'feedback_accepted',   // User B agreed to give feedback and open chat
  COMPLETED: 'completed',    // Trade was successfully completed
  CANCELED: 'canceled'       // Trade was canceled after acceptance
};

// Create context
export const TradeInteractionContext = createContext();

// Hook for using trade interaction context
export const useTradeInteraction = () => {
  return useContext(TradeInteractionContext);
};

export const TradeInteractionProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { 
    addTradeOfferNotification, 
    addTradeDeclinedNotification, 
    addFeedbackRequestNotification,
    updateNotificationAction
  } = useNotifications();
  
  const [tradeInteractions, setTradeInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load trade interactions on login/mount
  useEffect(() => {
    if (currentUser) {
      loadTradeInteractions();
    } else {
      setTradeInteractions([]);
      setLoading(false);
    }
  }, [currentUser]);

  // Load trade interactions from localStorage
  const loadTradeInteractions = () => {
    try {
      setLoading(true);
      
      const interactionsData = localStorage.getItem('tedlistTradeInteractions');
      let interactions = [];
      
      if (interactionsData) {
        interactions = JSON.parse(interactionsData);
      }
      
      setTradeInteractions(interactions);
    } catch (error) {
      console.error('Error loading trade interactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save trade interactions to localStorage
  const saveTradeInteractions = (newInteractions) => {
    try {
      localStorage.setItem('tedlistTradeInteractions', JSON.stringify(newInteractions));
    } catch (error) {
      console.error('Error saving trade interactions:', error);
    }
  };

  // Create a new trade offer
  const createTradeOffer = (fromUser, toUser, userItem, theirItem) => {
    if (!currentUser) return null;
    
    // Create a new trade interaction
    const newTrade = {
      id: `trade_${Date.now()}`,
      fromUserId: fromUser.id,
      toUserId: toUser.id,
      userItemId: userItem.id,
      theirItemId: theirItem.id,
      userItem: userItem,     // Include full item objects for convenience
      theirItem: theirItem,   // Include full item objects for convenience
      status: TRADE_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          type: 'offer_created',
          userId: fromUser.id,
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    // Update state
    const newInteractions = [...tradeInteractions, newTrade];
    setTradeInteractions(newInteractions);
    saveTradeInteractions(newInteractions);
    
    // Create notification for the recipient
    addTradeOfferNotification(fromUser, userItem, theirItem);
    
    return newTrade;
  };

  // Accept a trade offer
  const acceptTradeOffer = (tradeId) => {
    const trade = tradeInteractions.find(t => t.id === tradeId);
    
    if (!trade || trade.status !== TRADE_STATUS.PENDING) {
      return { success: false, message: 'Trade not found or not pending' };
    }
    
    // Update the trade with new status
    const updatedTrade = {
      ...trade,
      status: TRADE_STATUS.ACCEPTED,
      updatedAt: new Date().toISOString(),
      history: [
        ...trade.history,
        {
          type: 'offer_accepted',
          userId: currentUser.id,
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    // Update state
    const newInteractions = tradeInteractions.map(t => 
      t.id === tradeId ? updatedTrade : t
    );
    
    setTradeInteractions(newInteractions);
    saveTradeInteractions(newInteractions);
    
    return { success: true, trade: updatedTrade };
  };

  // Decline a trade offer
  const declineTradeOffer = (tradeId, notificationId) => {
    const trade = tradeInteractions.find(t => t.id === tradeId);
    
    if (!trade || trade.status !== TRADE_STATUS.PENDING) {
      return { success: false, message: 'Trade not found or not pending' };
    }
    
    // Update the trade with new status
    const updatedTrade = {
      ...trade,
      status: TRADE_STATUS.DECLINED,
      updatedAt: new Date().toISOString(),
      history: [
        ...trade.history,
        {
          type: 'offer_declined',
          userId: currentUser.id,
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    // Update state
    const newInteractions = tradeInteractions.map(t => 
      t.id === tradeId ? updatedTrade : t
    );
    
    setTradeInteractions(newInteractions);
    saveTradeInteractions(newInteractions);
    
    // Update notification action
    if (notificationId) {
      updateNotificationAction(notificationId, 'declined');
    }
    
    // Create notification for the original offerer
    addTradeDeclinedNotification(
      { id: trade.toUserId, username: 'User' }, // Should be replaced with actual user data in a real app
      trade.userItem,
      trade.theirItem
    );
    
    return { success: true, trade: updatedTrade };
  };

  // Request feedback for a declined trade
  const requestTradeFeedback = (tradeId, notificationId) => {
    const trade = tradeInteractions.find(t => t.id === tradeId);
    
    if (!trade || trade.status !== TRADE_STATUS.DECLINED) {
      return { success: false, message: 'Trade not found or not in declined state' };
    }
    
    // Update the trade with new status
    const updatedTrade = {
      ...trade,
      status: TRADE_STATUS.FEEDBACK_REQUESTED,
      updatedAt: new Date().toISOString(),
      history: [
        ...trade.history,
        {
          type: 'feedback_requested',
          userId: currentUser.id,
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    // Update state
    const newInteractions = tradeInteractions.map(t => 
      t.id === tradeId ? updatedTrade : t
    );
    
    setTradeInteractions(newInteractions);
    saveTradeInteractions(newInteractions);
    
    // Update notification action
    if (notificationId) {
      updateNotificationAction(notificationId, 'feedback_requested');
    }
    
    // Create notification for the trade decliner
    addFeedbackRequestNotification(
      { id: trade.fromUserId, username: 'User' }, // Should be replaced with actual user data
      trade.userItem,
      trade.theirItem,
      trade.id
    );
    
    return { success: true, trade: updatedTrade };
  };

  // Respond to feedback request (accept or decline)
  const respondToFeedbackRequest = (tradeId, accept, feedback, notificationId) => {
    const trade = tradeInteractions.find(t => t.id === tradeId);
    
    if (!trade || trade.status !== TRADE_STATUS.FEEDBACK_REQUESTED) {
      return { success: false, message: 'Trade not found or feedback not requested' };
    }
    
    // Update the trade with new status
    const newStatus = accept 
      ? TRADE_STATUS.FEEDBACK_ACCEPTED 
      : TRADE_STATUS.FEEDBACK_DECLINED;
      
    const updatedTrade = {
      ...trade,
      status: newStatus,
      feedback: accept ? feedback : null,
      updatedAt: new Date().toISOString(),
      history: [
        ...trade.history,
        {
          type: accept ? 'feedback_accepted' : 'feedback_declined',
          userId: currentUser.id,
          timestamp: new Date().toISOString(),
          feedback: accept ? feedback : null
        }
      ]
    };
    
    // Update state
    const newInteractions = tradeInteractions.map(t => 
      t.id === tradeId ? updatedTrade : t
    );
    
    setTradeInteractions(newInteractions);
    saveTradeInteractions(newInteractions);
    
    // Update notification action
    if (notificationId) {
      updateNotificationAction(notificationId, accept ? 'feedback_accepted' : 'feedback_declined');
    }
    
    return { success: true, trade: updatedTrade };
  };

  // Complete a trade (after it was accepted)
  const completeTrade = (tradeId) => {
    const trade = tradeInteractions.find(t => t.id === tradeId);
    
    if (!trade || trade.status !== TRADE_STATUS.ACCEPTED) {
      return { success: false, message: 'Trade not found or not accepted' };
    }
    
    // Update the trade with new status
    const updatedTrade = {
      ...trade,
      status: TRADE_STATUS.COMPLETED,
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      history: [
        ...trade.history,
        {
          type: 'trade_completed',
          userId: currentUser.id,
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    // Update state
    const newInteractions = tradeInteractions.map(t => 
      t.id === tradeId ? updatedTrade : t
    );
    
    setTradeInteractions(newInteractions);
    saveTradeInteractions(newInteractions);
    
    return { success: true, trade: updatedTrade };
  };

  // Cancel a trade (after it was accepted)
  const cancelTrade = (tradeId) => {
    const trade = tradeInteractions.find(t => t.id === tradeId);
    
    if (!trade || trade.status !== TRADE_STATUS.ACCEPTED) {
      return { success: false, message: 'Trade not found or not accepted' };
    }
    
    // Update the trade with new status
    const updatedTrade = {
      ...trade,
      status: TRADE_STATUS.CANCELED,
      updatedAt: new Date().toISOString(),
      canceledAt: new Date().toISOString(),
      history: [
        ...trade.history,
        {
          type: 'trade_canceled',
          userId: currentUser.id,
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    // Update state
    const newInteractions = tradeInteractions.map(t => 
      t.id === tradeId ? updatedTrade : t
    );
    
    setTradeInteractions(newInteractions);
    saveTradeInteractions(newInteractions);
    
    return { success: true, trade: updatedTrade };
  };

  // Get all trade interactions involving the current user
  const getAllTradeInteractions = () => {
    return tradeInteractions.filter(t => 
      t.fromUserId === currentUser?.id || t.toUserId === currentUser?.id
    );
  };

  // Get pending trade offers sent to the current user
  const getPendingTradeOffers = () => {
    return tradeInteractions.filter(t => 
      t.toUserId === currentUser?.id && t.status === TRADE_STATUS.PENDING
    );
  };

  // Get pending feedback requests sent to the current user
  const getPendingFeedbackRequests = () => {
    return tradeInteractions.filter(t => 
      t.toUserId === currentUser?.id && t.status === TRADE_STATUS.FEEDBACK_REQUESTED
    );
  };

  // Get a specific trade interaction by ID
  const getTradeById = (tradeId) => {
    return tradeInteractions.find(t => t.id === tradeId) || null;
  };

  // Value object for context consumers
  const value = {
    tradeInteractions,
    loading,
    createTradeOffer,
    acceptTradeOffer,
    declineTradeOffer,
    requestTradeFeedback,
    respondToFeedbackRequest,
    completeTrade,
    cancelTrade,
    getAllTradeInteractions,
    getPendingTradeOffers,
    getPendingFeedbackRequests,
    getTradeById,
    TRADE_STATUS
  };

  return (
    <TradeInteractionContext.Provider value={value}>
      {!loading && children}
    </TradeInteractionContext.Provider>
  );
};
