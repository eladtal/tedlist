import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Confetti from 'react-confetti';
import { FaTrophy, FaTimes, FaCoins } from 'react-icons/fa';
import theme from '../../styles/theme';
import { useOnboarding, STEP_POINTS } from '../../contexts/OnboardingContext';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: ${theme.borderRadius.large};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: ${theme.shadows.large};
  animation: ${slideUp} 0.5s ease;
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #6A5ACD, #8A2BE2);
  color: white;
  padding: ${theme.spacing.lg};
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${theme.typography.fontSize.xlarge};
  margin-bottom: ${theme.spacing.sm};
`;

const ModalSubtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: ${theme.typography.fontSize.medium};
`;

const ModalBody = styled.div`
  padding: ${theme.spacing.lg};
  text-align: center;
`;

const TrophyIcon = styled.div`
  color: gold;
  font-size: 4rem;
  margin-bottom: ${theme.spacing.md};
`;

const BadgeContainer = styled.div`
  background-color: ${theme.colors.greyLight};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.large};
  display: inline-block;
  margin: ${theme.spacing.md} 0;
`;

const BadgeTitle = styled.div`
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.large};
  margin-bottom: ${theme.spacing.xs};
`;

const BadgeDescription = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.medium};
`;

const BonusPoints = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${theme.spacing.lg} 0;
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.xlarge};
  color: ${theme.colors.primary};
`;

const PointsIcon = styled.div`
  color: gold;
  margin-right: ${theme.spacing.sm};
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.medium};
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.medium};
  cursor: pointer;
  margin-top: ${theme.spacing.md};
  
  &:hover {
    background-color: ${theme.colors.primaryDark};
  }
`;

const OnboardingSuccessModal = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { showCompletionModal, closeCompletionModal } = useOnboarding();
  
  // Set dimensions for the confetti
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  if (!showCompletionModal) {
    return null;
  }
  
  return (
    <Overlay>
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        numberOfPieces={200}
        recycle={false}
        colors={['#6A5ACD', '#8A2BE2', '#FF6347', '#FFD700', '#4CAF50', '#2196F3']}
      />
      
      <ModalContainer>
        <ModalHeader>
          <CloseButton onClick={closeCompletionModal}>
            <FaTimes />
          </CloseButton>
          <ModalTitle>🎉 Congratulations!</ModalTitle>
          <ModalSubtitle>You've completed your Tedlist Starter Pack!</ModalSubtitle>
        </ModalHeader>
        
        <ModalBody>
          <TrophyIcon>
            <FaTrophy />
          </TrophyIcon>
          
          <p>
            You've completed all the onboarding tasks and unlocked a special reward!
          </p>
          
          <BadgeContainer>
            <BadgeTitle>Starter Pack Complete!</BadgeTitle>
            <BadgeDescription>You're now a verified Tedlist user</BadgeDescription>
          </BadgeContainer>
          
          <BonusPoints>
            <PointsIcon>
              <FaCoins />
            </PointsIcon>
            +{STEP_POINTS.COMPLETION_BONUS} BONUS POINTS
          </BonusPoints>
          
          <p>
            Keep exploring Tedlist to earn more points and unlock additional rewards!
          </p>
          
          <Button onClick={closeCompletionModal}>
            Continue to Tedlist
          </Button>
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

export default OnboardingSuccessModal;
