# 🔧 Quick Google OAuth Setup

**You need to complete these steps to fix the "OAuth client was not found" error:**

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create or select a project**
3. **Enable APIs**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
   - Also enable "Google Identity Services API"

4. **Create OAuth Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"

5. **Configure Authorized redirect URIs**:
   ```
   http://localhost:8081
   http://localhost:19006
   https://your-app-name.netlify.app (when you deploy)
   ```

6. **Copy your Client ID** - it will look like:
   ```
   123456789-abcdefghijklmnop.apps.googleusercontent.com
   ```

## Step 2: Update Your Local Environment

1. **Open the `.env` file** in your project root
2. **Replace the placeholder** with your actual Client ID:
   ```
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
   ```

## Step 3: Test the Setup

1. **Restart your development server**:
   ```bash
   npm run web
   ```

2. **Try logging in** - you should now see the Google OAuth screen

## Common Issues & Solutions

### "This app isn't verified"
- This is normal during development
- Click "Advanced" → "Go to ingredient-analyzer (unsafe)"

### "Redirect URI mismatch"
- Make sure you added `http://localhost:8081` to authorized redirect URIs
- Also try adding `http://localhost:19006`

### Still getting "OAuth client not found"
- Double-check your Client ID is correct
- Make sure there are no extra spaces
- Restart the development server after updating .env

## Need Help?

If you encounter issues:
1. Check the Google Cloud Console for any error messages
2. Verify your Client ID is copied correctly
3. Make sure the Google+ API is enabled
4. Restart your development server after any changes

Once this is working locally, we'll configure it for production deployment on Netlify.
