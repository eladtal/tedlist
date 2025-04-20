import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaExchangeAlt, FaPlus, FaEnvelope, FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
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

const NavLogo = styled.div`
  display: none;
  font-size: ${theme.typography.fontSize.large};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  margin-right: auto;
  padding: 0 ${theme.spacing.md};
  
  @media (min-width: ${theme.breakpoints.md}) {
    display: block;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${props => props.active ? theme.colors.primary : theme.colors.textSecondary};
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

const NavIcon = styled.div`
  font-size: 1.25rem;
  margin-bottom: ${theme.spacing.xs};
  
  @media (min-width: ${theme.breakpoints.md}) {
    margin-bottom: 0;
  }
`;

const NavLabel = styled.span`
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 0.7rem;
  }
`;

const AddButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${theme.colors.accent};
  color: ${theme.colors.textPrimary};
  font-size: 1.5rem;
  position: relative;
  bottom: ${theme.spacing.md};
  box-shadow: ${theme.shadows.medium};
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: ${theme.shadows.large};
  }
  
  @media (min-width: ${theme.breakpoints.md}) {
    position: static;
    width: auto;
    height: auto;
    border-radius: ${theme.borderRadius.medium};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    margin-left: auto;
    margin-right: ${theme.spacing.md};
    
    svg {
      margin-right: ${theme.spacing.xs};
    }
  }
`;

const AddButtonLabel = styled.span`
  display: none;
  
  @media (min-width: ${theme.breakpoints.md}) {
    display: inline;
  }
`;

const ProfileAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-image: url(${props => props.src || 'https://randomuser.me/api/portraits/lego/1.jpg'});
  background-size: cover;
  background-position: center;
  margin-bottom: ${theme.spacing.xs};
  border: 2px solid ${props => props.active ? theme.colors.primary : 'transparent'};
  
  @media (min-width: ${theme.breakpoints.md}) {
    margin-bottom: 0;
    margin-right: ${theme.spacing.xs};
    width: 28px;
    height: 28px;
  }
`;

const Navbar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  return (
    <NavContainer>
      <NavInner>
        <NavLogo>Tedlist</NavLogo>
        
        <NavLink to="/" active={location.pathname === '/' ? 1 : 0}>
          <NavIcon><FaHome /></NavIcon>
          <NavLabel>Home</NavLabel>
        </NavLink>
        
        <NavLink to="/swipe" active={location.pathname === '/swipe' ? 1 : 0}>
          <NavIcon><FaExchangeAlt /></NavIcon>
          <NavLabel>Swipe</NavLabel>
        </NavLink>
        
        <AddButton to="/upload">
          <FaPlus />
          <AddButtonLabel>Post Item</AddButtonLabel>
        </AddButton>
        
        <NavLink to="/messages" active={location.pathname === '/messages' ? 1 : 0}>
          <NavIcon><FaEnvelope /></NavIcon>
          <NavLabel>Messages</NavLabel>
        </NavLink>
        
        <NavLink to="/profile" active={location.pathname === '/profile' ? 1 : 0}>
          {currentUser?.profileImage ? (
            <ProfileAvatar 
              src={currentUser.profileImage} 
              active={location.pathname === '/profile' ? 1 : 0} 
            />
          ) : (
            <NavIcon><FaUser /></NavIcon>
          )}
          <NavLabel>Profile</NavLabel>
        </NavLink>
      </NavInner>
    </NavContainer>
  );
};

export default Navbar;