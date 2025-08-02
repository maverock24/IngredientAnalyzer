import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { setupInstructions } from '../config';

interface SetupScreenProps {
  onContinue: () => void;
}

export default function SetupScreen({ onContinue }: SetupScreenProps) {
  const openGeminiStudio = () => {
    Linking.openURL('https://aistudio.google.com/app/apikey');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>🚀 Welcome to Ingredient Analyzer</Text>
        
        <Text style={styles.description}>
          This app analyzes product ingredients using Google's Gemini AI to help you make 
          healthier and more sustainable choices.
        </Text>

        <View style={styles.setupSection}>
          <Text style={styles.sectionTitle}>⚙️ Setup Options</Text>
          
          <View style={styles.optionCard}>
            <Text style={styles.optionTitle}>Option 1: Use with Gemini AI (Recommended)</Text>
            <Text style={styles.optionDescription}>
              Get real AI-powered analysis of your product images.
            </Text>
            
            <TouchableOpacity style={styles.linkButton} onPress={openGeminiStudio}>
              <Text style={styles.linkButtonText}>🔗 Get Gemini API Key</Text>
            </TouchableOpacity>
            
            <Text style={styles.steps}>
              1. Click the link above{'\n'}
              2. Create a new API key{'\n'}
              3. Copy and paste it into src/config/index.ts{'\n'}
              4. Replace 'YOUR_GEMINI_API_KEY_HERE' with your key
            </Text>
          </View>

          <View style={styles.optionCard}>
            <Text style={styles.optionTitle}>Option 2: Try with Mock Data</Text>
            <Text style={styles.optionDescription}>
              Test the app functionality with sample data (no API key needed).
            </Text>
            
            <Text style={styles.steps}>
              1. Open src/config/index.ts{'\n'}
              2. Set USE_MOCK_DATA to true{'\n'}
              3. The app will work with sample ingredient data
            </Text>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>✨ Features</Text>
          <Text style={styles.feature}>📷 Camera & gallery image capture</Text>
          <Text style={styles.feature}>🤖 AI-powered ingredient extraction</Text>
          <Text style={styles.feature}>📊 Health & sustainability scoring</Text>
          <Text style={styles.feature}>🔍 Product comparison analysis</Text>
          <Text style={styles.feature}>📱 Beautiful mobile interface</Text>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
          <Text style={styles.continueButtonText}>Continue to App</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          💡 Tip: You can always return to setup by editing the configuration files.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  setupSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  linkButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  steps: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  featuresSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feature: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    paddingLeft: 10,
  },
  continueButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  note: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
