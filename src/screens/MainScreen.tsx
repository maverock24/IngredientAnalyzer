import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ComparisonResults from "../components/ComparisonResults";
import ProductCard from "../components/ProductCard";
import UserProfile from "../components/UserProfile";
import { useAuth } from "../contexts/AuthContext";
import { GeminiService } from "../services/GeminiService";
import { ComparisonResult, Product } from "../types/Product";

interface MainScreenProps {
  onShowSetup?: () => void;
}

export default function MainScreen({ onShowSetup }: MainScreenProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  const { user } = useAuth();

  // Close profile modal when user signs out
  useEffect(() => {
    if (!user && showProfile) {
      setShowProfile(false);
    }
  }, [user, showProfile]);

  // Get screen dimensions for responsive design
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const isTablet = screenWidth >= 768;
  const isLandscape = screenWidth > screenHeight;

  // Calculate optimal content width (max 600px for mobile portrait, centered on larger screens)
  const contentWidth = Math.min(screenWidth, isTablet ? 600 : screenWidth);
  const horizontalPadding = (screenWidth - contentWidth) / 2;

  const addProduct = async () => {
    if (!user) {
      Alert.alert(
        "Authentication Required",
        "Please sign in to analyze products."
      );
      return;
    }

    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access your photos."
        );
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setIsAnalyzing(true);
        const asset = result.assets[0];

        try {
          // Extract ingredients using Gemini
          const ingredients = await GeminiService.analyzeIngredients(
            asset.base64!
          );

          const newProduct: Product = {
            id: Date.now().toString(),
            name: `Product ${products.length + 1}`,
            imageUri: asset.uri,
            ingredients,
          };

          // Analyze the product
          const analysis = await GeminiService.analyzeProduct(newProduct);
          newProduct.analysis = analysis;

          setProducts((prev) => [...prev, newProduct]);
          setComparisonResult(null); // Clear previous comparison
        } catch (error) {
          Alert.alert(
            "Error",
            "Failed to analyze the product. Please try again."
          );
          console.error("Error processing image:", error);
        } finally {
          setIsAnalyzing(false);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
      setIsAnalyzing(false);
    }
  };

  const takePhoto = async () => {
    if (!user) {
      Alert.alert(
        "Authentication Required",
        "Please sign in to analyze products."
      );
      return;
    }

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access your camera."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setIsAnalyzing(true);
        const asset = result.assets[0];

        try {
          const ingredients = await GeminiService.analyzeIngredients(
            asset.base64!
          );

          const newProduct: Product = {
            id: Date.now().toString(),
            name: `Product ${products.length + 1}`,
            imageUri: asset.uri,
            ingredients,
          };

          const analysis = await GeminiService.analyzeProduct(newProduct);
          newProduct.analysis = analysis;

          setProducts((prev) => [...prev, newProduct]);
          setComparisonResult(null);
        } catch (error) {
          Alert.alert(
            "Error",
            "Failed to analyze the product. Please try again."
          );
          console.error("Error processing photo:", error);
        } finally {
          setIsAnalyzing(false);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo. Please try again.");
      setIsAnalyzing(false);
    }
  };

  const compareProducts = async () => {
    if (!user) {
      Alert.alert(
        "Authentication Required",
        "Please sign in to compare products."
      );
      return;
    }

    if (products.length < 2) {
      Alert.alert(
        "Not Enough Products",
        "Please add at least 2 products to compare."
      );
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await GeminiService.compareProducts(products);
      setComparisonResult(result);
    } catch (error) {
      Alert.alert("Error", "Failed to compare products. Please try again.");
      console.error("Error comparing products:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setComparisonResult(null);
  };

  const clearAll = () => {
    setProducts([]);
    setComparisonResult(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.contentContainer,
            {
              width: contentWidth,
              marginHorizontal: horizontalPadding,
              paddingHorizontal: isTablet ? 0 : 20,
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.titleContainer}>
                <Text style={[styles.title, { fontSize: isTablet ? 32 : 28 }]}>
                  Ingredient Analyzer
                </Text>
                <Text
                  style={[styles.subtitle, { fontSize: isTablet ? 18 : 16 }]}
                >
                  Compare products for health and sustainability
                </Text>
              </View>
              <TouchableOpacity
                style={styles.userButton}
                onPress={() => setShowProfile(true)}
              >
                {user?.picture ? (
                  <Image
                    source={{ uri: user.picture }}
                    style={styles.userAvatar}
                  />
                ) : (
                  <View style={styles.userAvatarPlaceholder}>
                    <Text style={styles.userAvatarText}>
                      {user?.name?.charAt(0).toUpperCase() || "?"}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={takePhoto}
              disabled={isAnalyzing}
            >
              <Text style={styles.buttonText}>📷 Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={addProduct}
              disabled={isAnalyzing}
            >
              <Text style={styles.buttonText}>🖼️ Choose Image</Text>
            </TouchableOpacity>
          </View>

          {isAnalyzing && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Analyzing ingredients...</Text>
            </View>
          )}

          {products.length > 0 && (
            <View style={styles.productsContainer}>
              <View style={styles.productsHeader}>
                <Text style={styles.sectionTitle}>
                  Products ({products.length})
                </Text>
                <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
              </View>

              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onRemove={() => removeProduct(product.id)}
                />
              ))}

              {products.length >= 2 && (
                <TouchableOpacity
                  style={styles.compareButton}
                  onPress={compareProducts}
                  disabled={isAnalyzing}
                >
                  <Text style={styles.compareButtonText}>
                    🔍 Compare Products
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {comparisonResult && <ComparisonResults result={comparisonResult} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    maxWidth: 600, // Maximum width for optimal reading
    width: "100%",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 12,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  setupButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  setupButtonText: {
    fontSize: 18,
  },
  userButton: {
    padding: 2,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  userAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    marginBottom: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
    marginHorizontal: 8,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  productsContainer: {
    paddingHorizontal: 8,
  },
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "500",
  },
  compareButton: {
    backgroundColor: "#34C759",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
    marginHorizontal: 8,
    minHeight: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  compareButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
