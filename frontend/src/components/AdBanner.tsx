import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { AdUnits } from '../constants/adUnits';

// Dynamically import AdMob only for native platforms
let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

if (Platform.OS !== 'web') {
  const admob = require('react-native-google-mobile-ads');
  BannerAd = admob.BannerAd;
  BannerAdSize = admob.BannerAdSize;
  TestIds = admob.TestIds;
}

interface AdBannerProps {
  style?: any;
}

export const AdBanner: React.FC<AdBannerProps> = ({ style }) => {
  // Don't show ads on web
  if (Platform.OS === 'web' || !BannerAd) {
    return <View style={[styles.container, styles.placeholder, style]} />;
  }

  const adUnitId = __DEV__ ? TestIds.BANNER : AdUnits.banner;

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  placeholder: {
    height: 50,
    backgroundColor: '#f0f0f0',
  },
});
