import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaArrowLeft, FaHeart, FaTimes, FaExchangeAlt, 
  FaRedo, FaFilter, FaToggleOn, FaToggleOff 
} from 'react-icons/fa';
import theme from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useTradeInteraction } from '../../contexts/TradeInteractionContext';

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

const FilterContainer = styled.div`
  padding: ${theme.spacing.md};
  background-color: white;
  margin-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.divider};
  display: ${props => props.show ? 'block' : 'none'};
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
  border-bottom: 1px solid ${theme.colors.divider};
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

const SwipesList = styled.div`
  display: flex;
  flex-direction: column;
`;

const SwipeItem = styled.div`
  display: flex;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.divider};
  background-color: white;
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${theme.borderRadius.small};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  margin-right: ${theme.spacing.md};
  flex-shrink: 0;
`;

const ItemContent = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h3`
  font-size: ${theme.typography.fontSize.medium};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const ItemPrice = styled.div`
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const ItemOwner = styled.div`
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.sm};
`;

const SwipeTime = styled.div`
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.textSecondary};
`;

const SwipeStatus = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing.xs};
  font-size: ${theme.typography.fontSize.small};
  font-weight: ${theme.typography.fontWeight.medium};
  
  color: ${props => {
    if (props.direction === 'right') return '#4CAF50';
    if (props.direction === 'left') return '#F44336';
    return theme.colors.textSecondary;
  }};
  
  svg {
    margin-right: ${theme.spacing.xs};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.fontSize.small};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s;
  
  background-color: ${props => {
    if (props.primary) return theme.colors.primary;
    if (props.secondary) return 'white';
    return theme.colors.greyLight;
  }};
  
  color: ${props => props.primary ? 'white' : theme.colors.textSecondary};
  
  border: ${props => props.secondary ? `1px solid ${theme.colors.divider}` : 'none'};
  
  &:hover {
    opacity: 0.9;
  }
  
  svg {
    margin-right: ${theme.spacing.xs};
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

const SwipeHistoryScreen = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createTradeOffer } = useTradeInteraction();
  
  const [swipes, setSwipes] = useState([]);
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [sortNewest, setSortNewest] = useState(true);
  
  // Load swipes from localStorage
  useEffect(() => {
    if (currentUser) {
      try {
        const savedSwipes = localStorage.getItem('tedlistSwipes');
        const savedItems = localStorage.getItem('tedlistItems');
        
        let userSwipes = [];
        let allItems = [];
        
        if (savedSwipes) {
          const allSwipes = JSON.parse(savedSwipes);
          userSwipes = allSwipes[currentUser.id] || [];
        }
        
        // Sample items data (in a real app, this would come from an API)
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
        
        if (savedItems) {
          const userItems = JSON.parse(savedItems);
          allItems = [...sampleItems, ...userItems];
        } else {
          allItems = sampleItems;
        }
        
        setItems(allItems);
        
        // Enrich swipes with item data
        const enrichedSwipes = userSwipes.map(swipe => {
          const item = allItems.find(item => item.id === swipe.itemId);
          return {
            ...swipe,
            item: item || { 
              id: swipe.itemId,
              title: 'Unknown Item',
              price: '',
              owner: 'Unknown',
              images: ['https://via.placeholder.com/300x300?text=Item+Not+Found'],
              listingType: 'unknown'
            }
          };
        });
        
        setSwipes(enrichedSwipes);
      } catch (error) {
        console.error('Error loading swipes:', error);
      }
    }
  }, [currentUser]);
  
  // Update swipe direction for an item
  const updateSwipeDirection = (itemId, direction) => {
    try {
      // Update local state
      const swipeIndex = swipes.findIndex(swipe => swipe.item.id === itemId);
      if (swipeIndex >= 0) {
        const newSwipes = [...swipes];
        newSwipes[swipeIndex] = {
          ...newSwipes[swipeIndex],
          direction,
          timestamp: new Date().toISOString()
        };
        setSwipes(newSwipes);
      }
      
      // Update localStorage
      const savedSwipes = localStorage.getItem('tedlistSwipes');
      
      if (savedSwipes) {
        const allSwipes = JSON.parse(savedSwipes);
        const userSwipes = allSwipes[currentUser.id] || [];
        
        const userSwipeIndex = userSwipes.findIndex(swipe => swipe.itemId === itemId);
        
        if (userSwipeIndex >= 0) {
          userSwipes[userSwipeIndex] = {
            ...userSwipes[userSwipeIndex],
            direction,
            timestamp: new Date().toISOString()
          };
        }
        
        allSwipes[currentUser.id] = userSwipes;
        localStorage.setItem('tedlistSwipes', JSON.stringify(allSwipes));
      }
    } catch (error) {
      console.error('Error updating swipe:', error);
    }
  };
  
  // Handle creating a trade offer
  const handleTradeOffer = (item) => {
    if (item.listingType !== 'trade') return;
    
    // In a real app, we'd get the user's selected item for trade here
    // For now, we'll use a mock user item
    const userItem = {
      id: 'user_item_1',
      title: 'Your Item',
      price: 'For Trade',
      images: ['https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80']
    };
    
    // Create a trade offer
    createTradeOffer(
      { id: currentUser.id, username: currentUser.username || 'You' },
      { id: item.ownerId, username: item.owner },
      userItem,
      item
    );
    
    // Update the swipe direction to 'right'
    updateSwipeDirection(item.id, 'right');
    
    alert('Trade offer sent!');
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  const toggleSortOrder = () => {
    setSortNewest(prev => !prev);
  };
  
  const viewItemDetails = (itemId) => {
    navigate(`/items/${itemId}`);
  };
  
  const getFilteredSwipes = () => {
    let filtered = [...swipes];
    
    // Filter by tab
    if (activeTab === 'liked') {
      filtered = filtered.filter(swipe => swipe.direction === 'right');
    } else if (activeTab === 'passed') {
      filtered = filtered.filter(swipe => swipe.direction === 'left');
    }
    
    // Filter by item type
    if (filterType !== 'all') {
      filtered = filtered.filter(swipe => swipe.item.listingType === filterType);
    }
    
    // Sort by timestamp
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortNewest ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
  };
  
  const filteredSwipes = getFilteredSwipes();
  
  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <FaArrowLeft />
        </BackButton>
        <PageTitle>
          Swipe History
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
          active={activeTab === 'liked'} 
          onClick={() => setActiveTab('liked')}
        >
          Liked
        </Tab>
        <Tab 
          active={activeTab === 'passed'} 
          onClick={() => setActiveTab('passed')}
        >
          Passed
        </Tab>
      </TabsContainer>
      
      <ToggleContainer>
        <ToggleLabel>Filter & Sort</ToggleLabel>
        <ActionButton onClick={toggleFilters}>
          <FaFilter /> Filters
        </ActionButton>
      </ToggleContainer>
      
      <FilterContainer show={showFilters}>
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
        
        <ToggleContainer>
          <ToggleLabel>Sort by newest first</ToggleLabel>
          <ToggleButton 
            active={sortNewest} 
            onClick={toggleSortOrder}
          >
            {sortNewest ? <FaToggleOn /> : <FaToggleOff />}
          </ToggleButton>
        </ToggleContainer>
      </FilterContainer>
      
      {filteredSwipes.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>
            <FaHeart />
          </EmptyStateIcon>
          <div>No swipe history found</div>
        </EmptyState>
      ) : (
        <SwipesList>
          {filteredSwipes.map(swipe => (
            <SwipeItem key={`${swipe.itemId}-${swipe.timestamp}`}>
              <ItemImage src={swipe.item.images[0]} />
              <ItemContent>
                <SwipeStatus direction={swipe.direction}>
                  {swipe.direction === 'right' ? (
                    <>
                      <FaHeart /> Liked
                    </>
                  ) : (
                    <>
                      <FaTimes /> Passed
                    </>
                  )}
                </SwipeStatus>
                <ItemTitle>{swipe.item.title}</ItemTitle>
                <ItemPrice>{swipe.item.price}</ItemPrice>
                <ItemOwner>By {swipe.item.owner}</ItemOwner>
                <SwipeTime>{formatTimeAgo(swipe.timestamp)}</SwipeTime>
                
                <ActionButtons>
                  <ActionButton onClick={() => viewItemDetails(swipe.item.id)}>
                    View Details
                  </ActionButton>
                  
                  {swipe.direction === 'left' && swipe.item.listingType === 'trade' && (
                    <ActionButton 
                      primary 
                      onClick={() => handleTradeOffer(swipe.item)}
                    >
                      <FaExchangeAlt /> Offer Trade
                    </ActionButton>
                  )}
                  
                  {swipe.direction === 'right' && swipe.item.listingType === 'sale' && (
                    <ActionButton primary>
                      Contact Seller
                    </ActionButton>
                  )}
                  
                  {swipe.direction === 'right' && (
                    <ActionButton 
                      onClick={() => updateSwipeDirection(swipe.item.id, 'left')}
                    >
                      <FaRedo /> Pass Instead
                    </ActionButton>
                  )}
                  
                  {swipe.direction === 'left' && (
                    <ActionButton 
                      onClick={() => updateSwipeDirection(swipe.item.id, 'right')}
                    >
                      <FaRedo /> Like Instead
                    </ActionButton>
                  )}
                </ActionButtons>
              </ItemContent>
            </SwipeItem>
          ))}
        </SwipesList>
      )}
    </Container>
  );
};

export default SwipeHistoryScreen;
