import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaTrophy, FaTimes } from 'react-icons/fa';
import theme from '../../styles/theme';
import { useOnboarding } from '../../contexts/OnboardingContext';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fallAnimation = keyframes`
  0% {
    transform: translateY(-50vh);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.xl};
  width: 90%;
  max-width: 500px;
  text-align: center;
  position: relative;
  z-index: 1001;
  box-shadow: ${theme.shadows.large};
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  
  &:hover {
    color: ${theme.colors.textPrimary};
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.textPrimary};
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: ${theme.spacing.xl};
  color: ${theme.colors.textSecondary};
`;

const IconContainer = styled.div`
  margin-bottom: ${theme.spacing.md};
  font-size: 4rem;
  color: #FFD700;
  animation: ${pulse} 2s infinite;
`;

const PointsHighlight = styled.span`
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  font-size: 1.4rem;
`;

const ConfettiContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1000;
  pointer-events: none;
`;

const Confetti = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: ${props => props.color};
  opacity: 0.8;
  border-radius: ${props => props.round ? '50%' : '0'};
  animation: ${fallAnimation} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  top: -10px;
  left: ${props => props.left}%;
  transform: rotate(${props => props.rotate}deg);
`;

const createConfetti = (count = 50) => {
  const colors = ['#6A5ACD', '#FF6347', '#FFD700', '#3CB371', '#FF1493', '#00BFFF'];
  const confetti = [];
  
  for (let i = 0; i < count; i++) {
    const left = Math.random() * 100;
    const duration = Math.random() * 5 + 3;
    const delay = Math.random() * 3;
    const rotate = Math.random() * 360;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const round = Math.random() > 0.5;
    
    confetti.push(
      <Confetti 
        key={i}
        left={left}
        duration={duration}
        delay={delay}
        rotate={rotate}
        color={color}
        round={round}
      />
    );
  }
  
  return confetti;
};

const OnboardingSuccessModal = ({ onClose }) => {
  const { getTotalPointsEarned } = useOnboarding();
  const totalPoints = getTotalPointsEarned();
  
  useEffect(() => {
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  return (
    <ModalOverlay>
      <ConfettiContainer>
        {createConfetti(100)}
      </ConfettiContainer>
      
      <ModalContent>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        
        <IconContainer>
          <FaTrophy />
        </IconContainer>
        
        <Title>Congratulations!</Title>
        <Message>
          You've completed all onboarding tasks and earned a total of
          <PointsHighlight> {totalPoints} points</PointsHighlight>!
        </Message>
        <Message>
          Great job exploring Tedlist! Continue using the platform to earn more points and unlock special rewards.
        </Message>
      </ModalContent>
    </ModalOverlay>
  );
};

export default OnboardingSuccessModal;
