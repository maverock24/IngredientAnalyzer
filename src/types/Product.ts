export interface Product {
  id: string;
  name: string;
  imageUri: string;
  ingredients: string[];
  analysis?: ProductAnalysis;
}

export interface ProductAnalysis {
  healthScore: number;
  sustainabilityScore: number;
  overallScore: number;
  healthNotes: string[];
  sustainabilityNotes: string[];
  recommendation: string;
}

export interface ComparisonResult {
  products: Product[];
  winner: Product;
  comparison: {
    health: {
      winner: Product;
      reason: string;
    };
    sustainability: {
      winner: Product;
      reason: string;
    };
    overall: {
      winner: Product;
      reason: string;
    };
  };
  detailedAnalysis: string;
}
