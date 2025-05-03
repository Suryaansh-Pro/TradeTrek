import React from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { useMarket } from '@/context/MarketContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleDollarSign, TrendingUp, BarChart3, RefreshCw } from 'lucide-react';

export default function PortfolioSummary() {
  const { portfolio, refreshPortfolio, isLoading } = usePortfolio();
  const { stocks } = useMarket();

  return (
    <Card className="shadow-md bg-card/30 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Portfolio Summary</CardTitle>
            <CardDescription>
              Portfolio performance overview
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={refreshPortfolio}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium flex items-center text-muted-foreground">
              <CircleDollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
              Total Value
            </p>
            <p className="text-2xl font-bold">
              ₹{portfolio.totalValue.toLocaleString('en-IN', { 
                maximumFractionDigits: 0 
              })}
            </p>
            <div className={`text-xs font-medium flex items-center ${portfolio.dayChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <span>{portfolio.dayChangePercent >= 0 ? '+' : ''}</span>
              <span>₹{Math.abs(portfolio.dayChange).toLocaleString('en-IN', { 
                maximumFractionDigits: 0 
              })}</span>
              <span className="ml-1">
                ({portfolio.dayChangePercent >= 0 ? '+' : ''}{portfolio.dayChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium flex items-center text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-1 text-muted-foreground" />
              Cash Balance
            </p>
            <p className="text-2xl font-bold">
              ₹{portfolio.balance.toLocaleString('en-IN', { 
                maximumFractionDigits: 0 
              })}
            </p>
            <div className="text-xs text-muted-foreground">
              Equity: ₹{portfolio.equity.toLocaleString('en-IN', { 
                maximumFractionDigits: 0 
              })}
            </div>
          </div>
        </div>
      </CardContent>
      
      <div className="px-6 py-2">
        <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
          <BarChart3 className="h-4 w-4 mr-1" />
          Holdings
        </div>
        <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
          {portfolio.holdings.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No holdings yet. Start trading to build your portfolio.
            </div>
          ) : (
            portfolio.holdings.map((holding) => (
              <div key={holding.symbol} className="grid grid-cols-12 text-sm p-2 rounded-md hover:bg-muted">
                <div className="col-span-2 font-medium">{holding.symbol}</div>
                <div className="col-span-2 text-center font-medium">{holding.quantity}</div>
                <div className="col-span-3 text-right">₹{holding.avgPrice.toFixed(2)}</div>
                <div className="col-span-3 text-right">₹{holding.currentPrice.toFixed(2)}</div>
                <div className={`col-span-2 text-right ${holding.profitPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {holding.profitPercent >= 0 ? '+' : ''}{holding.profitPercent.toFixed(1)}%
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <CardFooter className="flex justify-between pt-2">
        <div className="text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleString('en-IN')}
        </div>
        <div className={`text-xs font-medium ${portfolio.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          Overall P&L: {portfolio.totalProfit >= 0 ? '+' : ''}
          ₹{portfolio.totalProfit.toLocaleString('en-IN', { 
            maximumFractionDigits: 0 
          })} 
          ({portfolio.totalProfitPercent >= 0 ? '+' : ''}{portfolio.totalProfitPercent.toFixed(2)}%)
        </div>
      </CardFooter>
    </Card>
  );
}