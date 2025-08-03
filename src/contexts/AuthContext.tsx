import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { config } from '../config/environment';

// Configure WebBrowser for better OAuth experience
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Google OAuth configuration
const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get client ID from configuration
  const clientId = config.googleClientId;

  // Log environment check for debugging
  config.logEnvironment();

  // Check if client ID is properly configured
  const isClientIdConfigured = clientId !== "your-google-client-id";

  // Use Expo's default redirect URI which handles COOP correctly
  const redirectUri = AuthSession.makeRedirectUri({
    preferLocalhost: true, // This helps with COOP issues
  });

  console.log("Using redirect URI:", redirectUri); // Debug log
  console.log("Client ID:", clientId); // Debug log

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ["openid", "profile", "email"],
      redirectUri,
      responseType: AuthSession.ResponseType.Token, // Use implicit flow to avoid client secret requirement
      usePKCE: false, // Explicitly disable PKCE for implicit flow
      extraParams: {
        // Ensure we're using the right flow
        prompt: "select_account",
      },
    },
    discovery
  );

  // Check for existing session on app start
  useEffect(() => {
    checkAuthState();
  }, []);

  // Handle auth response
  useEffect(() => {
    if (response?.type === "success") {
      if (response.params.access_token) {
        // Direct access token from implicit flow
        fetchUserInfo(response.params.access_token);
      } else {
        console.error("No access token in response:", response.params);
        alert("Authentication failed: No access token received");
        setIsLoading(false);
      }
    } else if (response?.type === "error") {
      console.error("Auth error:", response.error);
      alert(
        `Authentication failed: ${response.error?.message || "Unknown error"}`
      );
      setIsLoading(false);
    } else if (response?.type === "cancel") {
      console.log("User cancelled authentication");
      setIsLoading(false);
    }
  }, [response]);

  const checkAuthState = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserInfo = async (accessToken: string) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.ok) {
        const userInfo = await response.json();
        const user: User = {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
        };

        setUser(user);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("accessToken", accessToken);
      } else {
        throw new Error("Failed to fetch user info");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async () => {
    try {
      setIsLoading(true);

      // Check if Google Client ID is configured
      if (!isClientIdConfigured) {
        alert(
          "Google OAuth is not configured. Please follow the setup instructions in GOOGLE_OAUTH_QUICK_SETUP.md"
        );
        setIsLoading(false);
        return;
      }

      console.log("Starting OAuth flow with redirect URI:", redirectUri);
      const result = await promptAsync();
      console.log("OAuth result:", result);

      // The response will be handled by the useEffect above
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Sign in failed. Please check your Google OAuth configuration.");
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    console.log("🔓 signOut function called"); // Debug log
    try {
      console.log("Starting sign out process...");
      setIsLoading(true);

      // Clear user state first
      console.log("Clearing user state...");
      setUser(null);

      // Clear stored data
      console.log("Clearing AsyncStorage...");
      await AsyncStorage.multiRemove(["user", "accessToken"]);
      console.log("User data cleared successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      // Even if there's an error clearing storage, we should still sign out the user
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log("Sign out completed");
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
