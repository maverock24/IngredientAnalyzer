# 🚨 Fix for "OAuth client was not found" Error

## The Problem
Your app is trying to use Google OAuth but the Client ID is not configured properly. This is why you're seeing:
```
Access blocked: authorisation error
The OAuth client was not found.
```

## The Solution (Step by Step)

### 1. Create Google OAuth Credentials

**Go to Google Cloud Console**: https://console.cloud.google.com/

1. **Create or select a project**
2. **Enable required APIs**:
   - Go to "APIs & Services" > "Library"
   - Search for and enable: "Google+ API"
   - Also enable: "Google Identity Services API"

3. **Create OAuth 2.0 Client ID**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add these **Authorized redirect URIs**:
     ```
     http://localhost:8081
     http://localhost:19006
     ```

4. **Copy your Client ID** (it looks like: `123456789-abcd.apps.googleusercontent.com`)

### 2. Update Your .env File

1. Open the `.env` file in your project root
2. Replace this line:
   ```
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   ```
   With your actual Client ID:
   ```
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcd.apps.googleusercontent.com
   ```

### 3. Test the Fix

1. **Restart your development server**:
   ```bash
   npm run web
   ```

2. **Try logging in again** - you should now see the Google OAuth screen

## Expected Behavior

- You'll see a Google sign-in popup
- During development, Google will show "This app isn't verified"
- Click "Advanced" > "Go to ingredient-analyzer (unsafe)"
- Complete the sign-in process
- You should be logged into the app

## Still Need Help?

If you're still having issues:
1. Double-check your Client ID has no extra spaces
2. Make sure both APIs are enabled in Google Cloud Console
3. Verify the redirect URIs are exactly: `http://localhost:8081` and `http://localhost:19006`
4. Clear your browser cache and try again

---

**Note**: I've updated the code to show helpful error messages when OAuth is not configured properly. The app will now alert you if the Client ID is not set up correctly.
