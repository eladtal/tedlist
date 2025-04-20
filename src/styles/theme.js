// Theme constants for Tedlist application
// Based on pastel color palette described in design spec

const theme = {
    colors: {
      // Pastel colors as specified in the design document
      butteryYellow: '#FAEDCB',
      mintGreen: '#C9E4DE',
      skyBlue: '#C6DEF1',
      lavender: '#DBCDF0',
      blushPink: '#F2C6DE',
      peach: '#F7D9C4',
      
      // Functional colors
      background: '#FFFFFF',
      textPrimary: '#333333',
      textSecondary: '#666666',
      primary: '#C6DEF1', // Using sky blue as primary
      secondary: '#F7D9C4', // Using peach as secondary
      accent: '#C9E4DE', // Using mint green as accent
      error: '#F8AFA6', // A soft pastel red for errors
      
      // UI component colors
      cardBackground: '#FFFFFF',
      buttonPrimary: '#C6DEF1',
      buttonSecondary: '#F7D9C4',
      navBackground: '#FFFFFF',
      divider: '#EEEEEE',
    },
    
    // Typography
    typography: {
      fontFamily: "'Roboto', 'Segoe UI', sans-serif",
      fontSize: {
        small: '0.875rem',
        medium: '1rem',
        large: '1.25rem',
        xlarge: '1.5rem',
        xxlarge: '2rem',
      },
      fontWeight: {
        regular: 400,
        medium: 500,
        bold: 700,
      },
    },
    
    // Spacing
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    },
    
    // Border radius
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '16px',
      circle: '50%',
    },
    
    // Shadows
    shadows: {
      small: '0 2px 4px rgba(0, 0, 0, 0.05)',
      medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
      large: '0 8px 16px rgba(0, 0, 0, 0.15)',
    },
    
    // Breakpoints for responsive design
    breakpoints: {
      xs: '320px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
    
    // Z-index values
    zIndex: {
      navbar: 1000,
      modal: 1100,
      tooltip: 1200,
    },
  };
  
  export default theme;