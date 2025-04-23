import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaLock, FaUser, FaCamera, FaTimes, FaCheck } from 'react-icons/fa/index.js';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../styles/theme';
import { AuthService } from '../../services';

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

const ProfileImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
`;

const ProfileImagePreview = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-image: url(${props => props.src || 'https://randomuser.me/api/portraits/lego/1.jpg'});
  background-size: cover;
  background-position: center;
  margin-bottom: ${theme.spacing.sm};
  border: 3px solid ${theme.colors.skyBlue};
`;

const ProfileImageUpload = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background-color: #6A5ACD;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const ProfileImageWrapper = styled.div`
  position: relative;
`;

const HiddenInput = styled.input`
  display: none;
`;

const SignupScreen = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = React.useRef(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error
    setError('');
    
    // Basic validation
    if (!formData.email || !formData.username || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      
<<<<<<< HEAD
      // The signup function will now send data to the API instead of storing in localStorage
      await signup(formData.email, formData.password, formData.username, profileImage);
=======
      // Prepare user data in the format expected by the backend
      const userData = {
        email: formData.email,
        username: formData.username,
        password: formData.password
      };
      
      console.log('Sending registration data:', userData);
      
      // First, register the user directly with AuthService
      const registerResult = await AuthService.register(userData);
      
      if (!registerResult.success) {
        throw new Error(registerResult.error || 'Registration failed');
      }
      
      console.log('Registration successful:', registerResult);
      
      // If profile image was provided, update it separately
      if (profileImage) {
        try {
          await AuthService.updateProfile({ profileImage });
        } catch (imageError) {
          console.error('Failed to upload profile image:', imageError);
          // Continue even if image upload fails
        }
      }
>>>>>>> temp-branch
      
      // Redirect to home on success and show onboarding for new users
      navigate('/', { state: { showOnboarding: true } });
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
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
        <FormTitle>Create an Account</FormTitle>
        
        {error && (
          <ErrorMessage>
            <FaTimes /> {error}
          </ErrorMessage>
        )}
        
        <ProfileImageContainer>
          <ProfileImageWrapper>
            <ProfileImagePreview src={profileImage} />
            <ProfileImageUpload onClick={() => fileInputRef.current.click()}>
              <FaCamera size={16} />
            </ProfileImageUpload>
            <HiddenInput 
              type="file" 
              ref={fileInputRef} 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </ProfileImageWrapper>
          <div style={{ fontSize: theme.typography.fontSize.small, color: theme.colors.textSecondary }}>
            Profile Picture
          </div>
        </ProfileImageContainer>
        
        <InputGroup>
          <InputIcon>
            <FaUser />
          </InputIcon>
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            error={error && !formData.username}
          />
        </InputGroup>
        
        <InputGroup>
          <InputIcon>
            <FaEnvelope />
          </InputIcon>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            error={error && !formData.email}
          />
        </InputGroup>
        
        <InputGroup>
          <InputIcon>
            <FaLock />
          </InputIcon>
          <Input
            type="password"
            name="password"
            placeholder="Password (min. 6 characters)"
            value={formData.password}
            onChange={handleChange}
            error={error && (!formData.password || formData.password.length < 6)}
          />
        </InputGroup>
        
        <InputGroup>
          <InputIcon>
            <FaLock />
          </InputIcon>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={error && formData.password !== formData.confirmPassword}
          />
        </InputGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
        
        <LinkContainer>
          <p>Already have an account? <StyledLink to="/login">Log in</StyledLink></p>
        </LinkContainer>
      </Form>
    </Container>
  );
};

export default SignupScreen;
