import { API_BASE_URL } from '../config';

export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a relative path starting with /uploads, append to API base URL
  if (imagePath.startsWith('/uploads/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // For any other case, assume it's a relative path and append to API base URL
  return `${API_BASE_URL}/${imagePath}`;
}; 