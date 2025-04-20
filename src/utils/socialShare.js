/**
 * Social sharing utilities for Tedlist app
 */

/**
 * Generate a shareable image for Instagram stories
 * @param {Object} tradeInfo - Trade information object
 * @param {Object} tradeInfo.userItem - The user's item being traded
 * @param {Object} tradeInfo.theirItem - The other party's item being traded
 * @param {string} tradeInfo.matchDate - When the trade match occurred
 * @returns {Promise<string>} - Data URL of the generated image
 */
export const generateTradeShareImage = async (tradeInfo) => {
  return new Promise((resolve) => {
    // Create a canvas for the share image (Instagram story size: 1080x1920)
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#6A5ACD');  // Purple shade
    gradient.addColorStop(1, '#87CEEB');  // Sky blue shade
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add Tedlist logo/branding
    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Tedlist', canvas.width / 2, 200);
    
    ctx.font = '50px Arial';
    ctx.fillText('Just made an amazing trade! 🎉', canvas.width / 2, 300);
    
    // Load user's item image
    const userItemImg = new Image();
    userItemImg.crossOrigin = 'Anonymous';
    userItemImg.src = tradeInfo.userItem.image;
    
    userItemImg.onload = () => {
      // Draw user's item
      const itemWidth = 400;
      const itemHeight = 400;
      
      // First item on left side
      ctx.save();
      // Create circular mask for left image
      ctx.beginPath();
      ctx.arc(canvas.width / 2 - 250, 600, itemWidth / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      
      // Draw the image inside the circular mask
      ctx.drawImage(userItemImg, 
        canvas.width / 2 - 250 - itemWidth / 2, 
        600 - itemHeight / 2, 
        itemWidth, 
        itemHeight);
      ctx.restore();
      
      // Add label for user's item
      ctx.fillStyle = 'white';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('I traded my', canvas.width / 2 - 250, 850);
      ctx.fillText(tradeInfo.userItem.title, canvas.width / 2 - 250, 900);
      
      if (tradeInfo.theirItem) {
        // Load partner's item image
        const theirItemImg = new Image();
        theirItemImg.crossOrigin = 'Anonymous';
        theirItemImg.src = tradeInfo.theirItem.image;
        
        theirItemImg.onload = () => {
          // Draw arrow in the middle
          ctx.fillStyle = 'white';
          ctx.font = 'bold 80px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('↔️', canvas.width / 2, 600);
          
          // Draw their item on the right
          ctx.save();
          // Create circular mask for right image
          ctx.beginPath();
          ctx.arc(canvas.width / 2 + 250, 600, itemWidth / 2, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          
          // Draw the image inside the circular mask
          ctx.drawImage(theirItemImg, 
            canvas.width / 2 + 250 - itemWidth / 2, 
            600 - itemHeight / 2, 
            itemWidth, 
            itemHeight);
          ctx.restore();
          
          // Add label for their item
          ctx.fillStyle = 'white';
          ctx.font = 'bold 40px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('For their', canvas.width / 2 + 250, 850);
          ctx.fillText(tradeInfo.theirItem.title, canvas.width / 2 + 250, 900);
          
          // Add date and call to action
          ctx.fillStyle = 'white';
          ctx.font = '40px Arial';
          ctx.fillText(`Trade made on ${tradeInfo.matchDate}`, canvas.width / 2, 1050);
          
          ctx.font = 'bold 50px Arial';
          ctx.fillText('Join Tedlist to trade your items!', canvas.width / 2, 1600);
          
          // Convert canvas to data URL and resolve promise
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        
        // Handle error loading their item image
        theirItemImg.onerror = () => {
          // Fallback: just show user's item
          // Add date and call to action
          ctx.fillStyle = 'white';
          ctx.font = '40px Arial';
          ctx.fillText(`Trade made on ${tradeInfo.matchDate}`, canvas.width / 2, 1050);
          
          ctx.font = 'bold 50px Arial';
          ctx.fillText('Join Tedlist to trade your items!', canvas.width / 2, 1600);
          
          // Convert canvas to data URL and resolve promise
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
      } else {
        // No trade partner item (maybe it's a sale)
        ctx.fillStyle = 'white';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Check out my item on Tedlist!', canvas.width / 2, 1050);
        
        ctx.font = 'bold 50px Arial';
        ctx.fillText('Download the app to see more!', canvas.width / 2, 1600);
        
        // Convert canvas to data URL and resolve promise
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      }
    };
    
    // Handle error loading user's item image
    userItemImg.onerror = () => {
      // Draw fallback content
      ctx.fillStyle = 'white';
      ctx.font = 'bold 60px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('I made an amazing trade on Tedlist!', canvas.width / 2, 600);
      
      ctx.font = 'bold 50px Arial';
      ctx.fillText('Join Tedlist to trade your items!', canvas.width / 2, 1600);
      
      // Convert canvas to data URL and resolve promise
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
  });
};

/**
 * Share to Instagram Stories
 * This uses the Web Share API where supported, and falls back to window.open with Instagram URL scheme
 * @param {Object} tradeInfo - Trade information object
 */
export const shareToInstagramStory = async (tradeInfo) => {
  try {
    // Generate shareable image
    const imageUrl = await generateTradeShareImage(tradeInfo);
    
    // First try the Web Share API (more modern, better UX)
    if (navigator.share) {
      // Convert data URL to Blob
      const imageBlob = await (await fetch(imageUrl)).blob();
      
      // Create file object from blob
      const imageFile = new File([imageBlob], 'tedlist-trade.jpg', { type: 'image/jpeg' });
      
      // Web Share API with file
      await navigator.share({
        title: 'Check out my Tedlist trade!',
        text: `I traded my ${tradeInfo.userItem.title} for a ${tradeInfo.theirItem?.title || 'great deal'} on Tedlist!`,
        files: [imageFile]
      });
      
      return { success: true, method: 'webshare' };
    } 
    // Try direct Instagram URL scheme for Stories
    else {
      // Save image to local storage to access it in the ShareScreen component
      localStorage.setItem('tedlistShareImage', imageUrl);
      
      // For Instagram Stories URL scheme
      const instagramURL = `instagram://story?media=${encodeURIComponent(imageUrl)}`;
      
      // Open Instagram (will work on mobile devices with Instagram app installed)
      window.open(instagramURL);
      
      return { success: true, method: 'urlscheme' };
    }
  } catch (error) {
    console.error('Error sharing to Instagram:', error);
    
    // Save image to local storage as fallback
    if (error.name !== 'AbortError') { // Only save if user didn't cancel
      const imageUrl = await generateTradeShareImage(tradeInfo);
      localStorage.setItem('tedlistShareImage', imageUrl);
      
      // Show the ShareScreen component
      return { 
        success: false, 
        error: error.message,
        fallback: true
      };
    }
    
    return { success: false, error: error.message };
  }
};

/**
 * Format date for sharing
 * @param {Date|number} date - Date object or timestamp
 * @returns {string} - Formatted date string
 */
export const formatDateForSharing = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};
