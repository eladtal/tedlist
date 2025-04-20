import React from 'react';
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
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { isAdmin } = useAdmin();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
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
    </HeaderContainer>
  );
};

export default Header;
