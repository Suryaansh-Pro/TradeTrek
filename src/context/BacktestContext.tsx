import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BacktestResult } from '@/types/market';
import { mockBacktestResults } from '@/lib/mockData';

interface BacktestStrategy {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, number | string | boolean>;
}

interface BacktestContextType {
  strategies: BacktestStrategy[];
  results: BacktestResult[];
  selectedStrategy: BacktestStrategy | null;
  isRunning: boolean;
  selectStrategy: (id: string) => void;
  runBacktest: (
    symbol: string, 
    startDate: string, 
    endDate: string, 
    initialCapital: number
  ) => Promise<BacktestResult>;
  compareStrategies: (
    strategyIds: string[], 
    symbol: string, 
    startDate: string, 
    endDate: string
  ) => Promise<BacktestResult[]>;
}

// Sample strategies
const defaultStrategies: BacktestStrategy[] = [
  {
    id: 'moving-avg-crossover',
    name: 'Moving Average Crossover',
    description: 'Buy when short MA crosses above long MA, sell when it crosses below',
    parameters: {
      shortPeriod: 10,
      longPeriod: 50,
      stopLoss: 5
    }
  },
  {
    id: 'rsi-strategy',
    name: 'RSI Momentum',
    description: 'Buy when RSI crosses above 30, sell when RSI crosses below 70',
    parameters: {
      rsiPeriod: 14,
      oversold: 30,
      overbought: 70
    }
  },
  {
    id: 'bollinger-bands',
    name: 'Bollinger Bands',
    description: 'Buy when price touches lower band, sell when price touches upper band',
    parameters: {
      period: 20,
      standardDeviations: 2,
      useClose: true
    }
  }
];

const BacktestContext = createContext<BacktestContextType | undefined>(undefined);

export const useBacktest = () => {
  const context = useContext(BacktestContext);
  if (!context) {
    throw new Error('useBacktest must be used within a BacktestProvider');
  }
  return context;
};

interface BacktestProviderProps {
  children: ReactNode;
}

export const BacktestProvider: React.FC<BacktestProviderProps> = ({ children }) => {
  const [strategies, setStrategies] = useState<BacktestStrategy[]>(defaultStrategies);
  const [results, setResults] = useState<BacktestResult[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<BacktestStrategy | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const selectStrategy = (id: string) => {
    const strategy = strategies.find(s => s.id === id) || null;
    setSelectedStrategy(strategy);
  };

  const runBacktest = async (
    symbol: string, 
    startDate: string, 
    endDate: string, 
    initialCapital: number
  ): Promise<BacktestResult> => {
    if (!selectedStrategy) {
      throw new Error('No strategy selected');
    }

    setIsRunning(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get a mock result and customize it
      const baseResult = { ...mockBacktestResults[0] };
      
      // Update the result with the specific parameters
      const result: BacktestResult = {
        ...baseResult,
        strategyName: selectedStrategy.name,
        startDate,
        endDate,
        initialCapital,
        finalCapital: initialCapital * (1 + baseResult.totalReturn / 100)
      };
      
      // Add to results
      setResults(prev => [result, ...prev]);
      
      return result;
    } finally {
      setIsRunning(false);
    }
  };

  const compareStrategies = async (
    strategyIds: string[], 
    symbol: string, 
    startDate: string, 
    endDate: string
  ): Promise<BacktestResult[]> => {
    setIsRunning(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate a result for each strategy
      const comparisonResults = strategyIds.map((id, index) => {
        const strategy = strategies.find(s => s.id === id);
        const baseResult = mockBacktestResults[index % mockBacktestResults.length];
        
        // Create a slightly different result for each strategy
        return {
          ...baseResult,
          strategyName: strategy?.name || 'Unknown Strategy',
          startDate,
          endDate,
          // Add some variation
          totalReturn: baseResult.totalReturn * (0.8 + Math.random() * 0.4),
          annualizedReturn: baseResult.annualizedReturn * (0.8 + Math.random() * 0.4),
          maxDrawdown: baseResult.maxDrawdown * (0.8 + Math.random() * 0.4),
          sharpeRatio: baseResult.sharpeRatio * (0.8 + Math.random() * 0.4),
        };
      });
      
      return comparisonResults;
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <BacktestContext.Provider
      value={{
        strategies,
        results,
        selectedStrategy,
        isRunning,
        selectStrategy,
        runBacktest,
        compareStrategies
      }}
    >
      {children}
    </BacktestContext.Provider>
  );
};