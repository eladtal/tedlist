import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaUsers, FaArrowLeft, FaEdit, FaTrash, 
  FaUserPlus, FaSearch, FaUserShield, 
  FaUserCog, FaSave, FaTimes 
} from 'react-icons/fa';
import theme from '../../styles/theme';
import { useAdmin } from '../../contexts/AdminContext';
import { useAuth } from '../../contexts/AuthContext';

const Container = styled.div`
  padding-bottom: 80px;
  max-width: 1200px;
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

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.greyLight};
  margin-bottom: ${theme.spacing.md};
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;
  
  svg {
    position: absolute;
    left: ${theme.spacing.sm};
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.colors.textSecondary};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.sm} 36px;
  border: 1px solid ${theme.colors.divider};
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.medium};
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  font-weight: ${theme.typography.fontWeight.medium};
  
  svg {
    margin-right: ${theme.spacing.xs};
  }
  
  &:hover {
    background-color: ${theme.colors.primaryDark};
  }
`;

const UsersTable = styled.div`
  background-color: white;
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  margin: 0 ${theme.spacing.md};
  box-shadow: ${theme.shadows.small};
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 1fr 150px 130px;
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.primary};
  color: white;
  font-weight: ${theme.typography.fontWeight.bold};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 60px 1fr 120px;
  }
`;

const HeaderItem = styled.div`
  &:nth-child(4), &:nth-child(5) {
    @media (max-width: ${theme.breakpoints.md}) {
      display: none;
    }
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 1fr 150px 130px;
  padding: ${theme.spacing.md};
  align-items: center;
  border-bottom: 1px solid ${theme.colors.divider};
  
  &:hover {
    background-color: ${theme.colors.greyLight};
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 60px 1fr 120px;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-color: ${theme.colors.primary};
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserInfo = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: ${theme.breakpoints.md}) {
    &:nth-child(4), &:nth-child(5) {
      display: none;
    }
  }
`;

const UserName = styled.div`
  font-weight: ${theme.typography.fontWeight.bold};
`;

const UserEmail = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.small};
`;

const UserRole = styled.div`
  display: inline-block;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.fontSize.small};
  font-weight: ${theme.typography.fontWeight.medium};
  background-color: ${props => props.isAdmin ? 'rgba(106, 90, 205, 0.1)' : 'rgba(76, 175, 80, 0.1)'};
  color: ${props => props.isAdmin ? '#6A5ACD' : '#4CAF50'};
`;

const UserDate = styled.div`
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.textSecondary};
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: none;
  border: 1px solid ${theme.colors.divider};
  cursor: pointer;
  color: ${props => props.delete ? '#F44336' : props.admin ? '#6A5ACD' : theme.colors.textSecondary};
  
  &:hover {
    background-color: ${props => props.delete ? 'rgba(244, 67, 54, 0.1)' : props.admin ? 'rgba(106, 90, 205, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.textSecondary};
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  color: ${theme.colors.divider};
  margin-bottom: ${theme.spacing.md};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: ${theme.borderRadius.medium};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${theme.shadows.large};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.divider};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${theme.typography.fontSize.large};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: ${theme.colors.textSecondary};
`;

const ModalBody = styled.div`
  padding: ${theme.spacing.md};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: ${theme.spacing.xs};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const Input = styled.input`
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.divider};
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.medium};
`;

const RadioGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  input {
    margin-right: ${theme.spacing.xs};
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
`;

const Button = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  
  background-color: ${props => props.primary ? theme.colors.primary : 'white'};
  color: ${props => props.primary ? 'white' : theme.colors.textSecondary};
  border: ${props => props.primary ? 'none' : `1px solid ${theme.colors.divider}`};
  
  &:hover {
    background-color: ${props => props.primary ? theme.colors.primaryDark : theme.colors.greyLight};
  }
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const initialUserForm = {
  username: '',
  email: '',
  password: '',
  role: 'user',
  profileImage: ''
};

const AdminScreen = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    isAdmin, 
    getAllUsers, 
    addUser, 
    updateUser, 
    deleteUser, 
    setUserAsAdmin, 
    removeAdminRole 
  } = useAdmin();
  
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userForm, setUserForm] = useState(initialUserForm);
  const [editingUserId, setEditingUserId] = useState(null);
  
  // Check if current user is admin, if not redirect
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);
  
  // Load users from admin context
  useEffect(() => {
    setUsers(getAllUsers());
  }, [getAllUsers]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredUsers = users.filter(user => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(lowerSearchTerm) ||
      user.email?.toLowerCase().includes(lowerSearchTerm)
    );
  });
  
  const handleAddUser = () => {
    setUserForm(initialUserForm);
    setShowAddModal(true);
  };
  
  const handleEditUser = (user) => {
    setUserForm({
      username: user.username || '',
      email: user.email || '',
      password: '', // Don't show existing password
      role: user.role || 'user',
      profileImage: user.profileImage || ''
    });
    setEditingUserId(user.id);
    setShowEditModal(true);
  };
  
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = deleteUser(userId);
      
      if (result.success) {
        setUsers(getAllUsers());
      } else {
        alert(`Error deleting user: ${result.error}`);
      }
    }
  };
  
  const handleToggleAdminRole = (user) => {
    const isCurrentlyAdmin = user.role === 'admin';
    const result = isCurrentlyAdmin ? removeAdminRole(user.id) : setUserAsAdmin(user.id);
    
    if (result.success) {
      setUsers(getAllUsers());
    } else {
      alert(`Error updating user role: ${result.error}`);
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddFormSubmit = (e) => {
    e.preventDefault();
    
    const result = addUser({
      username: userForm.username,
      email: userForm.email,
      password: userForm.password, // In a real app, you'd hash this
      role: userForm.role,
      profileImage: userForm.profileImage || null
    });
    
    if (result.success) {
      setUsers(getAllUsers());
      setShowAddModal(false);
    } else {
      alert(`Error adding user: ${result.error}`);
    }
  };
  
  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    
    const updates = {
      username: userForm.username,
      email: userForm.email,
      role: userForm.role,
      profileImage: userForm.profileImage || null
    };
    
    // Only include password if it was changed
    if (userForm.password) {
      updates.password = userForm.password; // In a real app, you'd hash this
    }
    
    const result = updateUser(editingUserId, updates);
    
    if (result.success) {
      setUsers(getAllUsers());
      setShowEditModal(false);
    } else {
      alert(`Error updating user: ${result.error}`);
    }
  };
  
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>
          <FaArrowLeft />
        </BackButton>
        <PageTitle>
          <FaUsers /> User Management
        </PageTitle>
      </Header>
      
      <ActionBar>
        <SearchContainer>
          <FaSearch />
          <SearchInput 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchContainer>
        <AddButton onClick={handleAddUser}>
          <FaUserPlus /> Add User
        </AddButton>
      </ActionBar>
      
      <UsersTable>
        <TableHeader>
          <HeaderItem>Avatar</HeaderItem>
          <HeaderItem>User</HeaderItem>
          <HeaderItem>Role</HeaderItem>
          <HeaderItem>Joined</HeaderItem>
          <HeaderItem>Actions</HeaderItem>
        </TableHeader>
        
        {filteredUsers.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>
              <FaUsers />
            </EmptyStateIcon>
            <p>No users found</p>
          </EmptyState>
        ) : (
          filteredUsers.map(user => (
            <TableRow key={user.id}>
              <UserAvatar src={user.profileImage}>
                {!user.profileImage && getInitials(user.username)}
              </UserAvatar>
              <UserInfo>
                <UserName>{user.username}</UserName>
                <UserEmail>{user.email}</UserEmail>
              </UserInfo>
              <UserInfo>
                <UserRole isAdmin={user.role === 'admin'}>
                  {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                </UserRole>
              </UserInfo>
              <UserInfo>
                <UserDate>{formatDate(user.createdAt)}</UserDate>
              </UserInfo>
              <ActionsContainer>
                <ActionButton onClick={() => handleEditUser(user)}>
                  <FaEdit />
                </ActionButton>
                <ActionButton 
                  admin 
                  onClick={() => handleToggleAdminRole(user)}
                >
                  {user.role === 'admin' ? <FaUserCog /> : <FaUserShield />}
                </ActionButton>
                {currentUser.id !== user.id && (
                  <ActionButton 
                    delete 
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <FaTrash />
                  </ActionButton>
                )}
              </ActionsContainer>
            </TableRow>
          ))
        )}
      </UsersTable>
      
      {/* Add User Modal */}
      {showAddModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Add New User</ModalTitle>
              <CloseButton onClick={() => setShowAddModal(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={handleAddFormSubmit}>
                <FormGroup>
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username"
                    name="username"
                    value={userForm.username}
                    onChange={handleFormChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={userForm.email}
                    onChange={handleFormChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password"
                    name="password"
                    type="password"
                    value={userForm.password}
                    onChange={handleFormChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="profileImage">Profile Image URL (optional)</Label>
                  <Input 
                    id="profileImage"
                    name="profileImage"
                    value={userForm.profileImage}
                    onChange={handleFormChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Role</Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={userForm.role === 'user'}
                        onChange={handleFormChange}
                      />
                      Regular User
                    </RadioLabel>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={userForm.role === 'admin'}
                        onChange={handleFormChange}
                      />
                      Administrator
                    </RadioLabel>
                  </RadioGroup>
                </FormGroup>
                <FormActions>
                  <Button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" primary>
                    <FaUserPlus /> Add User
                  </Button>
                </FormActions>
              </Form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      
      {/* Edit User Modal */}
      {showEditModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Edit User</ModalTitle>
              <CloseButton onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={handleEditFormSubmit}>
                <FormGroup>
                  <Label htmlFor="edit-username">Username</Label>
                  <Input 
                    id="edit-username"
                    name="username"
                    value={userForm.username}
                    onChange={handleFormChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input 
                    id="edit-email"
                    name="email"
                    type="email"
                    value={userForm.email}
                    onChange={handleFormChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="edit-password">Password (leave empty to keep current)</Label>
                  <Input 
                    id="edit-password"
                    name="password"
                    type="password"
                    value={userForm.password}
                    onChange={handleFormChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="edit-profileImage">Profile Image URL</Label>
                  <Input 
                    id="edit-profileImage"
                    name="profileImage"
                    value={userForm.profileImage}
                    onChange={handleFormChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Role</Label>
                  <RadioGroup>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={userForm.role === 'user'}
                        onChange={handleFormChange}
                      />
                      Regular User
                    </RadioLabel>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={userForm.role === 'admin'}
                        onChange={handleFormChange}
                      />
                      Administrator
                    </RadioLabel>
                  </RadioGroup>
                </FormGroup>
                <FormActions>
                  <Button 
                    type="button" 
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" primary>
                    <FaSave /> Save Changes
                  </Button>
                </FormActions>
              </Form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default AdminScreen;
