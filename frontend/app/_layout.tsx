import React from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AppProvider } from '../src/context/AppContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import mobileAds from 'react-native-google-mobile-ads';

// Initialize Google Mobile Ads
mobileAds()
  .initialize()
  .then((adapterStatuses) => {
    console.log('AdMob initialized:', adapterStatuses);
  })
  .catch((error) => {
    console.error('AdMob initialization error:', error);
  });

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
