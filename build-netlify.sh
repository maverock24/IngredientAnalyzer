#!/bin/bash

# Build script for Netlify that injects environment variables into the build

echo "🔧 Starting Netlify build with environment variable injection..."

# Check if environment variables are available
echo "📋 Environment variables check:"
echo "EXPO_PUBLIC_GOOGLE_CLIENT_ID: ${EXPO_PUBLIC_GOOGLE_CLIENT_ID:-'NOT_SET'}"
echo "REACT_APP_GOOGLE_CLIENT_ID: ${REACT_APP_GOOGLE_CLIENT_ID:-'NOT_SET'}"

# Get the client ID from any available source
CLIENT_ID="${EXPO_PUBLIC_GOOGLE_CLIENT_ID:-${REACT_APP_GOOGLE_CLIENT_ID:-'139734881985-1lbdr2gg837l09ui22nj4fvagh5ls3vu.apps.googleusercontent.com'}}"

echo "🎯 Using Client ID: $CLIENT_ID"

# Replace the placeholder in the environment config file
if [ -f "src/config/environment.ts" ]; then
    echo "🔄 Injecting Client ID into environment.ts..."
    sed -i "s/BUILD_TIME_GOOGLE_CLIENT_ID/$CLIENT_ID/g" src/config/environment.ts
    echo "✅ Client ID injected successfully"
else
    echo "❌ environment.ts not found"
fi

# Run the normal build
echo "🚀 Starting Expo build..."
npm run build

echo "✅ Build completed!"
