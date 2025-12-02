import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { calculateRiskScore } from '../utils/calculations';
import {
  CROP_TYPES,
  WEATHER_RISKS,
  DIVERSIFICATION_OPTIONS,
} from '../constants/mockData';
import { Colors } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

export const RiskMeterScreen: React.FC = () => {
  const [cropType, setCropType] = useState('rice');
  const [farmSize, setFarmSize] = useState('');
  const [diversification, setDiversification] = useState('single');
  const [weatherRisk, setWeatherRisk] = useState('low');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    if (!farmSize) {
      Alert.alert('Error', 'Please enter farm size');
      return;
    }

    const data = {
      cropType,
      farmSize: parseFloat(farmSize),
      diversification,
      weatherRisk,
    };

    const riskResult = calculateRiskScore(data);
    setResult(riskResult);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return Colors.riskLow;
      case 'medium':
        return Colors.riskMedium;
      case 'high':
        return Colors.riskHigh;
      default:
        return Colors.gray;
    }
  };

  const getRiskGradient = (level: string) => {
    switch (level) {
      case 'low':
        return ['#4CAF50', '#81C784'];
      case 'medium':
        return ['#FFC107', '#FFD54F'];
      case 'high':
        return ['#F44336', '#E57373'];
      default:
        return ['#9E9E9E', '#BDBDBD'];
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="speedometer" size={40} color={Colors.secondary} />
        <Text style={styles.headerTitle}>Risk Meter</Text>
        <Text style={styles.headerSubtitle}>
          Assess your farming risk level
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Select Crop Type</Text>
        <View style={styles.optionButtons}>
          {CROP_TYPES.slice(0, 4).map((crop) => (
            <TouchableOpacity
              key={crop.value}
              style={[
                styles.optionButton,
                cropType === crop.value && styles.optionButtonActive,
              ]}
              onPress={() => setCropType(crop.value)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  cropType === crop.value && styles.optionButtonTextActive,
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
          activeOutlineColor={Colors.secondary}
        />

        <Text style={styles.label}>Diversification Strategy</Text>
        <View style={styles.optionButtons}>
          {DIVERSIFICATION_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                diversification === option.value && styles.optionButtonActive,
              ]}
              onPress={() => setDiversification(option.value)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  diversification === option.value &&
                    styles.optionButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Local Weather Risk</Text>
        <View style={styles.optionButtons}>
          {WEATHER_RISKS.map((risk) => (
            <TouchableOpacity
              key={risk.value}
              style={[
                styles.optionButton,
                weatherRisk === risk.value && styles.optionButtonActive,
              ]}
              onPress={() => setWeatherRisk(risk.value)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  weatherRisk === risk.value && styles.optionButtonTextActive,
                ]}
              >
                {risk.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleCalculate}
          style={styles.calculateButton}
          buttonColor={Colors.secondary}
          contentStyle={styles.buttonContent}
        >
          Calculate Risk
        </Button>
      </View>

      {result && (
        <View style={styles.resultSection}>
          <Text style={styles.resultTitle}>Risk Assessment</Text>

          <LinearGradient
            colors={getRiskGradient(result.riskLevel)}
            style={styles.riskGauge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.riskLevel}>
              {result.riskLevel.toUpperCase()}
            </Text>
            <Text style={styles.riskScore}>Score: {result.score}/100</Text>
          </LinearGradient>

          <View style={styles.risksContainer}>
            <Text style={styles.risksTitle}>Top Risks to Address:</Text>
            {result.risks.map((risk: string, index: number) => (
              <View key={index} style={styles.riskItem}>
                <Ionicons
                  name="warning"
                  size={20}
                  color={Colors.secondary}
                />
                <Text style={styles.riskText}>{risk}</Text>
              </View>
            ))}
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color={Colors.info} />
            <Text style={styles.infoText}>
              Lower risk scores indicate better financial stability. Consider the
              recommendations above to reduce your risk.
            </Text>
          </View>
        </View>
      )}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    marginTop: 8,
  },
  optionButtons: {
    marginBottom: 16,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  optionButtonActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  optionButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  optionButtonTextActive: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.white,
  },
  calculateButton: {
    marginTop: 16,
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
  riskGauge: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  riskLevel: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  riskScore: {
    fontSize: 18,
    color: Colors.white,
  },
  risksContainer: {
    marginTop: 16,
  },
  risksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    padding: 12,
    backgroundColor: Colors.light,
    borderRadius: 8,
  },
  riskText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
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
});
