/**
 * Configuration for MOLECULAI
 * This file determines whether to use backend API or embedded data
 */

const CONFIG = {
  // Set to true to use embedded molecule data (for GitHub Pages static deployment)
  // Set to false to use backend API (for full-stack deployment)
  USE_EMBEDDED_DATA: true,
  
  // API base URL (only used when USE_EMBEDDED_DATA is false)
  API_BASE_URL: window.location.origin,
  
  // GitHub Pages base path (if deployed to a subdirectory)
  BASE_PATH: '',
  
  // Enable authentication features (requires backend)
  ENABLE_AUTH: false
};

// Expose configuration globally for other scripts to consume
window.CONFIG = CONFIG;
