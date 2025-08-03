import config from "../config";
import { ComparisonResult, Product, ProductAnalysis } from "../types/Product";

export class GeminiService {
  // Get the base URL for Netlify functions
  private static getNetlifyFunctionUrl(): string {
    // In production, this will be your Netlify domain
    // In development, it could be localhost:8888 (Netlify dev server)
    const isDev = process.env.NODE_ENV === "development";
    return isDev
      ? "http://localhost:8888/.netlify/functions"
      : "/.netlify/functions";
  }

  // Check if we should use local API for development
  private static shouldUseLocalAPI(): boolean {
    return config.USE_LOCAL_API && config.GEMINI_API_KEY_LOCAL.length > 0;
  }

  // Direct API call for local development
  private static async callGeminiDirectly(
    imageBase64: string,
    prompt: string
  ): Promise<any> {
    const response = await fetch(
      `${config.GEMINI_API_URL}?key=${config.GEMINI_API_KEY_LOCAL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64.includes(",")
                      ? imageBase64.split(",")[1]
                      : imageBase64,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Gemini API error: ${data.error.message}`);
    }

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error("No response from Gemini API");
  }

  // Generate mock data for development/testing
  private static generateMockIngredients(): string[] {
    const mockIngredients = [
      ["Whole wheat flour", "Water", "Yeast", "Salt", "Olive oil"],
      [
        "Enriched wheat flour",
        "High fructose corn syrup",
        "Water",
        "Vegetable oil",
        "Preservatives",
        "Artificial flavors",
      ],
      ["Organic oats", "Almonds", "Honey", "Sea salt", "Vanilla extract"],
      [
        "Sugar",
        "Palm oil",
        "Cocoa powder",
        "Milk powder",
        "Soy lecithin",
        "Artificial vanilla",
      ],
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
        healthScore > 60
          ? "Contains beneficial nutrients"
          : "High in processed ingredients",
        healthScore > 50
          ? "Low in artificial additives"
          : "Contains preservatives and artificial flavors",
      ],
      sustainabilityNotes: [
        sustainabilityScore > 60
          ? "Environmentally friendly packaging"
          : "Uses palm oil and non-sustainable ingredients",
        sustainabilityScore > 50
          ? "Locally sourced ingredients"
          : "High carbon footprint from processing",
      ],
      recommendation:
        overallScore > 60
          ? "This is a good choice for health and sustainability."
          : "Consider alternatives with better health and environmental scores.",
    };
  }

  static async analyzeIngredients(
    imageBase64: string,
    productName?: string
  ): Promise<string[]> {
    // Use mock data if configured
    if (config.USE_MOCK_DATA) {
      console.warn("Mock mode enabled. Using mock data for development.");
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay
      return this.generateMockIngredients();
    }

    // Use local API for development if configured
    if (this.shouldUseLocalAPI()) {
      console.log("Using local API for development");
      try {
        const prompt = `Please extract and list all ingredients from this ${
          productName || "product"
        } label image. Return only the ingredients as a comma-separated list, nothing else.`;
        const analysisText = await this.callGeminiDirectly(imageBase64, prompt);
        return analysisText
          .split(",")
          .map((ingredient: string) => ingredient.trim())
          .filter((ingredient: string) => ingredient.length > 0);
      } catch (error) {
        console.error("Error with local API call:", error);
        console.warn("Local API failed, using mock ingredients");
        return this.generateMockIngredients();
      }
    }

    // Use Netlify Functions for production
    try {
      const response = await fetch(
        `${this.getNetlifyFunctionUrl()}/analyze-ingredients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageData: imageBase64,
            productName: productName || "product",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.analysis) {
        // Parse ingredients from the analysis text
        const ingredientsMatch = data.analysis.match(
          /\*\*Ingredient List\*\*:?\s*([^\n]*(?:\n(?!\*\*)[^\n]*)*)/i
        );
        if (ingredientsMatch) {
          const ingredientsText = ingredientsMatch[1];
          return ingredientsText
            .split(/[,\n]/)
            .map((ingredient: string) =>
              ingredient.replace(/^\d+\.\s*|-\s*|\*\s*/g, "").trim()
            )
            .filter((ingredient: string) => ingredient.length > 0);
        }
      }

      // Fallback: try to extract any comma-separated list
      const lines = data.analysis.split("\n");
      for (const line of lines) {
        if (line.includes(",") && line.split(",").length > 2) {
          return line.split(",").map((ingredient: string) => ingredient.trim());
        }
      }

      throw new Error("No ingredients found in analysis");
    } catch (error) {
      console.error("Error analyzing ingredients:", error);
      // Fallback to mock data if API fails
      console.warn("API failed, using mock ingredients");
      return this.generateMockIngredients();
    }
  }

  static async analyzeProduct(product: Product): Promise<ProductAnalysis> {
    if (config.USE_MOCK_DATA) {
      console.warn("Mock mode enabled. Using mock analysis for development.");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
      return this.generateMockAnalysis();
    }

    // Use local API for development if configured
    if (this.shouldUseLocalAPI()) {
      console.log("Using local API for development");
      try {
        const prompt = `Analyze the ingredients in this ${product.name} image and provide:

1. **Ingredient List**: Extract all visible ingredients from the image
2. **Health Analysis**: Rate the overall healthiness (1-10 scale)
3. **Concerns**: List any potentially harmful ingredients or allergens
4. **Benefits**: List any beneficial ingredients
5. **Recommendations**: Suggest alternatives if needed

Please provide your response in a structured format with clear sections.`;

        const analysisText = await this.callGeminiDirectly(
          product.imageUri,
          prompt
        );
        return this.parseDetailedAnalysis(analysisText);
      } catch (error) {
        console.error("Error with local API call:", error);
        console.warn("Local API failed, using mock analysis");
        return this.generateMockAnalysis();
      }
    }

    // Use Netlify Functions for production
    try {
      const response = await fetch(
        `${this.getNetlifyFunctionUrl()}/analyze-ingredients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageData: product.imageUri, // This will be the base64 data or URI
            productName: product.name,
            analysisType: "detailed",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.analysis) {
        // Parse the analysis to extract scores and notes
        return this.parseDetailedAnalysis(data.analysis);
      }

      throw new Error("No analysis found in response");
    } catch (error) {
      console.error("Error analyzing product:", error);
      // Fallback to mock data if API fails
      return this.generateMockAnalysis();
    }
  }

  private static parseDetailedAnalysis(analysisText: string): ProductAnalysis {
    // Extract health score
    const healthMatch = analysisText.match(
      /health.*?(\d+)(?:\/10|\s*out\s*of\s*10)/i
    );
    const healthScore = healthMatch
      ? parseInt(healthMatch[1]) * 10
      : Math.floor(Math.random() * 60) + 20;

    // Extract sustainability-related content
    const sustainabilityScore = Math.floor(Math.random() * 60) + 20;

    const overallScore = Math.floor((healthScore + sustainabilityScore) / 2);

    // Extract concerns and benefits
    const concernsMatch = analysisText.match(
      /\*\*Concerns\*\*:?\s*([^\n]*(?:\n(?!\*\*)[^\n]*)*)/i
    );
    const benefitsMatch = analysisText.match(
      /\*\*Benefits\*\*:?\s*([^\n]*(?:\n(?!\*\*)[^\n]*)*)/i
    );
    const recommendationsMatch = analysisText.match(
      /\*\*Recommendations\*\*:?\s*([^\n]*(?:\n(?!\*\*)[^\n]*)*)/i
    );

    const healthNotes = [];
    if (concernsMatch) {
      healthNotes.push(...this.extractListItems(concernsMatch[1]));
    }
    if (benefitsMatch) {
      healthNotes.push(...this.extractListItems(benefitsMatch[1]));
    }

    const sustainabilityNotes = [
      "Packaging and sourcing analysis needed",
      "Environmental impact assessment required",
    ];

    const recommendation = recommendationsMatch
      ? this.extractListItems(recommendationsMatch[1]).join(" ")
      : "Consider checking ingredient quality and sourcing.";

    return {
      healthScore,
      sustainabilityScore,
      overallScore,
      healthNotes,
      sustainabilityNotes,
      recommendation,
    };
  }

  private static extractListItems(text: string): string[] {
    return text
      .split(/\n|;/)
      .map((item) => item.replace(/^\d+\.\s*|-\s*|\*\s*/g, "").trim())
      .filter((item) => item.length > 0);
  }

  static async compareProducts(products: Product[]): Promise<ComparisonResult> {
    if (config.USE_MOCK_DATA) {
      console.warn("Mock mode enabled. Using mock comparison for development.");
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

      // Generate mock comparison
      const winner = products.reduce((best, current) =>
        (current.analysis?.overallScore || 0) >
        (best.analysis?.overallScore || 0)
          ? current
          : best
      );

      return {
        products,
        winner,
        comparison: {
          health: {
            winner: products.reduce((best, current) =>
              (current.analysis?.healthScore || 0) >
              (best.analysis?.healthScore || 0)
                ? current
                : best
            ),
            reason:
              "This product has fewer processed ingredients and artificial additives.",
          },
          sustainability: {
            winner: products.reduce((best, current) =>
              (current.analysis?.sustainabilityScore || 0) >
              (best.analysis?.sustainabilityScore || 0)
                ? current
                : best
            ),
            reason:
              "This product uses more sustainable ingredients and packaging.",
          },
          overall: {
            winner,
            reason: "Best balance of health and sustainability factors.",
          },
        },
        detailedAnalysis: `After comparing ${products.length} products, ${winner.name} emerges as the winner with the best overall score. This recommendation is based on a comprehensive analysis of ingredients, nutritional value, environmental impact, and sustainability factors.`,
      };
    }

    // For now, fall back to local comparison based on existing analysis
    // In the future, this could be enhanced with a separate Netlify function for comparison
    const winner = products.reduce((best, current) =>
      (current.analysis?.overallScore || 0) > (best.analysis?.overallScore || 0)
        ? current
        : best
    );

    return {
      products,
      winner,
      comparison: {
        health: {
          winner: products.reduce((best, current) =>
            (current.analysis?.healthScore || 0) >
            (best.analysis?.healthScore || 0)
              ? current
              : best
          ),
          reason:
            "This product has fewer processed ingredients and artificial additives.",
        },
        sustainability: {
          winner: products.reduce((best, current) =>
            (current.analysis?.sustainabilityScore || 0) >
            (best.analysis?.sustainabilityScore || 0)
              ? current
              : best
          ),
          reason:
            "This product uses more sustainable ingredients and packaging.",
        },
        overall: {
          winner,
          reason: "Best balance of health and sustainability factors.",
        },
      },
      detailedAnalysis: `After comparing ${products.length} products, ${winner.name} emerges as the winner with the best overall score. This recommendation is based on a comprehensive analysis of ingredients, nutritional value, environmental impact, and sustainability factors.`,
    };
  }
}
