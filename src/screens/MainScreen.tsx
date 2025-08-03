import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Product, ComparisonResult } from '../types/Product';
import { GeminiService } from '../services/GeminiService';
import ProductCard from '../components/ProductCard';
import ComparisonResults from '../components/ComparisonResults';

interface MainScreenProps {
  onShowSetup?: () => void;
}

export default function MainScreen({ onShowSetup }: MainScreenProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  // Get screen dimensions for responsive design
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isTablet = screenWidth >= 768;
  const isLandscape = screenWidth > screenHeight;
  
  // Calculate optimal content width (max 600px for mobile portrait, centered on larger screens)
  const contentWidth = Math.min(screenWidth, isTablet ? 600 : screenWidth);
  const horizontalPadding = (screenWidth - contentWidth) / 2;

  const addProduct = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photos.');
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
          const ingredients = await GeminiService.analyzeIngredients(asset.base64!);
          
          const newProduct: Product = {
            id: Date.now().toString(),
            name: `Product ${products.length + 1}`,
            imageUri: asset.uri,
            ingredients,
          };

          // Analyze the product
          const analysis = await GeminiService.analyzeProduct(newProduct);
          newProduct.analysis = analysis;

          setProducts(prev => [...prev, newProduct]);
          setComparisonResult(null); // Clear previous comparison
        } catch (error) {
          Alert.alert('Error', 'Failed to analyze the product. Please try again.');
          console.error('Error processing image:', error);
        } finally {
          setIsAnalyzing(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your camera.');
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
          const ingredients = await GeminiService.analyzeIngredients(asset.base64!);
          
          const newProduct: Product = {
            id: Date.now().toString(),
            name: `Product ${products.length + 1}`,
            imageUri: asset.uri,
            ingredients,
          };

          const analysis = await GeminiService.analyzeProduct(newProduct);
          newProduct.analysis = analysis;

          setProducts(prev => [...prev, newProduct]);
          setComparisonResult(null);
        } catch (error) {
          Alert.alert('Error', 'Failed to analyze the product. Please try again.');
          console.error('Error processing photo:', error);
        } finally {
          setIsAnalyzing(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const compareProducts = async () => {
    if (products.length < 2) {
      Alert.alert('Not Enough Products', 'Please add at least 2 products to compare.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await GeminiService.compareProducts(products);
      setComparisonResult(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to compare products. Please try again.');
      console.error('Error comparing products:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setComparisonResult(null);
  };

  const clearAll = () => {
    setProducts([]);
    setComparisonResult(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Ingredient Analyzer</Text>
              <Text style={styles.subtitle}>
                Compare products for health and sustainability
              </Text>
            </View>
            {onShowSetup && (
              <TouchableOpacity style={styles.setupButton} onPress={onShowSetup}>
                <Text style={styles.setupButtonText}>⚙️</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={takePhoto} disabled={isAnalyzing}>
            <Text style={styles.buttonText}>📷 Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={addProduct} disabled={isAnalyzing}>
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
              <Text style={styles.sectionTitle}>Products ({products.length})</Text>
              <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            
            {products.map(product => (
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

        {comparisonResult && (
          <ComparisonResults result={comparisonResult} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  setupButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupButtonText: {
    fontSize: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  productsContainer: {
    paddingHorizontal: 20,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
  },
  compareButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  compareButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
