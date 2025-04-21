import React, { useState, useEffect } from 'react';
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

// Add a loading timeout for safety
const LoadingTimeout = ({ children }) => {
  const [showTimeout, setShowTimeout] = useState(false);
  
  useEffect(() => {
    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('Application render timeout triggered');
      setShowTimeout(true);
    }, 10000); // 10 seconds
    
    return () => clearTimeout(timeout);
  }, []);
  
  if (showTimeout) {
    return (
      <div style={{ 
        padding: '20px',
        maxWidth: '500px',
        margin: '100px auto',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeeba',
        borderRadius: '4px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#856404' }}>Loading Timeout</h2>
        <p>The application is taking too long to load. This could be due to network issues or an application error.</p>
        <div style={{ margin: '20px 0' }}>
          <a href="/react-app.html" style={{ 
            display: 'inline-block',
            padding: '10px 15px',
            backgroundColor: '#6A5ACD',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            marginRight: '15px'
          }}>
            Use Simple Version
          </a>
          <button onClick={() => window.location.reload()} style={{ 
            padding: '10px 15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Reload Page
          </button>
        </div>
      </div>
    );
  }
  
  return children;
};

// Private Route component to protect authenticated routes
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  
  // Add a safeguard against endless loading
  const [forceAuth, setForceAuth] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn('Auth still loading after timeout, forcing decision');
        setForceAuth(true);
      }
    }, 5000); // 5 second safety net
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  // If still loading and not past timeout, show loading
  if (loading && !forceAuth) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '15px' }}>Loading authentication...</div>
        <div style={{ width: '40px', height: '40px', border: '4px solid rgba(0,0,0,0.1)', borderRadius: '50%', borderLeftColor: '#6A5ACD', animation: 'spin 1s linear infinite' }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  if (!currentUser && !forceAuth) {
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

const App = () => {
  const [appReady, setAppReady] = useState(false);
  
  // Add a safety timeout to ensure the app loads eventually
  useEffect(() => {
    // Mark app as ready after a short delay
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AppContainer>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <ErrorBoundary>
          <LoadingTimeout>
            <AuthProvider>
              <NotificationProvider>
                <AdminProvider>
                  <TradeInteractionProvider>
                    <PointsProvider>
                      <OnboardingProvider>
                        <Router>
                          {appReady ? (
                            <ErrorBoundary>
                              <AppContent />
                            </ErrorBoundary>
                          ) : (
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'center', 
                              alignItems: 'center', 
                              height: '100vh' 
                            }}>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ 
                                  width: '50px', 
                                  height: '50px', 
                                  border: '5px solid #f3f3f3',
                                  borderTop: '5px solid #6A5ACD',
                                  borderRadius: '50%',
                                  margin: '0 auto 20px',
                                  animation: 'spin 1s linear infinite'
                                }}></div>
                                <h2>Loading Tedlist Marketplace</h2>
                                <p>Please wait while we prepare your experience...</p>
                                <style>{`
                                  @keyframes spin {
                                    0% { transform: rotate(0deg); }
                                    100% { transform: rotate(360deg); }
                                  }
                                `}</style>
                              </div>
                            </div>
                          )}
                        </Router>
                      </OnboardingProvider>
                    </PointsProvider>
                  </TradeInteractionProvider>
                </AdminProvider>
              </NotificationProvider>
            </AuthProvider>
          </LoadingTimeout>
        </ErrorBoundary>
      </ThemeProvider>
    </AppContainer>
  );
};

export default App;