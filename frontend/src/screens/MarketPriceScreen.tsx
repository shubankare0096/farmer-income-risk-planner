import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button, TextInput, Portal, Modal } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { MARKET_PRICES, CROP_TYPES } from '../constants/mockData';
import { formatCurrency, formatDate } from '../utils/calculations';
import { Colors } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { AdBanner } from '../components/AdBanner';

export const MarketPriceScreen: React.FC = () => {
  const { profitPlan, priceAlerts, addPriceAlert, removePriceAlert } = useApp();
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [targetPrice, setTargetPrice] = useState('');

  const handleSetAlert = async () => {
    if (!selectedCrop || !targetPrice) {
      Alert.alert('Error', 'Please select crop and enter target price');
      return;
    }

    await addPriceAlert({
      cropType: selectedCrop,
      targetPrice: parseFloat(targetPrice),
      active: true,
    });

    Alert.alert('Success', 'Price alert set successfully!');
    setAlertModalVisible(false);
    setSelectedCrop(null);
    setTargetPrice('');
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'remove';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return Colors.success;
      case 'down':
        return Colors.danger;
      default:
        return Colors.gray;
    }
  };

  const isAboveFairRange = (price: number, fairRange: { min: number; max: number }) => {
    return price > fairRange.max;
  };

  const isBelowFairRange = (price: number, fairRange: { min: number; max: number }) => {
    return price < fairRange.min;
  };

  const compareWithBreakEven = (currentPrice: number, cropType: string) => {
    if (!profitPlan || profitPlan.cropType !== cropType) return null;

    const difference = currentPrice - profitPlan.breakEvenPrice;
    const percentage = (difference / profitPlan.breakEvenPrice) * 100;

    return {
      difference,
      percentage,
      profitable: difference > 0,
    };
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Ionicons name="pricetag" size={40} color={Colors.secondary} />
          <Text style={styles.headerTitle}>Market Prices</Text>
          <Text style={styles.headerSubtitle}>
            Current crop prices (Updated Daily)
          </Text>
        </View>

        <View style={styles.pricesContainer}>
          {Object.entries(MARKET_PRICES).map(([cropKey, priceData]) => {
            const cropLabel = CROP_TYPES.find((c) => c.value === cropKey)?.label || cropKey;
            const comparison = compareWithBreakEven(priceData.currentPrice, cropKey);
            const hasAlert = priceAlerts.some((a) => a.cropType === cropKey && a.active);

            return (
              <View key={cropKey} style={styles.priceCard}>
                <View style={styles.priceHeader}>
                  <View style={styles.cropInfo}>
                    <Text style={styles.cropName}>{cropLabel}</Text>
                    <Text style={styles.priceUnit}>per {priceData.unit}</Text>
                  </View>
                  <View style={styles.trendBadge}>
                    <Ionicons
                      name={getTrendIcon(priceData.trend)}
                      size={20}
                      color={getTrendColor(priceData.trend)}
                    />
                    <Text
                      style={[
                        styles.trendText,
                        { color: getTrendColor(priceData.trend) },
                      ]}
                    >
                      {priceData.change > 0 ? '+' : ''}{priceData.change}%
                    </Text>
                  </View>
                </View>

                <Text style={styles.currentPrice}>
                  {formatCurrency(priceData.currentPrice)}
                </Text>

                <View style={styles.fairRangeContainer}>
                  <Text style={styles.fairRangeLabel}>Fair Range:</Text>
                  <Text style={styles.fairRangeValue}>
                    {formatCurrency(priceData.fairRange.min)} -{' '}
                    {formatCurrency(priceData.fairRange.max)}
                  </Text>
                </View>

                {isAboveFairRange(priceData.currentPrice, priceData.fairRange) && (
                  <View style={[styles.statusBadge, styles.goodStatus]}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={styles.statusText}>Above Fair Range - Good to Sell!</Text>
                  </View>
                )}

                {isBelowFairRange(priceData.currentPrice, priceData.fairRange) && (
                  <View style={[styles.statusBadge, styles.badStatus]}>
                    <Ionicons name="warning" size={16} color={Colors.danger} />
                    <Text style={styles.statusText}>Below Fair Range - Wait if Possible</Text>
                  </View>
                )}

                {comparison && (
                  <View style={styles.breakEvenComparison}>
                    <Text style={styles.breakEvenLabel}>vs Your Break-Even:</Text>
                    <Text
                      style={[
                        styles.breakEvenValue,
                        { color: comparison.profitable ? Colors.success : Colors.danger },
                      ]}
                    >
                      {comparison.profitable ? '+' : ''}
                      {formatCurrency(comparison.difference)} ({comparison.percentage.toFixed(1)}%)
                    </Text>
                  </View>
                )}

                <Button
                  mode={hasAlert ? 'outlined' : 'contained'}
                  onPress={() => {
                    setSelectedCrop(cropKey);
                    setAlertModalVisible(true);
                  }}
                  style={styles.alertButton}
                  buttonColor={hasAlert ? undefined : Colors.info}
                  textColor={hasAlert ? Colors.info : undefined}
                  icon={hasAlert ? 'bell' : 'bell-outline'}
                >
                  {hasAlert ? 'Alert Set' : 'Set Price Alert'}
                </Button>
              </View>
            );
          })}
        </View>

        <View style={styles.infoSection}>
          <Ionicons name="information-circle" size={24} color={Colors.info} />
          <Text style={styles.infoText}>
            Prices are mock data for demonstration. In production, integrate with real
            agricultural market APIs like eNAM.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <AdBanner />

      <Portal>
        <Modal
          visible={alertModalVisible}
          onDismiss={() => {
            setAlertModalVisible(false);
            setSelectedCrop(null);
            setTargetPrice('');
          }}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Set Price Alert</Text>
          <Text style={styles.modalSubtitle}>
            Get notified when price reaches your target
          </Text>

          {selectedCrop && (
            <View style={styles.selectedCropInfo}>
              <Text style={styles.selectedCropLabel}>Crop:</Text>
              <Text style={styles.selectedCropValue}>
                {CROP_TYPES.find((c) => c.value === selectedCrop)?.label || selectedCrop}
              </Text>
            </View>
          )}

          <TextInput
            label="Target Price (₹)"
            value={targetPrice}
            onChangeText={setTargetPrice}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            outlineColor={Colors.border}
            activeOutlineColor={Colors.info}
          />

          <Button
            mode="contained"
            onPress={handleSetAlert}
            style={styles.submitButton}
            buttonColor={Colors.info}
            contentStyle={styles.buttonContent}
          >
            Set Alert
          </Button>

          <Button
            mode="text"
            onPress={() => {
              setAlertModalVisible(false);
              setSelectedCrop(null);
              setTargetPrice('');
            }}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </Modal>
      </Portal>
    </View>
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
  },
  pricesContainer: {
    padding: 20,
  },
  priceCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  priceUnit: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginVertical: 8,
  },
  fairRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  fairRangeLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginRight: 8,
  },
  fairRangeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  goodStatus: {
    backgroundColor: '#E8F5E9',
  },
  badStatus: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  breakEvenComparison: {
    backgroundColor: Colors.light,
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakEvenLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  breakEvenValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertButton: {
    marginTop: 12,
    borderRadius: 8,
  },
  infoSection: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
  modalContent: {
    backgroundColor: Colors.white,
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
  },
  selectedCropInfo: {
    flexDirection: 'row',
    backgroundColor: Colors.light,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedCropLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginRight: 8,
  },
  selectedCropValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.white,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    height: 50,
  },
  cancelButton: {
    marginTop: 8,
  },
});
