import React from 'react';
import StockChart from '@/components/StockChart';
import MarketWatch from '@/components/MarketWatch';
import TradePanel from '@/components/TradePanel';
import PortfolioSummary from '@/components/PortfolioSummary';
import BacktestPanel from '@/components/BacktestPanel';
import { useMarket } from '@/context/MarketContext';

export default function Dashboard() {
  const { stockData, selectedTimeframe, setTimeframe, selectedStock, isLoading } = useMarket();
  
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column - Market Watch */}
        <div className="col-span-12 lg:col-span-3">
          <MarketWatch />
        </div>
        
        {/* Center Column - Chart & Trading */}
        <div className="col-span-12 lg:col-span-6 space-y-4">
          <StockChart
            data={stockData}
            timeframe={selectedTimeframe}
            onTimeframeChange={setTimeframe}
            isLoading={isLoading}
            stockName={selectedStock?.name}
            stockSymbol={selectedStock?.symbol}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TradePanel />
            <PortfolioSummary />
          </div>
        </div>
        
        {/* Right Column - Backtest & Analysis */}
        <div className="col-span-12 lg:col-span-3">
          <BacktestPanel />
        </div>
      </div>
    </div>
  );
}