import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCamera, FaPen, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../styles/theme';

const Container = styled.div`
  padding-bottom: 80px;
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 80px;
    padding-bottom: ${theme.spacing.md};
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.xl} ${theme.spacing.md};
  background-color: white;
  position: relative;
`;

const ProfileImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-image: url(${props => props.src || 'https://randomuser.me/api/portraits/lego/1.jpg'});
  background-size: cover;
  background-position: center;
  margin-bottom: ${theme.spacing.md};
  border: 3px solid ${theme.colors.skyBlue};
`;

const ProfileName = styled.h1`
  font-size: ${theme.typography.fontSize.large};
  margin-bottom: ${theme.spacing.xs};
`;

const ProfileInfo = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.medium};
`;

const EditButton = styled.button`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: 1.2rem;
  cursor: pointer;
  
  &:hover {
    color: ${theme.colors.skyBlue};
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background-color: #f5f5f5;
  color: ${theme.colors.textSecondary};
  border: 1px solid ${theme.colors.divider};
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.small};
  margin-top: ${theme.spacing.md};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f0f0f0;
    color: ${theme.colors.error};
  }
`;

const Tabs = styled.div`
  display: flex;
  background-color: white;
  border-bottom: 1px solid ${theme.colors.divider};
  margin-bottom: ${theme.spacing.md};
`;

const Tab = styled.button`
  flex: 1;
  padding: ${theme.spacing.md};
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? theme.colors.primary : 'transparent'};
  color: ${props => props.active ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${props => props.active ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  
  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
    max-width: 1200px;
    margin: 0 auto;
  }
`;

const ItemCard = styled.div`
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  background-color: white;
  box-shadow: ${theme.shadows.small};
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.medium};
  }
`;

const ItemImage = styled.div`
  width: 100%;
  height: 150px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const ItemInfo = styled.div`
  padding: ${theme.spacing.sm};
`;

const ItemTitle = styled.div`
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.xs};
  font-size: ${theme.typography.fontSize.small};
`;

const ItemPrice = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.small};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.textSecondary};
`;

const AddPhotoButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${theme.colors.skyBlue};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: ${theme.shadows.small};
`;

const ProfileImageContainer = styled.div`
  position: relative;
`;

const EditProfileModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.md};
`;

const ModalContent = styled.div`
  background-color: white;
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.large};
  width: 100%;
  max-width: 500px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const ModalTitle = styled.h2`
  font-size: ${theme.typography.fontSize.large};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${theme.colors.textSecondary};
  
  &:hover {
    color: ${theme.colors.textPrimary};
  }
`;

const Form = styled.form``;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.xs};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid ${theme.colors.divider};
  font-size: ${theme.typography.fontSize.medium};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.skyBlue};
  }
`;

const SaveButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.skyBlue};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.medium};
  font-weight: ${theme.typography.fontWeight.bold};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #5c9ec5;
  }
`;

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { currentUser, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [items, setItems] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const fileInputRef = React.useRef(null);
  
  useEffect(() => {
    // Load user items from localStorage
    const loadItems = () => {
      try {
        const savedItems = localStorage.getItem('tedlistItems');
        
        if (savedItems) {
          const parsedItems = JSON.parse(savedItems);
          setItems(parsedItems);
        }
      } catch (error) {
        console.error('Error loading items:', error);
      }
    };
    
    if (currentUser) {
      setUsername(currentUser.username);
      setProfileImage(currentUser.profileImage);
      loadItems();
    }
  }, [currentUser]);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };
  
  const handleEditProfile = () => {
    setShowEditModal(true);
  };
  
  const handleCloseModal = () => {
    setShowEditModal(false);
  };
  
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        username,
        profileImage
      });
      
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  const handleItemClick = (itemId) => {
    navigate(`/items/${itemId}`);
  };
  
  // Filter items based on active tab
  const filteredItems = items.filter(item => {
    if (activeTab === 'listings') {
      return true; // Show all
    } else if (activeTab === 'trades') {
      return item.listingType === 'trade';
    } else if (activeTab === 'sold') {
      return item.sold;
    }
    return false;
  });
  
  return (
    <Container>
      <ProfileHeader>
        <ProfileImageContainer>
          <ProfileImage src={profileImage} />
          <AddPhotoButton onClick={handleImageClick}>
            <FaCamera size={16} />
          </AddPhotoButton>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleImageChange}
          />
        </ProfileImageContainer>
        <ProfileName>{username}</ProfileName>
        <ProfileInfo>Member since {new Date(currentUser?.createdAt || Date.now()).toLocaleDateString()}</ProfileInfo>
        
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt />
          Log Out
        </LogoutButton>
        
        <EditButton onClick={handleEditProfile}>
          <FaPen />
        </EditButton>
      </ProfileHeader>
      
      <Tabs>
        <Tab 
          active={activeTab === 'listings'} 
          onClick={() => setActiveTab('listings')}
        >
          My Listings
        </Tab>
        <Tab 
          active={activeTab === 'trades'} 
          onClick={() => setActiveTab('trades')}
        >
          Trades
        </Tab>
        <Tab 
          active={activeTab === 'sold'} 
          onClick={() => setActiveTab('sold')}
        >
          Sold
        </Tab>
      </Tabs>
      
      {filteredItems.length > 0 ? (
        <ItemsGrid>
          {filteredItems.map(item => (
            <ItemCard key={item.id} onClick={() => handleItemClick(item.id)}>
              <ItemImage src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300'} />
              <ItemInfo>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemPrice>{item.price}</ItemPrice>
              </ItemInfo>
            </ItemCard>
          ))}
        </ItemsGrid>
      ) : (
        <EmptyState>
          {activeTab === 'listings' ? 'You have no listings yet.' : 
           activeTab === 'trades' ? 'You have no trade items yet.' :
           'You have no sold items yet.'}
        </EmptyState>
      )}
      
      {showEditModal && (
        <EditProfileModal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Edit Profile</ModalTitle>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Username</Label>
                <Input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Profile Image</Label>
                <ProfileImageContainer style={{ width: '100px', margin: '0 auto 20px' }}>
                  <ProfileImage src={profileImage} />
                  <AddPhotoButton onClick={handleImageClick}>
                    <FaCamera size={16} />
                  </AddPhotoButton>
                </ProfileImageContainer>
              </FormGroup>
              <SaveButton type="submit">Save Changes</SaveButton>
            </Form>
          </ModalContent>
        </EditProfileModal>
      )}
    </Container>
  );
};

export default ProfileScreen;