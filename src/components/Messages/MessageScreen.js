import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaExchangeAlt, FaUser, FaArrowLeft, FaSearch, FaHandshake } from 'react-icons/fa';
import theme from '../../styles/theme';

const Container = styled.div`
  padding-bottom: 80px;
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 80px;
    padding-bottom: ${theme.spacing.md};
    max-width: 900px;
    margin: 0 auto;
  }
`;

const PageHeader = styled.div`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.divider};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.fontSize.xlarge};
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  margin-left: ${theme.spacing.md};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.sm} 36px;
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid ${theme.colors.divider};
  font-size: ${theme.typography.fontSize.small};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.skyBlue};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xxl} ${theme.spacing.md};
  text-align: center;
  height: 300px;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  color: ${theme.colors.skyBlue};
  margin-bottom: ${theme.spacing.lg};
`;

const EmptyStateTitle = styled.h2`
  margin-bottom: ${theme.spacing.md};
  font-size: 1.5rem;
`;

const EmptyStateText = styled.p`
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xl};
  max-width: 500px;
`;

const ConversationList = styled.div`
  
`;

const ConversationItem = styled.div`
  display: flex;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.divider};
  cursor: pointer;
  position: relative;
  
  &:hover {
    background-color: rgba(198, 222, 241, 0.1);
  }
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-image: url(${props => props.src || 'https://randomuser.me/api/portraits/women/44.jpg'});
  background-size: cover;
  margin-right: ${theme.spacing.md};
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0; /* Important for text truncation to work */
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
  white-space: nowrap;
  margin-left: ${theme.spacing.sm};
`;

const LastMessage = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.medium};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TradeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${theme.spacing.sm};
  background-color: rgba(106, 90, 205, 0.05);
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
`;

const TradeIcon = styled.div`
  color: ${theme.colors.skyBlue};
  margin-right: ${theme.spacing.xs};
  font-size: 0.9rem;
`;

const TradeItemsContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
`;

const TradeItemImage = styled.div`
  width: 30px;
  height: 30px;
  border-radius: ${theme.borderRadius.small};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  margin-right: ${theme.spacing.xs};
  flex-shrink: 0;
  border: 1px solid white;
`;

const TradeItemInfo = styled.div`
  font-size: ${theme.typography.fontSize.small};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
`;

const TradeItemTitle = styled.div`
  font-weight: ${theme.typography.fontWeight.medium};
`;

const TradeItemPrice = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.xsmall};
`;

const UnreadBadge = styled.div`
  position: absolute;
  top: 50%;
  right: ${theme.spacing.md};
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #6A5ACD;
`;

const MessageScreen = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For this demo, we'll load from localStorage and add some sample data
    const loadConversations = () => {
      try {
        const savedConversations = localStorage.getItem('tedlistConversations');
        let conversationData = [];
        
        if (savedConversations) {
          conversationData = JSON.parse(savedConversations);
        }
        
        // If no conversations found, add sample ones
        if (conversationData.length === 0) {
          // Add sample trade conversations
          conversationData = [
            {
              id: 'c1',
              user: {
                id: 'u1',
                name: 'Maya Goldstein',
                avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
              },
              lastMessage: {
                text: 'Hi! Is your item still available for trade?',
                timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
                read: false
              },
              trade: {
                id: 't1',
                userItem: {
                  id: 'uitem1',
                  title: 'Vintage Record Player',
                  price: 'For Trade',
                  image: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
                },
                theirItem: {
                  id: 'titem1',
                  title: 'Ceramic Plant Pot Set',
                  price: 'For Trade',
                  image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
                }
              }
            },
            {
              id: 'c2',
              user: {
                id: 'u2',
                name: 'Daniel Levi',
                avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
              },
              lastMessage: {
                text: 'Would you be willing to meet tomorrow for the trade?',
                timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
                read: true
              },
              trade: {
                id: 't2',
                userItem: {
                  id: 'uitem2',
                  title: 'Professional Camera Lenses',
                  price: 'For Trade',
                  image: 'https://images.unsplash.com/photo-1520549233664-03f65c1d1327?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
                },
                theirItem: {
                  id: 'titem2',
                  title: 'Vintage Bicycle',
                  price: 'For Trade',
                  image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
                }
              }
            },
            {
              id: 'c3',
              user: {
                id: 'u3',
                name: 'David Cohen',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
              },
              lastMessage: {
                text: 'Would you consider selling for cash instead of trading?',
                timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
                read: true
              },
              trade: {
                id: 't3',
                userItem: {
                  id: 'uitem3',
                  title: 'Handcrafted Ceramic Set',
                  price: 'For Trade',
                  image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
                },
                theirItem: null // They're interested in buying, not trading
              }
            }
          ];
          
          // Save to localStorage
          localStorage.setItem('tedlistConversations', JSON.stringify(conversationData));
        }
        
        setConversations(conversationData);
      } catch (e) {
        console.error('Error loading conversations:', e);
        setConversations([]);
      }
    };
    
    loadConversations();
  }, []);
  
  const formatTimestamp = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    // Less than a day
    if (diff < 1000 * 60 * 60 * 24) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Less than a week
    if (diff < 1000 * 60 * 60 * 24 * 7) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const date = new Date(timestamp);
      return days[date.getDay()];
    }
    
    // Otherwise show date
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  const filteredConversations = conversations.filter(conv => 
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (conv.trade?.userItem?.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (conv.trade?.theirItem?.title?.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleConversationClick = (id) => {
    // Mark as read
    const updatedConversations = conversations.map(conv => {
      if (conv.id === id) {
        return {
          ...conv,
          lastMessage: {
            ...conv.lastMessage,
            read: true
          }
        };
      }
      return conv;
    });
    
    // Save to localStorage
    localStorage.setItem('tedlistConversations', JSON.stringify(updatedConversations));
    setConversations(updatedConversations);
    
    // Navigate to conversation
    navigate(`/messages/${id}`);
  };
  
  return (
    <Container>
      <PageHeader>
        <PageTitle>Messages</PageTitle>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput 
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
      </PageHeader>
      
      {filteredConversations.length > 0 ? (
        <ConversationList>
          {filteredConversations.map(conv => (
            <ConversationItem 
              key={conv.id}
              onClick={() => handleConversationClick(conv.id)}
            >
              <Avatar src={conv.user.avatar} />
              <Content>
                <Header>
                  <UserName>{conv.user.name}</UserName>
                  <Time>{formatTimestamp(conv.lastMessage.timestamp)}</Time>
                </Header>
                <LastMessage>{conv.lastMessage.text}</LastMessage>
                
                {conv.trade && (
                  <TradeContainer>
                    <TradeIcon>
                      <FaHandshake />
                    </TradeIcon>
                    <TradeItemsContainer>
                      <TradeItemImage src={conv.trade.userItem.image} />
                      <TradeItemInfo>
                        <TradeItemTitle>Your {conv.trade.userItem.title}</TradeItemTitle>
                      </TradeItemInfo>
                      
                      {conv.trade.theirItem && (
                        <>
                          <TradeIcon>
                            <FaExchangeAlt />
                          </TradeIcon>
                          <TradeItemImage src={conv.trade.theirItem.image} />
                          <TradeItemInfo>
                            <TradeItemTitle>Their {conv.trade.theirItem.title}</TradeItemTitle>
                          </TradeItemInfo>
                        </>
                      )}
                    </TradeItemsContainer>
                  </TradeContainer>
                )}
              </Content>
              
              {!conv.lastMessage.read && <UnreadBadge />}
            </ConversationItem>
          ))}
        </ConversationList>
      ) : (
        <EmptyState>
          <EmptyStateIcon>
            <FaHandshake />
          </EmptyStateIcon>
          <EmptyStateTitle>No conversations yet</EmptyStateTitle>
          <EmptyStateText>
            When you match with someone on an item trade, your conversations will appear here.
          </EmptyStateText>
        </EmptyState>
      )}
    </Container>
  );
};

export default MessageScreen;