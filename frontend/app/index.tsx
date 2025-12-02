import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../src/constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.replace('/(tabs)/profit');
  };

  return (
    <LinearGradient
      colors={[Colors.primary, '#81C784', Colors.secondary]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="leaf" size={80} color={Colors.white} />
        </View>

        <Text style={styles.title}>Farmer Income &{'\n'}Risk Planner</Text>
        <Text style={styles.subtitle}>
          Smart tools to maximize your farming profits and minimize risks
        </Text>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Ionicons name="calculator" size={24} color={Colors.white} />
            <Text style={styles.featureText}>Profit Calculator</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="speedometer" size={24} color={Colors.white} />
            <Text style={styles.featureText}>Risk Assessment</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="wallet" size={24} color={Colors.white} />
            <Text style={styles.featureText}>Expense Tracking</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="pricetag" size={24} color={Colors.white} />
            <Text style={styles.featureText}>Market Prices</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="school" size={24} color={Colors.white} />
            <Text style={styles.featureText}>Learning Hub</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={styles.footer}>
          Made for farmers, by technology
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 48,
    opacity: 0.9,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 48,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: Colors.white,
    marginLeft: 16,
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: 8,
  },
  footer: {
    fontSize: 12,
    color: Colors.white,
    marginTop: 32,
    opacity: 0.7,
  },
});
