import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaCamera, FaTimes, FaExclamationCircle, FaCheckCircle, FaArrowLeft, FaUpload, FaTag, FaHandshake } from 'react-icons/fa/index.js';
import theme from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding, ONBOARDING_STEPS } from '../../contexts/OnboardingContext';
import { ItemService } from '../../services';
import { compressImage, fileToBase64 } from '../../utils/image-utils';

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

const UploadScreen = () => {
  const { currentUser } = useAuth();
  const { completeStep } = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSubmission, setSuccessSubmission] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    condition: 'Used - Good',
    listingType: 'sale', // default to sale, can be 'sale', 'free', 'trade'
    tags: ''
  });

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
    const { id, value } = e.target;
    
    setFormState(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [id]: true
    }));
  };
  
  const handleListingTypeChange = (type) => {
    setFormState(prev => ({
      ...prev,
      listingType: type
    }));
    
    // Clear price if switching to free or trade
    if (type === 'free' || type === 'trade') {
      setFormState(prev => ({
        ...prev,
        price: ''
      }));
    }
    
    // Reset errors for price field when changing type
    setErrors(prev => ({
      ...prev,
      price: undefined
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Title is required and must be between 3 and 100 characters
    if (!formState.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formState.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formState.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    // Description is required and must be at least 10 characters
    if (!formState.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formState.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    // Price is required only for sale items
    if (formState.listingType === 'sale') {
      if (!formState.price) {
        newErrors.price = 'Price is required for sale items';
      } else if (isNaN(formState.price) || parseFloat(formState.price) <= 0) {
        newErrors.price = 'Price must be a positive number';
      }
    }
    
    // Category is required
    if (!formState.category) {
      newErrors.category = 'Category is required';
    }
    
    // Location is required
    if (!formState.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    // At least one photo is required
    if (photos.length === 0) {
      newErrors.photos = 'At least one photo is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleBlur = (e) => {
    const { id } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [id]: true
    }));
    
    // Validate on blur
    validateForm();
  };
  
  const handleChoosePhoto = () => {
    // Trigger hidden file input
    fileInputRef.current.click();
  };
  
  const handleFileChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setUploadingPhoto(true);
      setErrors(prev => ({ ...prev, photos: undefined }));
      
      const file = e.target.files[0];
      
      // Limit to 5 photos
      if (photos.length >= 5) {
        setErrors(prev => ({ ...prev, photos: 'Maximum 5 photos allowed' }));
        return;
      }
      
      // Process image 
      const compressedImage = await compressImage(file, 800, 0.8);
      const base64Image = await fileToBase64(compressedImage);
      
      setPhotos(prev => [...prev, base64Image]);
    } catch (error) {
      console.error('Error processing photo:', error);
      setErrors(prev => ({ ...prev, photos: 'Error processing photo' }));
    } finally {
      setUploadingPhoto(false);
      // Clear file input
      e.target.value = '';
    }
  };
  
  const handleRemovePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };
  
  const scrollToFirstError = () => {
    // Get all error elements
    const errorElements = document.querySelectorAll('.input-error');
    if (errorElements.length > 0) {
      // Scroll to the first error
      errorElements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Full validation on submit
    const isValid = validateForm();
    
    if (!isValid) {
      // Mark all fields as touched to show all errors
      const allTouched = Object.keys(formState).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      
      setTouched(allTouched);
      
      // Scroll to first error
      setTimeout(scrollToFirstError, 100);
      
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Process photos for API submission
      let processedPhotosResult;
      
      try {
        console.log('Processing photos for upload');
        processedPhotosResult = await ItemService.processPhotos(photos);
        
        if (!processedPhotosResult.success) {
          throw new Error(processedPhotosResult.error || 'Failed to process photos');
        }
        
        console.log(`Successfully processed ${processedPhotosResult.data.length} photos`);
      } catch (error) {
        console.error('Error processing photos:', error);
        // Continue with unprocessed photos as fallback
        processedPhotosResult = { success: true, data: photos };
      }
      
      // Format price based on listing type
      const priceDisplay = formState.listingType === 'free' 
        ? 'Free' 
        : formState.listingType === 'trade' 
          ? 'For Trade' 
          : `₪ ${formState.price}`;
      
      // Create item data object
      const itemData = {
        title: formState.title,
        description: formState.description,
        category: formState.category,
        location: formState.location,
        listingType: formState.listingType,
        price: formState.listingType === 'sale' ? parseFloat(formState.price) : undefined,
        condition: formState.condition,
        images: processedPhotosResult.data,
        tags: formState.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        userId: currentUser?.id || currentUser?._id // Ensure we're using the correct user ID field
      };
      
      console.log('Submitting item data:', itemData);
      
      // Try to create item through the API first
      let result = null;
      try {
        result = await ItemService.createItem(itemData);
        console.log('Item successfully created in database:', result);
        
        // Complete the upload item onboarding step if applicable
        if (completeStep) {
          completeStep(ONBOARDING_STEPS.UPLOAD_ITEM);
        }
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
          userId: currentUser?.id || currentUser?._id,
          condition: formState.condition,
          tags: formState.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        
        // Get existing items or initialize empty array
        const existingItemsJson = localStorage.getItem('tedlistUserItems');
        const existingItems = existingItemsJson ? JSON.parse(existingItemsJson) : [];
        
        // Add new item
        existingItems.unshift(newItem);
        
        // Save back to localStorage
        localStorage.setItem('tedlistUserItems', JSON.stringify(existingItems));
        
        // Complete the upload item onboarding step if applicable
        if (completeStep) {
          completeStep(ONBOARDING_STEPS.UPLOAD_ITEM);
        }
        
        // Update result reference for consistent handling below
        result = { success: true, data: newItem };
      }
      
      // Show success message
      setSuccessSubmission(true);
      
      // Redirect after delay
      setTimeout(() => {
        // Navigate to profile page to show the listing
        navigate('/profile', { 
          state: { 
            tab: 'listings',
            newItem: result?.data || result 
          } 
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: error.message || 'Failed to create listing. Please try again.' 
      }));
      
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
                <DeletePhotoButton onClick={() => handleRemovePhoto(index)}>
                  <FaTimes />
                </DeletePhotoButton>
              </PhotoPreview>
            ))}
            {photos.length < 5 && (
              <PhotoUploadBox onClick={handleChoosePhoto} error={errors.photos}>
                <FaCamera size={24} />
              </PhotoUploadBox>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              multiple 
              onChange={handleFileChange} 
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
        
        <FormGroup>
          <Label htmlFor="condition">Condition</Label>
          <Input 
            type="text" 
            id="condition" 
            name="condition" 
            value={formState.condition} 
            onChange={handleInputChange} 
            placeholder="What is the condition of your item?"
            error={errors.condition}
          />
          {errors.condition && <ErrorText>{errors.condition}</ErrorText>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="tags">Tags</Label>
          <Input 
            type="text" 
            id="tags" 
            name="tags" 
            value={formState.tags} 
            onChange={handleInputChange} 
            placeholder="Enter tags separated by commas"
            error={errors.tags}
          />
          {errors.tags && <ErrorText>{errors.tags}</ErrorText>}
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
          disabled={isSubmitting || !currentUser}
          listingType={formState.listingType}
        >
          {isSubmitting ? 
            `Uploading... ${uploadingPhoto ? 'Processing photos...' : 'Submitting...'}` : 
            formState.listingType === 'trade' ? 'Post for Trading' : 'List for Sale'}
        </SubmitButton>
        
        {!currentUser && (
          <ErrorText style={{ textAlign: 'center', marginTop: '8px' }}>
            You must be logged in to post an item. Please log in or sign up.
          </ErrorText>
        )}
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