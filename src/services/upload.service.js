import api from './api';

/**
 * Upload images to the server
 * @param {Array} imageFiles - Array of image files to upload
 * @returns {Promise} - API response with uploaded image URLs
 */
export const uploadImages = async (imageDataUrls) => {
  try {
    const response = await api.post('/upload/images', { images: imageDataUrls });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Helper function to convert Data URLs to File objects
 * This can be used if the backend requires multipart/form-data uploads
 * @param {String} dataUrl - Data URL of the image
 * @param {String} filename - Filename to use
 * @returns {File} - File object created from the data URL
 */
export const dataURLtoFile = (dataUrl, filename) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};

/**
 * Format item data for API submission
 * @param {Object} formData - Form data from UploadScreen
 * @param {Array} imageUrls - Image URLs from uploadImages or dataURLs
 * @returns {Object} - Formatted item data for API
 */
export const formatItemForApi = (formData, imageUrls, currentUser) => {
  return {
    title: formData.title,
    description: formData.description,
    price: formData.listingType === 'sale' ? Number(formData.price) : 0,
    listingType: formData.listingType,
    location: formData.location,
    category: formData.category,
    images: imageUrls,
    userId: currentUser?.id,
    status: 'active'
  };
};
