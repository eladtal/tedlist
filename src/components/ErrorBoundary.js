import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, errorMessage: error.toString() };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console or an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          fontFamily: 'Arial, sans-serif' 
        }}>
          <h1>Something went wrong 😞</h1>
          <p>We're sorry, an error occurred while loading the application.</p>
          <div style={{ 
            margin: '20px', 
            padding: '10px', 
            backgroundColor: '#f8f8f8', 
            borderRadius: '4px',
            color: 'red',
            textAlign: 'left'
          }}>
            <pre>{this.state.errorMessage}</pre>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              padding: '10px 15px',
              backgroundColor: '#4A90E2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go to homepage
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
