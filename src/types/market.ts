export interface Stock {
  symbol: string;
  name: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  marketCap: number;
  sector: string;
}

export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Portfolio {
  balance: number;
  equity: number;
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalProfit: number;
  totalProfitPercent: number;
  holdings: Holding[];
  transactions: Transaction[];
}

export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  profit: number;
  profitPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  quantity: number;
  price: number;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  timestamp: string;
  value: number;
}

export interface Order {
  symbol: string;
  quantity: number;
  price?: number;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
}

export interface BacktestResult {
  strategyName: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  annualizedReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: number;
  winRate: number;
  profitFactor: number;
  dailyReturns: { date: string; return: number }[];
}

export type TimeFrame = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'MAX';

export interface StockQuote {
  symbol: string;
  open: number;
  high: number;
  low: number;
  price: number;
  volume: number;
  latestTradingDay: string;
  previousClose: number;
  change: number;
  changePercent: number;
}