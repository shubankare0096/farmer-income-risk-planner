import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useApp } from '../context/AppContext';
import { calculateProfitPlan, formatCurrency } from '../utils/calculations';
import { CROP_TYPES } from '../constants/mockData';
import { Colors } from '../constants/colors';
import { AdBanner } from '../components/AdBanner';
import { Ionicons } from '@expo/vector-icons';
import { AdUnits } from '../constants/adUnits';

const screenWidth = Dimensions.get('window').width;

// Dynamically import AdMob only for native platforms
let InterstitialAd: any = null;
let AdEventType: any = null;
let TestIds: any = null;

if (Platform.OS !== 'web') {
  const admob = require('react-native-google-mobile-ads');
  InterstitialAd = admob.InterstitialAd;
  AdEventType = admob.AdEventType;
  TestIds = admob.TestIds;
}

const interstitial = Platform.OS !== 'web' && InterstitialAd
  ? InterstitialAd.createForAdRequest(
      __DEV__ ? TestIds.INTERSTITIAL : AdUnits.interstitial,
      {
        requestNonPersonalizedAdsOnly: true,
      }
    )
  : null;

export const ProfitCalculatorScreen: React.FC = () => {
  const { saveProfitPlan } = useApp();
  const [cropType, setCropType] = useState('rice');
  const [farmSize, setFarmSize] = useState('');
  const [seedCost, setSeedCost] = useState('');
  const [fertilizerCost, setFertilizerCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [irrigationCost, setIrrigationCost] = useState('');
  const [expectedYield, setExpectedYield] = useState('');
  const [result, setResult] = useState<any>(null);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  React.useEffect(() => {
    if (!interstitial || Platform.OS === 'web') return;

    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setInterstitialLoaded(true);
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setInterstitialLoaded(false);
        interstitial.load();
      }
    );

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const handleCalculate = () => {
    if (
      !farmSize ||
      !seedCost ||
      !fertilizerCost ||
      !laborCost ||
      !irrigationCost ||
      !expectedYield
    ) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const data = {
      cropType,
      farmSize: parseFloat(farmSize),
      seedCost: parseFloat(seedCost),
      fertilizerCost: parseFloat(fertilizerCost),
      laborCost: parseFloat(laborCost),
      irrigationCost: parseFloat(irrigationCost),
      expectedYield: parseFloat(expectedYield),
    };

    const calculation = calculateProfitPlan(data);
    setResult(calculation);

    // Show interstitial ad after calculation
    if (interstitialLoaded) {
      interstitial.show();
    }
  };

  const handleSavePlan = async () => {
    if (!result) return;

    const plan = {
      cropType,
      farmSize: parseFloat(farmSize),
      seedCost: parseFloat(seedCost),
      fertilizerCost: parseFloat(fertilizerCost),
      laborCost: parseFloat(laborCost),
      irrigationCost: parseFloat(irrigationCost),
      expectedYield: parseFloat(expectedYield),
      totalCost: result.totalCost,
      breakEvenPrice: result.breakEvenPrice,
      createdAt: new Date().toISOString(),
    };

    await saveProfitPlan(plan);
    Alert.alert('Success', 'Profit plan saved successfully!');
  };

  const getPieChartData = () => {
    if (!result) return [];

    return [
      {
        name: 'Seeds',
        amount: result.costBreakdown.seeds,
        color: '#FF6384',
        legendFontColor: Colors.text,
        legendFontSize: 14,
      },
      {
        name: 'Fertilizer',
        amount: result.costBreakdown.fertilizer,
        color: '#36A2EB',
        legendFontColor: Colors.text,
        legendFontSize: 14,
      },
      {
        name: 'Labor',
        amount: result.costBreakdown.labor,
        color: '#FFCE56',
        legendFontColor: Colors.text,
        legendFontSize: 14,
      },
      {
        name: 'Irrigation',
        amount: result.costBreakdown.irrigation,
        color: '#4BC0C0',
        legendFontColor: Colors.text,
        legendFontSize: 14,
      },
    ];
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Ionicons name="calculator" size={40} color={Colors.primary} />
          <Text style={styles.headerTitle}>Profit Calculator</Text>
          <Text style={styles.headerSubtitle}>
            Calculate your farming costs and break-even price
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Select Crop Type</Text>
          <View style={styles.cropButtons}>
            {CROP_TYPES.slice(0, 4).map((crop) => (
              <TouchableOpacity
                key={crop.value}
                style={[
                  styles.cropButton,
                  cropType === crop.value && styles.cropButtonActive,
                ]}
                onPress={() => setCropType(crop.value)}
              >
                <Text
                  style={[
                    styles.cropButtonText,
                    cropType === crop.value && styles.cropButtonTextActive,
                  ]}
                >
                  {crop.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            label="Farm Size (acres)"
            value={farmSize}
            onChangeText={setFarmSize}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            outlineColor={Colors.border}
            activeOutlineColor={Colors.primary}
          />

          <TextInput
            label="Seed Cost (₹)"
            value={seedCost}
            onChangeText={setSeedCost}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            outlineColor={Colors.border}
            activeOutlineColor={Colors.primary}
          />

          <TextInput
            label="Fertilizer Cost (₹)"
            value={fertilizerCost}
            onChangeText={setFertilizerCost}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            outlineColor={Colors.border}
            activeOutlineColor={Colors.primary}
          />

          <TextInput
            label="Labor Cost (₹)"
            value={laborCost}
            onChangeText={setLaborCost}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            outlineColor={Colors.border}
            activeOutlineColor={Colors.primary}
          />

          <TextInput
            label="Irrigation Cost (₹)"
            value={irrigationCost}
            onChangeText={setIrrigationCost}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            outlineColor={Colors.border}
            activeOutlineColor={Colors.primary}
          />

          <TextInput
            label="Expected Yield (quintals)"
            value={expectedYield}
            onChangeText={setExpectedYield}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            outlineColor={Colors.border}
            activeOutlineColor={Colors.primary}
          />

          <Button
            mode="contained"
            onPress={handleCalculate}
            style={styles.calculateButton}
            buttonColor={Colors.primary}
            contentStyle={styles.buttonContent}
          >
            Calculate Profit
          </Button>
        </View>

        {result && (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>Cost Breakdown</Text>

            <View style={styles.chartContainer}>
              <PieChart
                data={getPieChartData()}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total Cost</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(result.totalCost)}
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Break-Even Price</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(result.breakEvenPrice)}/quintal
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Cost per Acre</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(result.costPerAcre)}
                </Text>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleSavePlan}
              style={styles.saveButton}
              buttonColor={Colors.secondary}
              contentStyle={styles.buttonContent}
              icon="content-save"
            >
              Save Profit Plan
            </Button>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <AdBanner />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.white,
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  cropButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  cropButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
    minWidth: '48%',
    alignItems: 'center',
  },
  cropButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  cropButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  cropButtonTextActive: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.white,
  },
  calculateButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    height: 56,
  },
  resultSection: {
    padding: 20,
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  statsContainer: {
    marginTop: 16,
  },
  statCard: {
    backgroundColor: Colors.light,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});
