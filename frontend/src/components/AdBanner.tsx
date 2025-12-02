import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { AdUnits } from '../constants/adUnits';

interface AdBannerProps {
  style?: any;
}

export const AdBanner: React.FC<AdBannerProps> = ({ style }) => {
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
});
