import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCircle } from 'react-icons/fa';
import theme from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';
import { getConversationsWithFallback } from '../../services/message.service';

const Container = styled.div`
  padding-bottom: 80px;
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 80px;
    padding-bottom: ${theme.spacing.md};
  }
`;

const PageHeader = styled.div`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.divider};
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.fontSize.xlarge};
`;

const ConversationList = styled.div`
  
`;

const ConversationItem = styled.div`
  display: flex;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.divider};
  cursor: pointer;
  
  &:hover {
    background-color: rgba(198, 222, 241, 0.1);
  }
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-size: cover;
  margin-right: ${theme.spacing.md};
`;

const Content = styled.div`
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.xs};
`;

const UserName = styled.div`
  font-weight: ${theme.typography.fontWeight.bold};
`;

const Time = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.small};
`;

const LastMessage = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.medium};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
`;

const ItemPreview = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${theme.spacing.xs};
  padding: ${theme.spacing.xs};
  background-color: rgba(198, 222, 241, 0.1);
  border-radius: ${theme.borderRadius.small};
`;

const ItemImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.small};
  background-size: cover;
  margin-right: ${theme.spacing.sm};
`;

const ItemName = styled.div`
  font-size: ${theme.typography.fontSize.small};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const EmptyState = styled.div`
  padding: ${theme.spacing.xxl};
  text-align: center;
`;

const EmptyStateTitle = styled.h2`
  margin-bottom: ${theme.spacing.md};
`;

const EmptyStateText = styled.p`
  color: ${theme.colors.textSecondary};
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xxl};
  
  .spinner {
    width: 40px;
    height: 40px;
    margin-bottom: ${theme.spacing.md};
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-left-color: ${theme.colors.primary};
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl};
  color: ${theme.colors.error};
`;

const RefreshButton = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.small};
  margin-top: ${theme.spacing.md};
  cursor: pointer;
  
  &:hover {
    background-color: ${theme.colors.primaryDark};
  }
`;

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const UnreadIndicator = styled.span`
  color: ${theme.colors.primary};
  font-size: 8px;
  margin-right: 5px;
  display: flex;
  align-items: center;
`;

const MessagesScreen = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Only fetch conversations if user is logged in
    if (currentUser) {
      fetchConversations();
    } else {
      setLoading(false);
    }
  }, [currentUser]);
  
  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      // Use our service to fetch conversations from API with localStorage fallback
      const fetchedConversations = await getConversationsWithFallback();
      
      // If we didn't get any conversations from API or localStorage, use sample data
      if (!fetchedConversations || fetchedConversations.length === 0) {
        // Sample data in case no conversations exist yet
        setConversations([{
          id: 'sample-1',
          otherUser: {
            id: 'user-1',
            name: 'Noa',
            profileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
          },
          lastMessage: {
            content: 'Is this still available?',
            timestamp: new Date(),
            isRead: false
          },
          item: {
            id: 'item-1',
            name: 'iPhone 13 Pro - 256GB',
            image: 'https://images.unsplash.com/photo-1592750475357-76f3da3fcb0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
          }
        }]);
      } else {
        setConversations(fetchedConversations);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleConversationClick = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };
  
  // Format timestamp to readable format
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    
    // Today's date
    const today = new Date();
    
    // Check if the message is from today
    if (date.toDateString() === today.toDateString()) {
      // Return time in format 14:23
      return date.getHours().toString().padStart(2, '0') + ':' + 
             date.getMinutes().toString().padStart(2, '0');
    } else {
      // Return date in format Jan 15
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[date.getMonth()] + ' ' + date.getDate();
    }
  };
  
  if (loading) {
    return (
      <Container>
        <PageHeader>
          <PageTitle>Messages</PageTitle>
        </PageHeader>
        <LoadingState>
          <div className="spinner"></div>
          <p>Loading conversations...</p>
        </LoadingState>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <PageHeader>
          <PageTitle>Messages</PageTitle>
        </PageHeader>
        <ErrorState>
          <p>{error}</p>
          <RefreshButton onClick={fetchConversations}>Try Again</RefreshButton>
        </ErrorState>
      </Container>
    );
  }
  
  return (
    <Container>
      <PageHeader>
        <PageTitle>Messages</PageTitle>
      </PageHeader>
      
      {conversations && conversations.length > 0 ? (
        <ConversationList>
          {conversations.map((conversation) => (
            <ConversationItem 
              key={conversation.id} 
              onClick={() => handleConversationClick(conversation.id)}
            >
              <Avatar style={{ backgroundImage: `url(${conversation.otherUser.profileImage})` }} />
              <Content>
                <Header>
                  <UserName>{conversation.otherUser.name}</UserName>
                  <TimeWrapper>
                    {!conversation.lastMessage.isRead && (
                      <UnreadIndicator>
                        <FaCircle />
                      </UnreadIndicator>
                    )}
                    <Time>{formatMessageTime(conversation.lastMessage.timestamp)}</Time>
                  </TimeWrapper>
                </Header>
                <LastMessage>
                  {conversation.lastMessage.content}
                </LastMessage>
                {conversation.item && (
                  <ItemPreview>
                    <ItemImage style={{ backgroundImage: `url(${conversation.item.image})` }} />
                    <ItemName>{conversation.item.name}</ItemName>
                  </ItemPreview>
                )}
              </Content>
            </ConversationItem>
          ))}
        </ConversationList>
      ) : (
        <EmptyState>
          <EmptyStateTitle>No Messages Yet</EmptyStateTitle>
          <EmptyStateText>
            When you connect with other users, your conversations will appear here.
          </EmptyStateText>
        </EmptyState>
      )}
    </Container>
  );
};

export default MessagesScreen;
