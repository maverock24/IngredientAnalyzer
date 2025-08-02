# Ingredient Analyzer - Quick Start Guide

## 🎯 What This App Does

The Ingredient Analyzer is a React Native Expo app that:
- Takes photos of product ingredient lists
- Uses Google Gemini AI to extract and analyze ingredients
- Provides health and sustainability scores
- Compares multiple products to recommend the best choice

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd IngredientAnalyzer
npm install
```

### 2. Choose Your Setup Mode

#### Option A: Full AI Experience (Recommended)
1. Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Open `src/config/index.ts`
3. Replace `'YOUR_GEMINI_API_KEY_HERE'` with your actual API key

#### Option B: Demo Mode (No API Key Required)
1. Open `src/config/index.ts`
2. Set `USE_MOCK_DATA: true`
3. The app will work with realistic mock data

### 3. Start the App
```bash
npm start
```

Then scan the QR code with Expo Go app or run on simulator.

## 📱 How to Use

1. **Welcome Screen**: Choose your setup option and continue
2. **Take Photos**: Use "Take Photo" or "Choose Image" to capture ingredient lists
3. **Wait for Analysis**: The app extracts ingredients and analyzes them
4. **Add More Products**: Repeat for 2+ products to enable comparison
5. **Compare**: Tap "Compare Products" to see detailed analysis
6. **Review Results**: See winner, scores, and detailed recommendations

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ProductCard.tsx      # Individual product display
│   ├── ComparisonResults.tsx # Comparison results
│   └── SetupScreen.tsx      # Initial setup guide
├── screens/
│   └── MainScreen.tsx       # Main app interface
├── services/
│   └── GeminiService.ts     # Gemini AI integration
├── types/
│   └── Product.ts           # TypeScript interfaces
└── config/
    └── index.ts             # App configuration
```

## 🔧 Configuration Options

In `src/config/index.ts`:

```typescript
export const config = {
  GEMINI_API_KEY: 'your-key-here',  // Your Gemini API key
  USE_MOCK_DATA: false,             // Set true for demo mode
  MAX_PRODUCTS: 5,                  // Max products to compare
  IMAGE_QUALITY: 0.8,               // Image compression (0-1)
};
```

## 🧪 Development Features

- **Mock Data Mode**: Test without API key using realistic sample data
- **Error Handling**: Graceful fallbacks if API fails
- **TypeScript**: Full type safety throughout the app
- **Responsive Design**: Works on all screen sizes
- **Performance**: Optimized image handling and API calls

## 📊 Analysis Features

### Product Scoring (0-100)
- **Health Score**: Based on nutritional value, additives, processing
- **Sustainability Score**: Environmental impact, packaging, sourcing
- **Overall Score**: Weighted combination of health and sustainability

### Comparison Results
- Overall winner with detailed explanation
- Category winners (health vs sustainability)
- Side-by-side score visualization
- Comprehensive analysis report

## 🔒 Security & Privacy

- API keys are stored locally (never transmitted except to Google)
- Images are processed temporarily and not stored
- No personal data collection
- All analysis happens on-device or via secure Google APIs

## 🛠️ Troubleshooting

### Camera/Gallery Issues
- Grant camera and gallery permissions when prompted
- Test on physical device for best camera experience
- Ensure good lighting for ingredient list photos

### API Issues
- Verify API key is correct in config file
- Check internet connection
- Monitor API usage in Google AI Studio
- Use mock mode for testing without API limits

### Build Issues
- Clear Expo cache: `expo r -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Update Expo CLI: `npm install -g @expo/cli@latest`

## 🎨 Customization

### Adding New Features
1. Create components in `src/components/`
2. Add new screens in `src/screens/`
3. Extend types in `src/types/`
4. Modify analysis logic in `src/services/`

### Styling
- All styles are in component files using StyleSheet
- Uses consistent color scheme and spacing
- Responsive design principles applied

## 📝 Next Steps

Potential enhancements:
- Barcode scanning for automatic product identification
- Historical comparison tracking
- Export analysis reports
- Additional AI providers
- Offline mode with cached analyses

## 📄 License

This project is for educational and demonstration purposes.
