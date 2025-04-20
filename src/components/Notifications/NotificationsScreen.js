import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaBell, FaArrowLeft, FaExchangeAlt, FaTimes, 
  FaCheck, FaCommentDots, FaHandshake, FaInfoCircle 
} from 'react-icons/fa';
import { useNotifications, NOTIFICATION_TYPES } from '../../contexts/NotificationContext';
import { useTradeInteraction, TRADE_STATUS } from '../../contexts/TradeInteractionContext';
import theme from '../../styles/theme';

const Container = styled.div`
  padding-bottom: 80px;
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 80px;
    padding-bottom: ${theme.spacing.md};
    max-width: 800px;
    margin: 0 auto;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md};
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid ${theme.colors.divider};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-right: ${theme.spacing.md};
  cursor: pointer;
  color: ${theme.colors.textPrimary};
  font-size: 1.2rem;
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.fontSize.large};
  margin: 0;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: ${theme.spacing.sm};
  }
`;

const TabsContainer = styled.div`
  display: flex;
  background-color: white;
  border-bottom: 1px solid ${theme.colors.divider};
`;

const Tab = styled.button`
  flex: 1;
  padding: ${theme.spacing.md};
  border: none;
  background: none;
  font-weight: ${props => props.active ? theme.typography.fontWeight.bold : theme.typography.fontWeight.regular};
  color: ${props => props.active ? theme.colors.primary : theme.colors.textSecondary};
  border-bottom: 2px solid ${props => props.active ? theme.colors.primary : 'transparent'};
  cursor: pointer;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xxl} ${theme.spacing.md};
  text-align: center;
  height: 200px;
  color: ${theme.colors.textSecondary};
`;

const EmptyStateIcon = styled.div`
  font-size: 2.5rem;
  color: ${theme.colors.divider};
  margin-bottom: ${theme.spacing.md};
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.divider};
  background-color: ${props => props.read ? 'white' : 'rgba(106, 90, 205, 0.05)'};
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing.sm};
`;

const NotificationIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.type) {
      case NOTIFICATION_TYPES.TRADE_OFFER:
        return 'rgba(106, 90, 205, 0.2)';
      case NOTIFICATION_TYPES.TRADE_DECLINED:
        return 'rgba(239, 83, 80, 0.2)';
      case NOTIFICATION_TYPES.FEEDBACK_REQUEST:
        return 'rgba(33, 150, 243, 0.2)';
      default:
        return 'rgba(158, 158, 158, 0.2)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    switch (props.type) {
      case NOTIFICATION_TYPES.TRADE_OFFER:
        return '#6A5ACD';
      case NOTIFICATION_TYPES.TRADE_DECLINED:
        return '#EF5350';
      case NOTIFICATION_TYPES.FEEDBACK_REQUEST:
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  }};
  margin-right: ${theme.spacing.md};
  flex-shrink: 0;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.xs};
`;

const NotificationMessage = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.medium};
  margin-bottom: ${theme.spacing.sm};
`;

const NotificationTime = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.small};
`;

const TradeItems = styled.div`
  display: flex;
  align-items: center;
  margin: ${theme.spacing.md} 0;
  padding: ${theme.spacing.sm};
  background-color: ${theme.colors.greyLight};
  border-radius: ${theme.borderRadius.medium};
`;

const TradeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const TradeItemImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${theme.borderRadius.small};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  margin-bottom: ${theme.spacing.xs};
  border: 1px solid white;
`;

const TradeItemTitle = styled.div`
  font-size: ${theme.typography.fontSize.small};
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100px;
`;

const TradeArrow = styled.div`
  margin: 0 ${theme.spacing.sm};
  color: ${theme.colors.textSecondary};
`;

const ActionButtons = styled.div`
  display: flex;
  margin-top: ${theme.spacing.md};
  gap: ${theme.spacing.sm};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  
  background-color: ${props => {
    if (props.accept) return '#4CAF50';
    if (props.decline) return '#EF5350';
    if (props.feedback) return '#2196F3';
    if (props.secondary) return 'white';
    return theme.colors.primary;
  }};
  
  color: ${props => props.secondary ? theme.colors.textSecondary : 'white'};
  
  border: ${props => props.secondary ? `1px solid ${theme.colors.divider}` : 'none'};
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
  
  svg {
    margin-right: ${theme.spacing.xs};
  }
`;

const FeedbackOptions = styled.div`
  margin-top: ${theme.spacing.md};
  background-color: white;
  border: 1px solid ${theme.colors.divider};
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
`;

const FeedbackOption = styled.button`
  display: block;
  width: 100%;
  padding: ${theme.spacing.md};
  text-align: left;
  border: none;
  background: none;
  border-bottom: 1px solid ${theme.colors.divider};
  cursor: pointer;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${theme.colors.greyLight};
  }
`;

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
};

const NotificationsScreen = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    markAsRead, 
    updateNotificationAction,
    NOTIFICATION_TYPES 
  } = useNotifications();
  
  const {
    acceptTradeOffer,
    declineTradeOffer,
    requestTradeFeedback,
    respondToFeedbackRequest,
    getTradeById,
    TRADE_STATUS
  } = useTradeInteraction();
  
  const [activeTab, setActiveTab] = useState('all');
  const [showingFeedbackOptions, setShowingFeedbackOptions] = useState(null);
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'trades') return notification.type === NOTIFICATION_TYPES.TRADE_OFFER;
    if (activeTab === 'feedback') return notification.type === NOTIFICATION_TYPES.FEEDBACK_REQUEST;
    return true;
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleAcceptTrade = (notification) => {
    const tradeId = getTradeFromNotification(notification)?.id;
    
    if (!tradeId) return;
    
    const result = acceptTradeOffer(tradeId);
    
    if (result.success) {
      updateNotificationAction(notification.id, 'accepted');
      // Navigate to chat
      navigate(`/messages`); // Would go to specific chat in real app
    }
  };

  const handleDeclineTrade = (notification) => {
    const tradeId = getTradeFromNotification(notification)?.id;
    
    if (!tradeId) return;
    
    const result = declineTradeOffer(tradeId, notification.id);
    
    if (result.success) {
      // Update UI
      updateNotificationAction(notification.id, 'declined');
    }
  };

  const handleAskForFeedback = (notification) => {
    const tradeId = getTradeFromNotification(notification)?.id;
    
    if (!tradeId) return;
    
    const result = requestTradeFeedback(tradeId, notification.id);
    
    if (result.success) {
      // Update UI
      updateNotificationAction(notification.id, 'feedback_requested');
    }
  };

  const handleGiveFeedback = (notification) => {
    setShowingFeedbackOptions(notification.id);
  };

  const handleFeedbackOptionSelected = (notification, feedback) => {
    const tradeId = getTradeFromNotification(notification)?.id;
    
    if (!tradeId) return;
    
    const result = respondToFeedbackRequest(tradeId, true, feedback, notification.id);
    
    if (result.success) {
      // Update UI
      updateNotificationAction(notification.id, 'feedback_provided');
      setShowingFeedbackOptions(null);
      
      // Navigate to chat
      navigate(`/messages`); // Would go to specific chat in real app
    }
  };

  const handleDeclineFeedback = (notification) => {
    const tradeId = getTradeFromNotification(notification)?.id;
    
    if (!tradeId) return;
    
    const result = respondToFeedbackRequest(tradeId, false, null, notification.id);
    
    if (result.success) {
      // Update UI
      updateNotificationAction(notification.id, 'feedback_declined');
    }
  };

  // Helper function to get trade from notification
  const getTradeFromNotification = (notification) => {
    // In a real app, this would get the trade from the backend
    // For now, we'll simulate it by creating a basic trade object
    
    if (!notification) return null;
    
    return {
      id: `trade_${notification.id}`,
      fromUserId: notification.fromUser?.id || 'user1',
      toUserId: 'currentUser',
      userItemId: notification.userItem?.id || 'item1',
      theirItemId: notification.theirItem?.id || 'item2',
      status: TRADE_STATUS.PENDING
    };
  };

  // Render notification icon based on type
  const renderNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.TRADE_OFFER:
        return <FaExchangeAlt />;
      case NOTIFICATION_TYPES.TRADE_DECLINED:
        return <FaTimes />;
      case NOTIFICATION_TYPES.FEEDBACK_REQUEST:
        return <FaCommentDots />;
      default:
        return <FaBell />;
    }
  };

  // Render notification content based on type
  const renderNotificationContent = (notification) => {
    const { type, fromUser, userItem, theirItem, actionTaken } = notification;
    
    switch (type) {
      case NOTIFICATION_TYPES.TRADE_OFFER:
        return (
          <>
            <NotificationTitle>
              Trade Offer
            </NotificationTitle>
            <NotificationMessage>
              {fromUser.username} wants to trade their {userItem.title} for your {theirItem.title}
            </NotificationMessage>
            
            <TradeItems>
              <TradeItem>
                <TradeItemImage src={userItem.image} />
                <TradeItemTitle>Their: {userItem.title}</TradeItemTitle>
              </TradeItem>
              
              <TradeArrow>
                <FaExchangeAlt />
              </TradeArrow>
              
              <TradeItem>
                <TradeItemImage src={theirItem.image} />
                <TradeItemTitle>Your: {theirItem.title}</TradeItemTitle>
              </TradeItem>
            </TradeItems>
            
            {!actionTaken && (
              <ActionButtons>
                <ActionButton accept onClick={() => handleAcceptTrade(notification)}>
                  <FaCheck /> Accept
                </ActionButton>
                <ActionButton decline onClick={() => handleDeclineTrade(notification)}>
                  <FaTimes /> Decline
                </ActionButton>
              </ActionButtons>
            )}
            
            {actionTaken && notification.action === 'accepted' && (
              <ActionButtons>
                <ActionButton secondary>
                  <FaHandshake /> Trade Accepted
                </ActionButton>
              </ActionButtons>
            )}
            
            {actionTaken && notification.action === 'declined' && (
              <ActionButtons>
                <ActionButton secondary>
                  <FaTimes /> Trade Declined
                </ActionButton>
              </ActionButtons>
            )}
          </>
        );
        
      case NOTIFICATION_TYPES.TRADE_DECLINED:
        return (
          <>
            <NotificationTitle>
              Trade Declined
            </NotificationTitle>
            <NotificationMessage>
              {fromUser.username} declined your trade offer.
            </NotificationMessage>
            
            <TradeItems>
              <TradeItem>
                <TradeItemImage src={userItem.image} />
                <TradeItemTitle>Your: {userItem.title}</TradeItemTitle>
              </TradeItem>
              
              <TradeArrow>
                <FaExchangeAlt />
              </TradeArrow>
              
              <TradeItem>
                <TradeItemImage src={theirItem.image} />
                <TradeItemTitle>Their: {theirItem.title}</TradeItemTitle>
              </TradeItem>
            </TradeItems>
            
            {!actionTaken && !notification.feedbackRequested && (
              <ActionButtons>
                <ActionButton feedback onClick={() => handleAskForFeedback(notification)}>
                  <FaCommentDots /> Ask for Feedback
                </ActionButton>
                <ActionButton secondary onClick={() => updateNotificationAction(notification.id, 'ignored')}>
                  <FaTimes /> Ignore
                </ActionButton>
              </ActionButtons>
            )}
            
            {actionTaken && notification.action === 'feedback_requested' && (
              <ActionButtons>
                <ActionButton secondary>
                  <FaCommentDots /> Feedback Requested
                </ActionButton>
              </ActionButtons>
            )}
            
            {actionTaken && notification.action === 'ignored' && (
              <ActionButtons>
                <ActionButton secondary>
                  <FaTimes /> Ignored
                </ActionButton>
              </ActionButtons>
            )}
          </>
        );
        
      case NOTIFICATION_TYPES.FEEDBACK_REQUEST:
        return (
          <>
            <NotificationTitle>
              Feedback Request
            </NotificationTitle>
            <NotificationMessage>
              {fromUser.username} would like to know why you declined their trade offer.
            </NotificationMessage>
            
            <TradeItems>
              <TradeItem>
                <TradeItemImage src={userItem.image} />
                <TradeItemTitle>Their: {userItem.title}</TradeItemTitle>
              </TradeItem>
              
              <TradeArrow>
                <FaExchangeAlt />
              </TradeArrow>
              
              <TradeItem>
                <TradeItemImage src={theirItem.image} />
                <TradeItemTitle>Your: {theirItem.title}</TradeItemTitle>
              </TradeItem>
            </TradeItems>
            
            {!actionTaken && (
              <>
                <ActionButtons>
                  <ActionButton feedback onClick={() => handleGiveFeedback(notification)}>
                    <FaCommentDots /> Give Feedback
                  </ActionButton>
                  <ActionButton secondary onClick={() => handleDeclineFeedback(notification)}>
                    <FaTimes /> No Thanks
                  </ActionButton>
                </ActionButtons>
                
                {showingFeedbackOptions === notification.id && (
                  <FeedbackOptions>
                    <FeedbackOption onClick={() => handleFeedbackOptionSelected(notification, "Not interested in this item")}>
                      Not interested in this item
                    </FeedbackOption>
                    <FeedbackOption onClick={() => handleFeedbackOptionSelected(notification, "Looking for something else")}>
                      Looking for something else
                    </FeedbackOption>
                    <FeedbackOption onClick={() => handleFeedbackOptionSelected(notification, "Item condition not as expected")}>
                      Item condition not as expected
                    </FeedbackOption>
                    <FeedbackOption onClick={() => handleFeedbackOptionSelected(notification, "Item value doesn't match")}>
                      Item value doesn't match
                    </FeedbackOption>
                    <FeedbackOption onClick={() => handleFeedbackOptionSelected(notification, "Let's discuss other options")}>
                      Let's discuss other options
                    </FeedbackOption>
                  </FeedbackOptions>
                )}
              </>
            )}
            
            {actionTaken && notification.action === 'feedback_provided' && (
              <ActionButtons>
                <ActionButton secondary>
                  <FaCommentDots /> Feedback Provided
                </ActionButton>
              </ActionButtons>
            )}
            
            {actionTaken && notification.action === 'feedback_declined' && (
              <ActionButtons>
                <ActionButton secondary>
                  <FaTimes /> Feedback Declined
                </ActionButton>
              </ActionButtons>
            )}
          </>
        );
        
      default:
        return (
          <>
            <NotificationTitle>
              Notification
            </NotificationTitle>
            <NotificationMessage>
              You have a new notification
            </NotificationMessage>
          </>
        );
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <FaArrowLeft />
        </BackButton>
        <PageTitle>
          <FaBell /> Notifications
        </PageTitle>
      </Header>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
        >
          All
        </Tab>
        <Tab 
          active={activeTab === 'trades'} 
          onClick={() => setActiveTab('trades')}
        >
          Trade Offers
        </Tab>
        <Tab 
          active={activeTab === 'feedback'} 
          onClick={() => setActiveTab('feedback')}
        >
          Feedback
        </Tab>
      </TabsContainer>
      
      {filteredNotifications.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>
            <FaBell />
          </EmptyStateIcon>
          <div>No notifications yet</div>
        </EmptyState>
      ) : (
        <NotificationList>
          {filteredNotifications.map(notification => (
            <NotificationItem 
              key={notification.id} 
              read={notification.read}
              onClick={() => handleNotificationClick(notification)}
            >
              <NotificationHeader>
                <NotificationIcon type={notification.type}>
                  {renderNotificationIcon(notification.type)}
                </NotificationIcon>
                <NotificationContent>
                  {renderNotificationContent(notification)}
                  <NotificationTime>
                    {formatTimeAgo(notification.timestamp)}
                  </NotificationTime>
                </NotificationContent>
              </NotificationHeader>
            </NotificationItem>
          ))}
        </NotificationList>
      )}
    </Container>
  );
};

export default NotificationsScreen;
