import { Stock, StockData, Portfolio, BacktestResult, TimeFrame } from '@/types/market';

// Mock Stocks Data
export const mockStocks: Stock[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    lastPrice: 2980.55,
    change: 42.65,
    changePercent: 1.45,
    open: 2938.25,
    high: 2989.90,
    low: 2933.15,
    close: 2937.90,
    volume: 4521354,
    marketCap: 20165432000000,
    sector: 'Energy'
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd.',
    lastPrice: 3842.30,
    change: -24.60,
    changePercent: -0.64,
    open: 3860.00,
    high: 3879.45,
    low: 3835.20,
    close: 3866.90,
    volume: 1234567,
    marketCap: 14059876000000,
    sector: 'Information Technology'
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    lastPrice: 1675.40,
    change: 25.75,
    changePercent: 1.56,
    open: 1659.90,
    high: 1682.50,
    low: 1654.30,
    close: 1649.65,
    volume: 3578921,
    marketCap: 9328745000000,
    sector: 'Financials'
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    lastPrice: 1458.25,
    change: -12.35,
    changePercent: -0.84,
    open: 1468.55,
    high: 1473.20,
    low: 1452.10,
    close: 1470.60,
    volume: 2983476,
    marketCap: 6074325000000,
    sector: 'Information Technology'
  },
  {
    symbol: 'HINDUNILVR',
    name: 'Hindustan Unilever Ltd.',
    lastPrice: 2543.85,
    change: 37.45,
    changePercent: 1.49,
    open: 2512.40,
    high: 2555.90,
    low: 2507.25,
    close: 2506.40,
    volume: 1298734,
    marketCap: 5972431000000,
    sector: 'Consumer Goods'
  },
  {
    symbol: 'BAJAJFINSV',
    name: 'Bajaj Finserv Ltd.',
    lastPrice: 1673.55,
    change: -27.90,
    changePercent: -1.64,
    open: 1705.00,
    high: 1708.35,
    low: 1668.20,
    close: 1701.45,
    volume: 874563,
    marketCap: 2658971000000,
    sector: 'Financials'
  },
  {
    symbol: 'WIPRO',
    name: 'Wipro Ltd.',
    lastPrice: 456.30,
    change: 8.75,
    changePercent: 1.96,
    open: 449.10,
    high: 458.95,
    low: 447.65,
    close: 447.55,
    volume: 3572198,
    marketCap: 2367894000000,
    sector: 'Information Technology'
  },
  {
    symbol: 'ITC',
    name: 'ITC Ltd.',
    lastPrice: 434.75,
    change: 6.30,
    changePercent: 1.47,
    open: 429.25,
    high: 436.50,
    low: 428.90,
    close: 428.45,
    volume: 8972341,
    marketCap: 5427685000000,
    sector: 'Consumer Goods'
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    lastPrice: 746.50,
    change: 15.80,
    changePercent: 2.16,
    open: 732.10,
    high: 749.80,
    low: 730.40,
    close: 730.70,
    volume: 6547823,
    marketCap: 6659871000000,
    sector: 'Financials'
  },
  {
    symbol: 'AXISBANK',
    name: 'Axis Bank Ltd.',
    lastPrice: 968.25,
    change: -7.50,
    changePercent: -0.77,
    open: 977.00,
    high: 979.45,
    low: 965.10,
    close: 975.75,
    volume: 2563419,
    marketCap: 2954678000000,
    sector: 'Financials'
  }
];

// Generate mock candlestick data based on timeframe
export const generateCandlestickData = (timeframe: TimeFrame, basePrice: number = 500): StockData[] => {
  const now = new Date();
  const data: StockData[] = [];
  let points = 0;
  
  // Determine number of data points based on timeframe
  switch (timeframe) {
    case '1D':
      points = 60; // 1-minute candles for 1 hour
      break;
    case '1W':
      points = 35; // 5-minute candles
      break;
    case '1M':
      points = 30; // Daily candles
      break;
    case '3M':
      points = 90; // Daily candles
      break;
    case '6M':
      points = 130; // Daily candles
      break;
    case '1Y':
      points = 250; // Trading days in a year
      break;
    case '5Y':
      points = 260; // Monthly data
      break;
    case 'MAX':
      points = 300;
      break;
    default:
      points = 60;
  }
  
  let price = basePrice;
  const volatility = basePrice * 0.005; // 0.5% base volatility
  
  for (let i = points; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    const change = (Math.random() - 0.5) * volatility;
    
    // Simulate some trend
    if (i < points / 2) {
      price += change * 1.2; // Upward trend in second half
    } else {
      price += change * 0.8; // Slightly downward trend in first half
    }
    
    const open = price;
    const high = open + Math.random() * volatility;
    const low = open - Math.random() * volatility;
    const close = (open + high + low + open) / 4 + (Math.random() - 0.5) * volatility / 2;
    const volume = Math.floor(Math.random() * 1000000) + 500000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume
    });
    
    price = close;
  }
  
  return data;
};

// Mock Portfolio Data
export const mockPortfolio: Portfolio = {
  balance: 500000,
  equity: 850000,
  totalValue: 1350000,
  dayChange: 12500,
  dayChangePercent: 0.94,
  totalProfit: 50000,
  totalProfitPercent: 3.85,
  holdings: [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd.',
      quantity: 100,
      avgPrice: 2850.50,
      currentPrice: 2980.55,
      value: 298055,
      profit: 13005,
      profitPercent: 4.56,
      dayChange: 4265,
      dayChangePercent: 1.45
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services Ltd.',
      quantity: 50,
      avgPrice: 3750.25,
      currentPrice: 3842.30,
      value: 192115,
      profit: 4602.5,
      profitPercent: 2.46,
      dayChange: -1230,
      dayChangePercent: -0.64
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd.',
      quantity: 200,
      avgPrice: 1600.00,
      currentPrice: 1675.40,
      value: 335080,
      profit: 15080,
      profitPercent: 4.71,
      dayChange: 5150,
      dayChangePercent: 1.56
    },
    {
      symbol: 'SBIN',
      name: 'State Bank of India',
      quantity: 150,
      avgPrice: 710.75,
      currentPrice: 746.50,
      value: 111975,
      profit: 5362.5,
      profitPercent: 5.03,
      dayChange: 2370,
      dayChangePercent: 2.16
    }
  ],
  transactions: [
    {
      id: 'tr-1',
      symbol: 'RELIANCE',
      quantity: 100,
      price: 2850.50,
      type: 'BUY',
      orderType: 'MARKET',
      status: 'COMPLETED',
      timestamp: '2023-09-15T10:30:45Z',
      value: 285050
    },
    {
      id: 'tr-2',
      symbol: 'TCS',
      quantity: 50,
      price: 3750.25,
      type: 'BUY',
      orderType: 'LIMIT',
      status: 'COMPLETED',
      timestamp: '2023-09-16T09:15:30Z',
      value: 187512.5
    },
    {
      id: 'tr-3',
      symbol: 'HDFCBANK',
      quantity: 200,
      price: 1600.00,
      type: 'BUY',
      orderType: 'MARKET',
      status: 'COMPLETED',
      timestamp: '2023-09-18T11:45:22Z',
      value: 320000
    },
    {
      id: 'tr-4',
      symbol: 'WIPRO',
      quantity: 75,
      price: 435.60,
      type: 'BUY',
      orderType: 'MARKET',
      status: 'COMPLETED',
      timestamp: '2023-09-20T14:25:10Z',
      value: 32670
    },
    {
      id: 'tr-5',
      symbol: 'WIPRO',
      quantity: 75,
      price: 450.25,
      type: 'SELL',
      orderType: 'LIMIT',
      status: 'COMPLETED',
      timestamp: '2023-10-05T10:12:33Z',
      value: 33768.75
    },
    {
      id: 'tr-6',
      symbol: 'SBIN',
      quantity: 150,
      price: 710.75,
      type: 'BUY',
      orderType: 'MARKET',
      status: 'COMPLETED',
      timestamp: '2023-10-08T09:30:15Z',
      value: 106612.5
    }
  ]
};

// Mock Backtest Results
export const mockBacktestResults: BacktestResult[] = [
  {
    strategyName: 'Moving Average Crossover',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    initialCapital: 1000000,
    finalCapital: 1125000,
    totalReturn: 12.5,
    annualizedReturn: 12.5,
    maxDrawdown: 8.3,
    sharpeRatio: 1.45,
    trades: 42,
    winRate: 62.5,
    profitFactor: 2.1,
    dailyReturns: Array.from({ length: 250 }, (_, i) => ({
      date: new Date(2023, 0, i + 1).toISOString().split('T')[0],
      return: (Math.random() - 0.45) * 0.8
    }))
  },
  {
    strategyName: 'RSI Momentum',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    initialCapital: 1000000,
    finalCapital: 1105000,
    totalReturn: 10.5,
    annualizedReturn: 10.5,
    maxDrawdown: 12.1,
    sharpeRatio: 1.15,
    trades: 58,
    winRate: 57.8,
    profitFactor: 1.85,
    dailyReturns: Array.from({ length: 250 }, (_, i) => ({
      date: new Date(2023, 0, i + 1).toISOString().split('T')[0],
      return: (Math.random() - 0.48) * 0.75
    }))
  },
  {
    strategyName: 'Bollinger Bands',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    initialCapital: 1000000,
    finalCapital: 1092500,
    totalReturn: 9.25,
    annualizedReturn: 9.25,
    maxDrawdown: 7.5,
    sharpeRatio: 1.1,
    trades: 36,
    winRate: 66.7,
    profitFactor: 2.3,
    dailyReturns: Array.from({ length: 250 }, (_, i) => ({
      date: new Date(2023, 0, i + 1).toISOString().split('T')[0],
      return: (Math.random() - 0.5) * 0.6
    }))
  }
];