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
import MinimalApp from './MinimalApp';

// FEATURE FLAGS - Enable these one by one to find the source of loading issues
const FEATURES = {
  USE_AUTH: true,            // Authentication provider
  USE_NOTIFICATIONS: false,  // Notification provider
  USE_ADMIN: false,          // Admin provider
  USE_TRADE: false,          // Trade interaction provider
  USE_POINTS: false,         // Points provider
  USE_ONBOARDING: false,     // Onboarding provider
  USE_FULL_ROUTES: false,    // All routes or just minimal ones
  
  // Debug mode will show provider loading state on screen
  DEBUG_MODE: true
};

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
  
  // Simple admin check - can be enhanced with actual role check
  // We're not using isAdmin property as it might not be available
  // This is a workaround for the "Cannot destructure property 'isAdmin'" error
  const checkIsAdmin = () => {
    // If admin feature is disabled, nobody is admin
    if (!FEATURES.USE_ADMIN) return false;
    
    // Basic admin check, enhance as needed
    return currentUser && currentUser.email === 'admin@example.com';
  };
  
  if (!currentUser || !checkIsAdmin()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// Debug provider to track loading state of a provider
const DebugProvider = ({ name, loading, children }) => {
  if (!FEATURES.DEBUG_MODE) return children;
  
  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '5px 10px',
          borderRadius: '4px',
          zIndex: 9999,
          fontSize: '12px',
          opacity: 0.9
        }}>
          {name} is still loading...
        </div>
      )}
      {children}
    </div>
  );
};

// This wrapper is needed to access location for conditional navbar rendering
const AppContent = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Routes that don't need a navbar
  const noNavbarRoutes = ['/login', '/signup', '/onboarding'];
  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);
  
  return (
    <>
      {shouldShowNavbar && <Navbar />}
      
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        
        {/* Full routes or minimal routes based on feature flag */}
        {FEATURES.USE_FULL_ROUTES ? (
          <>
            {/* Protected routes - require authentication */}
            <Route path="/" element={<PrivateRoute><HomeScreen /></PrivateRoute>} />
            <Route path="/swipe" element={<PrivateRoute><SwipeScreen /></PrivateRoute>} />
            <Route path="/swipe/history" element={<PrivateRoute><SwipeHistoryScreen /></PrivateRoute>} />
            <Route path="/item/:id" element={<PrivateRoute><ItemDetailScreen /></PrivateRoute>} />
            <Route path="/upload" element={<PrivateRoute><UploadScreen /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfileScreen /></PrivateRoute>} />
            <Route path="/profile/:id" element={<PrivateRoute><ProfileScreen /></PrivateRoute>} />
            <Route path="/messages" element={<PrivateRoute><MessagesScreen /></PrivateRoute>} />
            <Route path="/messages/:id" element={<PrivateRoute><ChatScreen /></PrivateRoute>} />
            <Route path="/trade/:id" element={<PrivateRoute><TradePage /></PrivateRoute>} />
            <Route path="/trade-swipe" element={<PrivateRoute><TradeSwipe /></PrivateRoute>} />
            <Route path="/share/:id" element={<PrivateRoute><ShareScreen /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><NotificationsScreen /></PrivateRoute>} />
            <Route path="/onboarding" element={<PrivateRoute><OnboardingScreen /></PrivateRoute>} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminRoute><AdminScreen /></AdminRoute>} />
          </>
        ) : (
          /* Minimal routes when debugging */
          <>
            <Route path="/" element={
              <div style={{ padding: '20px', marginTop: '80px' }}>
                <h1>Tedlist Marketplace</h1>
                <p>This is a reduced functionality version for debugging.</p>
                <p>Feature flags: {JSON.stringify(FEATURES, null, 2)}</p>
                {currentUser ? (
                  <div style={{ marginTop: '20px' }}>
                    <h2>Welcome, {currentUser.displayName || currentUser.email}</h2>
                    <p>User is authenticated.</p>
                  </div>
                ) : (
                  <div style={{ marginTop: '20px' }}>
                    <h2>Not logged in</h2>
                    <p>Please <a href="/login">login</a> to see more content.</p>
                  </div>
                )}
              </div>
            } />
            <Route path="/minimal" element={<MinimalApp />} />
          </>
        )}
        
        {/* Fallback route - will work even if providers fail */}
        <Route path="/minimal" element={<MinimalApp />} />
        
        {/* Catch-all route - redirect to home or login based on auth status */}
        <Route path="*" element={
          currentUser ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </>
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

// Function to wrap content with appropriate providers based on feature flags
const withProviders = (children) => {
  let result = children;
  
  // Each provider layer is only added if the feature flag is enabled
  if (FEATURES.USE_ONBOARDING) {
    result = <OnboardingProvider>{result}</OnboardingProvider>;
  }
  
  if (FEATURES.USE_POINTS) {
    result = <PointsProvider>{result}</PointsProvider>;
  }
  
  if (FEATURES.USE_TRADE) {
    result = <TradeInteractionProvider>{result}</TradeInteractionProvider>;
  }
  
  if (FEATURES.USE_ADMIN) {
    result = <AdminProvider>{result}</AdminProvider>;
  }
  
  if (FEATURES.USE_NOTIFICATIONS) {
    result = <NotificationProvider>{result}</NotificationProvider>;
  }
  
  if (FEATURES.USE_AUTH) {
    result = <AuthProvider>{result}</AuthProvider>;
  }
  
  return result;
};

const App = () => {
  const [appReady, setAppReady] = useState(false);
  const [providerLoading, setProviderLoading] = useState(true);
  
  // Add a safety timeout to ensure the app loads eventually
  useEffect(() => {
    // Mark app as ready after a short delay
    const timer = setTimeout(() => {
      setAppReady(true);
      
      // After 2 seconds, assume providers have loaded (or failed)
      setTimeout(() => {
        setProviderLoading(false);
      }, 2000);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AppContainer>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <ErrorBoundary>
          <LoadingTimeout>
            <DebugProvider name="All Providers" loading={providerLoading}>
              {withProviders(
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
              )}
            </DebugProvider>
          </LoadingTimeout>
        </ErrorBoundary>
      </ThemeProvider>
    </AppContainer>
  );
};

export default App;