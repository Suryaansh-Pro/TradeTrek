import React, { useState, useMemo, useEffect } from 'react';
import { useMarket } from '@/context/MarketContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ArrowUpIcon, ArrowDownIcon, SearchIcon } from 'lucide-react';

export default function MarketWatch() {
  const { stocks, selectStock, selectedStock } = useMarket();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof stocks[0] | null;
    direction: 'ascending' | 'descending';
  }>({ key: null, direction: 'ascending' });

  const filteredStocks = useMemo(() => {
    if (!searchQuery) return stocks;
    
    const query = searchQuery.toLowerCase();
    return stocks.filter(
      stock => 
        stock.symbol.toLowerCase().includes(query) || 
        stock.name.toLowerCase().includes(query)
    );
  }, [stocks, searchQuery]);

  const sortedStocks = useMemo(() => {
    let sortableStocks = [...filteredStocks];
    
    if (sortConfig.key) {
      sortableStocks.sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableStocks;
  }, [filteredStocks, sortConfig]);

  const handleSort = (key: keyof typeof stocks[0]) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  return (
    <Card className="h-full shadow-md bg-card/30 backdrop-blur-sm">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Market Watch</CardTitle>
          <div className="relative w-1/2">
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <div className="px-4 pb-2">
          <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground border-b border-border py-2">
            <div className="cursor-pointer" onClick={() => handleSort('symbol')}>Symbol</div>
            <div className="cursor-pointer text-right" onClick={() => handleSort('lastPrice')}>Price</div>
            <div className="cursor-pointer text-right" onClick={() => handleSort('change')}>Change</div>
            <div className="cursor-pointer text-right" onClick={() => handleSort('changePercent')}>Chg%</div>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-20rem)] pb-4">
          <div className="px-4">
            {sortedStocks.map((stock) => (
              <Button
                key={stock.symbol}
                variant="ghost"
                onClick={() => selectStock(stock.symbol)}
                className={cn(
                  "w-full justify-start p-2 h-auto text-left grid grid-cols-4 gap-2 text-sm border-b border-border",
                  selectedStock?.symbol === stock.symbol && "bg-muted"
                )}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{stock.symbol}</span>
                  <span className="text-xs text-muted-foreground truncate w-20">{stock.name}</span>
                </div>
                <div className="text-right font-mono">
                  ₹{stock.lastPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className={cn(
                  "text-right font-mono",
                  stock.change >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                </div>
                <div className={cn(
                  "text-right font-mono flex items-center justify-end",
                  stock.changePercent >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {stock.changePercent >= 0 ? (
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(stock.changePercent).toFixed(2)}%
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}