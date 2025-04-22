import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaLock, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../styles/theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.md};
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 100px;
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const Logo = styled.h1`
  font-size: 2.5rem;
  background: linear-gradient(45deg, #6A5ACD, #87CEEB);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: ${theme.spacing.xs};
`;

const Tagline = styled.p`
  color: ${theme.colors.textSecondary};
`;

const Form = styled.form`
  background-color: white;
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.large};
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: ${theme.spacing.lg};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} 40px;
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid ${props => props.error ? theme.colors.error : theme.colors.divider};
  font-size: ${theme.typography.fontSize.medium};
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.skyBlue};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.typography.fontSize.small};
  margin-top: ${theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const Button = styled.button`
  width: 100%;
  padding: ${theme.spacing.md};
  background-color: #6A5ACD;
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.medium};
  font-weight: ${theme.typography.fontWeight.bold};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #5D4FB8;
  }
  
  &:disabled {
    background-color: ${theme.colors.divider};
    cursor: not-allowed;
  }
`;

const LinkContainer = styled.div`
  text-align: center;
  margin-top: ${theme.spacing.lg};
`;

const StyledLink = styled(Link)`
  color: #6A5ACD;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoginScreen = () => {
  const navigate = useNavigate();
  const { login, setCurrentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error
    setError('');
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      await login(email, password);
      
      // Redirect to home on success
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  // Demo login now uses the API with a predefined account
  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      
      const demoEmail = 'demo@tedlist.com';
      const demoPassword = 'demopassword';
      
      await login(demoEmail, demoPassword);
      navigate('/');
    } catch (error) {
      console.error('Demo login error:', error);
      setError('Demo account login failed. Please try regular login.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <LogoContainer>
        <Logo>Tedlist</Logo>
        <Tagline>Buy, sell, and trade with your community</Tagline>
      </LogoContainer>
      
      <Form onSubmit={handleSubmit}>
        <FormTitle>Log in to Tedlist</FormTitle>
        
        {error && (
          <ErrorMessage>
            <FaTimes /> {error}
          </ErrorMessage>
        )}
        
        <InputGroup>
          <InputIcon>
            <FaEnvelope />
          </InputIcon>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error && !email}
          />
        </InputGroup>
        
        <InputGroup>
          <InputIcon>
            <FaLock />
          </InputIcon>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error && !password}
          />
        </InputGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
        
        {process.env.NODE_ENV === 'development' && (
          <Button 
            type="button" 
            onClick={() => {
              // Create mock user data
              const mockUser = {
                id: 'dev-user-123',
                email: 'dev@example.com',
                username: 'DevUser',
                profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg'
              };
              
              // Create mock token
              const mockToken = 'dev-token-' + Date.now();
              
              // Store in localStorage
              localStorage.setItem('tedlistAuthToken', mockToken);
              localStorage.setItem('tedlistUser', JSON.stringify(mockUser));
              
              // Update auth context
              setCurrentUser(mockUser);
              
              // Redirect to home
              navigate('/');
            }}
            style={{ backgroundColor: '#FF9800', marginTop: '10px' }}
          >
            Dev Mode: Instant Login
          </Button>
        )}
        
        <LinkContainer>
          <p>Don't have an account? <StyledLink to="/signup">Sign up</StyledLink></p>
        </LinkContainer>
        
        <div style={{ margin: '20px 0', textAlign: 'center' }}>
          <p style={{ color: theme.colors.textSecondary, marginBottom: '10px' }}>- OR -</p>
          <Button type="button" onClick={handleDemoLogin} disabled={loading}>
            {loading ? 'Loading...' : 'Try Demo Account'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default LoginScreen;
