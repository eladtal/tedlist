import React from 'react';
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
  }
`;

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

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
    </HeaderContainer>
  );
};

export default Header;
