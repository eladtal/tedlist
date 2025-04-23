import React from 'react';
<<<<<<< HEAD
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaSignInAlt, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import theme from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';

const HeaderContainer = styled.header`
  background-color: white;
  border-bottom: 1px solid ${theme.colors.divider};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${theme.shadows.small};
`;

const Logo = styled(Link)`
  font-size: ${theme.typography.fontSize.large};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    color: ${theme.colors.primaryDark};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const Username = styled.div`
  font-weight: ${theme.typography.fontWeight.medium};
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-color: ${theme.colors.greyLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textSecondary};
  
  svg {
    font-size: 1rem;
  }
`;

const LoginButton = styled(Link)`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background-color: ${theme.colors.primary};
  color: white;
  border-radius: ${theme.borderRadius.medium};
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.medium};
  
  svg {
    margin-right: ${theme.spacing.xs};
  }
  
  &:hover {
    background-color: ${theme.colors.primaryDark};
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background-color: transparent;
  color: ${theme.colors.textSecondary};
  border: 1px solid ${theme.colors.divider};
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  font-weight: ${theme.typography.fontWeight.medium};
  
  svg {
    margin-right: ${theme.spacing.xs};
  }
  
  &:hover {
    background-color: ${theme.colors.greyLight};
  }
`;

const AdminButton = styled(Link)`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background-color: ${theme.colors.accent};
  color: white;
  border-radius: ${theme.borderRadius.medium};
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.medium};
  
  svg {
    margin-right: ${theme.spacing.xs};
  }
  
  &:hover {
    opacity: 0.9;
  }
`;

const ProfileLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${theme.colors.textPrimary};
  
  &:hover {
    color: ${theme.colors.primary};
=======
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUpload, FaHome, FaExchangeAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #6A5ACD;
  font-size: 24px;
  font-weight: bold;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  gap: 5px;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  @media (max-width: 768px) {
    padding: 8px 5px;
    
    span {
      display: none;
    }
  }
`;

const AuthContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ProfileContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  gap: 8px;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileName = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  background-color: ${props => props.primary ? '#6A5ACD' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: ${props => props.primary ? 'none' : '1px solid #ddd'};
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.primary ? '#5849B8' : '#f5f5f5'};
  }

  @media (max-width: 768px) {
    padding: 8px;
    
    span {
      display: none;
    }
>>>>>>> temp-branch
  }
`;

const Header = () => {
<<<<<<< HEAD
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { isAdmin } = useAdmin();
  
=======
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

>>>>>>> temp-branch
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
<<<<<<< HEAD
  
  const getInitials = (name) => {
    if (!name) return <FaUser />;
    return name.charAt(0).toUpperCase();
  };
  
  return (
    <HeaderContainer>
      <Logo to="/">Tedlist</Logo>
      
      <RightSection>
        {currentUser ? (
          <>
            <UserSection>
              <ProfileLink to="/profile">
                <UserAvatar src={currentUser.profileImage}>
                  {!currentUser.profileImage && getInitials(currentUser.username)}
                </UserAvatar>
                <Username>{currentUser.username || currentUser.email}</Username>
              </ProfileLink>
            </UserSection>
            
            {isAdmin && (
              <AdminButton to="/admin">
                <FaUserShield /> Admin
              </AdminButton>
            )}
            
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </LogoutButton>
          </>
        ) : (
          <LoginButton to="/login">
            <FaSignInAlt /> Login
          </LoginButton>
        )}
      </RightSection>
=======

  return (
    <HeaderContainer>
      <LogoContainer to="/">Tedlist</LogoContainer>
      
      <Nav>
        <NavLink to="/">
          <FaHome />
          <span>Home</span>
        </NavLink>
        {currentUser && (
          <>
            <NavLink to="/swipe">
              <FaExchangeAlt />
              <span>Swipe</span>
            </NavLink>
            <NavLink to="/upload">
              <FaUpload />
              <span>Post Item</span>
            </NavLink>
          </>
        )}
      </Nav>
      
      <AuthContainer>
        {currentUser ? (
          <>
            <ProfileContainer to="/profile">
              <Avatar>
                {currentUser.photoURL ? (
                  <ProfileImage src={currentUser.photoURL} alt="Profile" />
                ) : (
                  <FaUser />
                )}
              </Avatar>
              <ProfileName>
                {currentUser.displayName || currentUser.email || 'User'}
              </ProfileName>
            </ProfileContainer>
            
            <Button onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </Button>
          </>
        ) : (
          <Button primary as={Link} to="/login">
            <FaSignInAlt />
            <span>Login</span>
          </Button>
        )}
      </AuthContainer>
>>>>>>> temp-branch
    </HeaderContainer>
  );
};

export default Header;
