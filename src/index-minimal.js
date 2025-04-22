import React from 'react';
import ReactDOM from 'react-dom/client';
import styled from 'styled-components';

// Minimal styles
const GlobalStyle = () => (
  <style>
    {`
      body {
        margin: 0;
        font-family: 'Arial', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #f9f9f9;
      }
      
      * {
        box-sizing: border-box;
      }
    `}
  </style>
);

// Styled components for minimal UI
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
`;

const Logo = styled.h1`
  color: #6A5ACD;
  margin: 0;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavLink = styled.a`
  color: #333;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 4px;
  background: #f5f5f5;
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  margin-top: 30px;
`;

const ItemCard = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  background-color: white;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ItemContent = styled.div`
  padding: 15px;
`;

const ItemTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
`;

const ItemPrice = styled.p`
  font-weight: bold;
  color: #6A5ACD;
  margin: 0 0 8px 0;
`;

const ItemDescription = styled.p`
  color: #666;
  margin: 0;
  font-size: 0.9rem;
`;

const Button = styled.button`
  background: #6A5ACD;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.2s;
  
  &:hover {
    background: #5849b8;
  }
`;

// Sample item data
const sampleItems = [
  {
    id: 1,
    title: 'Vintage Camera',
    price: '$120',
    description: 'Classic film camera in excellent condition',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80'
  },
  {
    id: 2,
    title: 'Mountain Bike',
    price: '$350',
    description: 'Great for trails and city riding',
    image: 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=500&q=80'
  },
  {
    id: 3,
    title: 'Leather Jacket',
    price: '$95',
    description: 'Vintage leather jacket, size L',
    image: 'https://images.unsplash.com/photo-1605908502724-9093a79a1b39?w=500&q=80'
  },
  {
    id: 4,
    title: 'iPhone 12',
    price: '$580',
    description: 'Good condition, with case and charger',
    image: 'https://images.unsplash.com/photo-1624434207284-727c6e2762d3?w=500&q=80'
  },
  {
    id: 5,
    title: 'Gaming Headset',
    price: '$75',
    description: '7.1 surround sound, noise cancelling',
    image: 'https://images.unsplash.com/photo-1591416213816-5ed35c2a3c0e?w=500&q=80'
  },
  {
    id: 6,
    title: 'Coffee Table',
    price: '$120',
    description: 'Modern design, solid wood',
    image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=500&q=80'
  },
];

// MinimalApp component
const MinimalApp = () => {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  // Load sample items
  React.useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setItems(sampleItems);
      setLoading(false);
    }, 500);
    
    // Try to load saved items
    try {
      const savedItems = localStorage.getItem('tedlistItems');
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems);
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          setItems(prevItems => [...parsedItems, ...prevItems]);
        }
      }
    } catch (error) {
      console.warn('Error loading saved items:', error);
    }
  }, []);
  
  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Logo>Tedlist</Logo>
          <Nav>
            <NavLink href="/">Back to Home</NavLink>
          </Nav>
        </Header>
        
        <div>
          <h2>Welcome to Tedlist Marketplace</h2>
          <p>Browse items from our community. This is a completely independent minimal version.</p>
          
          {loading ? (
            <p>Loading items...</p>
          ) : (
            <ItemGrid>
              {items.map(item => (
                <ItemCard key={item.id}>
                  <ItemImage src={item.image} alt={item.title} />
                  <ItemContent>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemPrice>{item.price}</ItemPrice>
                    <ItemDescription>{item.description}</ItemDescription>
                    <Button>View Details</Button>
                  </ItemContent>
                </ItemCard>
              ))}
            </ItemGrid>
          )}
        </div>
      </Container>
    </>
  );
};

// Create root and render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MinimalApp />
  </React.StrictMode>
);
