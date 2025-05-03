import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Stock, StockData, TimeFrame, StockQuote } from '@/types/market';
import { mockStocks, generateCandlestickData } from '@/lib/mockData';

interface MarketContextType {
  stocks: Stock[];
  stockData: StockData[];
  selectedStock: Stock | null;
  selectedTimeframe: TimeFrame;
  isLoading: boolean;
  selectStock: (symbol: string) => void;
  setTimeframe: (timeframe: TimeFrame) => void;
  getStockQuote: (symbol: string) => StockQuote | null;
  searchStocks: (query: string) => Stock[];
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};

interface MarketProviderProps {
  children: ReactNode;
}

export const MarketProvider: React.FC<MarketProviderProps> = ({ children }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>('1D');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize with mock data
  useEffect(() => {
    setStocks(mockStocks);
    setIsLoading(false);
    
    // Set initial selected stock
    if (mockStocks.length > 0) {
      selectStock(mockStocks[0].symbol);
    }
  }, []);

  const selectStock = (symbol: string) => {
    setIsLoading(true);
    
    // Find the stock in our list
    const stock = stocks.find(s => s.symbol === symbol) || null;
    setSelectedStock(stock);
    
    // Generate mock chart data for the selected timeframe
    const data = generateCandlestickData(selectedTimeframe, stock?.lastPrice || 500);
    setStockData(data);
    
    setIsLoading(false);
  };

  const setTimeframe = (timeframe: TimeFrame) => {
    setIsLoading(true);
    setSelectedTimeframe(timeframe);
    
    // Generate new data for the selected timeframe
    const data = generateCandlestickData(timeframe, selectedStock?.lastPrice || 500);
    setStockData(data);
    
    setIsLoading(false);
  };

  const getStockQuote = (symbol: string): StockQuote | null => {
    const stock = stocks.find(s => s.symbol === symbol);
    if (!stock) return null;
    
    return {
      symbol: stock.symbol,
      open: stock.open,
      high: stock.high,
      low: stock.low,
      price: stock.lastPrice,
      volume: stock.volume,
      latestTradingDay: new Date().toISOString().split('T')[0],
      previousClose: stock.close,
      change: stock.change,
      changePercent: stock.changePercent
    };
  };

  const searchStocks = (query: string): Stock[] => {
    if (!query) return stocks;
    
    const lowerQuery = query.toLowerCase();
    return stocks.filter(
      stock => 
        stock.symbol.toLowerCase().includes(lowerQuery) || 
        stock.name.toLowerCase().includes(lowerQuery)
    );
  };

  return (
    <MarketContext.Provider
      value={{
        stocks,
        stockData,
        selectedStock,
        selectedTimeframe,
        isLoading,
        selectStock,
        setTimeframe,
        getStockQuote,
        searchStocks
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};