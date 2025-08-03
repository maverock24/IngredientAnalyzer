import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Product } from "../types/Product";

interface ProductCardProps {
  product: Product;
  onRemove: () => void;
}

export default function ProductCard({ product, onRemove }: ProductCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#34C759";
    if (score >= 60) return "#FF9500";
    return "#FF3B30";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{product.name}</Text>
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <Image source={{ uri: product.imageUri }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Ingredients:</Text>
        <Text style={styles.ingredients}>{product.ingredients.join(", ")}</Text>

        {product.analysis && (
          <View style={styles.analysis}>
            <Text style={styles.sectionTitle}>Analysis:</Text>

            <View style={styles.scoresContainer}>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>Health</Text>
                <Text
                  style={[
                    styles.score,
                    { color: getScoreColor(product.analysis.healthScore) },
                  ]}
                >
                  {product.analysis.healthScore}/100
                </Text>
              </View>

              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>Sustainability</Text>
                <Text
                  style={[
                    styles.score,
                    {
                      color: getScoreColor(
                        product.analysis.sustainabilityScore
                      ),
                    },
                  ]}
                >
                  {product.analysis.sustainabilityScore}/100
                </Text>
              </View>

              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>Overall</Text>
                <Text
                  style={[
                    styles.score,
                    { color: getScoreColor(product.analysis.overallScore) },
                  ]}
                >
                  {product.analysis.overallScore}/100
                </Text>
              </View>
            </View>

            <Text style={styles.recommendation}>
              {product.analysis.recommendation}
            </Text>

            {product.analysis.healthNotes.length > 0 && (
              <View style={styles.notesSection}>
                <Text style={styles.notesTitle}>Health Notes:</Text>
                {product.analysis.healthNotes.map((note, index) => (
                  <Text key={index} style={styles.note}>
                    • {note}
                  </Text>
                ))}
              </View>
            )}

            {product.analysis.sustainabilityNotes.length > 0 && (
              <View style={styles.notesSection}>
                <Text style={styles.notesTitle}>Sustainability Notes:</Text>
                {product.analysis.sustainabilityNotes.map((note, index) => (
                  <Text key={index} style={styles.note}>
                    • {note}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  content: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  ingredients: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  analysis: {
    marginTop: 10,
  },
  scoresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  scoreItem: {
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
  },
  recommendation: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  notesSection: {
    marginBottom: 10,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  note: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginLeft: 5,
  },
});
