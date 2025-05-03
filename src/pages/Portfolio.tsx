import React from 'react';
import PortfolioSummary from '@/components/PortfolioSummary';

export default function Portfolio() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4">
        <PortfolioSummary />
      </div>
    </div>
  );
}