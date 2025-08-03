# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Ingredient Analyzer app.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (required for OAuth)

## Step 2: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Select **Application type**:
   - For **Web**: Select "Web application"
   - For **iOS**: Select "iOS"
   - For **Android**: Select "Android"

### For Web Applications:
- **Authorized redirect URIs**: Add your web domain
- For local development: `http://localhost:8081`
- For production: `https://your-netlify-domain.netlify.app`

### For Mobile Applications:
- **Bundle ID** (iOS): `com.yourcompany.ingredient-analyzer`
- **Package name** (Android): `com.yourcompany.ingredient_analyzer`

## Step 3: Configure the App

1. Copy your **Client ID** from the Google Cloud Console
2. Open `/src/contexts/AuthContext.tsx`
3. Replace `'your-google-client-id'` with your actual Client ID:

```typescript
const clientId = 'your-actual-google-client-id.apps.googleusercontent.com';
```

## Step 4: Update Environment Variables

For production deployment, add your client ID to Netlify environment variables:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Add a new variable:
   - **Key**: `EXPO_PUBLIC_GOOGLE_CLIENT_ID`
   - **Value**: Your Google Client ID

Then update the AuthContext to use the environment variable:

```typescript
const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'your-fallback-client-id';
```

## Step 5: Test the Authentication

1. Run your app in development:
   ```bash
   npm run web
   ```

2. Try signing in with Google
3. Check that the user profile appears after successful authentication

## Troubleshooting

### Common Issues:

1. **"OAuth client not found"**
   - Make sure your Client ID is correct
   - Verify the redirect URI matches your configuration

2. **"This app isn't verified"**
   - This is normal for development
   - You can proceed by clicking "Advanced" > "Go to [app] (unsafe)"

3. **Redirect URI mismatch**
   - Ensure your redirect URIs in Google Cloud Console match your app's configuration
   - For Expo web, the default redirect URI is `http://localhost:8081`

## Security Notes

- Never commit your actual Client ID to version control
- Use environment variables for production
- Consider implementing refresh tokens for long-term authentication
- Always validate tokens on your backend (Netlify Functions)

## Additional Features to Consider

1. **Token validation**: Verify Google tokens in your Netlify Functions
2. **User data storage**: Store user preferences and analysis history
3. **Rate limiting**: Implement per-user API rate limits
4. **Session management**: Handle token expiration and refresh
