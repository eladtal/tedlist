// Custom build script that ensures proper path configurations
const fs = require('fs');
const path = require('path');

// Paths
const buildDir = path.join(__dirname, 'build');
const indexHtmlPath = path.join(buildDir, 'index.html');

// Run after build to modify paths if needed
function fixBuildPaths() {
  console.log('Running post-build path fixes...');
  
  // Check if build directory exists
  if (!fs.existsSync(buildDir)) {
    console.error('Build directory not found!');
    process.exit(1);
  }
  
  // Fix index.html paths if needed
  if (fs.existsSync(indexHtmlPath)) {
    console.log('Fixing asset paths in index.html...');
    let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Replace absolute paths with relative paths
    indexHtml = indexHtml.replace(/href="\//g, 'href="./');
    indexHtml = indexHtml.replace(/src="\//g, 'src="./');
    
    // Write fixed file
    fs.writeFileSync(indexHtmlPath, indexHtml);
    console.log('Fixed index.html asset paths');
    
    // Create backup of original
    fs.writeFileSync(`${indexHtmlPath}.original`, indexHtml);
  }
  
  // Ensure _redirects file exists for SPA routing
  const redirectsPath = path.join(buildDir, '_redirects');
  if (!fs.existsSync(redirectsPath)) {
    console.log('Creating _redirects file for SPA routing...');
    fs.writeFileSync(redirectsPath, '/* /index.html 200');
  }
  
  // Ensure react-app.html is copied to build
  const cdnAppSourcePath = path.join(__dirname, 'public', 'react-app.html');
  const cdnAppDestPath = path.join(buildDir, 'react-app.html');
  if (fs.existsSync(cdnAppSourcePath)) {
    console.log('Copying react-app.html to build directory...');
    fs.copyFileSync(cdnAppSourcePath, cdnAppDestPath);
  }
  
  // Same for simple.html as fallback
  const simpleHtmlSourcePath = path.join(__dirname, 'public', 'simple.html');
  const simpleHtmlDestPath = path.join(buildDir, 'simple.html');
  if (fs.existsSync(simpleHtmlSourcePath)) {
    console.log('Copying simple.html to build directory...');
    fs.copyFileSync(simpleHtmlSourcePath, simpleHtmlDestPath);
  }
  
  console.log('Build fixes complete!');
}

// Run the fix function
fixBuildPaths();
