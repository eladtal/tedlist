import React from 'react';
import styled, { keyframes } from 'styled-components';
import theme from '../../styles/theme';
import { useOnboarding } from '../../contexts/OnboardingContext';

const progressAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: var(--progress-width);
  }
`;

const Container = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const ProgressBarContainer = styled.div`
  height: 10px;
  background-color: ${theme.colors.greyLight};
  border-radius: ${theme.borderRadius.large};
  overflow: hidden;
  margin-bottom: ${theme.spacing.xs};
`;

const Progress = styled.div`
  height: 100%;
  --progress-width: ${props => props.percentage}%;
  width: var(--progress-width);
  background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent});
  border-radius: ${theme.borderRadius.large};
  transition: width 0.5s ease;
  animation: ${progressAnimation} 1s ease;
`;

const ProgressText = styled.div`
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.textSecondary};
  text-align: center;
  font-weight: ${theme.typography.fontWeight.medium};
`;

const OnboardingProgressBar = () => {
  const { getProgressPercentage } = useOnboarding();
  const percentage = getProgressPercentage();
  
  return (
    <Container>
      <ProgressBarContainer>
        <Progress percentage={percentage} />
      </ProgressBarContainer>
      <ProgressText>
        Your onboarding progress: {percentage}% complete
      </ProgressText>
    </Container>
  );
};

export default OnboardingProgressBar;
