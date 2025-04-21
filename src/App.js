import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import Navbar from './components/common/Navbar';
import HomeScreen from './components/Home/HomeScreen';
import SwipeScreen from './components/Swipe/SwipeScreen';
import SwipeHistoryScreen from './components/Swipe/SwipeHistoryScreen';
import ItemDetailScreen from './components/ItemDetail/ItemDetailScreen';
import UploadScreen from './components/Upload/UploadScreen';
import ProfileScreen from './components/Profile/ProfileScreen';
import MessagesScreen from './components/Messages/MessagesScreen';
import MessageScreen from './components/Messages/MessageScreen';
import ChatScreen from './components/Messages/ChatScreen';
import TradePage from './components/Trade/TradePage';
import TradeSwipe from './components/Trade/TradeSwipe';
import ShareScreen from './components/Social/ShareScreen';
import NotificationsScreen from './components/Notifications/NotificationsScreen';
import AdminScreen from './components/Admin/AdminScreen';
import OnboardingScreen from './components/Onboarding/OnboardingScreen';
import LoginScreen from './components/Auth/LoginScreen';
import SignupScreen from './components/Auth/SignupScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { TradeInteractionProvider } from './contexts/TradeInteractionContext';
import { AdminProvider } from './contexts/AdminContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { PointsProvider } from './contexts/PointsContext';

// Private Route component to protect authenticated routes
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// Admin Route component to protect admin routes
const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // In a real app, we would check if the user is an admin here
  // For now, we'll just check if they're authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// This wrapper is needed to access location for conditional navbar rendering
const AppContent = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Check if the current route is the homepage
  const isHomePage = location.pathname === '/';
  // Check if we're in a chat - don't show navbar in chat screens
  const isChatScreen = location.pathname.includes('/messages/');
  // Check if we're in share screen - don't show navbar
  const isShareScreen = location.pathname.includes('/share/');
  // Check if we're on auth screens
  const isAuthScreen = location.pathname === '/login' || location.pathname === '/signup';
  
  // Don't show navbar on auth screens or if user is not logged in
  const showNavbar = !isHomePage && !isChatScreen && !isShareScreen && !isAuthScreen && currentUser;
  
  return (
    <AppContainer>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        
        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            currentUser ? <HomeScreen /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/swipe" 
          element={
            <PrivateRoute>
              <SwipeScreen />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/swipe-history" 
          element={
            <PrivateRoute>
              <SwipeHistoryScreen />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/items/:id" 
          element={
            <PrivateRoute>
              <ItemDetailScreen />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/upload" 
          element={
            <PrivateRoute>
              <UploadScreen />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <ProfileScreen />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/messages" 
          element={
            <PrivateRoute>
              <MessageScreen />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/messages/:id" 
          element={
            <PrivateRoute>
              <ChatScreen />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/trade" 
          element={
            <PrivateRoute>
              <TradePage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/trade/swipe/:itemId" 
          element={
            <PrivateRoute>
              <TradeSwipe />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <PrivateRoute>
              <NotificationsScreen />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/onboarding" 
          element={
            <PrivateRoute>
              <OnboardingScreen />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/share/:id" 
          element={
            <PrivateRoute>
              <ShareScreen />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/share" 
          element={
            <PrivateRoute>
              <ShareScreen />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminScreen />
            </AdminRoute>
          } 
        />
      </Routes>
      {showNavbar && <Navbar />}
    </AppContainer>
  );
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${theme.colors.background};
  
  @media (min-width: ${theme.breakpoints.md}) {
    max-width: 1440px;
    margin: 0 auto;
  }
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <NotificationProvider>
          <TradeInteractionProvider>
            <AdminProvider>
              <PointsProvider>
                <OnboardingProvider>
                  <Router>
                    <ErrorBoundary>
                      <AppContent />
                    </ErrorBoundary>
                  </Router>
                </OnboardingProvider>
              </PointsProvider>
            </AdminProvider>
          </TradeInteractionProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;