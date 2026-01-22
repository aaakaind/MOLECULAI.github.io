/**
 * Configuration for MOLECULAI
 * This file determines whether to use backend API or embedded data
 * 
 * Platform Detection:
 * - GitHub Pages: Uses static embedded data
 * - Vercel/other: Uses full API backend
 * 
 * Note: Detection is runtime-based for maximum flexibility.
 * For build-time configuration, set environment variables and
 * generate this file during the build process.
 */

const CONFIG = {
  // Set to true to use embedded molecule data (for GitHub Pages static deployment)
  // Set to false to use backend API (for full-stack deployment like Vercel)
  USE_EMBEDDED_DATA: typeof window !== 'undefined' && window.location.hostname.includes('github.io'),
  
  // API base URL (only used when USE_EMBEDDED_DATA is false)
  // Automatically detects if running on Vercel or locally
  API_BASE_URL: typeof window !== 'undefined' ? window.location.origin : '',
  
  // GitHub Pages base path (if deployed to a subdirectory)
  BASE_PATH: '',
  
  // Enable authentication features (requires backend)
  // Enabled for Vercel deployments, disabled for GitHub Pages
  ENABLE_AUTH: typeof window !== 'undefined' && !window.location.hostname.includes('github.io')
};

// Expose configuration globally for other scripts to consume
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
  console.log('MOLECULAI Configuration:', {
    mode: CONFIG.USE_EMBEDDED_DATA ? 'Static (Embedded Data)' : 'Full-Stack (API)',
    apiUrl: CONFIG.API_BASE_URL,
    authEnabled: CONFIG.ENABLE_AUTH
  });
}

