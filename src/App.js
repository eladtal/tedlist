import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import Header from './components/common/Header';
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
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { PointsProvider } from './contexts/PointsContext';
import MinimalApp from './MinimalApp';

// FEATURE FLAGS - Enable these one by one to find the source of loading issues
const FEATURES = {
  USE_AUTH: true,         // Authentication provider
  USE_NOTIFICATIONS: true, // Notification provider
  USE_ADMIN: true,        // Admin provider
  USE_ONBOARDING: true,   // Onboarding provider
  USE_TRADE: true,        // Trade interaction provider
  USE_POINTS: true,       // Points provider
  USE_DEBUG: true,        // Debug UI elements
  LOADING_TIMEOUT: 2000,  // Max time to wait for providers to load (ms)
};

// Simple component to show when app is in minimal mode
const MinimalApp = () => (
  <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
    <h1>TedList - Minimal Mode</h1>
    <p>This is a simplified version of the app for testing or preview.</p>
    <div style={{ marginTop: 20 }}>
      <a href="/">Go to main app</a>
    </div>
  </div>
);

// Error boundary component to catch errors in the app
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
          <h1>Something went wrong</h1>
          <p>We're sorry, but there was an error loading the app.</p>
          <pre>{this.state.error && this.state.error.toString()}</pre>
          <button onClick={() => window.location.reload()}>Reload App</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading timeout component to prevent infinite loading states
const LoadingTimeout = ({ children }) => {
  const [timedOut, setTimedOut] = useState(false);
  
  useEffect(() => {
    // Set a timeout to force loading to complete
    const timer = setTimeout(() => {
      console.warn(`Provider loading timed out after ${FEATURES.LOADING_TIMEOUT}ms`);
      setTimedOut(true);
    }, FEATURES.LOADING_TIMEOUT);
    
    return () => clearTimeout(timer);
  }, []);
  
  // If we've timed out, we'll render a special version of the children
  // that ignores loading states
  if (timedOut) {
    return (
      <>
        {children}
        {FEATURES.USE_DEBUG && (
          <div 
            style={{ 
              position: 'fixed', 
              bottom: 0, 
              right: 0, 
              background: 'rgba(255,0,0,0.7)', 
              color: 'white',
              padding: 5,
              fontSize: 12,
              zIndex: 9999
            }}
          >
            Loading timeout activated
          </div>
        )}
      </>
    );
  }
  
  return children;
};

// Private Route component to protect authenticated routes
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  
  // If we're still loading, show loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}>
        <p>Loading...</p>
      </div>
    );
  }
  
  // If user isn't authenticated, redirect to login
  if (!currentUser) {
    // Save the attempted URL for redirecting after login
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/login" state={{ from: location }} />;
  }
  
  // If in dev mode and debug is enabled, show debug info
  if (process.env.NODE_ENV === 'development' && FEATURES.USE_DEBUG) {
    return (
      <>
        {children}
        <div 
          style={{ 
            position: 'fixed', 
            bottom: 30, 
            right: 0, 
            background: 'rgba(0,0,255,0.7)', 
            color: 'white',
            padding: 5,
            fontSize: 12,
            zIndex: 9999
          }}
        >
          Auth: {currentUser.email || currentUser.username}
        </div>
      </>
    );
  }
  
  return children;
};

// Admin Route component to protect admin routes
const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const { isAdmin } = useAdmin();
  
  // If we're still loading, show loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}>
        <p>Loading admin access...</p>
      </div>
    );
  }
  
  // Check if user is authenticated and is an admin
  if (!currentUser || !isAdmin) {
    return <Navigate to="/" />;
  }
  
  // If in dev mode and debug is enabled, show debug info
  if (process.env.NODE_ENV === 'development' && FEATURES.USE_DEBUG) {
    return (
      <>
        {children}
        <div 
          style={{ 
            position: 'fixed', 
            bottom: 60, 
            right: 0, 
            background: 'rgba(128,0,128,0.7)', 
            color: 'white',
            padding: 5,
            fontSize: 12,
            zIndex: 9999
          }}
        >
          Admin mode
        </div>
      </>
    );
  }
  
  return children;
};

// Debug provider to track loading state of a provider
const DebugProvider = ({ name, loading, children }) => {
  // If not in development or debug disabled, just render children
  if (process.env.NODE_ENV !== 'development' || !FEATURES.USE_DEBUG) {
    return children;
  }
  
  return (
    <>
      {children}
      {loading && (
        <div 
          style={{ 
            position: 'fixed', 
            bottom: 90, 
            right: 0, 
            background: 'rgba(255,165,0,0.7)', 
            color: 'white',
            padding: 5,
            fontSize: 12,
            zIndex: 9999
          }}
        >
          {name} loading...
        </div>
      )}
    </>
  );
};

// This wrapper is needed to access location for conditional navbar rendering
const AppContent = () => {
  const location = useLocation();
  const { currentUser, loading } = useAuth();
  const { isOnboarded, onboardingComplete, openOnboarding } = useOnboarding();

  // Check if the current route is the homepage
  const isHomePage = location.pathname === '/';
  // Check if we're in a chat - don't show navbar in chat screens
  const isChatScreen = location.pathname.includes('/messages/');
  // Check if we're in share screen - don't show navbar
  const isShareScreen = location.pathname.includes('/share/');
  // Check if we're on auth screens
  const isAuthScreen = location.pathname === '/login' || location.pathname === '/signup';
  
  // Show header on all screens except auth screens
  const showHeader = !isAuthScreen;
  
  // Show a special UI when the app is in "minimal" mode
  // This is useful for development and demos
  if (location.pathname.startsWith('/minimal')) {
    return <MinimalApp />;
  }

  // If we're still loading auth, show a simple loading screen
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading TedList...</p>
      </div>
    );
  }
  
  // In development mode, we can add a fast login option
  // This lets us test the app without having to go through the login flow
  if (process.env.NODE_ENV === 'development' && FEATURES.USE_DEBUG && 
      !currentUser && isAuthScreen) {
    return (
      <>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          
          {/* In dev mode, redirect to login for any other route when not authenticated */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        
        {/* Debug UI for fast login in dev mode */}
        <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1000 }}>
          <button
            style={{
              background: '#ff4081',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '8px 16px',
              cursor: 'pointer'
            }}
            onClick={() => {
              // Create a demo user and manually set it
              const demoUser = {
                id: 'dev-user-1',
                username: 'dev_user',
                email: 'dev@example.com',
                profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg',
                isAdmin: true
              };
              
              // Check if setCurrentUser is available
              if (typeof setCurrentUser === 'function') {
                setCurrentUser(demoUser);
              } else {
                // Fallback - store in localStorage
                localStorage.setItem('tedlistUser', JSON.stringify(demoUser));
                localStorage.setItem('tedlistAuthToken', 'dev-token-123');
                // Reload the app to pick up the localStorage changes
                window.location.href = '/';
              }
            }}
          >
            Dev Mode: Skip Login
          </button>
        </div>
      </>
    );
  }
  
  return (
    <>
      {showHeader && <Header />}
      <MainContent>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          
          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <HomeScreen />
              </PrivateRoute>
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
            path="/history" 
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
                <MessagesScreen />
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
          
          {/* Admin routes */}
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <div>Admin Dashboard (Coming soon)</div>
              </AdminRoute>
            } 
          />
          
          {/* Special routes for development and demos */}
          <Route path="/minimal" element={<MinimalApp />} />
          
          {/* Catch-all route - always render MinimalApp */}
          <Route path="*" element={<MinimalApp />} />
        </Routes>
      </MainContent>
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

const MainContent = styled.main`
  flex: 1;
  margin-top: 60px; /* Space for the fixed header */
  padding: 20px;
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
  
  // Always include AdminProvider but honor feature flag internally
  // This prevents "Cannot destructure property 'isAdmin'" errors
  result = <AdminProvider adminEnabled={FEATURES.USE_ADMIN}>{result}</AdminProvider>;
  
  if (FEATURES.USE_NOTIFICATIONS) {
    result = <NotificationProvider>{result}</NotificationProvider>;
  }
  
  if (FEATURES.USE_AUTH) {
    result = <AuthProvider>{result}</AuthProvider>;
  }
  
  return result;
};

const App = () => {
  const [appReady, setAppReady] = useState(true);
  const [providerLoading, setProviderLoading] = useState(false);
  
  // Force app ready after a very short timeout
  useEffect(() => {
    if (!appReady) {
      // Mark app as ready immediately
      setAppReady(true);
    }
    
    // Force providers to be considered loaded
    if (providerLoading) {
      setProviderLoading(false);
    }
  }, [appReady, providerLoading]);
  
  return (
    <AppContainer>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <ErrorBoundary>
          <LoadingTimeout>
            <DebugProvider name="All Providers" loading={providerLoading}>
              {withProviders(
                <Router>
                  <ErrorBoundary>
                    <AppContent />
                  </ErrorBoundary>
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