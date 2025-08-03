import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SetupScreen from "./src/components/SetupScreen";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import LoginScreen from "./src/screens/LoginScreen";
import MainScreen from "./src/screens/MainScreen";

function AppContent() {
  const [showSetup, setShowSetup] = useState(false);
  const { user, isLoading } = useAuth();

  const handleShowSetup = () => {
    setShowSetup(true);
  };

  const handleContinue = () => {
    setShowSetup(false);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <>
      {showSetup ? (
        <SetupScreen onContinue={handleContinue} />
      ) : (
        <MainScreen onShowSetup={handleShowSetup} />
      )}
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
