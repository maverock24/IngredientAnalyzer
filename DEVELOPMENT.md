# Local Development Guide

This guide explains how to test the Ingredient Analyzer app locally with the Gemini API.

## Development Options

### Option 1: Direct API Calls (Quick Testing)

For quick local testing with direct API calls:

1. **Get your Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

2. **Configure for local development**:
   ```typescript
   // In src/config/index.ts
   export const config = {
     GEMINI_API_KEY_LOCAL: 'your-api-key-here', // Add your key
     USE_LOCAL_API: true, // Enable local API mode
     USE_MOCK_DATA: false,
     // ... other settings
   };
   ```

3. **Run the app**:
   ```bash
   npm run web
   ```

4. **⚠️ Important**: Remove your API key before committing:
   ```typescript
   GEMINI_API_KEY_LOCAL: '', // Clear this before committing
   USE_LOCAL_API: false, // Disable before committing
   ```

### Option 2: Netlify Dev (Recommended)

For testing with Netlify Functions locally:

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Set up environment**:
   ```bash
   # Create .env file with your API key
   echo "GEMINI_API_KEY=your-api-key-here" > .env
   ```

3. **Run with Netlify Dev**:
   ```bash
   npm run dev:netlify
   ```
   
   This will:
   - Start your Expo app
   - Run Netlify Functions locally at `localhost:8888`
   - Your app will use local functions instead of direct API calls

### Option 3: Mock Data (No API Required)

For testing without an API key:

1. **Enable mock mode**:
   ```typescript
   // In src/config/index.ts
   export const config = {
     USE_MOCK_DATA: true, // Enable mock data
     // ... other settings
   };
   ```

2. **Run the app**:
   ```bash
   npm run web
   ```

## Production Deployment

For production, the app automatically uses Netlify Functions:

1. **Set API key in Netlify Dashboard**:
   - Go to Site settings > Environment variables
   - Add `GEMINI_API_KEY` with your API key

2. **Deploy**:
   ```bash
   git push origin main
   ```

The app will automatically use server-side functions for secure API calls.

## Configuration Summary

| Mode | USE_LOCAL_API | USE_MOCK_DATA | API Key Location | Use Case |
|------|---------------|---------------|------------------|----------|
| Local API | `true` | `false` | `GEMINI_API_KEY_LOCAL` | Quick local testing |
| Netlify Dev | `false` | `false` | `.env` file | Full local testing |
| Mock Data | `false` | `true` | Not needed | Testing without API |
| Production | `false` | `false` | Netlify Dashboard | Live deployment |
