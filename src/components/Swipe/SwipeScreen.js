import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
<<<<<<< HEAD
import { FaHeart, FaTimes, FaFilter, FaExchangeAlt, FaToggleOn, FaToggleOff, FaRedo, FaList } from 'react-icons/fa';
=======
import { FaArrowLeft, FaHeart, FaTimes, FaInfo, FaHandshake, FaShoppingCart, FaTag, FaPlusCircle, FaUser, FaFilter } from 'react-icons/fa/index.js';
>>>>>>> temp-branch
import theme from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useTradeInteraction } from '../../contexts/TradeInteractionContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useOnboarding, ONBOARDING_STEPS } from '../../contexts/OnboardingContext';
import { 
  getSwipeItemsWithFallback, 
  getUserSwipesWithFallback, 
  recordSwipe as apiRecordSwipe 
} from '../../services/swipe.service';

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

<<<<<<< HEAD
const Card = styled.div`
=======
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

const SwipeCard = styled.div.attrs(props => ({
  style: {
    transform: `translateX(${props.offset || 0}px) rotate(${(props.offset || 0) * 0.1}deg)`,
  }
}))`
>>>>>>> temp-branch
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: ${theme.borderRadius.large};
  background-color: white;
  overflow: hidden;
<<<<<<< HEAD
  box-shadow: ${theme.shadows.medium};
  transition: transform 0.3s;
  cursor: grab;
  transform: translateX(${props => props.offset}px) rotate(${props => props.offset * 0.1}deg);
  
  &:active {
    cursor: grabbing;
  }
=======
  transition: transform 0.3s ease;
  opacity: ${props => props.isActive ? 1 : 0};
  visibility: ${props => props.isActive ? 'visible' : 'hidden'};
  pointer-events: ${props => props.isActive ? 'auto' : 'none'};
>>>>>>> temp-branch
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

const SwipeAnimationMessage = styled.div.attrs(props => ({
  className: props.show ? 'visible' : 'hidden'
}))`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  opacity: ${props => props.className === 'visible' ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
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

<<<<<<< HEAD
=======
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

>>>>>>> temp-branch
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
  const [loading, setLoading] = useState(true);
  
  // Load swiped items from API or localStorage
  useEffect(() => {
    const loadSwipedItems = async () => {
      if (currentUser) {
        try {
          const userSwipes = await getUserSwipesWithFallback(currentUser.id);
          setSwipedItems(userSwipes);
        } catch (error) {
          console.error('Error loading swipes:', error);
        }
      }
    };
    
    loadSwipedItems();
  }, [currentUser]);
  
  // Save swipes to localStorage and API
  const saveSwipes = async (newSwipes) => {
    try {
      // Legacy localStorage support
      const savedSwipes = localStorage.getItem('tedlistSwipes');
      let allSwipes = {};
      
      if (savedSwipes) {
        allSwipes = JSON.parse(savedSwipes);
      }
      
      allSwipes[currentUser.id] = newSwipes;
      localStorage.setItem('tedlistSwipes', JSON.stringify(allSwipes));
    } catch (error) {
      console.error('Error saving swipes to localStorage:', error);
    }
  };
  
  // Add or update a swipe
  const recordSwipe = async (itemId, direction) => {
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
    
    // Record swipe in API
    try {
      await apiRecordSwipe(itemId, direction);
    } catch (error) {
      console.log('API swipe recording not available yet:', error);
    }
    
    return newSwipes;
  };
  
  // Check if an item has been swiped and which direction
  const getSwipeDirection = (itemId) => {
    const swipe = swipedItems.find(swipe => swipe.itemId === itemId);
    return swipe ? swipe.direction : null;
  };
  
  // Load items on component mount and when filters change
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      
      try {
        // Get items from API with fallback to localStorage + sample data
        const fetchedItems = await getSwipeItemsWithFallback({
          listingType: filterType,
          hideMyItems,
          currentUserId: currentUser?.id
        });
        
        // Prioritize items that haven't been swiped yet
        fetchedItems.sort((a, b) => {
          const aSwipeDirection = getSwipeDirection(a.id);
          const bSwipeDirection = getSwipeDirection(b.id);
          
          if (aSwipeDirection === null && bSwipeDirection !== null) return -1;
          if (aSwipeDirection !== null && bSwipeDirection === null) return 1;
          return 0;
        });
        
        setItems(fetchedItems);
        setCurrentIndex(0);
      } catch (error) {
        console.error('Error loading items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadItems();
  }, [filterType, hideMyItems, currentUser?.id]);

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
<<<<<<< HEAD
      
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
=======

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
                    <SwipeAnimationMessage show={!!(showLikeMessage && index === currentIndex)}>
                      LIKE
                    </SwipeAnimationMessage>
                    <SwipeAnimationMessage show={!!(showDislikeMessage && index === currentIndex)}>
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
>>>>>>> temp-branch
    </Container>
  );
};

export default SwipeScreen;