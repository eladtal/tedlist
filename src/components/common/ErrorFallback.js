import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import theme from '../../styles/theme';

const FallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 20px;
  background-color: ${theme.colors.background};
`;

const ErrorHeading = styled.h2`
  color: ${theme.colors.error};
  margin-bottom: 16px;
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.textPrimary};
  margin-bottom: 24px;
  max-width: 500px;
`;

const ActionButton = styled(Link)`
  background-color: ${theme.colors.primary};
  color: white;
  padding: 10px 20px;
  border-radius: ${theme.borderRadius.medium};
  text-decoration: none;
  margin: 5px;
  font-weight: ${theme.typography.fontWeight.medium};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${theme.colors.primaryDark};
  }
`;

const ReloadButton = styled.button`
  background-color: ${theme.colors.accent};
  color: white;
  padding: 10px 20px;
  border-radius: ${theme.borderRadius.medium};
  border: none;
  margin: 5px;
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${theme.colors.accentDark};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const ErrorDetails = styled.div`
  background-color: ${theme.colors.cardBackground};
  padding: 15px;
  border-radius: ${theme.borderRadius.medium};
  margin-top: 20px;
  max-width: 600px;
  overflow-x: auto;
  text-align: left;
  font-family: monospace;
  font-size: 14px;
  color: ${theme.colors.textSecondary};
`;

const ErrorFallback = ({ error, componentStack, retry, goHome, alternateVersion }) => {
  return (
    <FallbackContainer>
      <ErrorHeading>Something went wrong</ErrorHeading>
      <ErrorMessage>
        The application encountered an unexpected error. You can try reloading the page or use our simplified version while we fix the issue.
      </ErrorMessage>
      
      <ButtonContainer>
        <ReloadButton onClick={() => window.location.reload()}>
          Reload Page
        </ReloadButton>
        
        <ReloadButton onClick={alternateVersion || (() => window.location.href = '/react-app.html')}>
          Use Simple Version
        </ReloadButton>
        
        <ActionButton to="/" onClick={retry || goHome}>
          Go to Home
        </ActionButton>
      </ButtonContainer>
      
      {error && (
        <ErrorDetails>
          <p><strong>Error:</strong> {error.toString()}</p>
          {componentStack && (
            <p>
              <strong>Stack:</strong>
              <pre>{componentStack}</pre>
            </p>
          )}
        </ErrorDetails>
      )}
    </FallbackContainer>
  );
};

export default ErrorFallback;
