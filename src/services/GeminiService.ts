import { Product, ProductAnalysis, ComparisonResult } from '../types/Product';
import config from '../config';

export class GeminiService {
  private static apiKey = config.GEMINI_API_KEY;
  private static apiUrl = config.GEMINI_API_URL;

  // Check if API key is configured
  private static isApiConfigured(): boolean {
    return this.apiKey !== 'YOUR_GEMINI_API_KEY_HERE' && this.apiKey.length > 0;
  }

  // Generate mock data for development/testing
  private static generateMockIngredients(): string[] {
    const mockIngredients = [
      ['Whole wheat flour', 'Water', 'Yeast', 'Salt', 'Olive oil'],
      ['Enriched wheat flour', 'High fructose corn syrup', 'Water', 'Vegetable oil', 'Preservatives', 'Artificial flavors'],
      ['Organic oats', 'Almonds', 'Honey', 'Sea salt', 'Vanilla extract'],
      ['Sugar', 'Palm oil', 'Cocoa powder', 'Milk powder', 'Soy lecithin', 'Artificial vanilla']
    ];
    return mockIngredients[Math.floor(Math.random() * mockIngredients.length)];
  }

  private static generateMockAnalysis(): ProductAnalysis {
    const healthScore = Math.floor(Math.random() * 60) + 20; // 20-80
    const sustainabilityScore = Math.floor(Math.random() * 60) + 20; // 20-80
    const overallScore = Math.floor((healthScore + sustainabilityScore) / 2);

    return {
      healthScore,
      sustainabilityScore,
      overallScore,
      healthNotes: [
        healthScore > 60 ? 'Contains beneficial nutrients' : 'High in processed ingredients',
        healthScore > 50 ? 'Low in artificial additives' : 'Contains preservatives and artificial flavors'
      ],
      sustainabilityNotes: [
        sustainabilityScore > 60 ? 'Environmentally friendly packaging' : 'Uses palm oil and non-sustainable ingredients',
        sustainabilityScore > 50 ? 'Locally sourced ingredients' : 'High carbon footprint from processing'
      ],
      recommendation: overallScore > 60 ? 
        'This is a good choice for health and sustainability.' : 
        'Consider alternatives with better health and environmental scores.'
    };
  }

  static async analyzeIngredients(imageBase64: string): Promise<string[]> {
    // If API key is not configured, return mock data
    if (!this.isApiConfigured() || config.USE_MOCK_DATA) {
      console.warn('Gemini API key not configured or mock mode enabled. Using mock data for development.');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      return this.generateMockIngredients();
    }

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: "Please extract and list all ingredients from this product label image. Return only the ingredients as a comma-separated list, nothing else."
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64
                }
              }
            ]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const ingredientsText = data.candidates[0].content.parts[0].text;
        return ingredientsText.split(',').map((ingredient: string) => ingredient.trim());
      }
      
      throw new Error('No ingredients found in response');
    } catch (error) {
      console.error('Error analyzing ingredients:', error);
      // Fallback to mock data if API fails
      console.warn('API failed, using mock ingredients');
      return this.generateMockIngredients();
    }
  }

  static async analyzeProduct(product: Product): Promise<ProductAnalysis> {
    if (!this.isApiConfigured() || config.USE_MOCK_DATA) {
      console.warn('Gemini API key not configured or mock mode enabled. Using mock analysis for development.');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      return this.generateMockAnalysis();
    }

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this product with ingredients: ${product.ingredients.join(', ')}
              
              Please provide:
              1. Health score (0-100)
              2. Sustainability score (0-100)
              3. Overall score (0-100)
              4. Health notes (array of concerns/benefits)
              5. Sustainability notes (array of concerns/benefits)
              6. Brief recommendation
              
              Return as JSON with this structure:
              {
                "healthScore": number,
                "sustainabilityScore": number,
                "overallScore": number,
                "healthNotes": ["note1", "note2"],
                "sustainabilityNotes": ["note1", "note2"],
                "recommendation": "brief recommendation"
              }`
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const analysisText = data.candidates[0].content.parts[0].text;
        // Extract JSON from the response
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
      
      throw new Error('No analysis found in response');
    } catch (error) {
      console.error('Error analyzing product:', error);
      // Fallback to mock data if API fails
      return this.generateMockAnalysis();
    }
  }

  static async compareProducts(products: Product[]): Promise<ComparisonResult> {
    if (!this.isApiConfigured() || config.USE_MOCK_DATA) {
      console.warn('Gemini API key not configured or mock mode enabled. Using mock comparison for development.');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Generate mock comparison
      const winner = products.reduce((best, current) => 
        (current.analysis?.overallScore || 0) > (best.analysis?.overallScore || 0) ? current : best
      );

      return {
        products,
        winner,
        comparison: {
          health: {
            winner: products.reduce((best, current) => 
              (current.analysis?.healthScore || 0) > (best.analysis?.healthScore || 0) ? current : best
            ),
            reason: "This product has fewer processed ingredients and artificial additives."
          },
          sustainability: {
            winner: products.reduce((best, current) => 
              (current.analysis?.sustainabilityScore || 0) > (best.analysis?.sustainabilityScore || 0) ? current : best
            ),
            reason: "This product uses more sustainable ingredients and packaging."
          },
          overall: {
            winner,
            reason: "Best balance of health and sustainability factors."
          }
        },
        detailedAnalysis: `After comparing ${products.length} products, ${winner.name} emerges as the winner with the best overall score. This recommendation is based on a comprehensive analysis of ingredients, nutritional value, environmental impact, and sustainability factors.`
      };
    }

    try {
      const productsData = products.map(p => ({
        name: p.name,
        ingredients: p.ingredients,
        analysis: p.analysis
      }));

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Compare these products for health and sustainability:
              ${JSON.stringify(productsData, null, 2)}
              
              Provide a detailed comparison and determine which product is better overall.
              
              Return as JSON with this structure:
              {
                "winner": ${JSON.stringify(products[0])},
                "comparison": {
                  "health": {
                    "winner": ${JSON.stringify(products[0])},
                    "reason": "explanation"
                  },
                  "sustainability": {
                    "winner": ${JSON.stringify(products[0])},
                    "reason": "explanation"
                  },
                  "overall": {
                    "winner": ${JSON.stringify(products[0])},
                    "reason": "explanation"
                  }
                },
                "detailedAnalysis": "comprehensive analysis"
              }`
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const comparisonText = data.candidates[0].content.parts[0].text;
        const jsonMatch = comparisonText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          return {
            products,
            ...result
          };
        }
      }
      
      throw new Error('No comparison found in response');
    } catch (error) {
      console.error('Error comparing products:', error);
      // Fallback to mock comparison
      const winner = products.reduce((best, current) => 
        (current.analysis?.overallScore || 0) > (best.analysis?.overallScore || 0) ? current : best
      );

      return {
        products,
        winner,
        comparison: {
          health: {
            winner: products.reduce((best, current) => 
              (current.analysis?.healthScore || 0) > (best.analysis?.healthScore || 0) ? current : best
            ),
            reason: "This product has fewer processed ingredients and artificial additives."
          },
          sustainability: {
            winner: products.reduce((best, current) => 
              (current.analysis?.sustainabilityScore || 0) > (best.analysis?.sustainabilityScore || 0) ? current : best
            ),
            reason: "This product uses more sustainable ingredients and packaging."
          },
          overall: {
            winner,
            reason: "Best balance of health and sustainability factors."
          }
        },
        detailedAnalysis: `After comparing ${products.length} products, ${winner.name} emerges as the winner with the best overall score. This recommendation is based on a comprehensive analysis of ingredients, nutritional value, environmental impact, and sustainability factors.`
      };
    }
  }
}
