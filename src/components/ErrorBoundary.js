import React from 'react';
import ErrorFallback from './common/ErrorFallback';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      errorMessage: '',
      errorStack: '',
      errorComponentStack: ''
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      errorMessage: error.toString(),
      errorStack: error.stack
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console or an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({
      errorComponentStack: errorInfo.componentStack
    });
    
    // Send error report to localStorage for debugging
    try {
      const errorLog = localStorage.getItem('tedlist_error_log') || '[]';
      const errors = JSON.parse(errorLog);
      errors.push({
        timestamp: new Date().toISOString(),
        message: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
      
      // Keep only the last 10 errors
      if (errors.length > 10) {
        errors.shift();
      }
      
      localStorage.setItem('tedlist_error_log', JSON.stringify(errors));
    } catch (e) {
      console.error('Failed to log error to localStorage:', e);
    }
  }
  
  // Handle retry/reset
  handleRetry = () => {
    this.setState({ hasError: false });
  };

  // Handle alternate version
  handleAlternateVersion = () => {
    window.location.href = '/react-app.html';
  };

  // Handle go home
  handleGoHome = () => {
    window.location.href = '/';
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.errorMessage}
          componentStack={this.state.errorComponentStack}
          retry={this.handleRetry}
          goHome={this.handleGoHome}
          alternateVersion={this.handleAlternateVersion}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
