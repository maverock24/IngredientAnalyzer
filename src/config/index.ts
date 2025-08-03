// Configuration for API keys and settings
export const config = {
  // For local development, you can set your API key here temporarily
  // Remember to remove it before committing!
  GEMINI_API_KEY_LOCAL: "", // Add your key here for local testing

  // API endpoints
  GEMINI_API_URL:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",

  // App settings
  MAX_PRODUCTS: 5,
  IMAGE_QUALITY: 0.8,

  // Development settings
  USE_MOCK_DATA: false, // Set to true for testing without API
  USE_LOCAL_API: false, // Set to true for local development with direct API calls
};

// Instructions for setup
export const setupInstructions = `
🔧 Setup Instructions:

## For Production (Netlify):
1. Get your Gemini API Key:
   - Go to https://aistudio.google.com/app/apikey
   - Create a new API key
   - Copy the key

2. Configure API key in Netlify:
   - Go to your Netlify site dashboard
   - Navigate to Site settings > Environment variables
   - Add GEMINI_API_KEY with your actual key value

## For Local Development:
Choose one of these options:

Option 1: Direct API calls (for quick testing)
   - Set USE_LOCAL_API to true in config
   - Add your API key to GEMINI_API_KEY_LOCAL
   - ⚠️ Remember to remove the key before committing!

Option 2: Use Netlify Dev (recommended)
   - Install Netlify CLI: npm install -g netlify-cli
   - Run: netlify dev
   - This will run your functions locally at localhost:8888

Option 3: Mock data (no API needed)
   - Set USE_MOCK_DATA to true in config
   - The app will work without an API key using sample data

🔒 Security: In production, API calls are handled server-side via Netlify Functions!
`;

export default config;
