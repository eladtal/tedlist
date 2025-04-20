import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes, FaUserPlus, FaLink, FaCopy, FaEnvelope, FaWhatsapp, FaFacebookMessenger, FaCheck } from 'react-icons/fa';
import theme from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding, ONBOARDING_STEPS } from '../../contexts/OnboardingContext';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContainer = styled.div`
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
  display: flex;
  align-items: center;
  
  svg {
    margin-right: ${theme.spacing.sm};
    color: ${theme.colors.primary};
  }
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

const Description = styled.p`
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.lg};
`;

const Reward = styled.div`
  background-color: rgba(106, 90, 205, 0.1);
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  margin-bottom: ${theme.spacing.lg};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.primary};
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: ${theme.typography.fontSize.medium};
  margin-bottom: ${theme.spacing.sm};
`;

const LinkContainer = styled.div`
  display: flex;
  background-color: ${theme.colors.greyLight};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.medium};
  margin-bottom: ${theme.spacing.md};
`;

const InviteLink = styled.input`
  flex: 1;
  border: none;
  background: none;
  font-size: ${theme.typography.fontSize.medium};
  padding: ${theme.spacing.xs};
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  background-color: ${props => props.copied ? '#4CAF50' : theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
  cursor: pointer;
  
  svg {
    margin-right: ${theme.spacing.xs};
  }
`;

const ShareOptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
`;

const ShareOption = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.divider};
  border-radius: ${theme.borderRadius.medium};
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.small};
  }
`;

const ShareIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${theme.spacing.sm};
  color: ${props => props.color || theme.colors.primary};
`;

const ShareLabel = styled.div`
  font-size: ${theme.typography.fontSize.small};
  color: ${theme.colors.textSecondary};
`;

const EmailForm = styled.form`
  margin-top: ${theme.spacing.md};
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.sm};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.xs};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.divider};
  border-radius: ${theme.borderRadius.medium};
  font-size: ${theme.typography.fontSize.medium};
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  
  &:hover {
    background-color: ${theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: ${theme.colors.greyLight};
    color: ${theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  font-weight: ${theme.typography.fontWeight.medium};
  text-align: center;
  margin-top: ${theme.spacing.md};
`;

const InviteFriendModal = ({ onClose }) => {
  const { currentUser } = useAuth();
  const { completeStep } = useOnboarding();
  
  const [copied, setCopied] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    name: '',
    email: '',
    message: `Check out Tedlist, a great app for trading and selling items. I'm using it and thought you'd like it too!`
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  // Generate a unique invite link
  const inviteLink = `https://tedlist.example.com/invite/${currentUser?.id}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        
        // Mark invite step as completed
        completeStep(ONBOARDING_STEPS.INVITE_FRIEND);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  };
  
  const handleShareOption = (platform) => {
    let shareUrl;
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`Check out Tedlist: ${inviteLink}`)}`;
        break;
      case 'messenger':
        shareUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(inviteLink)}&app_id=123456789`;
        break;
      case 'email':
        setShowEmailForm(true);
        return;
      default:
        // Just copy the link
        handleCopyLink();
        return;
    }
    
    // Mark invite step as completed
    completeStep(ONBOARDING_STEPS.INVITE_FRIEND);
    
    // Open in new window
    window.open(shareUrl, '_blank');
  };
  
  const handleEmailFormChange = (e) => {
    const { name, value } = e.target;
    setEmailFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate sending email
    setTimeout(() => {
      setSending(false);
      setSent(true);
      
      // Mark invite step as completed
      completeStep(ONBOARDING_STEPS.INVITE_FRIEND);
    }, 1500);
  };
  
  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <FaUserPlus /> Invite Friends
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <Description>
            Invite your friends to join Tedlist and start trading or selling items together!
          </Description>
          
          <Reward>
            Earn +500 points for each friend that signs up!
          </Reward>
          
          <Section>
            <SectionTitle>
              <FaLink /> Your Invite Link
            </SectionTitle>
            
            <LinkContainer>
              <InviteLink 
                value={inviteLink}
                readOnly
                onClick={e => e.target.select()}
              />
              <CopyButton 
                onClick={handleCopyLink}
                copied={copied}
              >
                {copied ? (
                  <>
                    <FaCheck /> Copied
                  </>
                ) : (
                  <>
                    <FaCopy /> Copy
                  </>
                )}
              </CopyButton>
            </LinkContainer>
          </Section>
          
          <Section>
            <SectionTitle>Share Via</SectionTitle>
            
            <ShareOptionsContainer>
              <ShareOption onClick={() => handleShareOption('whatsapp')}>
                <ShareIcon color="#25D366">
                  <FaWhatsapp />
                </ShareIcon>
                <ShareLabel>WhatsApp</ShareLabel>
              </ShareOption>
              
              <ShareOption onClick={() => handleShareOption('messenger')}>
                <ShareIcon color="#0084FF">
                  <FaFacebookMessenger />
                </ShareIcon>
                <ShareLabel>Messenger</ShareLabel>
              </ShareOption>
              
              <ShareOption onClick={() => handleShareOption('email')}>
                <ShareIcon color="#EA4335">
                  <FaEnvelope />
                </ShareIcon>
                <ShareLabel>Email</ShareLabel>
              </ShareOption>
              
              <ShareOption onClick={() => handleShareOption('copy')}>
                <ShareIcon>
                  <FaCopy />
                </ShareIcon>
                <ShareLabel>Copy Link</ShareLabel>
              </ShareOption>
            </ShareOptionsContainer>
            
            {showEmailForm && (
              <EmailForm onSubmit={handleEmailSubmit}>
                <FormGroup>
                  <Label htmlFor="name">Friend's Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={emailFormData.name}
                    onChange={handleEmailFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="email">Friend's Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={emailFormData.email}
                    onChange={handleEmailFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="message">Message (optional)</Label>
                  <Input 
                    id="message"
                    name="message"
                    as="textarea"
                    rows="3"
                    value={emailFormData.message}
                    onChange={handleEmailFormChange}
                  />
                </FormGroup>
                
                <SubmitButton 
                  type="submit"
                  disabled={sending || sent}
                >
                  {sending ? 'Sending...' : sent ? 'Sent!' : 'Send Invitation'}
                </SubmitButton>
                
                {sent && (
                  <SuccessMessage>
                    Invitation sent successfully!
                  </SuccessMessage>
                )}
              </EmailForm>
            )}
          </Section>
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

export default InviteFriendModal;
