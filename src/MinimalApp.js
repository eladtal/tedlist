import React from 'react';

function MinimalApp() {
  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#6A5ACD' }}>Tedlist Marketplace (Minimal Version)</h1>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <p>This is a minimal version of the Tedlist app to diagnose loading issues.</p>
        <p>If you're seeing this, the basic React functionality is working!</p>
      </div>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        border: '1px solid #e1e1e1',
        marginBottom: '20px'
      }}>
        <h2>Sample Item</h2>
        <p><strong style={{ color: '#FF6347' }}>₪ 450</strong></p>
        <p>A sample item description.</p>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <a href="/simple.html" style={{ 
          display: 'inline-block',
          padding: '10px 15px',
          backgroundColor: '#6A5ACD',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          marginRight: '10px'
        }}>
          Go to Simple HTML Version
        </a>
        
        <a href="/" style={{ 
          display: 'inline-block',
          padding: '10px 15px',
          backgroundColor: '#44aa44',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          Try Full App
        </a>
      </div>
    </div>
  );
}

export default MinimalApp;
