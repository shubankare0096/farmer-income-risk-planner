import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage, StorageKeys } from '../utils/storage';

interface Expense {
  id: string;
  date: string;
  activityType: string;
  cost: number;
  notes: string;
}

interface ProfitPlan {
  cropType: string;
  farmSize: number;
  seedCost: number;
  fertilizerCost: number;
  laborCost: number;
  irrigationCost: number;
  expectedYield: number;
  totalCost: number;
  breakEvenPrice: number;
  createdAt: string;
}

interface LearningProgress {
  [moduleId: string]: {
    [lessonId: string]: boolean;
  };
}

interface PriceAlert {
  id: string;
  cropType: string;
  targetPrice: number;
  active: boolean;
}

interface AppContextType {
  expenses: Expense[];
  profitPlan: ProfitPlan | null;
  learningProgress: LearningProgress;
  priceAlerts: PriceAlert[];
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  saveProfitPlan: (plan: ProfitPlan) => Promise<void>;
  markLessonComplete: (moduleId: string, lessonId: string) => Promise<void>;
  addPriceAlert: (alert: Omit<PriceAlert, 'id'>) => Promise<void>;
  removePriceAlert: (id: string) => Promise<void>;
  loadData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [profitPlan, setProfitPlan] = useState<ProfitPlan | null>(null);
  const [learningProgress, setLearningProgress] = useState<LearningProgress>({});
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);

  const loadData = async () => {
    try {
      const [loadedExpenses, loadedPlan, loadedProgress, loadedAlerts] = await Promise.all([
        storage.get<Expense[]>(StorageKeys.EXPENSES),
        storage.get<ProfitPlan>(StorageKeys.PROFIT_PLAN),
        storage.get<LearningProgress>(StorageKeys.LEARNING_PROGRESS),
        storage.get<PriceAlert[]>(StorageKeys.PRICE_ALERTS),
      ]);

      setExpenses(loadedExpenses || []);
      setProfitPlan(loadedPlan);
      setLearningProgress(loadedProgress || {});
      setPriceAlerts(loadedAlerts || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    await storage.set(StorageKeys.EXPENSES, updatedExpenses);
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    const updatedExpenses = expenses.map((exp) =>
      exp.id === id ? { ...exp, ...updates } : exp
    );
    setExpenses(updatedExpenses);
    await storage.set(StorageKeys.EXPENSES, updatedExpenses);
  };

  const deleteExpense = async (id: string) => {
    const updatedExpenses = expenses.filter((exp) => exp.id !== id);
    setExpenses(updatedExpenses);
    await storage.set(StorageKeys.EXPENSES, updatedExpenses);
  };

  const saveProfitPlan = async (plan: ProfitPlan) => {
    setProfitPlan(plan);
    await storage.set(StorageKeys.PROFIT_PLAN, plan);
  };

  const markLessonComplete = async (moduleId: string, lessonId: string) => {
    const updatedProgress = {
      ...learningProgress,
      [moduleId]: {
        ...(learningProgress[moduleId] || {}),
        [lessonId]: true,
      },
    };
    setLearningProgress(updatedProgress);
    await storage.set(StorageKeys.LEARNING_PROGRESS, updatedProgress);
  };

  const addPriceAlert = async (alert: Omit<PriceAlert, 'id'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: Date.now().toString(),
    };
    const updatedAlerts = [...priceAlerts, newAlert];
    setPriceAlerts(updatedAlerts);
    await storage.set(StorageKeys.PRICE_ALERTS, updatedAlerts);
  };

  const removePriceAlert = async (id: string) => {
    const updatedAlerts = priceAlerts.filter((alert) => alert.id !== id);
    setPriceAlerts(updatedAlerts);
    await storage.set(StorageKeys.PRICE_ALERTS, updatedAlerts);
  };

  return (
    <AppContext.Provider
      value={{
        expenses,
        profitPlan,
        learningProgress,
        priceAlerts,
        addExpense,
        updateExpense,
        deleteExpense,
        saveProfitPlan,
        markLessonComplete,
        addPriceAlert,
        removePriceAlert,
        loadData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
