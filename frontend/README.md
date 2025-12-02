# Farmer Income & Risk Planner

A comprehensive React Native mobile app built with Expo to help farmers maximize profits, manage risks, track expenses, monitor market prices, and learn essential farming knowledge.

## 🌾 Features

### 1. **Profit Calculator**
- Input crop details, farm size, and all costs
- Visual pie chart breakdown of expenses
- Calculate break-even price automatically
- Save profit plans locally
- Banner ads at bottom, interstitial ads after calculation

### 2. **Risk Meter**
- Assess farming risk based on multiple factors
- Visual risk gauge (Low/Medium/High)
- Top 3 personalized risk recommendations
- No ads (educational focus)

### 3. **Expense Tracker**
- Log daily farming expenses with date and notes
- View cumulative spending
- Compare with profit plan budget
- Edit and delete expense entries
- Banner ads, interstitial when exporting

### 4. **Market Price Tracker**
- Current prices for 7 major crops (Rice, Wheat, Cotton, etc.)
- Compare with your break-even price
- Fair price range indicators
- Set price alerts for target prices
- Native ads among listings

### 5. **Learning Hub**
- 5 educational modules with 15 total lessons:
  - Spot Middleman Cheating
  - Understanding Fair Market Prices
  - Crop Insurance Basics
  - Crop Diversification Strategy
  - Debt vs Equity Financial Basics
- Progress tracking
- Rewarded video ads to unlock next lessons
- Real, actionable content for rural farmers

## 🚀 Technology Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router (file-based routing) + React Navigation
- **UI Library**: React Native Paper (Material Design)
- **Charts**: react-native-chart-kit
- **Storage**: AsyncStorage (100% offline)
- **Ads**: Google Mobile Ads SDK (AdMob)
- **State Management**: React Context API
- **Icons**: Expo Vector Icons

## 📦 Installation & Running

```bash
# Navigate to frontend directory
cd /app/frontend

# Install dependencies (already done)
yarn install

# Start development server
yarn start

# Or run on Android
yarn android
```

## 🏗️ Project Structure

```
/app/frontend/
├── app/                          # Expo Router screens
│   ├── index.tsx                 # Welcome screen
│   ├── _layout.tsx               # Root layout
│   └── (tabs)/                   # Bottom tab navigation
│       ├── _layout.tsx           # Tabs layout
│       ├── profit.tsx            # Profit Calculator
│       ├── risk.tsx              # Risk Meter
│       ├── expenses.tsx          # Expense Tracker
│       ├── prices.tsx            # Market Prices
│       └── learning.tsx          # Learning Hub
├── src/
│   ├── components/               # Reusable components
│   ├── constants/                # App constants
│   ├── context/                  # React Context
│   ├── screens/                  # Screen components
│   └── utils/                    # Utility functions
├── app.json                      # Expo configuration
└── package.json                  # Dependencies
```

## 🎨 Design Features

- **Agriculture Theme**: Green primary, Orange secondary
- **Large Touch Targets**: 50-56px height buttons for rural users
- **Simple Navigation**: Bottom tabs with clear icons
- **Offline First**: All data stored locally in AsyncStorage
- **Visual Feedback**: Loading states, success messages, alerts
- **Responsive**: Works on all Android screen sizes

## 📱 AdMob Integration

Uses Google's test Ad Unit IDs during development. Ready for production with your real AdMob credentials.

Publisher ID: `pub-9801079384342918`

## 💾 Data Storage

All data stored locally using AsyncStorage - fully offline capable!

## 📲 Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Build Android APK
eas build --platform android --profile preview

# Build for Google Play Store
eas build --platform android --profile production
```

---

**Built with ❤️ for farmers everywhere**
