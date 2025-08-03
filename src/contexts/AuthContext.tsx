import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Complete the auth session for web
WebBrowser.maybeCompleteAuthSession();

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Google OAuth configuration
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get client ID from environment variable or use placeholder for development
  const clientId = (process.env as any).EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id';

  // Check if client ID is properly configured
  const isClientIdConfigured = clientId !== 'your-google-client-id';

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'ingredient-analyzer',
      }),
    },
    discovery
  );

  // Check for existing session on app start
  useEffect(() => {
    checkAuthState();
  }, []);

  // Handle auth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        fetchUserInfo(authentication.accessToken);
      }
    } else if (response?.type === 'error') {
      console.error('Auth error:', response.error);
      setIsLoading(false);
    }
  }, [response]);

  const checkAuthState = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserInfo = async (accessToken: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (response.ok) {
        const userInfo = await response.json();
        const user: User = {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
        };
        
        setUser(user);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('accessToken', accessToken);
      } else {
        throw new Error('Failed to fetch user info');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async () => {
    try {
      setIsLoading(true);
      
      // Check if Google Client ID is configured
      if (!isClientIdConfigured) {
        alert('Google OAuth is not configured. Please follow the setup instructions in GOOGLE_OAUTH_QUICK_SETUP.md');
        return;
      }
      
      await promptAsync();
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Sign in failed. Please check your Google OAuth configuration.');
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      setUser(null);
      await AsyncStorage.multiRemove(['user', 'accessToken']);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
