import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { TextInput, Button, FAB, Portal, Modal, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/calculations';
import { ACTIVITY_TYPES } from '../constants/mockData';
import { Colors } from '../constants/colors';
import { AdBanner } from '../components/AdBanner';

export const ExpenseTrackerScreen: React.FC = () => {
  const { expenses, addExpense, updateExpense, deleteExpense, profitPlan } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activityType, setActivityType] = useState('seeds');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async () => {
    if (!cost) {
      Alert.alert('Error', 'Please enter cost');
      return;
    }

    const expenseData = {
      date,
      activityType,
      cost: parseFloat(cost),
      notes,
    };

    if (editingId) {
      await updateExpense(editingId, expenseData);
      Alert.alert('Success', 'Expense updated successfully!');
    } else {
      await addExpense(expenseData);
      Alert.alert('Success', 'Expense added successfully!');
    }

    resetForm();
    setModalVisible(false);
  };

  const handleEdit = (expense: any) => {
    setEditingId(expense.id);
    setActivityType(expense.activityType);
    setCost(expense.cost.toString());
    setNotes(expense.notes);
    setDate(expense.date);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteExpense(id);
          Alert.alert('Success', 'Expense deleted successfully!');
        },
      },
    ]);
  };

  const resetForm = () => {
    setEditingId(null);
    setActivityType('seeds');
    setCost('');
    setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, exp) => sum + exp.cost, 0);
  };

  const getExpensesByType = () => {
    const byType: Record<string, number> = {};
    expenses.forEach((exp) => {
      byType[exp.activityType] = (byType[exp.activityType] || 0) + exp.cost;
    });
    return byType;
  };

  const renderExpenseItem = ({ item }: { item: any }) => {
    const activityLabel =
      ACTIVITY_TYPES.find((a) => a.value === item.activityType)?.label || item.activityType;

    return (
      <TouchableOpacity style={styles.expenseCard} onPress={() => handleEdit(item)}>
        <View style={styles.expenseHeader}>
          <View style={styles.expenseInfo}>
            <Text style={styles.expenseActivity}>{activityLabel}</Text>
            <Text style={styles.expenseDate}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.expenseActions}>
            <Text style={styles.expenseCost}>{formatCurrency(item.cost)}</Text>
            <IconButton
              icon="delete"
              iconColor={Colors.danger}
              size={20}
              onPress={() => handleDelete(item.id)}
            />
          </View>
        </View>
        {item.notes ? <Text style={styles.expenseNotes}>{item.notes}</Text> : null}
      </TouchableOpacity>
    );
  };

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="wallet" size={40} color={Colors.primary} />
        <Text style={styles.headerTitle}>Expense Tracker</Text>
        <Text style={styles.headerSubtitle}>Track your farming expenses</Text>
      </View>

      <View style={styles.summarySection}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={styles.summaryValue}>{formatCurrency(getTotalExpenses())}</Text>
        </View>

        {profitPlan && (
          <View style={styles.comparisonCard}>
            <Text style={styles.comparisonLabel}>Planned Budget</Text>
            <Text style={styles.comparisonValue}>{formatCurrency(profitPlan.totalCost)}</Text>
            <Text
              style={[
                styles.comparisonDiff,
                getTotalExpenses() > profitPlan.totalCost
                  ? styles.overBudget
                  : styles.underBudget,
              ]}
            >
              {getTotalExpenses() > profitPlan.totalCost ? 'Over' : 'Under'} by{' '}
              {formatCurrency(Math.abs(getTotalExpenses() - profitPlan.totalCost))}
            </Text>
          </View>
        )}
      </View>

      {expenses.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={80} color={Colors.lightGray} />
          <Text style={styles.emptyText}>No expenses recorded yet</Text>
          <Text style={styles.emptySubtext}>Tap the + button to add your first expense</Text>
        </View>
      ) : (
        <FlatList
          data={sortedExpenses}
          renderItem={renderExpenseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AdBanner />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
        color={Colors.white}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
            resetForm();
          }}
          contentContainerStyle={styles.modalContent}
        >
          <ScrollView>
            <Text style={styles.modalTitle}>{editingId ? 'Edit' : 'Add'} Expense</Text>

            <Text style={styles.label}>Activity Type</Text>
            <View style={styles.activityButtons}>
              {ACTIVITY_TYPES.map((activity) => (
                <TouchableOpacity
                  key={activity.value}
                  style={[
                    styles.activityButton,
                    activityType === activity.value && styles.activityButtonActive,
                  ]}
                  onPress={() => setActivityType(activity.value)}
                >
                  <Text
                    style={[
                      styles.activityButtonText,
                      activityType === activity.value && styles.activityButtonTextActive,
                    ]}
                  >
                    {activity.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              label="Cost (₹)"
              value={cost}
              onChangeText={setCost}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              outlineColor={Colors.border}
              activeOutlineColor={Colors.primary}
            />

            <TextInput
              label="Date (YYYY-MM-DD)"
              value={date}
              onChangeText={setDate}
              mode="outlined"
              style={styles.input}
              outlineColor={Colors.border}
              activeOutlineColor={Colors.primary}
            />

            <TextInput
              label="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              outlineColor={Colors.border}
              activeOutlineColor={Colors.primary}
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              buttonColor={Colors.primary}
              contentStyle={styles.buttonContent}
            >
              {editingId ? 'Update' : 'Add'} Expense
            </Button>

            <Button
              mode="text"
              onPress={() => {
                setModalVisible(false);
                resetForm();
              }}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </ScrollView>
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
  summarySection: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 8,
  },
  comparisonCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  comparisonLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  comparisonValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 4,
  },
  comparisonDiff: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600',
  },
  overBudget: {
    color: Colors.danger,
  },
  underBudget: {
    color: Colors.success,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  listContainer: {
    padding: 20,
  },
  expenseCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseInfo: {
    flex: 1,
  },
  expenseActivity: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  expenseDate: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
  },
  expenseActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseCost: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: 8,
  },
  expenseNotes: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 8,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: Colors.primary,
  },
  modalContent: {
    backgroundColor: Colors.white,
    margin: 20,
    padding: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  activityButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  activityButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.light,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  activityButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  activityButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  activityButtonTextActive: {
    color: Colors.white,
    fontWeight: '600',
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
