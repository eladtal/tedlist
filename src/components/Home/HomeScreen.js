import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaExchangeAlt, FaShoppingCart, FaTag, FaHandshake } from 'react-icons/fa';
import theme from '../../styles/theme';
import Header from '../common/Header';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl} ${theme.spacing.md};
  text-align: center;
  background: linear-gradient(135deg, #6A5ACD, #FF6347);
  color: white;
`;

const HeaderContainer = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const Logo = styled.h1`
  font-size: 3rem;
  margin: 0;
  margin-bottom: ${theme.spacing.md};
  color: white;
  
  span {
    color: #FFD700;
  }
`;

const Tagline = styled.p`
  font-size: 1.5rem;
  margin: 0;
  opacity: 0.9;
  max-width: 800px;
`;

const ActionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.lg};
  width: 100%;
  max-width: 600px;
  margin-top: ${theme.spacing.xxl};
  
  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ActionCard = styled.div`
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const ActionIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${theme.spacing.md};
  
  svg {
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  }
`;

const ActionTitle = styled.h2`
  font-size: 1.8rem;
  margin: 0;
  margin-bottom: ${theme.spacing.xs};
`;

const ActionDescription = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
`;

const Footer = styled.div`
  margin-top: ${theme.spacing.xxl};
  font-size: 0.9rem;
  opacity: 0.7;
`;

const HomeScreen = () => {
  const navigate = useNavigate();
  
  const handleAction = (path, mode) => {
    if (mode) {
      navigate(path, { state: { mode } });
    } else {
      navigate(path);
    }
  };
  
  return (
    <Container>
      <Header />
      <ContentContainer>
        <HeaderContainer>
          <Logo><span>ted</span>list</Logo>
          <Tagline>Discover, trade, and connect with your community</Tagline>
        </HeaderContainer>
        
        <ActionsContainer>
          <ActionCard onClick={() => handleAction('/swipe', 'trade')}>
            <ActionIcon>
              <FaHandshake />
            </ActionIcon>
            <ActionTitle>Trade</ActionTitle>
            <ActionDescription>Swap your items with others in your community</ActionDescription>
          </ActionCard>
          
          <ActionCard onClick={() => handleAction('/swipe', 'buy')}>
            <ActionIcon>
              <FaShoppingCart />
            </ActionIcon>
            <ActionTitle>Buy</ActionTitle>
            <ActionDescription>Browse items for sale near you</ActionDescription>
          </ActionCard>
          
          <ActionCard onClick={() => handleAction('/upload')}>
            <ActionIcon>
              <FaTag />
            </ActionIcon>
            <ActionTitle>Sell</ActionTitle>
            <ActionDescription>List your items for others to discover</ActionDescription>
          </ActionCard>
          
          <ActionCard onClick={() => handleAction('/onboarding')}>
            <ActionIcon>
              <FaExchangeAlt />
            </ActionIcon>
            <ActionTitle>Get Started</ActionTitle>
            <ActionDescription>Complete your profile and earn rewards</ActionDescription>
          </ActionCard>
        </ActionsContainer>
        
        <Footer>
          &copy; {new Date().getFullYear()} Tedlist. All rights reserved.
        </Footer>
      </ContentContainer>
    </Container>
  );
};

export default HomeScreen;