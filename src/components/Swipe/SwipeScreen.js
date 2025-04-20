import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaHeart, FaTimes, FaInfo, FaHandshake, FaShoppingCart, FaTag, FaPlusCircle, FaUser, FaFilter } from 'react-icons/fa';
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
  margin-bottom: ${theme.spacing.lg};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: ${theme.spacing.sm};
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

const FilterButton = styled.button`
  background: ${props => props.active ? 'rgba(0, 0, 0, 0.05)' : 'none'};
  border: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.active ? theme.colors.skyBlue : theme.colors.textSecondary};
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  
  svg {
    margin-right: ${theme.spacing.xs};
  }
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize.xlarge};
  color: ${props => {
    switch(props.mode) {
      case 'trade': return '#6A5ACD';
      case 'buy': return '#20B2AA';
      default: return theme.colors.textPrimary;
    }
  }};
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const SwipeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 200px);
  position: relative;
  overflow: hidden;
  
  @media (min-width: ${theme.breakpoints.md}) {
    height: calc(100vh - 240px);
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
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
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

const CardOwnerTag = styled(CardTag)`
  top: ${theme.spacing.md};
  left: ${theme.spacing.md};
  right: auto;
  background-color: rgba(33, 150, 243, 0.8);
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
  color: ${props => {
    switch(props.mode) {
      case 'trade': return '#6A5ACD';
      case 'buy': return '#20B2AA';
      default: return theme.colors.skyBlue;
    }
  }};
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
  background: ${props => {
    switch(props.mode) {
      case 'trade': return 'linear-gradient(135deg, #6A5ACD, #8A2BE2)';
      case 'buy': return 'linear-gradient(135deg, #20B2AA, #3CB371)';
      default: return 'linear-gradient(135deg, #FF6347, #FF8C00)';
    }
  }};
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

// Sample items for swiping
const sampleItems = [
  {
    id: '1',
    title: 'Vintage Leather Sofa',
    price: '₪ 1,200',
    location: 'Tel Aviv',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    listingType: 'sale',
    isOwner: false
  },
  {
    id: '2',
    title: 'iPhone 13 Pro - 256GB',
    price: '₪ 2,800',
    location: 'Jerusalem',
    image: 'https://images.unsplash.com/photo-1592286927505-1def25115efb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    listingType: 'sale',
    isOwner: false
  },
  {
    id: '3',
    title: 'Ceramic Plant Pot Set',
    price: '₪ 150',
    location: 'Haifa',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    listingType: 'trade',
    isOwner: false
  },
  {
    id: '4',
    title: 'Nikon D850 Camera',
    price: '₪ 5,500',
    location: 'Eilat',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    listingType: 'sale',
    isOwner: false
  },
  {
    id: '5',
    title: 'Vintage Bicycle',
    price: '₪ 850',
    location: 'Be\'er Sheva',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    listingType: 'trade',
    isOwner: false
  },
  {
    id: '6',
    title: 'Antique Wooden Chair',
    price: 'For Trade',
    location: 'Tel Aviv',
    image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    listingType: 'trade',
    isOwner: false
  },
  {
    id: '7',
    title: 'Handmade Pottery Collection',
    price: 'For Trade',
    location: 'Haifa',
    image: 'https://images.unsplash.com/photo-1565193298357-c5b64a816c38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    listingType: 'trade',
    isOwner: false
  }
];

const SwipeScreen = () => {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedAll, setSwipedAll] = useState(false);
  const [offset, setOffset] = useState(0);
  const [showLikeMessage, setShowLikeMessage] = useState(false);
  const [showDislikeMessage, setShowDislikeMessage] = useState(false);
  const [mode, setMode] = useState('all'); // 'all', 'trade', or 'buy'
  const [hideOwnItems, setHideOwnItems] = useState(true); // By default, hide the user's own listings
  const navigate = useNavigate();
  const location = useLocation();

  // Load items and set mode based on navigation state
  useEffect(() => {
    // Set mode based on location state
    if (location.state && location.state.mode) {
      setMode(location.state.mode);
    }

    // Use localStorage items if they exist, otherwise use sample items
    const loadItems = () => {
      try {
        const savedItems = localStorage.getItem('tedlistUserItems');
        let userItems = [];
        
        if (savedItems) {
          const parsedItems = JSON.parse(savedItems);
          if (parsedItems && parsedItems.length > 0) {
            // Format saved items to match our card structure and mark as owned
            userItems = parsedItems.map(item => ({
              id: item.id,
              title: item.title,
              price: item.price,
              location: item.location || 'Unknown location',
              image: item.imageUrl || item.images?.[0] || 'https://via.placeholder.com/500x500?text=No+Image',
              listingType: item.listingType || 'sale',
              isOwner: true // Mark this as a user-owned item
            }));
          }
        }
        
        // Combine user items with sample items
        let allItems = [...userItems, ...sampleItems];
        
        // Filter out user's own items if hideOwnItems is true
        if (hideOwnItems) {
          allItems = allItems.filter(item => !item.isOwner);
        }
        
        // Filter based on mode
        if (mode === 'trade') {
          return allItems.filter(item => item.listingType === 'trade');
        } else if (mode === 'buy') {
          return allItems.filter(item => item.listingType === 'sale');
        } else {
          return allItems;
        }
      } catch (e) {
        console.error('Error loading items:', e);
        return mode === 'trade' 
          ? sampleItems.filter(item => item.listingType === 'trade')
          : mode === 'buy'
            ? sampleItems.filter(item => item.listingType === 'sale')
            : sampleItems;
      }
    };
    
    const itemsToDisplay = loadItems();
    setItems(itemsToDisplay);
    setCurrentIndex(0);
    setSwipedAll(itemsToDisplay.length === 0);
  }, [location.state, mode, hideOwnItems]);

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      setOffset(300);
      setShowLikeMessage(true);
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
        if (newIndex >= items.length) {
          setSwipedAll(true);
        }
        return newIndex;
      });
    }, 300);
  };

  const viewDetails = (id) => {
    navigate(`/items/${id}`);
  };
  
  const handleAddItem = () => {
    navigate('/upload', { state: { listingType: mode === 'trade' ? 'trade' : 'sale' }});
  };
  
  const toggleOwnItemsFilter = () => {
    setHideOwnItems(!hideOwnItems);
  };
  
  const getModeTitle = () => {
    switch(mode) {
      case 'trade': return 'Trade Items';
      case 'buy': return 'Items for Sale';
      default: return 'Discover Items';
    }
  };
  
  const getEmptyStateContent = () => {
    switch(mode) {
      case 'trade':
        return {
          title: hideOwnItems ? 'No Trade Items Found' : 'No Trade Items to Show',
          text: hideOwnItems 
            ? 'There are currently no items available for trade. Why not be the first to post something?' 
            : 'All available trade items have been shown. Want to post something for trade?',
          icon: <FaHandshake />,
          action: 'Post Trading Item'
        };
      case 'buy':
        return {
          title: hideOwnItems ? 'No Items for Sale' : 'No Items to Show',
          text: hideOwnItems 
            ? 'There are currently no items for sale. Check back later or post something yourself!' 
            : 'All available sale items have been shown. Want to post something to sell?',
          icon: <FaShoppingCart />,
          action: 'Post Item for Sale'
        };
      default:
        return {
          title: hideOwnItems ? 'No Items Available' : 'No Items to Show',
          text: hideOwnItems 
            ? 'There are currently no items to browse. Check back later or add your own!' 
            : 'All available items have been shown. Want to post your own item?',
          icon: <FaTimes />,
          action: 'Post an Item'
        };
    }
  };

  const emptyState = getEmptyStateContent();

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>
          <FaArrowLeft />
        </BackButton>
        <Title mode={mode}>{getModeTitle()}</Title>
        
        <HeaderActions>
          <FilterButton 
            active={hideOwnItems} 
            onClick={toggleOwnItemsFilter}
            title={hideOwnItems ? "Show all items including yours" : "Hide your own items"}
          >
            <FaFilter />
            {hideOwnItems ? "Others Only" : "Show All"}
          </FilterButton>
        </HeaderActions>
      </Header>

      <SwipeContainer>
        {items.length > 0 && !swipedAll ? (
          <>
            <CardsContainer>
              {items.map((item, index) => (
                <SwipeCard 
                  key={item.id} 
                  isActive={index === currentIndex}
                  offset={index === currentIndex ? offset : 0}
                >
                  <CardImage src={item.image}>
                    <SwipeAnimationMessage show={showLikeMessage && index === currentIndex}>
                      LIKE
                    </SwipeAnimationMessage>
                    <SwipeAnimationMessage show={showDislikeMessage && index === currentIndex}>
                      NOPE
                    </SwipeAnimationMessage>
                    {item.listingType === 'trade' && (
                      <CardTag>
                        <FaHandshake /> For Trade
                      </CardTag>
                    )}
                    {item.isOwner && (
                      <CardOwnerTag>
                        <FaUser /> Your Item
                      </CardOwnerTag>
                    )}
                    <CardContent>
                      <CardTitle>{item.title}</CardTitle>
                      <CardPrice>{item.price}</CardPrice>
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
              
              <InfoButton onClick={() => items[currentIndex] && viewDetails(items[currentIndex].id)}>
                <FaInfo />
              </InfoButton>
              
              <LikeButton onClick={() => handleSwipe('right')}>
                <FaHeart />
              </LikeButton>
            </ActionsContainer>
          </>
        ) : (
          <EmptyState>
            <EmptyStateIcon mode={mode}>
              {emptyState.icon}
            </EmptyStateIcon>
            <EmptyStateTitle>{emptyState.title}</EmptyStateTitle>
            <EmptyStateText>{emptyState.text}</EmptyStateText>
            <ActionLink mode={mode} onClick={handleAddItem}>
              <FaPlusCircle /> {emptyState.action}
            </ActionLink>
          </EmptyState>
        )}
      </SwipeContainer>
    </Container>
  );
};

export default SwipeScreen;