import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';

const Container = styled.div`
  padding-bottom: 80px;
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding-top: 80px;
    padding-bottom: ${theme.spacing.md};
  }
`;

const PageHeader = styled.div`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.divider};
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.fontSize.xlarge};
`;

const ConversationList = styled.div`
  
`;

const ConversationItem = styled.div`
  display: flex;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.divider};
  cursor: pointer;
  
  &:hover {
    background-color: rgba(198, 222, 241, 0.1);
  }
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-image: url('https://randomuser.me/api/portraits/women/44.jpg');
  background-size: cover;
  margin-right: ${theme.spacing.md};
`;

const Content = styled.div`
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.xs};
`;

const UserName = styled.div`
  font-weight: ${theme.typography.fontWeight.bold};
`;

const Time = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.small};
`;

const LastMessage = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.medium};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
`;

const ItemPreview = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${theme.spacing.xs};
  padding: ${theme.spacing.xs};
  background-color: rgba(198, 222, 241, 0.1);
  border-radius: ${theme.borderRadius.small};
`;

const ItemImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.small};
  background-image: url('https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1336&q=80');
  background-size: cover;
  margin-right: ${theme.spacing.sm};
`;

const ItemName = styled.div`
  font-size: ${theme.typography.fontSize.small};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const EmptyState = styled.div`
  padding: ${theme.spacing.xxl};
  text-align: center;
`;

const EmptyStateTitle = styled.h2`
  margin-bottom: ${theme.spacing.md};
`;

const EmptyStateText = styled.p`
  color: ${theme.colors.textSecondary};
`;

const MessagesScreen = () => {
  // In a real app, this would be fetched from an API
  const hasConversations = true;
  
  return (
    <Container>
      <PageHeader>
        <PageTitle>Messages</PageTitle>
      </PageHeader>
      
      {hasConversations ? (
        <ConversationList>
          <ConversationItem>
            <Avatar />
            <Content>
              <Header>
                <UserName>Noa</UserName>
                <Time>10:23</Time>
              </Header>
              <LastMessage>
                Is this still available?
              </LastMessage>
              <ItemPreview>
                <ItemImage />
                <ItemName>iPhone 13 Pro - 256GB</ItemName>
              </ItemPreview>
            </Content>
          </ConversationItem>
        </ConversationList>
      ) : (
        <EmptyState>
          <EmptyStateTitle>No Messages Yet</EmptyStateTitle>
          <EmptyStateText>
            When you connect with other users, your conversations will appear here.
          </EmptyStateText>
        </EmptyState>
      )}
    </Container>
  );
};

export default MessagesScreen;
