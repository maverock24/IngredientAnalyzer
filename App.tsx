import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainScreen from './src/screens/MainScreen';
import SetupScreen from './src/components/SetupScreen';

export default function App() {
  const [showSetup, setShowSetup] = useState(false); // Start with MainScreen

  const handleShowSetup = () => {
    setShowSetup(true);
  };

  const handleContinue = () => {
    setShowSetup(false);
  };

  return (
    <SafeAreaProvider>
      {showSetup ? (
        <SetupScreen onContinue={handleContinue} />
      ) : (
        <MainScreen onShowSetup={handleShowSetup} />
      )}
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
