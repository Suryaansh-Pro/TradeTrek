import React from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { usePortfolio } from '@/context/PortfolioContext';
import { BarChart4, TrendingUp } from 'lucide-react';

export default function Header() {
  const { portfolio } = usePortfolio();

  return (
    <header className="border-b border-border sticky top-0 z-10 backdrop-blur-md bg-background/70">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BarChart4 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">TradeTrek</h1>
        </div>
        
        <div className="flex items-center">
          <nav className="flex items-center gap-6 mr-6">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `text-sm transition-colors ${isActive ? 'text-primary font-medium' : 'hover:text-primary'}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/markets" 
              className={({ isActive }) => 
                `text-sm transition-colors ${isActive ? 'text-primary font-medium' : 'hover:text-primary'}`
              }
            >
              Markets
            </NavLink>
            <NavLink 
              to="/watchlist" 
              className={({ isActive }) => 
                `text-sm transition-colors ${isActive ? 'text-primary font-medium' : 'hover:text-primary'}`
              }
            >
              Watchlist
            </NavLink>
            <NavLink 
              to="/portfolio" 
              className={({ isActive }) => 
                `text-sm transition-colors ${isActive ? 'text-primary font-medium' : 'hover:text-primary'}`
              }
            >
              Portfolio
            </NavLink>
            <NavLink 
              to="/backtest" 
              className={({ isActive }) => 
                `text-sm transition-colors ${isActive ? 'text-primary font-medium' : 'hover:text-primary'}`
              }
            >
              Backtest
            </NavLink>
          </nav>
          
          <div className="flex items-center gap-2">
            <div className="mr-4 px-3 py-1 bg-muted rounded-lg flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">₹{portfolio.totalValue.toLocaleString('en-IN')}</span>
            </div>
            <ThemeToggle />
            <NavLink to="/account">
              <Button size="sm">Account</Button>
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}