import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaExchangeAlt, FaShoppingCart, FaTag, FaHandshake } from 'react-icons/fa';
import theme from '../../styles/theme';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.md};
  padding-bottom: 80px; /* Space for navbar */
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 80px;
    padding-bottom: ${theme.spacing.md};
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.xl};
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: ${theme.borderRadius.large};
    box-shadow: ${theme.shadows.medium};
  }
`;

const HeaderContainer = styled.div`
  margin-bottom: ${theme.spacing.xl};
  width: 100%;
`;

const Logo = styled.div`
  font-size: 3rem;
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.textPrimary};
  
  span {
    color: ${theme.colors.skyBlue};
  }
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize.xxlarge};
  margin-bottom: ${theme.spacing.md};
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.large};
  margin-bottom: ${theme.spacing.xl};
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 1.2rem;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xxl};
  
  @media (min-width: ${theme.breakpoints.md}) {
    flex-direction: row;
    justify-content: center;
  }
`;

const IntentButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 180px;
  border-radius: ${theme.borderRadius.large};
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: 1.5rem;
  box-shadow: ${theme.shadows.medium};
  padding: ${theme.spacing.lg};
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  color: white;
  position: relative;
  overflow: hidden;
  
  @media (min-width: ${theme.breakpoints.md}) {
    width: 240px;
    height: 240px;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: ${theme.shadows.large};
    
    &:before {
      transform: translateY(0);
    }
  }
  
  svg {
    font-size: 3rem;
    margin-bottom: ${theme.spacing.md};
    
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 4rem;
    }
  }
`;

const TradeButton = styled(IntentButton)`
  background: linear-gradient(135deg, #6A5ACD, #8A2BE2);
`;

const BuyButton = styled(IntentButton)`
  background: linear-gradient(135deg, #20B2AA, #3CB371);
`;

const SellButton = styled(IntentButton)`
  background: linear-gradient(135deg, #FF6347, #FF8C00);
`;

const FooterText = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.small};
  margin-top: auto;
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.medium};
  }
`;

const HomeScreen = () => {
  const navigate = useNavigate();
  
  const handleTradeClick = () => {
    navigate('/trade');
  };
  
  const handleBuyClick = () => {
    navigate('/swipe', { state: { mode: 'buy' } });
  };
  
  const handleSellClick = () => {
    navigate('/upload');
  };
  
  return (
    <Container>
      <ContentContainer>
        <HeaderContainer>
          <Logo><span>ted</span>list</Logo>
          <Title>What do you want to do today?</Title>
          <Subtitle>Buy, sell, or trade secondhand treasures in your area</Subtitle>
        </HeaderContainer>
        
        <ButtonsContainer>
          <TradeButton onClick={handleTradeClick}>
            <FaHandshake />
            Trade
          </TradeButton>
          
          <BuyButton onClick={handleBuyClick}>
            <FaShoppingCart />
            Buy
          </BuyButton>
          
          <SellButton onClick={handleSellClick}>
            <FaTag />
            Sell
          </SellButton>
        </ButtonsContainer>
        
        <FooterText>
          Join thousands of people finding great deals and unique items
        </FooterText>
      </ContentContainer>
    </Container>
  );
};

export default HomeScreen;