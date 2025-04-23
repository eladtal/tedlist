import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
<<<<<<< HEAD
import { FaHome, FaExchangeAlt, FaPlus, FaEnvelope, FaUser, FaUserShield } from 'react-icons/fa';
=======
import { FaHome, FaExchangeAlt, FaPlus, FaEnvelope, FaUser } from 'react-icons/fa/index.js';
>>>>>>> temp-branch
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import { useNotifications } from '../../contexts/NotificationContext';
import theme from '../../styles/theme';

const NavContainer = styled.nav`
  background-color: ${theme.colors.navBackground};
  box-shadow: ${theme.shadows.small};
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  z-index: ${theme.zIndex.navbar};
  
  @media (min-width: ${theme.breakpoints.md}) {
    top: 0;
    bottom: auto;
    height: 60px;
  }
`;

const NavInner = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (min-width: ${theme.breakpoints.md}) {
    justify-content: flex-start;
  }
`;

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${props => props.active === 'true' ? theme.colors.primary : theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.small};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  transition: color 0.2s;
  
  &:hover {
    color: ${theme.colors.primary};
  }
  
  @media (min-width: ${theme.breakpoints.md}) {
    flex-direction: row;
    margin-right: ${theme.spacing.lg};
    font-size: ${theme.typography.fontSize.medium};
    
    svg {
      margin-right: ${theme.spacing.xs};
    }
  }
`;

const IconLabel = styled.span`
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 0.7rem;
  }
`;

const MessageIconWrapper = styled.div`
  position: relative;
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: ${theme.colors.error};
  color: white;
  font-size: 0.7rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavbarInnerComponent = ({ currentUser, notificationData, adminData, location }) => {
  const hasNotifications = Boolean(notificationData?.unreadCount);
  const isAdmin = Boolean(adminData?.isAdmin);
  const unreadNotifications = notificationData?.unreadCount ?? 0;
  
  return (
    <NavContainer>
      <NavInner>
        <StyledLink to="/" active={location.pathname === '/' ? 'true' : 'false'}>
          <FaHome size={20} />
          <IconLabel>Home</IconLabel>
        </StyledLink>
        
        <StyledLink to="/swipe" active={location.pathname === '/swipe' ? 'true' : 'false'}>
          <FaExchangeAlt size={20} />
          <IconLabel>Swipe</IconLabel>
        </StyledLink>
        
        <StyledLink to="/upload" active={location.pathname === '/upload' ? 'true' : 'false'}>
          <FaPlus size={20} />
          <IconLabel>Upload</IconLabel>
        </StyledLink>
        
        <StyledLink 
          to="/messages" 
          active={location.pathname === '/messages' ? 'true' : 'false'}
        >
          <MessageIconWrapper>
            <FaEnvelope size={20} />
            {hasNotifications && (
              <NotificationBadge>
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </NotificationBadge>
            )}
          </MessageIconWrapper>
          <IconLabel>Messages</IconLabel>
        </StyledLink>
        
        <StyledLink 
          to="/profile" 
          active={location.pathname === '/profile' ? 'true' : 'false'}
        >
          <FaUser size={20} />
          <IconLabel>Profile</IconLabel>
        </StyledLink>
        
        {isAdmin && (
          <StyledLink 
            to="/admin" 
            active={location.pathname === '/admin' ? 'true' : 'false'}
          >
            <FaUserShield size={20} />
            <IconLabel>Admin</IconLabel>
          </StyledLink>
        )}
      </NavInner>
    </NavContainer>
  );
};

const Navbar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const notificationData = useNotifications();
  const adminData = useAdmin();

  return (
    <NavbarInnerComponent
      currentUser={currentUser}
      notificationData={notificationData}
      adminData={adminData}
      location={location}
    />
  );
};

export default Navbar;