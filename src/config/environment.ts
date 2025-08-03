// Environment configuration for production and development
// For Expo web builds, we need to hardcode values or use build-time injection

// Build-time configuration - this will be replaced during build
const GOOGLE_CLIENT_ID = 'BUILD_TIME_GOOGLE_CLIENT_ID';

export const config = {
  // Use hardcoded value for production or environment variables for development
  googleClientId: GOOGLE_CLIENT_ID !== 'BUILD_TIME_GOOGLE_CLIENT_ID' 
    ? GOOGLE_CLIENT_ID 
    : (process.env as any).EXPO_PUBLIC_GOOGLE_CLIENT_ID || 
      (process.env as any).REACT_APP_GOOGLE_CLIENT_ID ||
      '139734881985-1lbdr2gg837l09ui22nj4fvagh5ls3vu.apps.googleusercontent.com', // Fallback to actual ID
  
  // For debugging
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Log environment info
  logEnvironment: () => {
    console.log('Config loaded:', {
      googleClientId: config.googleClientId,
      buildTimeId: GOOGLE_CLIENT_ID,
      isDevelopment: config.isDevelopment,
      env: {
        EXPO_PUBLIC_GOOGLE_CLIENT_ID: (process.env as any).EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        REACT_APP_GOOGLE_CLIENT_ID: (process.env as any).REACT_APP_GOOGLE_CLIENT_ID,
        NODE_ENV: process.env.NODE_ENV
      }
    });
  }
};

// Auto-log in development
config.logEnvironment();
