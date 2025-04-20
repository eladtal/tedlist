import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaHeart, FaShare, FaExchangeAlt, FaHandshake, FaCheck, FaEnvelope } from 'react-icons/fa';
import theme from '../../styles/theme';

const Container = styled.div`
  padding-bottom: 80px;
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 80px;
    padding-bottom: ${theme.spacing.md};
    max-width: 1200px;
    margin: 0 auto;
  }
`;

const TopNav = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md};
  position: sticky;
  top: 0;
  background-color: ${theme.colors.background};
  z-index: 10;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ActionButtons = styled.div`
  margin-left: auto;
  display: flex;
  gap: ${theme.spacing.md};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const DetailLayout = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: ${theme.breakpoints.md}) {
    flex-direction: row;
    gap: ${theme.spacing.xl};
  }
`;

const MainItemSection = styled.div`
  flex: 1;
  
  @media (min-width: ${theme.breakpoints.md}) {
    flex: 2;
  }
`;

const TradeItemsSection = styled.div`
  flex: 1;
  padding: ${theme.spacing.md};
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing.md} ${theme.spacing.md} 0;
  }
`;

const TradeItemsHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 1px solid ${theme.colors.divider};
`;

const TradeItemsTitle = styled.h2`
  font-size: ${theme.typography.fontSize.large};
  color: ${theme.colors.textPrimary};
  margin-right: auto;
`;

const TradeItemsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: ${theme.spacing.md};
  max-height: 500px;
  overflow-y: auto;
  
  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
`;

const TradeItemCard = styled.div`
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${theme.shadows.small};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  border: 3px solid ${props => props.selected ? theme.colors.skyBlue : 'transparent'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.medium};
  }
`;

const TradeItemImage = styled.div`
  width: 100%;
  height: 140px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const TradeItemInfo = styled.div`
  padding: ${theme.spacing.sm};
  background-color: white;
`;

const TradeItemTitle = styled.div`
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.small};
  margin-bottom: ${theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TradeItemPrice = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.small};
`;

const TradeSelectedBadge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: ${theme.colors.skyBlue};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  box-shadow: ${theme.shadows.small};
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 300px;
  background-image: url(${props => props.src || 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2851&q=80'});
  background-size: cover;
  background-position: center;
  
  @media (min-width: ${theme.breakpoints.md}) {
    height: 400px;
  }
`;

const ContentContainer = styled.div`
  padding: ${theme.spacing.md};
`;

const ItemTitle = styled.h1`
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.xlarge};
`;

const ItemPrice = styled.div`
  font-size: ${theme.typography.fontSize.xlarge};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.md};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: ${theme.spacing.xs};
    color: #6A5ACD;
  }
`;

const ItemDescription = styled.p`
  color: ${theme.colors.textSecondary};
  line-height: 1.5;
  margin-bottom: ${theme.spacing.lg};
`;

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.textSecondary};
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${theme.colors.divider};
  margin: ${theme.spacing.md} 0;
`;

const SellerContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
  margin-bottom: ${theme.spacing.lg};
`;

const SellerAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-image: url(${props => props.src || 'https://randomuser.me/api/portraits/men/32.jpg'});
  background-size: cover;
  margin-right: ${theme.spacing.md};
`;

const SellerInfo = styled.div`
  flex: 1;
`;

const SellerName = styled.div`
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.xs};
`;

const SellerRating = styled.div`
  color: #FFC107;
`;

const ContactButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.buttonPrimary};
  color: ${theme.colors.textPrimary};
  border-radius: ${theme.borderRadius.medium};
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.medium};
  box-shadow: ${theme.shadows.small};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${theme.colors.skyBlue};
    box-shadow: ${theme.shadows.medium};
  }
  
  svg {
    margin-right: ${theme.spacing.sm};
  }
`;

const TradeActionButton = styled(ContactButton)`
  background: ${props => props.disabled ? theme.colors.divider : 'linear-gradient(135deg, #6A5ACD, #8A2BE2)'};
  color: white;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.7 : 1};
  margin-top: ${theme.spacing.md};
  
  &:hover {
    background: ${props => props.disabled ? theme.colors.divider : 'linear-gradient(135deg, #5849BD, #7A1BD2)'};
  }
`;

const TradeSuccessMessage = styled.div`
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  font-weight: ${theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  margin-top: ${theme.spacing.md};
  
  svg {
    margin-right: ${theme.spacing.sm};
  }
`;

const ItemTag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background-color: rgba(106, 90, 205, 0.1);
  color: #6A5ACD;
  border-radius: ${theme.borderRadius.small};
  margin-right: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.small};
  font-weight: ${theme.typography.fontWeight.medium};
  
  svg {
    margin-right: ${theme.spacing.xs};
    font-size: 0.8rem;
  }
`;

const NoItemsCard = styled.div`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.lg};
  text-align: center;
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  border: 1px dashed ${theme.colors.divider};
`;

const NoItemsText = styled.div`
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.md};
`;

const AddItemButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: linear-gradient(135deg, #6A5ACD, #8A2BE2);
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  display: flex;
  align-items: center;
  cursor: pointer;
  
  svg {
    margin-right: ${theme.spacing.xs};
  }
`;

const ItemDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [userTradeItems, setUserTradeItems] = useState([]);
  const [selectedTradeItem, setSelectedTradeItem] = useState(null);
  const [tradeProposed, setTradeProposed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch item details and user's own items for trading
  useEffect(() => {
    const fetchData = () => {
      try {
        // Try to find the specific item by ID
        let foundItem = null;
        
        // First look in sample items hardcoded here (in a real app, this would be an API call)
        const sampleItems = [
          {
            id: '1',
            title: 'Vintage Leather Sofa',
            price: '₪ 1,200',
            location: 'Tel Aviv',
            image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
            description: 'Beautiful vintage leather sofa in excellent condition. Minor wear but no tears or damage. Very comfortable and sturdy. Dimensions: 200cm x 90cm x 85cm height.',
            sellerName: 'David Cohen',
            sellerImage: 'https://randomuser.me/api/portraits/men/32.jpg',
            sellerRating: '4.8',
            postedDate: '5 days ago',
            category: 'Furniture',
            listingType: 'sale',
            isOwner: false
          },
          {
            id: '2',
            title: 'iPhone 13 Pro - 256GB',
            price: '₪ 2,800',
            location: 'Jerusalem',
            image: 'https://images.unsplash.com/photo-1592286927505-1def25115efb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
            description: 'iPhone 13 Pro in perfect condition. 256GB storage, battery health at 92%. Comes with original charger and box. No scratches or dents.',
            sellerName: 'Sarah Levy',
            sellerImage: 'https://randomuser.me/api/portraits/women/44.jpg',
            sellerRating: '4.9',
            postedDate: '2 days ago',
            category: 'Electronics',
            listingType: 'sale',
            isOwner: false
          },
          {
            id: '3',
            title: 'Ceramic Plant Pot Set',
            price: 'For Trade',
            location: 'Haifa',
            image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
            description: 'Set of 3 handmade ceramic plant pots in different sizes. Looking to trade for kitchen items or home decor.',
            sellerName: 'Maya Goldstein',
            sellerImage: 'https://randomuser.me/api/portraits/women/62.jpg',
            sellerRating: '4.6',
            postedDate: '1 week ago',
            category: 'Home & Garden',
            listingType: 'trade',
            isOwner: false
          },
          {
            id: '4',
            title: 'Nikon D850 Camera',
            price: '₪ 5,500',
            location: 'Eilat',
            image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
            description: 'Professional Nikon D850 DSLR camera in excellent condition. Shutter count under 10,000. Includes 24-70mm lens and carrying case.',
            sellerName: 'Avi Cohen',
            sellerImage: 'https://randomuser.me/api/portraits/men/76.jpg',
            sellerRating: '5.0',
            postedDate: '3 days ago',
            category: 'Electronics',
            listingType: 'sale',
            isOwner: false
          },
          {
            id: '5',
            title: 'Vintage Bicycle',
            price: 'For Trade',
            location: 'Be\'er Sheva',
            image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
            description: 'Beautifully restored vintage bicycle from the 1970s. Everything works perfectly. Looking to trade for audio equipment or electronics.',
            sellerName: 'Daniel Levi',
            sellerImage: 'https://randomuser.me/api/portraits/men/22.jpg',
            sellerRating: '4.7',
            postedDate: '6 days ago',
            category: 'Sports',
            listingType: 'trade',
            isOwner: false
          }
        ];
        
        // Look for the item in sample items
        foundItem = sampleItems.find(item => item.id === id);
        
        // If not found, check localStorage
        if (!foundItem) {
          const savedItems = localStorage.getItem('tedlistUserItems');
          if (savedItems) {
            const parsedItems = JSON.parse(savedItems);
            const userItem = parsedItems.find(item => item.id === id);
            
            if (userItem) {
              foundItem = {
                id: userItem.id,
                title: userItem.title,
                price: userItem.price,
                location: userItem.location || 'Unknown location',
                image: userItem.imageUrl || userItem.images?.[0] || 'https://via.placeholder.com/500x500?text=No+Image',
                description: userItem.description || 'No description provided',
                sellerName: 'You',
                sellerImage: localStorage.getItem('tedlistProfileImage') || null,
                sellerRating: '5.0',
                postedDate: 'Recently',
                category: userItem.category || 'Uncategorized',
                listingType: userItem.listingType || 'sale',
                isOwner: true
              };
            }
          }
        }
        
        if (foundItem) {
          setItem(foundItem);
          
          // If this is a trade item and not the user's own item, get user's trade items
          if (foundItem.listingType === 'trade' && !foundItem.isOwner) {
            // Get user's items that can be traded
            const savedItems = localStorage.getItem('tedlistUserItems');
            if (savedItems) {
              const parsedItems = JSON.parse(savedItems);
              // Only include the user's items that are available for trade
              const tradeItems = parsedItems
                .filter(item => item.listingType === 'trade')
                .map(item => ({
                  id: item.id,
                  title: item.title,
                  price: item.price,
                  image: item.imageUrl || item.images?.[0] || 'https://via.placeholder.com/500x500?text=No+Image',
                  listingType: item.listingType
                }));
              
              setUserTradeItems(tradeItems);
            }
          }
        } else {
          // If item not found
          console.error('Item not found');
        }
      } catch (e) {
        console.error('Error fetching item details:', e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleTradeItemSelect = (tradeItem) => {
    setSelectedTradeItem(tradeItem.id === selectedTradeItem ? null : tradeItem);
  };
  
  const handleTradePropose = () => {
    // In a real app, this would send a trade proposal to the backend
    setTradeProposed(true);
    
    // Simulate processing time
    setTimeout(() => {
      // After successful "trade proposal", we'd typically redirect or update UI
      // For now, we'll keep the user on this page with a success message
    }, 500);
  };
  
  const handleAddTradeItem = () => {
    navigate('/upload', { state: { listingType: 'trade' } });
  };
  
  if (loading) {
    return <Container><ContentContainer>Loading...</ContentContainer></Container>;
  }
  
  if (!item) {
    return <Container><ContentContainer>Item not found</ContentContainer></Container>;
  }

  const isTradeItem = item.listingType === 'trade';
  const showTradeInterface = isTradeItem && !item.isOwner;
  
  return (
    <Container>
      <TopNav>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </BackButton>
        <ActionButtons>
          <ActionButton>
            <FaHeart />
          </ActionButton>
          <ActionButton>
            <FaShare />
          </ActionButton>
        </ActionButtons>
      </TopNav>
      
      <DetailLayout>
        <MainItemSection>
          <ImageContainer src={item.image} />
          
          <ContentContainer>
            <ItemTitle>{item.title}</ItemTitle>
            
            <ItemPrice>
              {isTradeItem && <FaHandshake />}
              {item.price}
            </ItemPrice>
            
            {isTradeItem && (
              <ItemTag>
                <FaExchangeAlt /> Available for Trade
              </ItemTag>
            )}
            
            <ItemMeta>
              📍 {item.location} 
            </ItemMeta>
            
            <ItemMeta>
              ⏱️ Posted {item.postedDate} • {item.category}
            </ItemMeta>
            
            <Divider />
            
            <ItemDescription>
              {item.description}
            </ItemDescription>
            
            <SellerContainer>
              <SellerAvatar src={item.sellerImage} />
              <SellerInfo>
                <SellerName>{item.sellerName}</SellerName>
                <SellerRating>⭐ {item.sellerRating} (23 ratings)</SellerRating>
              </SellerInfo>
            </SellerContainer>
            
            {!showTradeInterface && (
              <ContactButton>
                <FaEnvelope /> Contact Seller
              </ContactButton>
            )}
          </ContentContainer>
        </MainItemSection>
        
        {showTradeInterface && (
          <TradeItemsSection>
            <TradeItemsHeader>
              <TradeItemsTitle>Your Items to Trade</TradeItemsTitle>
            </TradeItemsHeader>
            
            <TradeItemsList>
              {userTradeItems.length > 0 ? (
                userTradeItems.map(tradeItem => (
                  <TradeItemCard 
                    key={tradeItem.id} 
                    selected={selectedTradeItem?.id === tradeItem.id}
                    onClick={() => handleTradeItemSelect(tradeItem)}
                  >
                    <TradeItemImage src={tradeItem.image} />
                    <TradeItemInfo>
                      <TradeItemTitle>{tradeItem.title}</TradeItemTitle>
                      <TradeItemPrice>{tradeItem.price}</TradeItemPrice>
                    </TradeItemInfo>
                    {selectedTradeItem?.id === tradeItem.id && (
                      <TradeSelectedBadge>
                        <FaCheck />
                      </TradeSelectedBadge>
                    )}
                  </TradeItemCard>
                ))
              ) : (
                <NoItemsCard>
                  <NoItemsText>You don't have any items available for trade</NoItemsText>
                  <AddItemButton onClick={handleAddTradeItem}>
                    <FaExchangeAlt /> Add a Trade Item
                  </AddItemButton>
                </NoItemsCard>
              )}
            </TradeItemsList>
            
            {userTradeItems.length > 0 && (
              <>
                <TradeActionButton 
                  onClick={handleTradePropose}
                  disabled={!selectedTradeItem || tradeProposed}
                >
                  <FaHandshake /> {tradeProposed ? 'Trade Proposed!' : 'Propose Trade'}
                </TradeActionButton>
                
                {tradeProposed && (
                  <TradeSuccessMessage>
                    <FaCheck /> Your trade proposal has been sent to the owner!
                  </TradeSuccessMessage>
                )}
              </>
            )}
          </TradeItemsSection>
        )}
      </DetailLayout>
    </Container>
  );
};

export default ItemDetailScreen;