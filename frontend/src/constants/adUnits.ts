import { Platform } from 'react-native';

// Test Ad Unit IDs from Google AdMob
export const AdUnits = {
  banner: Platform.select({
    android: 'ca-app-pub-9801079384342918/6300978111',
    ios: 'ca-app-pub-9801079384342918/2934735716',
  }) || '',
  interstitial: Platform.select({
    android: 'ca-app-pub-9801079384342918/1033173712',
    ios: 'ca-app-pub-9801079384342918/4411468910',
  }) || '',
  rewarded: Platform.select({
    android: 'ca-app-pub-9801079384342918/5224354917',
    ios: 'ca-app-pub-9801079384342918/1712485313',
  }) || '',
};

export const ADMOB_PUBLISHER_ID = 'pub-9801079384342918';
