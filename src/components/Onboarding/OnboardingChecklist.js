import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaCheck, FaUpload, FaUser, FaComment, 
  FaExchangeAlt, FaUserPlus, FaChevronRight, 
  FaTrophy 
} from 'react-icons/fa';
import theme from '../../styles/theme';
import { useOnboarding, ONBOARDING_STEPS, STEP_POINTS } from '../../contexts/OnboardingContext';
import OnboardingProgressBar from './OnboardingProgressBar';

const Container = styled.div`
  background-color: white;
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${theme.shadows.small};
  margin: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

const Header = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent});
  padding: ${theme.spacing.md};
  color: white;
`;

const Title = styled.h2`
  margin: 0;
  margin-bottom: ${theme.spacing.xs};
  font-size: ${theme.typography.fontSize.large};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: ${theme.spacing.sm};
  }
`;

const Subtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: ${theme.typography.fontSize.medium};
`;

const Content = styled.div`
  padding: ${theme.spacing.md};
`;

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md} 0;
  border-bottom: 1px solid ${theme.colors.divider};
  
  &:last-child {
    border-bottom: none;
  }
`;

const StepIconContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing.md};
  flex-shrink: 0;
  
  background-color: ${props => props.completed ? 
    'rgba(76, 175, 80, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  
  color: ${props => props.completed ? '#4CAF50' : theme.colors.textSecondary};
  
  font-size: 1.2rem;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.div`
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.xs};
  display: flex;
  align-items: center;
`;

const StepPoints = styled.span`
  color: ${theme.colors.primary};
  font-size: ${theme.typography.fontSize.small};
  margin-left: ${theme.spacing.sm};
  background-color: rgba(106, 90, 205, 0.1);
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.medium};
`;

const StepDescription = styled.div`
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.textSecondary};
  margin-bottom: ${props => props.hasProgress ? theme.spacing.sm : 0};
`;

const ProgressIndicator = styled.div`
  height: 4px;
  background-color: ${theme.colors.greyLight};
  border-radius: ${theme.borderRadius.large};
  margin-top: ${theme.spacing.xs};
  overflow: hidden;
  width: 100%;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background-color: ${theme.colors.primary};
  border-radius: ${theme.borderRadius.large};
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.textSecondary};
  margin-top: ${theme.spacing.xs};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background-color: ${props => props.completed ? 'transparent' : theme.colors.primary};
  color: ${props => props.completed ? '#4CAF50' : 'white'};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: ${props => props.completed ? 'default' : 'pointer'};
  margin-left: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.small};
  
  svg {
    margin-left: ${theme.spacing.xs};
  }
`;

const CompletionBanner = styled.div`
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  padding: ${theme.spacing.md};
  display: flex;
  align-items: center;
  font-weight: ${theme.typography.fontWeight.bold};
  margin-top: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  
  svg {
    margin-right: ${theme.spacing.sm};
  }
`;

const getStepIcon = (step, completed) => {
  if (completed) {
    return <FaCheck />;
  }
  
  switch (step) {
    case ONBOARDING_STEPS.SIGNED_UP:
      return <FaCheck />;
    case ONBOARDING_STEPS.UPLOAD_ITEM:
      return <FaUpload />;
    case ONBOARDING_STEPS.COMPLETE_PROFILE:
      return <FaUser />;
    case ONBOARDING_STEPS.SEND_MESSAGE:
      return <FaComment />;
    case ONBOARDING_STEPS.SWIPE_ITEMS:
      return <FaExchangeAlt />;
    case ONBOARDING_STEPS.INVITE_FRIEND:
      return <FaUserPlus />;
    default:
      return <FaCheck />;
  }
};

const OnboardingChecklist = () => {
  const navigate = useNavigate();
  const { 
    ONBOARDING_STEPS, 
    isStepCompleted, 
    getStepTitle, 
    getStepCta, 
    getStepCtaPath,
    isOnboardingComplete,
    getSwipeProgress
  } = useOnboarding();
  
  const handleActionClick = (step) => {
    const path = getStepCtaPath(step);
    navigate(path);
  };
  
  const swipeProgress = getSwipeProgress();
  
  return (
    <Container>
      <Header>
        <Title>
          <FaTrophy /> Starter Pack
        </Title>
        <Subtitle>Complete these tasks to earn points and unlock rewards</Subtitle>
      </Header>
      
      <Content>
        <OnboardingProgressBar />
        
        <StepsList>
          {/* Step 1: Sign up */}
          <Step>
            <StepIconContainer completed={true}>
              {getStepIcon(ONBOARDING_STEPS.SIGNED_UP, true)}
            </StepIconContainer>
            <StepContent>
              <StepTitle>
                {getStepTitle(ONBOARDING_STEPS.SIGNED_UP)}
                <StepPoints>+{STEP_POINTS[ONBOARDING_STEPS.SIGNED_UP]} pts</StepPoints>
              </StepTitle>
              <StepDescription>
                Welcome to Tedlist! Your journey begins here.
              </StepDescription>
            </StepContent>
            <ActionButton completed={true}>
              Completed <FaCheck />
            </ActionButton>
          </Step>
          
          {/* Step 2: Upload Item */}
          <Step>
            <StepIconContainer completed={isStepCompleted(ONBOARDING_STEPS.UPLOAD_ITEM)}>
              {getStepIcon(ONBOARDING_STEPS.UPLOAD_ITEM, isStepCompleted(ONBOARDING_STEPS.UPLOAD_ITEM))}
            </StepIconContainer>
            <StepContent>
              <StepTitle>
                {getStepTitle(ONBOARDING_STEPS.UPLOAD_ITEM)}
                <StepPoints>+{STEP_POINTS[ONBOARDING_STEPS.UPLOAD_ITEM]} pts</StepPoints>
              </StepTitle>
              <StepDescription>
                Share something you'd like to sell or trade with the community.
              </StepDescription>
            </StepContent>
            {isStepCompleted(ONBOARDING_STEPS.UPLOAD_ITEM) ? (
              <ActionButton completed={true}>
                Completed <FaCheck />
              </ActionButton>
            ) : (
              <ActionButton 
                onClick={() => handleActionClick(ONBOARDING_STEPS.UPLOAD_ITEM)}
              >
                {getStepCta(ONBOARDING_STEPS.UPLOAD_ITEM)} <FaChevronRight />
              </ActionButton>
            )}
          </Step>
          
          {/* Step 3: Complete Profile */}
          <Step>
            <StepIconContainer completed={isStepCompleted(ONBOARDING_STEPS.COMPLETE_PROFILE)}>
              {getStepIcon(ONBOARDING_STEPS.COMPLETE_PROFILE, isStepCompleted(ONBOARDING_STEPS.COMPLETE_PROFILE))}
            </StepIconContainer>
            <StepContent>
              <StepTitle>
                {getStepTitle(ONBOARDING_STEPS.COMPLETE_PROFILE)}
                <StepPoints>+{STEP_POINTS[ONBOARDING_STEPS.COMPLETE_PROFILE]} pts</StepPoints>
              </StepTitle>
              <StepDescription>
                Add a profile picture and bio to help others get to know you.
              </StepDescription>
            </StepContent>
            {isStepCompleted(ONBOARDING_STEPS.COMPLETE_PROFILE) ? (
              <ActionButton completed={true}>
                Completed <FaCheck />
              </ActionButton>
            ) : (
              <ActionButton 
                onClick={() => handleActionClick(ONBOARDING_STEPS.COMPLETE_PROFILE)}
              >
                {getStepCta(ONBOARDING_STEPS.COMPLETE_PROFILE)} <FaChevronRight />
              </ActionButton>
            )}
          </Step>
          
          {/* Step 4: Send Message */}
          <Step>
            <StepIconContainer completed={isStepCompleted(ONBOARDING_STEPS.SEND_MESSAGE)}>
              {getStepIcon(ONBOARDING_STEPS.SEND_MESSAGE, isStepCompleted(ONBOARDING_STEPS.SEND_MESSAGE))}
            </StepIconContainer>
            <StepContent>
              <StepTitle>
                {getStepTitle(ONBOARDING_STEPS.SEND_MESSAGE)}
                <StepPoints>+{STEP_POINTS[ONBOARDING_STEPS.SEND_MESSAGE]} pts</StepPoints>
              </StepTitle>
              <StepDescription>
                Connect with another user by sending them a message.
              </StepDescription>
            </StepContent>
            {isStepCompleted(ONBOARDING_STEPS.SEND_MESSAGE) ? (
              <ActionButton completed={true}>
                Completed <FaCheck />
              </ActionButton>
            ) : (
              <ActionButton 
                onClick={() => handleActionClick(ONBOARDING_STEPS.SEND_MESSAGE)}
              >
                {getStepCta(ONBOARDING_STEPS.SEND_MESSAGE)} <FaChevronRight />
              </ActionButton>
            )}
          </Step>
          
          {/* Step 5: Swipe Items */}
          <Step>
            <StepIconContainer completed={isStepCompleted(ONBOARDING_STEPS.SWIPE_ITEMS)}>
              {getStepIcon(ONBOARDING_STEPS.SWIPE_ITEMS, isStepCompleted(ONBOARDING_STEPS.SWIPE_ITEMS))}
            </StepIconContainer>
            <StepContent>
              <StepTitle>
                {getStepTitle(ONBOARDING_STEPS.SWIPE_ITEMS)}
                <StepPoints>+{STEP_POINTS[ONBOARDING_STEPS.SWIPE_ITEMS]} pts</StepPoints>
              </StepTitle>
              <StepDescription hasProgress={!isStepCompleted(ONBOARDING_STEPS.SWIPE_ITEMS)}>
                Swipe through 5 items to discover what's available.
              </StepDescription>
              
              {!isStepCompleted(ONBOARDING_STEPS.SWIPE_ITEMS) && (
                <>
                  <ProgressIndicator>
                    <ProgressBar percentage={(swipeProgress.current / swipeProgress.target) * 100} />
                  </ProgressIndicator>
                  <ProgressText>
                    {swipeProgress.current} of {swipeProgress.target} items swiped
                  </ProgressText>
                </>
              )}
            </StepContent>
            {isStepCompleted(ONBOARDING_STEPS.SWIPE_ITEMS) ? (
              <ActionButton completed={true}>
                Completed <FaCheck />
              </ActionButton>
            ) : (
              <ActionButton 
                onClick={() => handleActionClick(ONBOARDING_STEPS.SWIPE_ITEMS)}
              >
                {getStepCta(ONBOARDING_STEPS.SWIPE_ITEMS)} <FaChevronRight />
              </ActionButton>
            )}
          </Step>
          
          {/* Step 6: Invite Friend */}
          <Step>
            <StepIconContainer completed={isStepCompleted(ONBOARDING_STEPS.INVITE_FRIEND)}>
              {getStepIcon(ONBOARDING_STEPS.INVITE_FRIEND, isStepCompleted(ONBOARDING_STEPS.INVITE_FRIEND))}
            </StepIconContainer>
            <StepContent>
              <StepTitle>
                {getStepTitle(ONBOARDING_STEPS.INVITE_FRIEND)}
                <StepPoints>+{STEP_POINTS[ONBOARDING_STEPS.INVITE_FRIEND]} pts</StepPoints>
              </StepTitle>
              <StepDescription>
                Share Tedlist with a friend and earn bonus points.
              </StepDescription>
            </StepContent>
            {isStepCompleted(ONBOARDING_STEPS.INVITE_FRIEND) ? (
              <ActionButton completed={true}>
                Completed <FaCheck />
              </ActionButton>
            ) : (
              <ActionButton 
                onClick={() => handleActionClick(ONBOARDING_STEPS.INVITE_FRIEND)}
              >
                {getStepCta(ONBOARDING_STEPS.INVITE_FRIEND)} <FaChevronRight />
              </ActionButton>
            )}
          </Step>
        </StepsList>
        
        {isOnboardingComplete() && (
          <CompletionBanner>
            <FaTrophy /> Starter Pack completed! You earned a total of {Object.values(STEP_POINTS).reduce((a, b) => a + b, 0)} points.
          </CompletionBanner>
        )}
      </Content>
    </Container>
  );
};

export default OnboardingChecklist;
