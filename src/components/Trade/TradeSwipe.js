import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaHeart, FaTimes, FaInfo, FaHandshake, FaExchangeAlt, FaComments, FaInstagram, FaComment } from 'react-icons/fa';
import theme from '../../styles/theme';

const Container = styled.div`
  padding: ${theme.spacing.md};
  padding-bottom: 80px; /* Space for navbar */
  height: 100vh;
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.lg} ${theme.spacing.xxl};
    padding-top: 80px;
    padding-bottom: ${theme.spacing.lg};
    max-width: 1200px;
    margin: 0 auto;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing.md};
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${theme.colors.skyBlue};
  }
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize.xlarge};
  color: #6A5ACD;
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const YourOfferBanner = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md};
  background: linear-gradient(90deg, rgba(106, 90, 205, 0.1), rgba(138, 43, 226, 0.1));
  border-radius: ${theme.borderRadius.medium};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.small};
  
  @media (min-width: ${theme.breakpoints.md}) {
    max-width: 450px;
    margin: 0 auto ${theme.spacing.lg};
  }
`;

const YourOfferImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${theme.borderRadius.small};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  margin-right: ${theme.spacing.md};
  border: 2px solid white;
  box-shadow: ${theme.shadows.small};
`;

const YourOfferInfo = styled.div`
  flex: 1;
`;

const YourOfferTitle = styled.h3`
  font-size: ${theme.typography.fontSize.medium};
  margin-bottom: ${theme.spacing.xs};
`;

const YourOfferSubtitle = styled.div`
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.textSecondary};
  display: flex;
  align-items: center;
  
  svg {
    color: #6A5ACD;
    margin-right: ${theme.spacing.xs};
  }
`;

const SwipeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 250px);
  position: relative;
  overflow: hidden;
  
  @media (min-width: ${theme.breakpoints.md}) {
    height: calc(100vh - 290px);
  }
`;

const CardsContainer = styled.div`
  width: 100%;
  max-width: 350px;
  height: 100%;
  max-height: 500px;
  position: relative;
  
  @media (min-width: ${theme.breakpoints.md}) {
    max-width: 450px;
    max-height: 600px;
  }
`;

const SwipeCard = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: ${theme.borderRadius.large};
  background-color: white;
  box-shadow: ${theme.shadows.medium};
  overflow: hidden;
  transition: transform 0.3s ease;
  transform: translateX(${props => props.offset}px) rotate(${props => props.offset * 0.1}deg);
  opacity: ${props => props.isActive ? 1 : 0};
  visibility: ${props => props.isActive ? 'visible' : 'hidden'};
  pointer-events: ${props => props.isActive ? 'auto' : 'none'};
`;

const CardImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const CardContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${theme.spacing.md};
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
`;

const CardTitle = styled.h2`
  font-size: ${theme.typography.fontSize.large};
  margin-bottom: ${theme.spacing.xs};
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
`;

const CardPrice = styled.div`
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.medium};
  margin-bottom: ${theme.spacing.xs};
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: ${theme.spacing.xs};
  }
`;

const CardLocation = styled.div`
  font-size: ${theme.typography.fontSize.small};
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
`;

const CardTag = styled.div`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.fontSize.small};
  font-weight: ${theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: ${theme.spacing.xs};
    font-size: 0.8rem;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.lg};
`;

const ActionButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: ${theme.shadows.small};
  transition: all 0.2s;
  border: none;
  background-color: white;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${theme.shadows.medium};
  }
  
  @media (min-width: ${theme.breakpoints.md}) {
    width: 70px;
    height: 70px;
    font-size: 1.8rem;
  }
`;

const LikeButton = styled(ActionButton)`
  color: #4CAF50;
  
  &:hover {
    background-color: rgba(76, 175, 80, 0.1);
  }
`;

const DislikeButton = styled(ActionButton)`
  color: #F44336;
  
  &:hover {
    background-color: rgba(244, 67, 54, 0.1);
  }
`;

const InfoButton = styled(ActionButton)`
  color: ${theme.colors.skyBlue};
  
  &:hover {
    background-color: rgba(198, 222, 241, 0.2);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.textSecondary};
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${theme.spacing.md};
  color: #6A5ACD;
`;

const EmptyStateTitle = styled.h2`
  margin-bottom: ${theme.spacing.md};
  font-size: 1.5rem;
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 1.8rem;
  }
`;

const EmptyStateText = styled.p`
  margin-bottom: ${theme.spacing.lg};
  line-height: 1.5;
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 1.1rem;
  }
`;

const ActionLink = styled.button`
  background: linear-gradient(135deg, #6A5ACD, #8A2BE2);
  color: white;
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.medium};
  font-weight: ${theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.medium};
  }
  
  svg {
    margin-right: ${theme.spacing.sm};
  }
`;

const SwipeAnimationMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
`;

const MatchOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(106, 90, 205, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  text-align: center;
  padding: ${theme.spacing.md};
`;

const MatchContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${theme.spacing.xl};
  color: white;
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const MatchHeader = styled.h1`
  font-size: 3rem;
  color: white;
  margin-bottom: ${theme.spacing.lg};
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 4rem;
  }
`;

const MatchText = styled.p`
  color: white;
  font-size: 1.2rem;
  margin-bottom: ${theme.spacing.xxl};
  max-width: 500px;
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

const ItemsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.xxl};
  
  @media (min-width: ${theme.breakpoints.md}) {
    gap: ${theme.spacing.xl};
  }
`;

const ItemCard = styled.div`
  text-align: center;
  width: 120px;
  
  @media (min-width: ${theme.breakpoints.md}) {
    width: 200px;
  }
`;

const ItemImage = styled.div`
  width: 100%;
  height: 120px;
  border-radius: ${theme.borderRadius.medium};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border: 3px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  margin-bottom: ${theme.spacing.sm};
  
  @media (min-width: ${theme.breakpoints.md}) {
    height: 200px;
  }
`;

const ItemName = styled.div`
  color: white;
  font-size: ${theme.typography.fontSize.small};
  font-weight: ${theme.typography.fontWeight.medium};
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.medium};
  }
`;

const HeartIcon = styled.div`
  color: white;
  font-size: 2rem;
  margin: 0 ${theme.spacing.md};
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 3rem;
  }
`;

const MatchButtonsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
`;

const MatchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.large};
  background-color: ${props => props.primary ? 'white' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.primary ? '#6A5ACD' : 'white'};
  border: none;
  font-weight: ${theme.typography.fontWeight.bold};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const InstagramButton = styled(MatchButton)`
  background-color: #833AB4;
  color: white;
  
  &:hover {
    background-color: #5851DB;
  }
`;

const CloseMatchButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${theme.spacing.md};
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${theme.colors.skyBlue};
  }
`;

const TradeSwipe = () => {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const [userItem, setUserItem] = useState(null);
  const [tradeItems, setTradeItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedAll, setSwipedAll] = useState(false);
  const [offset, setOffset] = useState(0);
  const [showLikeMessage, setShowLikeMessage] = useState(false);
  const [showDislikeMessage, setShowDislikeMessage] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedItem, setMatchedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data: user's selected item and tradeable items from others
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get the user's selected item for trade
        const savedItems = localStorage.getItem('tedlistUserItems');
        if (savedItems) {
          const parsedItems = JSON.parse(savedItems);
          const selectedItem = parsedItems.find(item => item.id === itemId);
          
          if (selectedItem) {
            setUserItem({
              id: selectedItem.id,
              title: selectedItem.title,
              price: selectedItem.price,
              image: selectedItem.imageUrl || selectedItem.images?.[0] || 'https://via.placeholder.com/500x500?text=No+Image'
            });
          } else {
            // If item not found, go back to trade selection
            console.error('Selected item not found');
            navigate('/trade');
            return;
          }
        } else {
          // If no saved items, go back to trade selection
          navigate('/trade');
          return;
        }
        
        // In a real app, we would fetch trade items from an API
        // For now, we'll use sample data and filter out own items
        
        // Get all tradeable items from other users
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter out own items
        // In a real app, this would be filtered on the server
        const filteredItems = [...sampleTradeItems];
        
        setTradeItems(filteredItems);
        setSwipedAll(filteredItems.length === 0);
      } catch (e) {
        console.error('Error fetching trade data:', e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [itemId, navigate]);

  const handleSwipe = (direction) => {
    // Current item being shown
    const currentItem = tradeItems[currentIndex];
    
    if (direction === 'right') {
      setOffset(300);
      setShowLikeMessage(true);
      
      // Simulate a match (would be handled by backend in real app)
      // For this demo, let's say we match with every 3rd item
      if ((currentIndex + 1) % 3 === 0) {
        // Save the matched item before changing index
        setMatchedItem(currentItem);
        
        // Show match dialog after animation completes
        setTimeout(() => {
          setShowMatch(true);
        }, 500);
      }
    } else {
      setOffset(-300);
      setShowDislikeMessage(true);
    }

    // Reset after animation
    setTimeout(() => {
      setOffset(0);
      setShowLikeMessage(false);
      setShowDislikeMessage(false);
      setCurrentIndex(prev => {
        const newIndex = prev + 1;
        if (newIndex >= tradeItems.length) {
          setSwipedAll(true);
        }
        return newIndex;
      });
    }, 300);
  };

  const viewDetails = (id) => {
    navigate(`/items/${id}`);
  };
  
  const handleMessageClick = () => {
    // In a real app, we'd navigate to a messaging screen with this user
    // For now, just close the match overlay
    setShowMatch(false);
    
    // Create a conversation for this match and save to localStorage
    const conversation = {
      id: `c${Date.now()}`,
      user: {
        id: 'matched_user',
        name: 'Trading Partner',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      lastMessage: {
        text: 'Hi! I would like to trade with you!',
        timestamp: Date.now(),
        read: false
      },
      trade: {
        id: `t${Date.now()}`,
        userItem: userItem,
        theirItem: matchedItem
      }
    };
    
    // Get existing conversations or initialize empty array
    const existingConversationsJson = localStorage.getItem('tedlistConversations');
    let conversations = [];
    if (existingConversationsJson) {
      conversations = JSON.parse(existingConversationsJson);
    }
    
    // Add new conversation
    conversations.push(conversation);
    
    // Save to localStorage
    localStorage.setItem('tedlistConversations', JSON.stringify(conversations));
    
    // Navigate to messages
    navigate('/messages');
  };
  
  const handleShareOnInstagram = () => {
    // Create a trade info object for sharing
    const tradeInfo = {
      userItem: userItem,
      theirItem: matchedItem,
      matchDate: new Date().toLocaleDateString()
    };
    
    // Store in localStorage for the share screen to access
    localStorage.setItem('tedlistShareTradeInfo', JSON.stringify(tradeInfo));
    
    // Navigate to share screen
    navigate('/share');
  };
  
  const handleCloseMatch = () => {
    setShowMatch(false);
  };

  if (loading) {
    return <Container><div>Loading...</div></Container>;
  }
  
  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/trade')}>
          <FaArrowLeft />
        </BackButton>
        <Title>Find Trade Matches</Title>
      </Header>
      
      {userItem && (
        <YourOfferBanner>
          <YourOfferImage src={userItem.image} />
          <YourOfferInfo>
            <YourOfferTitle>{userItem.title}</YourOfferTitle>
            <YourOfferSubtitle>
              <FaExchangeAlt /> You're offering this item for trade
            </YourOfferSubtitle>
          </YourOfferInfo>
        </YourOfferBanner>
      )}

      <SwipeContainer>
        {tradeItems.length > 0 && !swipedAll ? (
          <>
            <CardsContainer>
              {tradeItems.map((item, index) => (
                <SwipeCard 
                  key={item.id} 
                  isActive={index === currentIndex}
                  offset={index === currentIndex ? offset : 0}
                >
                  <CardImage src={item.image}>
                    <SwipeAnimationMessage show={showLikeMessage && index === currentIndex}>
                      TRADE!
                    </SwipeAnimationMessage>
                    <SwipeAnimationMessage show={showDislikeMessage && index === currentIndex}>
                      PASS
                    </SwipeAnimationMessage>
                    <CardTag>
                      <FaHandshake /> For Trade
                    </CardTag>
                    <CardContent>
                      <CardTitle>{item.title}</CardTitle>
                      <CardPrice>
                        <FaExchangeAlt /> {item.price}
                      </CardPrice>
                      <CardLocation>{item.location}</CardLocation>
                    </CardContent>
                  </CardImage>
                </SwipeCard>
              ))}
            </CardsContainer>

            <ActionsContainer>
              <DislikeButton onClick={() => handleSwipe('left')}>
                <FaTimes />
              </DislikeButton>
              
              <InfoButton onClick={() => tradeItems[currentIndex] && viewDetails(tradeItems[currentIndex].id)}>
                <FaInfo />
              </InfoButton>
              
              <LikeButton onClick={() => handleSwipe('right')}>
                <FaHeart />
              </LikeButton>
            </ActionsContainer>
          </>
        ) : (
          <EmptyState>
            <EmptyStateIcon>
              <FaHandshake />
            </EmptyStateIcon>
            <EmptyStateTitle>No More Trade Items</EmptyStateTitle>
            <EmptyStateText>
              You've seen all available items for trade. Check back later for more!
            </EmptyStateText>
            <ActionLink onClick={() => navigate('/trade')}>
              <FaExchangeAlt /> Select Another Item
            </ActionLink>
          </EmptyState>
        )}
      </SwipeContainer>
      
      {showMatch && matchedItem && (
        <MatchOverlay>
          <MatchContent>
            <MatchHeader>It's a Match! 🎉</MatchHeader>
            <MatchText>
              You and someone else both expressed interest in each other's items.
            </MatchText>
            <ItemsContainer>
              <ItemCard>
                <ItemImage src={userItem.image} alt={userItem.title} />
                <ItemName>Your Item</ItemName>
              </ItemCard>
              <HeartIcon>💕</HeartIcon>
              <ItemCard>
                <ItemImage src={matchedItem.image} alt={matchedItem.title} />
                <ItemName>Their Item</ItemName>
              </ItemCard>
            </ItemsContainer>
            <MatchButtonsContainer>
              <MatchButton primary onClick={handleMessageClick}>
                <FaComment />
                Message
              </MatchButton>
              <InstagramButton onClick={handleShareOnInstagram}>
                <FaInstagram />
                Share
              </InstagramButton>
            </MatchButtonsContainer>
            <CloseMatchButton onClick={handleCloseMatch}>
              Keep Swiping
            </CloseMatchButton>
          </MatchContent>
        </MatchOverlay>
      )}
    </Container>
  );
};

export default TradeSwipe;

// Sample data for tradeable items (this would come from API in real app)
const sampleTradeItems = [
  {
    id: 't1',
    title: 'Vintage Record Player',
    price: 'For Trade',
    location: 'Tel Aviv',
    image: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    description: 'Vintage record player in great working condition. Looking to trade for audio equipment or books.',
    owner: 'David',
    ownerId: 'user1'
  },
  {
    id: 't2',
    title: 'Professional Camera Lenses',
    price: 'For Trade',
    location: 'Jerusalem',
    image: 'https://images.unsplash.com/photo-1520549233664-03f65c1d1327?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    description: 'Set of professional camera lenses in excellent condition. Looking for electronics or photography equipment.',
    owner: 'Maya',
    ownerId: 'user2'
  },
  {
    id: 't3',
    title: 'Handcrafted Ceramic Set',
    price: 'For Trade',
    location: 'Haifa',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    description: 'Beautiful handcrafted ceramic plates and bowls. Each piece is unique. Looking to trade for home decor or plants.',
    owner: 'Noa',
    ownerId: 'user3'
  },
  {
    id: 't4',
    title: 'Vintage Comic Book Collection',
    price: 'For Trade',
    location: 'Beer Sheva',
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    description: 'Collection of well-preserved vintage comic books from the 80s and 90s. Looking for other collectibles or tech gadgets.',
    owner: 'Dan',
    ownerId: 'user4'
  },
  {
    id: 't5',
    title: 'Professional DJ Equipment',
    price: 'For Trade',
    location: 'Eilat',
    image: 'https://images.unsplash.com/photo-1571510649755-66c9eb133540?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    description: 'Professional DJ setup including mixer and controllers. Everything in great condition. Looking for musical instruments or audio gear.',
    owner: 'Yael',
    ownerId: 'user5'
  }
];
