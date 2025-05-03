import React from 'react';
import MarketWatch from '@/components/MarketWatch';
import StockChart from '@/components/StockChart';
import TradePanel from '@/components/TradePanel';
import { useMarket } from '@/context/MarketContext';

export default function Markets() {
  const { stockData, selectedTimeframe, setTimeframe, selectedStock, isLoading } = useMarket();
  
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-3">
          <MarketWatch />
        </div>
        <div className="col-span-12 lg:col-span-9 space-y-4">
          <StockChart
            data={stockData}
            timeframe={selectedTimeframe}
            onTimeframeChange={setTimeframe}
            isLoading={isLoading}
            stockName={selectedStock?.name}
            stockSymbol={selectedStock?.symbol}
          />
          <TradePanel />
        </div>
      </div>
    </div>
  );
}