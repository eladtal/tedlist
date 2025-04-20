import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrophy } from 'react-icons/fa';
import OnboardingChecklist from './OnboardingChecklist';
import OnboardingSuccessModal from './OnboardingSuccessModal';
import theme from '../../styles/theme';

const Container = styled.div`
  padding-bottom: 80px;
  max-width: 800px;
  margin: 0 auto;
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 20px;
    padding-bottom: ${theme.spacing.md};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md};
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid ${theme.colors.divider};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-right: ${theme.spacing.md};
  cursor: pointer;
  color: ${theme.colors.textPrimary};
  font-size: 1.2rem;
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.fontSize.large};
  margin: 0;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: ${theme.spacing.sm};
  }
`;

const OnboardingScreen = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <FaArrowLeft />
        </BackButton>
        <PageTitle>
          <FaTrophy /> Onboarding
        </PageTitle>
      </Header>
      
      <OnboardingChecklist />
      <OnboardingSuccessModal />
    </Container>
  );
};

export default OnboardingScreen;
