import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaInstagram, FaDownload, FaShareSquare, FaCheckCircle } from 'react-icons/fa';
import theme from '../../styles/theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${theme.colors.background};
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 80px;
    max-width: 800px;
    margin: 0 auto;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.divider};
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: ${theme.colors.textPrimary};
  margin-right: ${theme.spacing.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.fontSize.large};
  margin: 0;
`;

const Content = styled.div`
  flex: 1;
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ShareImageContainer = styled.div`
  width: 100%;
  max-width: 320px;
  margin: ${theme.spacing.lg} auto;
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  position: relative;
  aspect-ratio: 9 / 16;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
`;

const ShareImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ShareTitle = styled.h2`
  font-size: ${theme.typography.fontSize.xlarge};
  text-align: center;
  margin-bottom: ${theme.spacing.md};
`;

const ShareDescription = styled.p`
  text-align: center;
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.5;
  max-width: 500px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.medium};
  font-weight: ${theme.typography.fontWeight.bold};
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  
  background-color: ${props => props.primary ? '#833AB4' : '#fff'};
  color: ${props => props.primary ? '#fff' : theme.colors.textPrimary};
  border: ${props => props.primary ? 'none' : `1px solid ${theme.colors.divider}`};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  background-color: rgba(76, 175, 80, 0.1);
`;

const SuccessIcon = styled(FaCheckCircle)`
  font-size: 3rem;
  color: #4CAF50;
`;

const SuccessText = styled.p`
  text-align: center;
  font-weight: ${theme.typography.fontWeight.medium};
`;

const ShareScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tradeInfo, setTradeInfo] = useState(null);
  const imageRef = useRef(null);
  
  useEffect(() => {
    // Get the trade details from localStorage
    const loadTradeDetails = () => {
      try {
        setLoading(true);
        
        // First check if we have a direct share image
        const shareImage = localStorage.getItem('tedlistShareImage');
        
        if (shareImage) {
          setImageUrl(shareImage);
          localStorage.removeItem('tedlistShareImage'); // Clear after use
          setLoading(false);
          return;
        }
        
        // Otherwise try to get trade info
        if (id) {
          const conversationString = localStorage.getItem('tedlistConversations');
          if (conversationString) {
            const conversations = JSON.parse(conversationString);
            const conversation = conversations.find(c => c.id === id);
            
            if (conversation && conversation.trade) {
              setTradeInfo({
                userItem: conversation.trade.userItem,
                theirItem: conversation.trade.theirItem,
                matchDate: new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })
              });
            }
          }
        }
      } catch (error) {
        console.error('Error loading trade details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTradeDetails();
  }, [id]);
  
  useEffect(() => {
    // Generate share image when tradeInfo is available
    const generateImage = async () => {
      if (tradeInfo) {
        try {
          // Import dynamically to prevent SSR issues
          const { generateTradeShareImage } = await import('../../utils/socialShare');
          const generatedImageUrl = await generateTradeShareImage(tradeInfo);
          setImageUrl(generatedImageUrl);
        } catch (error) {
          console.error('Error generating share image:', error);
        }
      }
    };
    
    generateImage();
  }, [tradeInfo]);
  
  const handleInstagramShare = async () => {
    try {
      // On mobile devices, this should open Instagram with the story sharing feature
      const instagramURL = `instagram://story?media=${encodeURIComponent(imageUrl)}`;
      window.open(instagramURL);
      
      // Show success message
      setShowSuccess(true);
      
      // After a delay, navigate back
      setTimeout(() => {
        navigate('/messages');
      }, 3000);
    } catch (error) {
      console.error('Error sharing to Instagram:', error);
      alert('Could not open Instagram. Try downloading the image and sharing manually.');
    }
  };
  
  const handleDownloadImage = () => {
    if (!imageUrl) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'tedlist-trade.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    setShowSuccess(true);
  };
  
  const handleShareOther = async () => {
    try {
      if (navigator.share) {
        // Use Web Share API if available
        const blob = await fetch(imageUrl).then(r => r.blob());
        const file = new File([blob], 'tedlist-trade.jpg', { type: 'image/jpeg' });
        
        await navigator.share({
          title: 'My Tedlist Trade',
          text: 'Check out this awesome trade I made on Tedlist!',
          files: [file]
        });
        
        // Show success message
        setShowSuccess(true);
      } else {
        // Fallback to download if Web Share API is not available
        handleDownloadImage();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // If user cancels, don't show error
      if (error.name !== 'AbortError') {
        alert('Could not share. Try downloading the image and sharing manually.');
      }
    }
  };
  
  if (loading) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </BackButton>
          <PageTitle>Share Your Trade</PageTitle>
        </Header>
        <Content>
          <p>Loading your trade image...</p>
        </Content>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </BackButton>
        <PageTitle>Share Your Trade</PageTitle>
      </Header>
      <Content>
        <ShareTitle>Show off your trade!</ShareTitle>
        <ShareDescription>
          Share your successful trade with friends on Instagram or save the image to share later.
        </ShareDescription>
        
        <ShareImageContainer>
          {imageUrl ? (
            <ShareImage ref={imageRef} src={imageUrl} alt="Trade share preview" />
          ) : (
            <p>Error loading preview image</p>
          )}
        </ShareImageContainer>
        
        {!showSuccess ? (
          <ButtonsContainer>
            <ShareButton primary onClick={handleInstagramShare}>
              <FaInstagram size={20} />
              Share to Instagram Story
            </ShareButton>
            <ShareButton onClick={handleDownloadImage}>
              <FaDownload size={20} />
              Download Image
            </ShareButton>
            <ShareButton onClick={handleShareOther}>
              <FaShareSquare size={20} />
              Share...
            </ShareButton>
          </ButtonsContainer>
        ) : (
          <SuccessMessage>
            <SuccessIcon />
            <SuccessText>
              Successfully shared your trade!
            </SuccessText>
          </SuccessMessage>
        )}
      </Content>
    </Container>
  );
};

export default ShareScreen;
