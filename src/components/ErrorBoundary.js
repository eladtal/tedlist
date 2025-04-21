import React from 'react';

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
  
  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '', errorStack: '', errorComponentStack: '' });
  }
  
  handleGoHome = () => {
    window.location.href = '/';
  }
  
  handleAlternateVersion = () => {
    window.location.href = '/react-app.html';
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          fontFamily: 'Arial, sans-serif',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1 style={{ color: '#E53935' }}>Something went wrong 😞</h1>
          <p>We're sorry, an error occurred while loading the application.</p>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            margin: '20px 0'
          }}>
            <button 
              onClick={this.handleRetry}
              style={{
                padding: '10px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
            
            <button 
              onClick={this.handleAlternateVersion}
              style={{
                padding: '10px 15px',
                backgroundColor: '#673AB7',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Use Simple Version
            </button>
            
            <button 
              onClick={this.handleGoHome}
              style={{
                padding: '10px 15px',
                backgroundColor: '#4A90E2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Go to Homepage
            </button>
          </div>
          
          <details style={{
            margin: '20px 0',
            textAlign: 'left',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <summary style={{
              padding: '10px',
              backgroundColor: '#f8f8f8',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Technical Details (for developers)
            </summary>
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#f8f8f8', 
              color: '#E53935',
              fontFamily: 'monospace',
              fontSize: '12px',
              overflowX: 'auto'
            }}>
              <h4>Error Message:</h4>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.errorMessage}</pre>
              
              <h4>Stack Trace:</h4>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.errorStack}</pre>
              
              <h4>Component Stack:</h4>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.errorComponentStack}</pre>
            </div>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
