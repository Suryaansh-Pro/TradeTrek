import React from 'react';
import BacktestPanel from '@/components/BacktestPanel';

export default function Backtest() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4">
        <BacktestPanel />
      </div>
    </div>
  );
}