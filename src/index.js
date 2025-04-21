// DEBUGGING VERSION
// Original index.js content is commented out but preserved for later restoration

import React from 'react';
import { createRoot } from 'react-dom/client';
import MinimalApp from './MinimalApp';

// Simple CSS to ensure the page isn't blank
const style = document.createElement('style');
style.textContent = `
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
  }
`;
document.head.appendChild(style);

// Add console logs to help debug
console.log('React version:', React.version);
console.log('Starting React initialization...');

try {
  // Get the root element
  const container = document.getElementById('root');
  
  if (!container) {
    console.error('Root element not found in the DOM');
    // Create a root element if it doesn't exist
    const newRoot = document.createElement('div');
    newRoot.id = 'root';
    document.body.appendChild(newRoot);
    console.log('Created new root element');
  }
  
  console.log('Creating React root...');
  const root = createRoot(document.getElementById('root'));
  
  console.log('Rendering minimal app...');
  root.render(
    <React.StrictMode>
      <MinimalApp />
    </React.StrictMode>
  );
  
  console.log('Render complete!');
} catch (error) {
  console.error('Error during React initialization:', error);
  
  // Display error on page if React fails
  const errorDiv = document.createElement('div');
  errorDiv.style.padding = '20px';
  errorDiv.style.margin = '20px';
  errorDiv.style.backgroundColor = '#ffebee';
  errorDiv.style.border = '1px solid #ffcdd2';
  errorDiv.style.borderRadius = '4px';
  
  errorDiv.innerHTML = `
    <h2 style="color: #b71c1c;">React Initialization Error</h2>
    <p>${error.message}</p>
    <pre style="background: #f8f8f8; padding: 15px; overflow: auto;">${error.stack}</pre>
    <p><a href="/simple.html" style="color: #2196F3;">Go to Simple HTML Version</a></p>
  `;
  
  document.body.appendChild(errorDiv);
}

// =========== ORIGINAL CODE (COMMENTED OUT) ===========
/*
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
*/
