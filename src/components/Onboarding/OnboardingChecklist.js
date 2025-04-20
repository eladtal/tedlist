import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaCheckCircle, 
  FaRegCircle, 
  FaUser, 
  FaUpload, 
  FaComments, 
  FaExchangeAlt, 
  FaUserFriends, 
  FaUserPlus,
  FaChevronRight 
} from 'react-icons/fa';
import { useOnboarding, ONBOARDING_STEPS, ONBOARDING_STEP_DETAILS, STEP_POINTS } from '../../contexts/OnboardingContext';
import theme from '../../styles/theme';

const Container = styled.div`
  background-color: white;
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.medium};
  overflow: hidden;
  margin-bottom: ${theme.spacing.xl};
`;

const Header = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark});
  color: white;
  padding: ${theme.spacing.lg};
  text-align: center;
`;

const Title = styled.h2`
  margin: 0;
  margin-bottom: ${theme.spacing.xs};
  font-size: 1.5rem;
`;

const Subtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
`;

const ChecklistItems = styled.div`
  padding: ${theme.spacing.md};
`;

const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.divider};
  
  &:last-child {
    border-bottom: none;
  }
  
  ${props => props.completed && `
    background-color: rgba(106, 90, 205, 0.05);
  `}
`;

const StatusIcon = styled.div`
  color: ${props => props.completed ? theme.colors.success : theme.colors.greyMedium};
  font-size: 1.2rem;
  margin-right: ${theme.spacing.md};
  
  svg {
    vertical-align: middle;
  }
`;

const StepIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${props => props.completed ? theme.colors.primary : theme.colors.greyLight};
  color: ${props => props.completed ? 'white' : theme.colors.textSecondary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing.md};
  flex-shrink: 0;
  
  svg {
    font-size: 1.2rem;
  }
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.div`
  font-weight: ${theme.typography.fontWeight.medium};
  margin-bottom: ${theme.spacing.xs};
`;

const StepDescription = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: ${theme.spacing.xs};
`;

const StepPoints = styled.div`
  color: ${theme.colors.primary};
  font-size: 0.8rem;
  font-weight: ${theme.typography.fontWeight.medium};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  background-color: ${props => props.completed ? 'transparent' : theme.colors.primary};
  color: ${props => props.completed ? theme.colors.success : 'white'};
  border: none;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
  cursor: ${props => props.completed ? 'default' : 'pointer'};
  font-size: 0.8rem;
  margin-left: ${theme.spacing.sm};
  
  ${props => !props.completed && `
    &:hover {
      background-color: ${theme.colors.primaryDark};
    }
  `}
  
  svg {
    margin-left: ${theme.spacing.xs};
  }
`;

// Map step keys to icons
const StepIcons = {
  [ONBOARDING_STEPS.SIGN_UP]: FaUserPlus,
  [ONBOARDING_STEPS.UPLOAD_ITEM]: FaUpload,
  [ONBOARDING_STEPS.COMPLETE_PROFILE]: FaUser,
  [ONBOARDING_STEPS.SEND_MESSAGE]: FaComments,
  [ONBOARDING_STEPS.SWIPE_ITEMS]: FaExchangeAlt,
  [ONBOARDING_STEPS.INVITE_FRIEND]: FaUserFriends
};

const OnboardingChecklist = () => {
  const navigate = useNavigate();
  const { 
    isStepCompleted, 
    getProgressPercentage,
    completedSteps
  } = useOnboarding();
  
  const handleActionClick = (step) => {
    if (isStepCompleted(step)) return;
    
    const path = ONBOARDING_STEP_DETAILS[step]?.ctaPath || '/';
    navigate(path);
  };
  
  const renderStepIcon = (step) => {
    const Icon = StepIcons[step] || FaCheckCircle;
    return <Icon />;
  };
  
  return (
    <Container>
      <Header>
        <Title>Get Started with Tedlist</Title>
        <Subtitle>Complete these steps to earn points and get the most out of Tedlist</Subtitle>
      </Header>
      
      <ChecklistItems>
        {Object.values(ONBOARDING_STEPS).map((step) => {
          const stepDetails = ONBOARDING_STEP_DETAILS[step];
          const completed = isStepCompleted(step);
          
          return (
            <ChecklistItem key={step} completed={completed}>
              <StatusIcon completed={completed}>
                {completed ? <FaCheckCircle /> : <FaRegCircle />}
              </StatusIcon>
              
              <StepIcon completed={completed}>
                {renderStepIcon(step)}
              </StepIcon>
              
              <StepContent>
                <StepTitle>{stepDetails?.title || step}</StepTitle>
                <StepDescription>{stepDetails?.description || ''}</StepDescription>
                <StepPoints>+{stepDetails?.points || STEP_POINTS[step] || 0} points</StepPoints>
              </StepContent>
              
              {!completed ? (
                <ActionButton onClick={() => handleActionClick(step)}>
                  {stepDetails?.ctaText || 'Complete'} <FaChevronRight />
                </ActionButton>
              ) : (
                <ActionButton completed>
                  Completed
                </ActionButton>
              )}
            </ChecklistItem>
          );
        })}
      </ChecklistItems>
    </Container>
  );
};

export default OnboardingChecklist;
