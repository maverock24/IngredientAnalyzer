# 🚀 Netlify Production OAuth Setup

## The Problem

Your app works locally but shows "Google OAuth is not configured" on Netlify because:

1. Netlify doesn't have access to your local `.env` file
2. Your Google OAuth redirect URIs don't include the production URL

## Step 1: Add Production Redirect URI to Google Cloud Console

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Navigate to**: APIs & Services → Credentials
3. **Edit your OAuth 2.0 Client ID**
4. **In "Authorized redirect URIs", add**:
   ```
   https://check-that.netlify.app
   ```
   **Make sure you have BOTH**:
   - `http://localhost:8081` (for local development)
   - `https://check-that.netlify.app` (for production)

## Step 2: Set Environment Variables in Netlify

1. **Go to your Netlify dashboard**: https://app.netlify.com/
2. **Select your site** (`check-that`)
3. **Go to**: Site settings → Environment variables
4. **Add a new variable**:
   - **Key**: `EXPO_PUBLIC_GOOGLE_CLIENT_ID`
   - **Value**: `139734881985-1lbdr2gg837l09ui22nj4fvagh5ls3vu.apps.googleusercontent.com`
5. **Click "Save"**

## Step 3: Redeploy Your Site

After adding the environment variable:

1. **Go to**: Deploys tab in Netlify
2. **Click**: "Trigger deploy" → "Deploy site"
3. **Wait for deployment** to complete

## Step 4: Test Production OAuth

1. **Visit**: https://check-that.netlify.app/
2. **Click "Continue with Google"**
3. **You should now see the Google OAuth screen**

## Important Notes

- **Environment variables in Netlify** are separate from your local `.env` file
- **You must redeploy** after adding environment variables
- **Both redirect URIs** (local and production) should be in Google Cloud Console

## Troubleshooting

If it still doesn't work:

1. **Check Netlify build logs** for any environment variable issues
2. **Verify the environment variable** is set correctly in Netlify dashboard
3. **Make sure you redeployed** after adding the environment variable
4. **Check browser console** for any error messages

The OAuth should work on both:

- Local: `http://localhost:8081`
- Production: `https://check-that.netlify.app`
