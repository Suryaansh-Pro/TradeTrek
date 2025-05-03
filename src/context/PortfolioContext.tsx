import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Holding, Portfolio, Transaction, Order } from '@/types/market';
import { mockPortfolio } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

interface PortfolioContextType {
  portfolio: Portfolio;
  placeOrder: (order: Order) => Promise<boolean>;
  cancelOrder: (orderId: string) => void;
  refreshPortfolio: () => void;
  isLoading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

interface PortfolioProviderProps {
  children: ReactNode;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<Portfolio>(mockPortfolio);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Simulate portfolio fetching on mount
  useEffect(() => {
    refreshPortfolio();
  }, []);

  const refreshPortfolio = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setPortfolio(mockPortfolio);
      setIsLoading(false);
    }, 500);
  };

  const placeOrder = async (order: Order): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // For paper trading, we'll auto-execute the order
      const price = order.price || (Math.random() * 100 + 200).toFixed(2);
      const timestamp = new Date().toISOString();
      const value = parseFloat(price as any) * order.quantity;
      
      const newTransaction: Transaction = {
        id: `tr-${Date.now()}`,
        symbol: order.symbol,
        quantity: order.quantity,
        price: parseFloat(price as any),
        type: order.type,
        orderType: order.orderType,
        status: 'COMPLETED',
        timestamp,
        value
      };

      // Update portfolio balance
      const balanceChange = order.type === 'BUY' ? -value : value;
      
      // Update holdings
      let updatedHoldings = [...portfolio.holdings];
      const holdingIndex = updatedHoldings.findIndex(h => h.symbol === order.symbol);
      
      if (holdingIndex >= 0) {
        const holding = updatedHoldings[holdingIndex];
        
        if (order.type === 'BUY') {
          // Increase position
          const newQuantity = holding.quantity + order.quantity;
          const newAvgPrice = (holding.avgPrice * holding.quantity + value) / newQuantity;
          
          updatedHoldings[holdingIndex] = {
            ...holding,
            quantity: newQuantity,
            avgPrice: newAvgPrice,
            value: newQuantity * holding.currentPrice
          };
        } else {
          // Decrease position
          const newQuantity = holding.quantity - order.quantity;
          
          if (newQuantity <= 0) {
            // Remove holding if all shares sold
            updatedHoldings = updatedHoldings.filter((_, i) => i !== holdingIndex);
          } else {
            updatedHoldings[holdingIndex] = {
              ...holding,
              quantity: newQuantity,
              value: newQuantity * holding.currentPrice
            };
          }
        }
      } else if (order.type === 'BUY') {
        // Add new holding
        const newHolding: Holding = {
          symbol: order.symbol,
          name: order.symbol, // This would be fetched from API
          quantity: order.quantity,
          avgPrice: parseFloat(price as any),
          currentPrice: parseFloat(price as any),
          value: value,
          profit: 0,
          profitPercent: 0,
          dayChange: 0,
          dayChangePercent: 0
        };
        updatedHoldings.push(newHolding);
      }

      // Calculate new total equity value
      const equity = updatedHoldings.reduce((total, holding) => total + holding.value, 0);
      
      // Update portfolio
      const updatedPortfolio: Portfolio = {
        ...portfolio,
        balance: portfolio.balance + balanceChange,
        equity,
        totalValue: portfolio.balance + balanceChange + equity,
        holdings: updatedHoldings,
        transactions: [newTransaction, ...portfolio.transactions]
      };
      
      setPortfolio(updatedPortfolio);
      
      toast({
        title: 'Order Executed',
        description: `${order.type} ${order.quantity} ${order.symbol} at ₹${price}`,
        variant: 'default',
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Order Failed',
        description: 'Could not place order. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = (orderId: string) => {
    // Update the order status to cancelled
    setPortfolio(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => 
        t.id === orderId ? { ...t, status: 'CANCELLED' } : t
      )
    }));
    
    toast({
      title: 'Order Cancelled',
      description: `Order ${orderId} has been cancelled`,
    });
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        placeOrder,
        cancelOrder,
        refreshPortfolio,
        isLoading
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};