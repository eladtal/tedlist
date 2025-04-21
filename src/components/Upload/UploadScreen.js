import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaCamera, FaTimes, FaArrowLeft, FaCheckCircle, FaUpload, FaTag, FaHandshake } from 'react-icons/fa';
import theme from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding, ONBOARDING_STEPS } from '../../contexts/OnboardingContext';
import { createItem } from '../../services/item.service';
import { uploadImages, formatItemForApi } from '../../services/upload.service';

const Container = styled.div`
  padding: ${theme.spacing.md};
  padding-bottom: 80px; /* Space for navbar */
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.lg} ${theme.spacing.xxl};
    padding-top: 80px;
    padding-bottom: ${theme.spacing.lg};
    max-width: 800px;
    margin: 0 auto;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing.md};
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${theme.colors.skyBlue};
  }
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize.xlarge};
  background: ${props => props.listingType === 'trade' 
    ? 'linear-gradient(135deg, #6A5ACD, #8A2BE2)' 
    : 'linear-gradient(135deg, #FF6347, #FF8C00)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  
  @media (min-width: ${theme.breakpoints.md}) {
    background-color: white;
    padding: ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.large};
    box-shadow: ${theme.shadows.medium};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textPrimary};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid ${props => props.error ? theme.colors.error : theme.colors.divider};
  font-size: ${theme.typography.fontSize.medium};
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? theme.colors.error : theme.colors.skyBlue};
    box-shadow: ${props => props.error ? `0 0 0 1px ${theme.colors.error}` : theme.shadows.small};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid ${props => props.error ? theme.colors.error : theme.colors.divider};
  font-size: ${theme.typography.fontSize.medium};
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? theme.colors.error : theme.colors.skyBlue};
    box-shadow: ${props => props.error ? `0 0 0 1px ${theme.colors.error}` : theme.shadows.small};
  }
`;

const ListingTypeContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

const ListingTypeButton = styled.button`
  flex: 1;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  border: ${props => props.active 
    ? 'none' 
    : `1px solid ${theme.colors.divider}`};
  background: ${props => props.active 
    ? props.listingType === 'trade' 
      ? 'linear-gradient(135deg, #6A5ACD, #8A2BE2)' 
      : 'linear-gradient(135deg, #FF6347, #FF8C00)'
    : 'white'};
  color: ${props => props.active ? 'white' : theme.colors.textPrimary};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.active ? theme.shadows.medium : 'none'};
  
  &:hover {
    transform: ${props => props.active ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.active ? theme.shadows.medium : theme.shadows.small};
  }
  
  svg {
    font-size: 1.5rem;
    margin-bottom: ${theme.spacing.xs};
  }
`;

const ErrorText = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.typography.fontSize.small};
  margin-top: ${theme.spacing.xs};
`;

const PhotosContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
`;

const PhotoUploadBox = styled.div`
  width: 100px;
  height: 100px;
  border-radius: ${theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px dashed ${props => props.error ? theme.colors.error : theme.colors.skyBlue};
  background-color: ${theme.colors.background};
  color: ${theme.colors.skyBlue};
  
  &:hover {
    background-color: ${theme.colors.backgroundHover};
  }
  
  @media (min-width: ${theme.breakpoints.md}) {
    width: 120px;
    height: 120px;
  }
`;

const PhotoPreview = styled.div`
  width: 100px;
  height: 100px;
  border-radius: ${theme.borderRadius.medium};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  position: relative;
  
  @media (min-width: ${theme.breakpoints.md}) {
    width: 120px;
    height: 120px;
  }
`;

const DeletePhotoButton = styled.button`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${theme.colors.error};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  border: none;
  cursor: pointer;
`;

const PhotoInfo = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.small};
  margin-bottom: ${theme.spacing.md};
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.md};
  background: ${props => props.listingType === 'trade' 
    ? 'linear-gradient(135deg, #6A5ACD, #8A2BE2)' 
    : 'linear-gradient(135deg, #FF6347, #FF8C00)'};
  color: white;
  border-radius: ${theme.borderRadius.medium};
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.medium};
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.7 : 1};
  transition: all 0.2s;
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : theme.shadows.medium};
  }
  
  &:disabled {
    background: ${theme.colors.divider};
  }
`;

const SuccessOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: ${theme.spacing.lg};
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 5rem;
  color: ${theme.colors.success};
  margin-bottom: ${theme.spacing.lg};
`;

const SuccessTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: ${theme.spacing.md};
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const SuccessMessage = styled.p`
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xl};
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 1.1rem;
  }
`;

// Initial form state
const initialFormState = {
  title: '',
  description: '',
  price: '',
  location: '',
  category: '',
  listingType: 'sale' // Default to sale
};

// Initial errors state
const initialErrors = {
  title: '',
  description: '',
  price: '',
  location: '',
  category: '',
  photos: ''
};

const UploadScreen = () => {
  const { currentUser } = useAuth();
  const { completeStep } = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();
  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrors);
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSubmission, setSuccessSubmission] = useState(false);
  const fileInputRef = useRef(null);
  
  // Set initial listing type based on navigation state if present
  useEffect(() => {
    if (location.state?.listingType) {
      setFormState(prev => ({ 
        ...prev, 
        listingType: location.state.listingType 
      }));
    }
  }, [location.state]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
    
    // Clear error if field has a value
    if (value.trim() !== '') {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleListingTypeChange = (type) => {
    setFormState({
      ...formState,
      listingType: type,
      // Reset price if switching to trade
      price: type === 'trade' ? '' : formState.price
    });
  };
  
  const handlePhotoClick = () => {
    if (photos.length < 5) {
      fileInputRef.current.click();
    }
  };
  
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = [...photos];
      
      for (let i = 0; i < e.target.files.length; i++) {
        if (newPhotos.length < 5) {
          const file = e.target.files[i];
          const reader = new FileReader();
          
          reader.onload = (event) => {
            newPhotos.push(event.target.result);
            setPhotos([...newPhotos]);
            
            // Clear photo error if we have at least one photo
            if (newPhotos.length > 0) {
              setErrors({
                ...errors,
                photos: ''
              });
            }
          };
          
          reader.readAsDataURL(file);
        }
      }
    }
    
    // Reset file input
    e.target.value = null;
  };
  
  const handleDeletePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };
  
  const validateForm = () => {
    const newErrors = { ...initialErrors };
    let isValid = true;
    
    // Title validation
    if (!formState.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    
    // Description validation
    if (!formState.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    } else if (formState.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
      isValid = false;
    }
    
    // Price validation (only for sale listings)
    if (formState.listingType === 'sale') {
      if (!formState.price.trim()) {
        newErrors.price = 'Price is required';
        isValid = false;
      } else if (isNaN(formState.price) || parseInt(formState.price) <= 0) {
        newErrors.price = 'Please enter a valid price';
        isValid = false;
      }
    }
    
    // Location validation
    if (!formState.location.trim()) {
      newErrors.location = 'Location is required';
      isValid = false;
    }
    
    // Category validation
    if (!formState.category.trim()) {
      newErrors.category = 'Category is required';
      isValid = false;
    }
    
    // Photo validation
    if (photos.length === 0) {
      newErrors.photos = 'At least one photo is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    
    // Scroll to first error if form is not valid
    if (!isValid) {
      const firstError = Object.keys(newErrors).find(key => newErrors[key] !== '');
      const errorElement = document.querySelector(`[name="${firstError}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format price based on listing type
      const priceDisplay = formState.listingType === 'free' 
        ? 'Free' 
        : formState.listingType === 'trade' 
          ? 'For Trade' 
          : `₪ ${formState.price}`;
      
      // Try to upload through the API first
      let result = null;
      try {
        // Construct the item data for API submission
        const itemData = formatItemForApi(
          formState, 
          photos, // Will be processed by the API
          currentUser
        );
        
        // Create item in the database
        result = await createItem(itemData);
        
        // Complete the upload item onboarding step
        completeStep(ONBOARDING_STEPS.UPLOAD_ITEM);
        
        console.log('Item successfully created in database:', result);
      } catch (apiError) {
        console.error('API upload failed, falling back to localStorage:', apiError);
        
        // Fallback to localStorage if API fails
        // Construct the new item object for localStorage
        const newItem = {
          id: Date.now().toString(),
          title: formState.title,
          price: priceDisplay,
          description: formState.description,
          location: formState.location,
          category: formState.category,
          listingType: formState.listingType,
          images: photos,
          datePosted: new Date().toISOString(),
          imageUrl: photos[0], // First photo as main image
          userId: currentUser?.id
        };
        
        // Get existing items or initialize empty array
        const existingItemsJson = localStorage.getItem('tedlistUserItems');
        const existingItems = existingItemsJson ? JSON.parse(existingItemsJson) : [];
        
        // Add new item
        existingItems.unshift(newItem);
        
        // Save back to localStorage
        localStorage.setItem('tedlistUserItems', JSON.stringify(existingItems));
        
        // Complete the upload item onboarding step
        completeStep(ONBOARDING_STEPS.UPLOAD_ITEM);
      }
      
      // Show success message
      setSuccessSubmission(true);
      
      // Reset form after 2 seconds, then redirect to profile
      setTimeout(() => {
        navigate('/profile', { state: { newItemAdded: true } });
      }, 2000);
    } catch (error) {
      console.error('Error uploading item:', error);
      alert('Failed to upload item. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </BackButton>
        <Title listingType={formState.listingType}>
          {formState.listingType === 'trade' ? 'Post Item for Trading' : 'Sell Your Item'}
        </Title>
      </Header>
      
      <Form onSubmit={handleSubmit}>
        <ListingTypeContainer>
          <ListingTypeButton 
            type="button"
            listingType="sale"
            active={formState.listingType === 'sale'}
            onClick={() => handleListingTypeChange('sale')}
          >
            <FaTag />
            Sell
          </ListingTypeButton>
          <ListingTypeButton 
            type="button"
            listingType="trade"
            active={formState.listingType === 'trade'}
            onClick={() => handleListingTypeChange('trade')}
          >
            <FaHandshake />
            Trade
          </ListingTypeButton>
        </ListingTypeContainer>
        
        <FormGroup>
          <Label htmlFor="photos">Photos</Label>
          <PhotosContainer>
            {photos.map((photo, index) => (
              <PhotoPreview key={index} src={photo}>
                <DeletePhotoButton onClick={() => handleDeletePhoto(index)}>
                  <FaTimes />
                </DeletePhotoButton>
              </PhotoPreview>
            ))}
            {photos.length < 5 && (
              <PhotoUploadBox onClick={handlePhotoClick} error={errors.photos}>
                <FaCamera size={24} />
              </PhotoUploadBox>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              multiple 
              onChange={handlePhotoChange} 
            />
          </PhotosContainer>
          <PhotoInfo>
            {photos.length} of 5 photos added {photos.length === 0 && '(required)'}
          </PhotoInfo>
          {errors.photos && <ErrorText>{errors.photos}</ErrorText>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="title">Title</Label>
          <Input 
            type="text" 
            id="title" 
            name="title" 
            value={formState.title} 
            onChange={handleInputChange} 
            placeholder="What are you selling?"
            error={errors.title}
          />
          {errors.title && <ErrorText>{errors.title}</ErrorText>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea 
            id="description" 
            name="description" 
            value={formState.description} 
            onChange={handleInputChange} 
            placeholder="Tell us about your item. Condition, brand, size, etc."
            error={errors.description}
          />
          {errors.description && <ErrorText>{errors.description}</ErrorText>}
        </FormGroup>
        
        {formState.listingType === 'sale' && (
          <FormGroup>
            <Label htmlFor="price">Price (₪)</Label>
            <Input 
              type="number" 
              id="price" 
              name="price" 
              value={formState.price} 
              onChange={handleInputChange} 
              placeholder="How much are you selling it for?"
              error={errors.price}
            />
            {errors.price && <ErrorText>{errors.price}</ErrorText>}
          </FormGroup>
        )}
        
        <FormGroup>
          <Label htmlFor="category">Category</Label>
          <Input 
            as="select" 
            id="category" 
            name="category" 
            value={formState.category} 
            onChange={handleInputChange}
            error={errors.category}
          >
            <option value="">Select a category</option>
            <option value="furniture">Furniture</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="sports">Sports</option>
            <option value="home">Home & Garden</option>
            <option value="toys">Toys & Games</option>
            <option value="other">Other</option>
          </Input>
          {errors.category && <ErrorText>{errors.category}</ErrorText>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="location">Location</Label>
          <Input 
            type="text" 
            id="location" 
            name="location" 
            value={formState.location} 
            onChange={handleInputChange} 
            placeholder="Where is the item located?"
            error={errors.location}
          />
          {errors.location && <ErrorText>{errors.location}</ErrorText>}
        </FormGroup>
        
        <SubmitButton 
          type="submit" 
          disabled={isSubmitting}
          listingType={formState.listingType}
        >
          {isSubmitting ? 'Posting...' : formState.listingType === 'trade' ? 'Post for Trading' : 'List for Sale'}
        </SubmitButton>
      </Form>
      
      {successSubmission && (
        <SuccessOverlay>
          <SuccessIcon>
            <FaCheckCircle />
          </SuccessIcon>
          <SuccessTitle>Item Posted Successfully!</SuccessTitle>
          <SuccessMessage>
            Your item has been posted and is now visible to potential 
            {formState.listingType === 'trade' ? ' traders' : ' buyers'}.
          </SuccessMessage>
        </SuccessOverlay>
      )}
    </Container>
  );
};

export default UploadScreen;