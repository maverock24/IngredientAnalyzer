import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { ComparisonResult } from '../types/Product';

interface ComparisonResultsProps {
  result: ComparisonResult;
}

export default function ComparisonResults({ result }: ComparisonResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#34C759';
    if (score >= 60) return '#FF9500';
    return '#FF3B30';
  };

  const renderWinnerCard = (title: string, winner: any, reason: string) => (
    <View style={styles.winnerCard}>
      <Text style={styles.winnerTitle}>{title} Winner</Text>
      <View style={styles.winnerContent}>
        <Image source={{ uri: winner.imageUri }} style={styles.winnerImage} />
        <View style={styles.winnerInfo}>
          <Text style={styles.winnerName}>{winner.name}</Text>
          <Text style={styles.winnerReason}>{reason}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Comparison Results</Text>
      
      {/* Overall Winner */}
      <View style={styles.overallWinner}>
        <Text style={styles.overallTitle}>🥇 Overall Winner</Text>
        <View style={styles.winnerContent}>
          <Image source={{ uri: result.winner.imageUri }} style={styles.winnerImage} />
          <View style={styles.winnerInfo}>
            <Text style={styles.winnerName}>{result.winner.name}</Text>
            <Text style={styles.winnerReason}>{result.comparison.overall.reason}</Text>
          </View>
        </View>
      </View>

      {/* Category Winners */}
      <View style={styles.categoryWinners}>
        {renderWinnerCard('🏥 Health', result.comparison.health.winner, result.comparison.health.reason)}
        {renderWinnerCard('🌱 Sustainability', result.comparison.sustainability.winner, result.comparison.sustainability.reason)}
      </View>

      {/* Product Comparison */}
      <View style={styles.productComparison}>
        <Text style={styles.sectionTitle}>Product Comparison</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {result.products.map((product, index) => (
            <View key={product.id} style={styles.comparisonCard}>
              <Image source={{ uri: product.imageUri }} style={styles.productImage} />
              <Text style={styles.productName}>{product.name}</Text>
              
              {product.analysis && (
                <View style={styles.scores}>
                  <View style={styles.scoreRow}>
                    <Text style={styles.scoreLabel}>Health:</Text>
                    <Text style={[styles.scoreValue, { color: getScoreColor(product.analysis.healthScore) }]}>
                      {product.analysis.healthScore}
                    </Text>
                  </View>
                  <View style={styles.scoreRow}>
                    <Text style={styles.scoreLabel}>Sustainability:</Text>
                    <Text style={[styles.scoreValue, { color: getScoreColor(product.analysis.sustainabilityScore) }]}>
                      {product.analysis.sustainabilityScore}
                    </Text>
                  </View>
                  <View style={styles.scoreRow}>
                    <Text style={styles.scoreLabel}>Overall:</Text>
                    <Text style={[styles.scoreValue, { color: getScoreColor(product.analysis.overallScore) }]}>
                      {product.analysis.overallScore}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Detailed Analysis */}
      <View style={styles.detailedAnalysis}>
        <Text style={styles.sectionTitle}>📊 Detailed Analysis</Text>
        <Text style={styles.analysisText}>{result.detailedAnalysis}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  overallWinner: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  overallTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  categoryWinners: {
    marginBottom: 20,
  },
  winnerCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  winnerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  winnerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  winnerImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  winnerInfo: {
    flex: 1,
  },
  winnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  winnerReason: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  productComparison: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  comparisonCard: {
    width: 150,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
  },
  productImage: {
    width: '100%',
    height: 80,
    borderRadius: 6,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  scores: {
    gap: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
  },
  scoreValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailedAnalysis: {
    marginTop: 10,
  },
  analysisText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
});
