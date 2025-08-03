import * as AuthSession from "expo-auth-session";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function DebugInfo() {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "ingredient-analyzer",
  });

  const webRedirectUri = AuthSession.makeRedirectUri({});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OAuth Debug Info</Text>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.label}>Scheme-based Redirect URI:</Text>
        <Text style={styles.value}>{redirectUri}</Text>

        <Text style={styles.label}>Web Redirect URI:</Text>
        <Text style={styles.value}>{webRedirectUri}</Text>

        <Text style={styles.instructions}>
          Add BOTH of these URLs to your Google Cloud Console:
          {"\n\n"}
          1. Go to https://console.cloud.google.com/
          {"\n"}
          2. Navigate to APIs & Services {">"} Credentials
          {"\n"}
          3. Edit your OAuth 2.0 Client ID
          {"\n"}
          4. Add both URLs above to "Authorized redirect URIs"
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    color: "#333",
  },
  value: {
    fontSize: 14,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    fontFamily: "monospace",
    color: "#666",
  },
  instructions: {
    fontSize: 14,
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    lineHeight: 20,
  },
});
