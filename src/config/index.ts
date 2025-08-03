import Constants from 'expo-constants';

// Configuration for API keys and settings
export const config = {
  // Get your Gemini API key from: https://aistudio.google.com/app/apikey
  GEMINI_API_KEY: Constants.expoConfig?.extra?.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
  
  // API endpoints
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
  
  // App settings
  MAX_PRODUCTS: 5,
  IMAGE_QUALITY: 0.8,
  
  // Mock data settings (for development without API key)
  USE_MOCK_DATA: false, // Set to true for testing without API
};

// Instructions for setup
export const setupInstructions = `
🔧 Setup Instructions:

1. Get your Gemini API Key:
   - Go to https://aistudio.google.com/app/apikey
   - Create a new API key
   - Copy the key

2. Add the API key:
   - Open src/config/index.ts
   - Replace 'YOUR_GEMINI_API_KEY_HERE' with your actual key
   
3. Alternative: Use mock data for testing:
   - Set USE_MOCK_DATA to true in config
   - The app will work without an API key using sample data

⚠️  Important: Never commit your API key to version control!
`;

export default config;
