import React from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AppProvider } from '../src/context/AppContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Initialize Google Mobile Ads only on native platforms
if (Platform.OS !== 'web') {
  const mobileAds = require('react-native-google-mobile-ads').default;
  mobileAds()
    .initialize()
    .then((adapterStatuses: any) => {
      console.log('AdMob initialized:', adapterStatuses);
    })
    .catch((error: any) => {
      console.error('AdMob initialization error:', error);
    });
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AppProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </AppProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
