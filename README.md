# Ingredient Analyzer

A React Native Expo app that allows users to take pictures of product ingredient lists and uses Google's Gemini AI to analyze and compare products for health and sustainability.

## Features

- 📷 Take photos or select images of product ingredient lists
- 🤖 AI-powered ingredient extraction using Google Gemini API
- 📊 Health and sustainability analysis for each product
- 🔍 Side-by-side product comparison
- 📱 Beautiful and intuitive mobile interface

## Setup Instructions

### 1. Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- A Google AI Studio account for Gemini API access

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the API key for the next step

### 3. Configure API Key

1. Open `src/services/GeminiService.ts`
2. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual Gemini API key:

```typescript
const GEMINI_API_KEY = 'your-actual-api-key-here';
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Start the Development Server

```bash
npm start
```

This will open the Expo Developer Tools in your browser. You can then:

- Scan the QR code with the Expo Go app (iOS/Android)
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Press `w` to open in web browser

## How to Use

1. **Add Products**: Tap "Take Photo" to capture an ingredient list or "Choose Image" to select from your gallery
2. **Wait for Analysis**: The app will extract ingredients and analyze the product for health and sustainability
3. **Compare Products**: Once you have 2 or more products, tap "Compare Products" to see a detailed comparison
4. **View Results**: See which product is recommended and why, with detailed scoring and analysis

## Project Structure

```
src/
├── components/
│   ├── ProductCard.tsx      # Individual product display
│   └── ComparisonResults.tsx # Comparison results display
├── screens/
│   └── MainScreen.tsx       # Main app screen
├── services/
│   └── GeminiService.ts     # Gemini API integration
└── types/
    └── Product.ts           # TypeScript interfaces
```

## Technologies Used

- **React Native** with **Expo** - Cross-platform mobile development
- **TypeScript** - Type safety and better development experience
- **Expo Camera & Image Picker** - Camera and gallery access
- **Google Gemini AI** - Ingredient extraction and product analysis

## API Integration

The app uses Google's Gemini 1.5 Flash model for:

1. **Ingredient Extraction**: Analyzing photos to extract ingredient lists
2. **Product Analysis**: Scoring products on health and sustainability metrics
3. **Product Comparison**: Generating detailed comparisons between products

## Features in Detail

### Product Analysis
Each product receives scores (0-100) for:
- **Health Score**: Based on nutritional value, additives, processing level
- **Sustainability Score**: Based on environmental impact, packaging, sourcing
- **Overall Score**: Weighted combination of health and sustainability

### Comparison Results
When comparing products, you get:
- Overall winner with explanation
- Category winners (health vs sustainability)
- Side-by-side score comparison
- Detailed analysis explaining the reasoning

## Development

To modify the app:

1. **Add new features**: Create components in `src/components/`
2. **Modify analysis logic**: Update `src/services/GeminiService.ts`
3. **Change UI**: Update styles in component files
4. **Add new screens**: Create in `src/screens/` and update navigation

## Troubleshooting

### Camera/Gallery Issues
- Make sure you've granted camera and gallery permissions
- Test on a physical device rather than simulator for camera functionality

### API Issues
- Verify your Gemini API key is correct
- Check your internet connection
- Monitor API usage limits in Google AI Studio

### Build Issues
- Clear Expo cache: `expo r -c`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## License

This project is for educational and demonstration purposes.
