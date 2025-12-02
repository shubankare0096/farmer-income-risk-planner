export const CROP_TYPES = [
  { label: 'Rice', value: 'rice' },
  { label: 'Wheat', value: 'wheat' },
  { label: 'Cotton', value: 'cotton' },
  { label: 'Vegetables', value: 'vegetables' },
  { label: 'Sugarcane', value: 'sugarcane' },
  { label: 'Maize', value: 'maize' },
  { label: 'Pulses', value: 'pulses' },
];

export const MARKET_PRICES = {
  rice: {
    currentPrice: 2100,
    unit: 'quintal',
    trend: 'up',
    change: 5.2,
    fairRange: { min: 2000, max: 2300 },
    lastUpdated: new Date().toISOString(),
  },
  wheat: {
    currentPrice: 2050,
    unit: 'quintal',
    trend: 'down',
    change: -2.1,
    fairRange: { min: 2000, max: 2200 },
    lastUpdated: new Date().toISOString(),
  },
  cotton: {
    currentPrice: 5800,
    unit: 'quintal',
    trend: 'up',
    change: 3.5,
    fairRange: { min: 5500, max: 6200 },
    lastUpdated: new Date().toISOString(),
  },
  vegetables: {
    currentPrice: 1500,
    unit: 'quintal',
    trend: 'stable',
    change: 0.5,
    fairRange: { min: 1200, max: 1800 },
    lastUpdated: new Date().toISOString(),
  },
  sugarcane: {
    currentPrice: 310,
    unit: 'quintal',
    trend: 'up',
    change: 2.0,
    fairRange: { min: 300, max: 350 },
    lastUpdated: new Date().toISOString(),
  },
  maize: {
    currentPrice: 1850,
    unit: 'quintal',
    trend: 'stable',
    change: 0.8,
    fairRange: { min: 1700, max: 2000 },
    lastUpdated: new Date().toISOString(),
  },
  pulses: {
    currentPrice: 7500,
    unit: 'quintal',
    trend: 'up',
    change: 4.2,
    fairRange: { min: 7000, max: 8000 },
    lastUpdated: new Date().toISOString(),
  },
};

export const WEATHER_RISKS = [
  { label: 'Low (Stable Weather)', value: 'low' },
  { label: 'Medium (Occasional Droughts)', value: 'medium' },
  { label: 'High (Frequent Floods/Droughts)', value: 'high' },
];

export const DIVERSIFICATION_OPTIONS = [
  { label: 'Single Crop', value: 'single' },
  { label: 'Multi-Crop (2-3 crops)', value: 'multi' },
  { label: 'Diverse Portfolio (4+ crops)', value: 'diverse' },
];

export const ACTIVITY_TYPES = [
  { label: 'Seeds', value: 'seeds' },
  { label: 'Fertilizer', value: 'fertilizer' },
  { label: 'Pesticides', value: 'pesticides' },
  { label: 'Labor', value: 'labor' },
  { label: 'Irrigation', value: 'irrigation' },
  { label: 'Equipment', value: 'equipment' },
  { label: 'Transportation', value: 'transportation' },
  { label: 'Other', value: 'other' },
];
