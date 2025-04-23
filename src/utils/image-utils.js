/**
 * Utility functions for image handling
 */

/**
 * Compress an image file to reduce size
 * @param {File} file - The image file to compress
 * @param {number} quality - Quality level (0 to 1)
 * @returns {Promise<Blob>} - Compressed image as a Blob
 */
export const compressImage = (file, quality = 0.5) => {
  return new Promise((resolve, reject) => {
    // Create image object
    const img = new Image();
    
    // Set up image load handler
    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set dimensions (max 800px while preserving aspect ratio)
      let width = img.width;
      let height = img.height;
      
      if (width > 800) {
        height = Math.round(height * 800 / width);
        width = 800;
      }
      
      if (height > 800) {
        width = Math.round(width * 800 / height);
        height = 800;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      try {
        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              // Fallback if toBlob isn't supported or fails
              resolve(file);
            }
          },
          'image/jpeg', // Always convert to JPEG for better compression
          quality
        );
      } catch (err) {
        console.error('Canvas toBlob error:', err);
        // Return original file as fallback
        resolve(file);
      }
    };
    
    // Handle image load errors
    img.onerror = (err) => {
      console.error('Image load error:', err);
      // Return original file as fallback
      resolve(file);
    };
    
    // Load image from file
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.onerror = (err) => {
      console.error('FileReader error:', err);
      // Return original file as fallback
      resolve(file);
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Get image dimensions from a file
 * @param {File} file - The image file
 * @returns {Promise<{width: number, height: number}>} - Image dimensions
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = (err) => {
      reject(err);
    };
    
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Convert a file to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 data URL
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
};
