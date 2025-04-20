import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaHeart, FaTimes, FaFilter, FaExchangeAlt, FaToggleOn, FaToggleOff, FaRedo, FaList } from 'react-icons/fa';
import theme from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useTradeInteraction } from '../../contexts/TradeInteractionContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useOnboarding } from '../../contexts/OnboardingContext';

const Container = styled.div`
  padding-bottom: 80px;
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 80px;
    padding-bottom: ${theme.spacing.md};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md};
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const HeaderTitle = styled.h1`
  font-size: ${theme.typography.fontSize.large};
  margin: 0;
`;

const FilterButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  color: ${theme.colors.primary};
  cursor: pointer;
  
  &:hover {
    color: ${theme.colors.textPrimary};
  }
`;

const SwipeHistoryButton = styled(FilterButton)`
  margin-right: ${theme.spacing.md};
`;

const FiltersContainer = styled.div`
  background-color: white;
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  display: ${props => props.show ? 'block' : 'none'};
  border-top: 1px solid ${theme.colors.divider};
`;

const FilterOption = styled.div`
  margin-bottom: ${theme.spacing.sm};
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: ${theme.typography.fontSize.medium};
  cursor: pointer;
  
  input {
    margin-right: ${theme.spacing.sm};
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: white;
  border-top: 1px solid ${theme.colors.divider};
  margin-bottom: ${theme.spacing.md};
`;

const ToggleLabel = styled.div`
  font-size: ${theme.typography.fontSize.medium};
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? theme.colors.primary : theme.colors.textSecondary};
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const SwipeContainer = styled.div`
  position: relative;
  height: 70vh;
  margin: 0 ${theme.spacing.md};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (min-width: ${theme.breakpoints.md}) {
    height: 65vh;
  }
`;

const Card = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: ${theme.borderRadius.large};
  background-color: white;
  overflow: hidden;
  box-shadow: ${theme.shadows.medium};
  transition: transform 0.3s;
  cursor: grab;
  transform: translateX(${props => props.offset}px) rotate(${props => props.offset * 0.1}deg);
  
  &:active {
    cursor: grabbing;
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 65%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const CardContent = styled.div`
  padding: ${theme.spacing.md};
`;

const CardTitle = styled.h2`
  font-size: ${theme.typography.fontSize.large};
  margin-bottom: ${theme.spacing.xs};
`;

const CardPrice = styled.div`
  font-size: ${theme.typography.fontSize.large};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const CardDescription = styled.p`
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.md};
`;

const CardOwner = styled.div`
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.textSecondary};
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${theme.spacing.md};
  gap: ${theme.spacing.lg};
`;

const ActionButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: none;
  background-color: white;
  box-shadow: ${theme.shadows.small};
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${theme.shadows.medium};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LikeButton = styled(ActionButton)`
  color: #4CAF50;
`;

const DislikeButton = styled(ActionButton)`
  color: #F44336;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 70vh;
  padding: ${theme.spacing.md};
  background-color: white;
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.small};
`;

const EmptyStateTitle = styled.h2`
  margin-bottom: ${theme.spacing.md};
`;

const EmptyStateMessage = styled.p`
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.lg};
  max-width: 400px;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};
  opacity: 0.7;
`;

const SwipeIndicator = styled.div`
  position: absolute;
  top: 20px;
  left: ${props => props.like ? 'auto' : '20px'};
  right: ${props => props.like ? '20px' : 'auto'};
  background-color: ${props => props.like ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)'};
  color: white;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  font-weight: ${theme.typography.fontWeight.bold};
  transform: rotate(${props => props.like ? '15deg' : '-15deg'});
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s;
  z-index: 2;
`;

const Button = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  font-weight: ${theme.typography.fontWeight.bold};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${theme.colors.primaryDark};
  }
`;

const SwipeScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode || 'all'; // 'all' or 'trade'
  const { currentUser } = useAuth();
  const { createTradeOffer } = useTradeInteraction();
  const { addTradeOfferNotification } = useNotifications();
  const { trackSwipe } = useOnboarding();
  
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState(mode === 'trade' ? 'trade' : 'all');
  const [hideMyItems, setHideMyItems] = useState(true);
  const [showLikeMessage, setShowLikeMessage] = useState(false);
  const [showDislikeMessage, setShowDislikeMessage] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipedItems, setSwipedItems] = useState([]);
  
  // Load swiped items from localStorage
  useEffect(() => {
    if (currentUser) {
      try {
        const savedSwipes = localStorage.getItem('tedlistSwipes');
        
        if (savedSwipes) {
          const allSwipes = JSON.parse(savedSwipes);
          const userSwipes = allSwipes[currentUser.id] || [];
          setSwipedItems(userSwipes);
        }
      } catch (error) {
        console.error('Error loading swipes:', error);
      }
    }
  }, [currentUser]);
  
  // Save swipes to localStorage
  const saveSwipes = (newSwipes) => {
    try {
      const savedSwipes = localStorage.getItem('tedlistSwipes');
      let allSwipes = {};
      
      if (savedSwipes) {
        allSwipes = JSON.parse(savedSwipes);
      }
      
      allSwipes[currentUser.id] = newSwipes;
      localStorage.setItem('tedlistSwipes', JSON.stringify(allSwipes));
    } catch (error) {
      console.error('Error saving swipes:', error);
    }
  };
  
  // Add or update a swipe
  const recordSwipe = (itemId, direction) => {
    // Check if item was already swiped
    const existingSwipeIndex = swipedItems.findIndex(swipe => swipe.itemId === itemId);
    let newSwipes = [...swipedItems];
    
    if (existingSwipeIndex >= 0) {
      // Update existing swipe
      newSwipes[existingSwipeIndex] = {
        ...newSwipes[existingSwipeIndex],
        direction,
        timestamp: new Date().toISOString()
      };
    } else {
      // Add new swipe
      newSwipes.push({
        userId: currentUser.id,
        itemId,
        direction,
        timestamp: new Date().toISOString()
      });
    }
    
    setSwipedItems(newSwipes);
    saveSwipes(newSwipes);
    
    return newSwipes;
  };
  
  // Check if an item has been swiped and which direction
  const getSwipeDirection = (itemId) => {
    const swipe = swipedItems.find(swipe => swipe.itemId === itemId);
    return swipe ? swipe.direction : null;
  };
  
  // Load items on component mount
  useEffect(() => {
    // Load sample items along with any user items from localStorage
    const loadItems = () => {
      // Sample data
      const sampleItems = [
        {
          id: 's1',
          title: 'Vintage Record Player',
          price: 'For Trade',
          description: 'Vintage record player in great working condition. Looking to trade for audio equipment or books.',
          images: ['https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'],
          owner: 'David',
          ownerId: 'user1',
          listingType: 'trade'
        },
        {
          id: 's2',
          title: 'Professional Camera Lenses',
          price: '₪ 1,200',
          description: 'Set of professional camera lenses in excellent condition.',
          images: ['https://images.unsplash.com/photo-1520549233664-03f65c1d1327?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'],
          owner: 'Maya',
          ownerId: 'user2',
          listingType: 'sale'
        },
        {
          id: 's3',
          title: 'Handcrafted Ceramic Set',
          price: 'For Trade',
          description: 'Beautiful handcrafted ceramic plates and bowls. Each piece is unique. Looking to trade for home decor or plants.',
          images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'],
          owner: 'Noa',
          ownerId: 'user3',
          listingType: 'trade'
        },
        {
          id: 's4',
          title: 'Vintage Comic Book Collection',
          price: '₪ 800',
          description: 'Collection of well-preserved vintage comic books from the 80s and 90s.',
          images: ['https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'],
          owner: 'Dan',
          ownerId: 'user4',
          listingType: 'sale'
        },
        {
          id: 's5',
          title: 'Professional DJ Equipment',
          price: 'For Trade',
          description: 'Professional DJ setup including mixer and controllers. Everything in great condition. Looking for musical instruments or audio gear.',
          images: ['https://images.unsplash.com/photo-1571510649755-66c9eb133540?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'],
          owner: 'Yael',
          ownerId: 'user5',
          listingType: 'trade'
        }
      ];
      
      // Get user-posted items from localStorage
      let userItems = [];
      try {
        const savedItems = localStorage.getItem('tedlistItems');
        if (savedItems) {
          userItems = JSON.parse(savedItems);
        }
      } catch (e) {
        console.error('Error loading user items:', e);
      }
      
      // Combine sample and user items
      const allItems = [...sampleItems, ...userItems];
      
      // Apply filters
      let filteredItems = allItems;
      
      // Filter by type if not 'all'
      if (filterType !== 'all') {
        filteredItems = filteredItems.filter(item => item.listingType === filterType);
      }
      
      // Hide user's own items if hideMyItems is true
      if (hideMyItems && currentUser) {
        filteredItems = filteredItems.filter(item => item.ownerId !== currentUser.id);
      }
      
      // Prioritize items that haven't been swiped yet
      filteredItems.sort((a, b) => {
        const aSwipeDirection = getSwipeDirection(a.id);
        const bSwipeDirection = getSwipeDirection(b.id);
        
        if (aSwipeDirection === null && bSwipeDirection !== null) return -1;
        if (aSwipeDirection !== null && bSwipeDirection === null) return 1;
        return 0;
      });
      
      setItems(filteredItems);
      setCurrentIndex(0);
    };
    
    loadItems();
  }, [filterType, hideMyItems, currentUser, swipedItems]);
  
  const handleSwipe = (direction) => {
    if (isAnimating || items.length === 0 || currentIndex >= items.length) return;
    
    const currentItem = items[currentIndex];
    
    setIsAnimating(true);
    
    if (direction === 'right') {
      setOffset(300);
      setShowLikeMessage(true);
      
      // If it's a trade item, create a trade offer
      if (currentItem.listingType === 'trade') {
        // In a real app, we'd get the user's selected item for trade here
        const userItem = {
          id: 'user_item_1',
          title: 'Your Item',
          price: 'For Trade',
          images: ['https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80']
        };
        
        // Create a trade offer
        createTradeOffer(
          { id: currentUser.id, username: currentUser.username || 'You' },
          { id: currentItem.ownerId, username: currentItem.owner },
          userItem,
          currentItem
        );
        
        // Create notification for the item owner (for demo purposes)
        addTradeOfferNotification(
          { id: currentUser.id, username: currentUser.username || 'A user' },
          userItem,
          currentItem
        );
      }
    } else {
      setOffset(-300);
      setShowDislikeMessage(true);
    }
    
    // Record the swipe
    recordSwipe(currentItem.id, direction);
    
    // Track the swipe for onboarding
    trackSwipe();
    
    // Reset and move to next card
    setTimeout(() => {
      setOffset(0);
      setShowLikeMessage(false);
      setShowDislikeMessage(false);
      setCurrentIndex(prevIndex => prevIndex + 1);
      setIsAnimating(false);
    }, 300);
  };
  
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  const toggleHideMyItems = () => {
    setHideMyItems(prev => !prev);
  };
  
  const navigateToSwipeHistory = () => {
    navigate('/swipe-history');
  };
  
  const currentItem = items[currentIndex];
  
  return (
    <Container>
      <Header>
        <HeaderTitle>
          {filterType === 'trade' ? 'Trade Items' : filterType === 'sale' ? 'Items for Sale' : 'Browse Items'}
        </HeaderTitle>
        <div>
          <SwipeHistoryButton onClick={navigateToSwipeHistory}>
            <FaList />
          </SwipeHistoryButton>
          <FilterButton onClick={toggleFilters}>
            <FaFilter />
          </FilterButton>
        </div>
      </Header>
      
      <FiltersContainer show={showFilters}>
        <FilterOption>
          <FilterLabel>
            <input 
              type="radio" 
              name="filterType" 
              value="all" 
              checked={filterType === 'all'} 
              onChange={() => setFilterType('all')} 
            />
            All Items
          </FilterLabel>
        </FilterOption>
        <FilterOption>
          <FilterLabel>
            <input 
              type="radio" 
              name="filterType" 
              value="trade" 
              checked={filterType === 'trade'} 
              onChange={() => setFilterType('trade')} 
            />
            Only Trade Items
          </FilterLabel>
        </FilterOption>
        <FilterOption>
          <FilterLabel>
            <input 
              type="radio" 
              name="filterType" 
              value="sale" 
              checked={filterType === 'sale'} 
              onChange={() => setFilterType('sale')} 
            />
            Only For Sale
          </FilterLabel>
        </FilterOption>
      </FiltersContainer>
      
      <ToggleContainer>
        <ToggleLabel>Hide my items</ToggleLabel>
        <ToggleButton 
          active={hideMyItems} 
          onClick={toggleHideMyItems}
        >
          {hideMyItems ? <FaToggleOn /> : <FaToggleOff />}
        </ToggleButton>
      </ToggleContainer>
      
      {items.length > 0 && currentIndex < items.length ? (
        <>
          <SwipeContainer>
            <Card offset={offset}>
              <SwipeIndicator like visible={showLikeMessage}>
                {currentItem.listingType === 'trade' ? 'OFFER TRADE' : 'INTERESTED'}
              </SwipeIndicator>
              <SwipeIndicator visible={showDislikeMessage}>
                PASS
              </SwipeIndicator>
              <CardImage src={currentItem.images[0]} />
              <CardContent>
                <CardTitle>{currentItem.title}</CardTitle>
                <CardPrice>{currentItem.price}</CardPrice>
                <CardDescription>{currentItem.description}</CardDescription>
                <CardOwner>Posted by {currentItem.owner}</CardOwner>
                
                {/* User can also click to view item details */}
                <Button onClick={() => navigate(`/items/${currentItem.id}`)}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </SwipeContainer>
          
          <ActionButtons>
            <DislikeButton onClick={() => handleSwipe('left')} disabled={isAnimating}>
              <FaTimes />
            </DislikeButton>
            <LikeButton onClick={() => handleSwipe('right')} disabled={isAnimating}>
              {currentItem.listingType === 'trade' ? <FaExchangeAlt /> : <FaHeart />}
            </LikeButton>
          </ActionButtons>
        </>
      ) : (
        <EmptyState>
          <EmptyStateIcon>
            {filterType === 'trade' ? <FaExchangeAlt /> : <FaHeart />}
          </EmptyStateIcon>
          <EmptyStateTitle>No more items to show</EmptyStateTitle>
          <EmptyStateMessage>
            {items.length === 0 
              ? `No ${filterType === 'trade' ? 'trade' : filterType === 'sale' ? 'sale' : ''} items found. Try adjusting your filters or check back later.`
              : `You've seen all ${filterType === 'trade' ? 'trade' : filterType === 'sale' ? 'sale' : ''} items for now. Check your swipe history to revisit items.`
            }
          </EmptyStateMessage>
        </EmptyState>
      )}
    </Container>
  );
};

export default SwipeScreen;