import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaUpload, FaExchangeAlt, FaHandshake } from 'react-icons/fa';
import theme from '../../styles/theme';

const Container = styled.div`
  padding: ${theme.spacing.md};
  padding-bottom: 80px; /* Space for navbar */
  
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
  background: linear-gradient(135deg, #6A5ACD, #8A2BE2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
  
  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: ${theme.spacing.lg};
  }
`;

const ItemCard = styled.div`
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${theme.shadows.small};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  border: 3px solid ${props => props.selected ? theme.colors.skyBlue : 'transparent'};
  transform: ${props => props.selected ? 'scale(1.02)' : 'scale(1)'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.medium};
  }
`;

const ItemImage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const ItemInfo = styled.div`
  padding: ${theme.spacing.sm};
  background-color: white;
`;

const ItemTitle = styled.div`
  font-weight: ${theme.typography.fontWeight.medium};
  margin-bottom: ${theme.spacing.xs};
  font-size: ${theme.typography.fontSize.medium};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemPrice = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.small};
`;

const ItemTag = styled.div`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background-color: rgba(106, 90, 205, 0.9);
  color: white;
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.fontSize.xsmall};
  font-weight: ${theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: ${theme.spacing.xs};
    font-size: 0.7rem;
  }
`;

const SelectedBadge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${theme.colors.skyBlue};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  box-shadow: ${theme.shadows.small};
  z-index: 2;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.large};
  margin-top: ${theme.spacing.xxl};
  min-height: 300px;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${theme.spacing.md};
  color: rgba(106, 90, 205, 0.5);
`;

const EmptyStateTitle = styled.h2`
  margin-bottom: ${theme.spacing.md};
  font-size: 1.5rem;
`;

const EmptyStateText = styled.p`
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.5;
  color: ${theme.colors.textSecondary};
  max-width: 500px;
`;

const ActionButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: linear-gradient(135deg, #6A5ACD, #8A2BE2);
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${theme.shadows.small};
  margin-top: ${theme.spacing.lg};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.medium};
  }
  
  svg {
    margin-right: ${theme.spacing.sm};
  }
  
  &:disabled {
    background: ${theme.colors.divider};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Subtitle = styled.h2`
  font-size: ${theme.typography.fontSize.large};
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.textPrimary};
`;

const TradePage = () => {
  const navigate = useNavigate();
  const [userItems, setUserItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadUserItems = () => {
      try {
        setLoading(true);
        
        // Get user's items from localStorage
        const savedItems = localStorage.getItem('tedlistUserItems');
        
        if (savedItems) {
          const parsedItems = JSON.parse(savedItems);
          
          if (parsedItems && parsedItems.length > 0) {
            // Format saved items to match our card structure
            const userItemsData = parsedItems.map(item => ({
              id: item.id,
              title: item.title,
              price: item.price,
              location: item.location || 'Unknown location',
              image: item.imageUrl || item.images?.[0] || 'https://via.placeholder.com/500x500?text=No+Image',
              listingType: item.listingType || 'sale'
            }));
            
            setUserItems(userItemsData);
          }
        }
      } catch (e) {
        console.error('Error loading user items:', e);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserItems();
  }, []);
  
  const handleItemSelect = (itemId) => {
    setSelectedItemId(itemId);
  };
  
  const handleUploadItem = () => {
    navigate('/upload', { state: { listingType: 'trade' } });
  };
  
  const handleStartTrading = () => {
    if (selectedItemId) {
      navigate(`/trade/swipe/${selectedItemId}`);
    }
  };
  
  if (loading) {
    return <Container><div>Loading...</div></Container>;
  }
  
  const hasUserItems = userItems && userItems.length > 0;
  
  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>
          <FaArrowLeft />
        </BackButton>
        <Title>Trade Items</Title>
      </Header>
      
      {hasUserItems ? (
        <>
          <Subtitle>Which of your items would you like to offer for trade?</Subtitle>
          
          <ItemsGrid>
            {userItems.map(item => (
              <ItemCard 
                key={item.id} 
                selected={selectedItemId === item.id}
                onClick={() => handleItemSelect(item.id)}
              >
                <ItemImage src={item.image} />
                {item.listingType === 'trade' && (
                  <ItemTag>
                    <FaHandshake /> For Trade
                  </ItemTag>
                )}
                {selectedItemId === item.id && (
                  <SelectedBadge>
                    <FaExchangeAlt />
                  </SelectedBadge>
                )}
                <ItemInfo>
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemPrice>{item.price}</ItemPrice>
                </ItemInfo>
              </ItemCard>
            ))}
          </ItemsGrid>
          
          <ActionButton 
            onClick={handleStartTrading} 
            disabled={!selectedItemId}
          >
            <FaExchangeAlt /> Start Trading
          </ActionButton>
        </>
      ) : (
        <EmptyState>
          <EmptyStateIcon>
            <FaExchangeAlt />
          </EmptyStateIcon>
          <EmptyStateTitle>You need to upload an item before you can start trading</EmptyStateTitle>
          <EmptyStateText>
            To offer trades to other users, you'll need to have at least one item posted on Tedlist.
            Upload an item now to get started!
          </EmptyStateText>
          <ActionButton onClick={handleUploadItem}>
            <FaUpload /> Upload an Item
          </ActionButton>
        </EmptyState>
      )}
    </Container>
  );
};

export default TradePage;
