import React, { useState } from 'react';
import { useBacktest } from '@/context/BacktestContext';
import { useMarket } from '@/context/MarketContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BacktestResult } from '@/types/market';
import { cn } from '@/lib/utils';
import { PlayIcon, PauseIcon } from 'lucide-react';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BacktestPanel() {
  const { strategies, selectedStrategy, selectStrategy, runBacktest, isRunning } = useBacktest();
  const { selectedStock } = useMarket();
  
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');
  const [initialCapital, setInitialCapital] = useState(1000000);
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [selectedTab, setSelectedTab] = useState('parameters');
  
  // Strategy parameters
  const [params, setParams] = useState<Record<string, number | string | boolean>>({});
  
  const handleStrategyChange = (id: string) => {
    selectStrategy(id);
    const strategy = strategies.find(s => s.id === id);
    if (strategy) {
      setParams(strategy.parameters);
    }
  };
  
  const handleParamChange = (key: string, value: number | string | boolean) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleRunBacktest = async () => {
    if (!selectedStock) return;
    
    try {
      const result = await runBacktest(
        selectedStock.symbol,
        startDate,
        endDate,
        initialCapital
      );
      
      setResult(result);
      setSelectedTab('results');
    } catch (error) {
      console.error('Backtest failed:', error);
    }
  };
  
  const renderParam = (key: string, value: number | string | boolean) => {
    // Handle boolean parameters
    if (typeof value === 'boolean') {
      return (
        <div key={key} className="flex items-center justify-between">
          <Label htmlFor={key} className="cursor-pointer capitalize">
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </Label>
          <Switch
            id={key}
            checked={value as boolean}
            onCheckedChange={(checked) => handleParamChange(key, checked)}
          />
        </div>
      );
    }
    
    // Handle numeric parameters
    if (typeof value === 'number') {
      const min = key.includes('Period') ? 1 : 0;
      const max = key.includes('Period') ? 200 : 100;
      
      return (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={key} className="capitalize">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </Label>
            <span className="text-sm font-mono">{value}</span>
          </div>
          <Slider
            id={key}
            value={[value as number]}
            min={min}
            max={max}
            step={1}
            onValueChange={(vals) => handleParamChange(key, vals[0])}
          />
        </div>
      );
    }
    
    // Handle string parameters
    return (
      <div key={key} className="space-y-2">
        <Label htmlFor={key} className="capitalize">
          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
        </Label>
        <Input
          id={key}
          value={value as string}
          onChange={(e) => handleParamChange(key, e.target.value)}
        />
      </div>
    );
  };

  return (
    <Card className="shadow-md bg-card/30 backdrop-blur-sm h-full">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg">Backtest Strategy</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="parameters" className="space-y-4">
            <div>
              <Label htmlFor="strategy">Strategy</Label>
              <Select 
                value={selectedStrategy?.id} 
                onValueChange={handleStrategyChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a strategy" />
                </SelectTrigger>
                <SelectContent>
                  {strategies.map(strategy => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedStrategy && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedStrategy.description}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="initialCapital">Initial Capital (₹)</Label>
              <Input
                id="initialCapital"
                type="number"
                min={10000}
                step={10000}
                value={initialCapital}
                onChange={(e) => setInitialCapital(parseInt(e.target.value) || 100000)}
              />
            </div>
            
            {selectedStrategy && params && (
              <>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Strategy Parameters</h3>
                  {Object.entries(params).map(([key, value]) => renderParam(key, value))}
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="results">
            {result ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Return</p>
                    <p className={cn(
                      "text-2xl font-bold",
                      result.totalReturn >= 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {result.totalReturn >= 0 ? "+" : ""}{result.totalReturn.toFixed(2)}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Final Capital</p>
                    <p className="text-2xl font-bold">
                      ₹{result.finalCapital.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                    <p className="text-lg font-medium">{result.sharpeRatio.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Max Drawdown</p>
                    <p className="text-lg font-medium text-red-500">-{result.maxDrawdown.toFixed(2)}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-lg font-medium">{result.winRate.toFixed(1)}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Profit Factor</p>
                    <p className="text-lg font-medium">{result.profitFactor.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="h-48 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={result.dailyReturns}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => `${value.toFixed(1)}%`}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`${value.toFixed(2)}%`, 'Return']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      />
                      <defs>
                        <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="return" 
                        stroke="hsl(var(--chart-3))" 
                        fillOpacity={1}
                        fill="url(#colorReturn)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-muted-foreground mb-4">Run a backtest to see results</p>
                <Button variant="outline" onClick={() => setSelectedTab('parameters')}>
                  Configure Backtest
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {selectedTab === 'parameters' && (
          <Button 
            className="w-full" 
            disabled={!selectedStrategy || !selectedStock || isRunning}
            onClick={handleRunBacktest}
          >
            {isRunning ? (
              <>
                <PauseIcon className="mr-2 h-4 w-4" />
                Running...
              </>
            ) : (
              <>
                <PlayIcon className="mr-2 h-4 w-4" />
                Run Backtest
              </>
            )}
          </Button>
        )}
        
        {selectedTab === 'results' && result && (
          <Button 
            className="w-full" 
            onClick={() => setSelectedTab('parameters')}
            variant="outline"
          >
            Modify Parameters
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}