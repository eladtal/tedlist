import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaExchangeAlt, FaPaperPlane, FaHandshake, FaTimesCircle, FaInstagram, FaShareAlt } from 'react-icons/fa';
import theme from '../../styles/theme';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  
  @media (min-width: ${theme.breakpoints.md}) {
    max-width: 900px;
    margin: 0 auto;
    height: calc(100vh - 80px);
    margin-top: 80px;
    border-radius: ${theme.borderRadius.large} ${theme.borderRadius.large} 0 0;
    border: 1px solid ${theme.colors.divider};
    border-bottom: none;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.divider};
  background-color: white;
  z-index: 10;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: ${theme.colors.textPrimary};
  margin-right: ${theme.spacing.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-image: url(${props => props.src || 'https://randomuser.me/api/portraits/women/44.jpg'});
  background-size: cover;
  margin-right: ${theme.spacing.md};
`;

const UserName = styled.div`
  font-weight: ${theme.typography.fontWeight.bold};
`;

const TradePreview = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.divider};
  background-color: rgba(106, 90, 205, 0.05);
  justify-content: space-between;
`;

const TradeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 45%;
`;

const TradeItemImage = styled.div`
  width: 100%;
  height: 120px;
  border-radius: ${theme.borderRadius.medium};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  margin-bottom: ${theme.spacing.sm};
  border: 1px solid white;
`;

const TradeItemInfo = styled.div`
  text-align: center;
  width: 100%;
`;

const TradeItemTitle = styled.div`
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.small};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TradeItemPrice = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.small};
`;

const TradeIcon = styled.div`
  color: ${theme.colors.skyBlue};
  font-size: 1.5rem;
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  gap: ${theme.spacing.xs};
`;

const Message = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${props => props.isUser 
    ? `${theme.borderRadius.large} ${theme.borderRadius.large} 0 ${theme.borderRadius.large}`
    : `${theme.borderRadius.large} ${theme.borderRadius.large} ${theme.borderRadius.large} 0`};
  background-color: ${props => props.isUser 
    ? 'rgba(106, 90, 205, 0.9)'
    : theme.colors.greyLight};
  color: ${props => props.isUser ? 'white' : theme.colors.textPrimary};
  max-width: 70%;
  word-wrap: break-word;
`;

const MessageTime = styled.div`
  font-size: ${theme.typography.fontSize.xsmall};
  color: ${theme.colors.textSecondary};
  margin: 0 ${theme.spacing.xs};
`;

const SystemMessage = styled.div`
  align-self: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: rgba(198, 222, 241, 0.2);
  border-radius: ${theme.borderRadius.large};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.small};
  max-width: 85%;
  text-align: center;
  margin: ${theme.spacing.md} 0;
`;

const InputContainer = styled.div`
  display: flex;
  padding: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.divider};
  background-color: white;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.large};
  border: 1px solid ${theme.colors.divider};
  font-size: ${theme.typography.fontSize.medium};
  
  &:focus {
    outline: none;
    border-color: rgba(106, 90, 205, 0.5);
  }
`;

const SendButton = styled.button`
  background-color: ${props => props.disabled ? theme.colors.greyLight : '#6A5ACD'};
  color: ${props => props.disabled ? theme.colors.textSecondary : 'white'};
  border: none;
  border-radius: 50%;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${theme.spacing.sm};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.disabled ? theme.colors.greyLight : '#5D4FB8'};
  }
`;

const TradeActions = styled.div`
  display: flex;
  padding: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.divider};
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  background-color: rgba(198, 222, 241, 0.1);
`;

const TradeButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.small};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  min-width: 120px;
  flex: 1;
  border: none;
  transition: all 0.2s;
  
  background-color: ${props => {
    if (props.primary) return '#6A5ACD';
    if (props.social) return '#833AB4'; // Instagram purple
    if (props.negative) return theme.colors.error;
    return 'white';
  }};
  
  color: ${props => {
    if (props.primary || props.social || props.negative) return 'white';
    return theme.colors.textSecondary;
  }};
  
  border: ${props => {
    if (props.primary || props.social || props.negative) return 'none';
    return `1px solid ${theme.colors.divider}`;
  }};
  
  &:hover {
    background-color: ${props => {
      if (props.primary) return '#5D4FB8';
      if (props.social) return '#5851DB'; // Darker Instagram purple
      if (props.negative) return '#D32F2F';
      return theme.colors.greyLight;
    }};
    transform: translateY(-2px);
  }
`;

const ChatScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    const loadConversation = () => {
      try {
        setLoading(true);
        const savedConversations = localStorage.getItem('tedlistConversations');
        
        if (savedConversations) {
          const conversations = JSON.parse(savedConversations);
          const convo = conversations.find(c => c.id === id);
          
          if (convo) {
            setConversation(convo);
            
            // Load messages for this conversation
            const savedMessages = localStorage.getItem(`tedlistMessages_${id}`);
            let messageData = [];
            
            if (savedMessages) {
              messageData = JSON.parse(savedMessages);
            } else {
              // Generate sample messages if none exist
              const now = Date.now();
              
              messageData = [
                {
                  id: 'm1',
                  senderId: convo.user.id,
                  text: convo.trade.theirItem 
                    ? `Hi! I'm interested in trading my ${convo.trade.theirItem.title} for your ${convo.trade.userItem.title}.`
                    : `Hi! I'm interested in your ${convo.trade.userItem.title}. Is it still available for trade?`,
                  timestamp: now - 1000 * 60 * 60, // 1 hour ago
                  type: 'message'
                },
                {
                  id: 'm2',
                  senderId: 'me',
                  text: `Hi there! Yes, it's still available for trade.`,
                  timestamp: now - 1000 * 60 * 55, // 55 minutes ago
                  type: 'message'
                },
                {
                  id: 'm3',
                  senderId: 'system',
                  text: 'A trade has been proposed. You can accept or decline this trade.',
                  timestamp: now - 1000 * 60 * 55, // 55 minutes ago
                  type: 'system'
                },
                {
                  id: 'm4',
                  senderId: convo.user.id,
                  text: convo.trade.theirItem 
                    ? `Great! Would you like to meet up to exchange the items?`
                    : `Would you be interested in selling it instead of trading?`,
                  timestamp: now - 1000 * 60 * 45, // 45 minutes ago
                  type: 'message'
                }
              ];
              
              localStorage.setItem(`tedlistMessages_${id}`, JSON.stringify(messageData));
            }
            
            setMessages(messageData);
          } else {
            // Handle conversation not found
            console.error('Conversation not found');
            navigate('/messages');
          }
        }
      } catch (e) {
        console.error('Error loading conversation:', e);
      } finally {
        setLoading(false);
      }
    };
    
    loadConversation();
  }, [id, navigate]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: `m${Date.now()}`,
      senderId: 'me',
      text: newMessage.trim(),
      timestamp: Date.now(),
      type: 'message'
    };
    
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    
    // Save to localStorage
    localStorage.setItem(`tedlistMessages_${id}`, JSON.stringify(updatedMessages));
    
    // Update last message in conversations list
    const savedConversations = localStorage.getItem('tedlistConversations');
    if (savedConversations) {
      const conversations = JSON.parse(savedConversations);
      const updatedConversations = conversations.map(conv => {
        if (conv.id === id) {
          return {
            ...conv,
            lastMessage: {
              text: newMessage.trim(),
              timestamp: Date.now(),
              read: true
            }
          };
        }
        return conv;
      });
      
      localStorage.setItem('tedlistConversations', JSON.stringify(updatedConversations));
    }
    
    // Clear input
    setNewMessage('');
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleAcceptTrade = () => {
    const systemMsg = {
      id: `m${Date.now()}`,
      senderId: 'system',
      text: 'Trade accepted! Exchange contact information to arrange the exchange.',
      timestamp: Date.now(),
      type: 'system'
    };
    
    const updatedMessages = [...messages, systemMsg];
    setMessages(updatedMessages);
    localStorage.setItem(`tedlistMessages_${id}`, JSON.stringify(updatedMessages));
  };
  
  const handleCancelTrade = () => {
    const systemMsg = {
      id: `m${Date.now()}`,
      senderId: 'system',
      text: 'Trade canceled. You can still continue the conversation.',
      timestamp: Date.now(),
      type: 'system'
    };
    
    const updatedMessages = [...messages, systemMsg];
    setMessages(updatedMessages);
    localStorage.setItem(`tedlistMessages_${id}`, JSON.stringify(updatedMessages));
  };
  
  const handleShareTrade = () => {
    // Navigate to the share screen with this conversation ID
    navigate(`/share/${id}`);
  };
  
  const groupMessagesByTime = (messages) => {
    const grouped = [];
    let currentGroup = null;
    
    messages.forEach(message => {
      if (message.type === 'system') {
        if (currentGroup) {
          grouped.push(currentGroup);
          currentGroup = null;
        }
        grouped.push({ system: true, messages: [message] });
      } else {
        // If no current group or different sender, create a new group
        if (!currentGroup || currentGroup.senderId !== message.senderId) {
          if (currentGroup) {
            grouped.push(currentGroup);
          }
          currentGroup = { 
            senderId: message.senderId, 
            isUser: message.senderId === 'me',
            messages: [message] 
          };
        } else {
          // Add to current group if same sender and within 5 minutes
          const lastMsg = currentGroup.messages[currentGroup.messages.length - 1];
          if (message.timestamp - lastMsg.timestamp < 5 * 60 * 1000) {
            currentGroup.messages.push(message);
          } else {
            grouped.push(currentGroup);
            currentGroup = { 
              senderId: message.senderId, 
              isUser: message.senderId === 'me',
              messages: [message] 
            };
          }
        }
      }
    });
    
    if (currentGroup) {
      grouped.push(currentGroup);
    }
    
    return grouped;
  };
  
  if (loading || !conversation) {
    return <div>Loading...</div>;
  }
  
  const groupedMessages = groupMessagesByTime(messages);
  
  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/messages')}>
          <FaArrowLeft />
        </BackButton>
        <UserInfo>
          <Avatar src={conversation.user.avatar} />
          <UserName>{conversation.user.name}</UserName>
        </UserInfo>
      </Header>
      
      {conversation.trade && (
        <TradePreview>
          <TradeItem>
            <TradeItemImage src={conversation.trade.userItem.image} />
            <TradeItemInfo>
              <TradeItemTitle>Your Item</TradeItemTitle>
              <TradeItemTitle>{conversation.trade.userItem.title}</TradeItemTitle>
              <TradeItemPrice>{conversation.trade.userItem.price}</TradeItemPrice>
            </TradeItemInfo>
          </TradeItem>
          
          <TradeIcon>
            <FaExchangeAlt />
          </TradeIcon>
          
          {conversation.trade.theirItem ? (
            <TradeItem>
              <TradeItemImage src={conversation.trade.theirItem.image} />
              <TradeItemInfo>
                <TradeItemTitle>Their Item</TradeItemTitle>
                <TradeItemTitle>{conversation.trade.theirItem.title}</TradeItemTitle>
                <TradeItemPrice>{conversation.trade.theirItem.price}</TradeItemPrice>
              </TradeItemInfo>
            </TradeItem>
          ) : (
            <TradeItem>
              <TradeItemImage src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80" />
              <TradeItemInfo>
                <TradeItemTitle>Interested in buying</TradeItemTitle>
                <TradeItemPrice>No trade item</TradeItemPrice>
              </TradeItemInfo>
            </TradeItem>
          )}
        </TradePreview>
      )}
      
      <MessageList>
        {groupedMessages.map((group, index) => (
          group.system ? (
            <SystemMessage key={`system-${index}`}>
              {group.messages[0].text}
            </SystemMessage>
          ) : (
            <MessageGroup key={`group-${index}`} isUser={group.isUser}>
              {group.messages.map((message, msgIndex) => (
                <Message key={message.id} isUser={group.isUser}>
                  {message.text}
                </Message>
              ))}
              <MessageTime>
                {formatTimestamp(group.messages[group.messages.length - 1].timestamp)}
              </MessageTime>
            </MessageGroup>
          )
        ))}
        <div ref={messagesEndRef} />
      </MessageList>
      
      <TradeActions>
        <TradeButton primary onClick={handleAcceptTrade}>
          <FaHandshake />
          Accept Trade
        </TradeButton>
        <TradeButton social onClick={handleShareTrade}>
          <FaInstagram />
          Share
        </TradeButton>
        <TradeButton negative onClick={handleCancelTrade}>
          <FaTimesCircle />
          Cancel Trade
        </TradeButton>
      </TradeActions>
      
      <InputContainer>
        <MessageInput
          type="text"
          placeholder="Write a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <SendButton 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <FaPaperPlane size={20} />
        </SendButton>
      </InputContainer>
    </Container>
  );
};

export default ChatScreen;
