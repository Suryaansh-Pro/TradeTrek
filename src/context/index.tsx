import React, { ReactNode } from 'react';
import { MarketProvider } from './MarketContext';
import { PortfolioProvider } from './PortfolioContext';
import { BacktestProvider } from './BacktestContext';
import { ThemeProvider } from './ThemeContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <MarketProvider>
        <PortfolioProvider>
          <BacktestProvider>
            {children}
          </BacktestProvider>
        </PortfolioProvider>
      </MarketProvider>
    </ThemeProvider>
  );
};