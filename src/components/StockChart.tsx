import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { StockData, TimeFrame } from '@/types/market';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface StockChartProps {
  data: StockData[];
  timeframe: TimeFrame;
  onTimeframeChange: (timeframe: TimeFrame) => void;
  isLoading?: boolean;
  stockName?: string;
  stockSymbol?: string;
}

// Format currency in Indian format
const formatIndianCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-card p-4 rounded-md shadow-md border border-border">
        <p className="font-semibold text-sm">{label}</p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <p className="text-xs text-muted-foreground">Open:</p>
          <p className="text-xs font-mono text-right">{formatIndianCurrency(data.open)}</p>
          
          <p className="text-xs text-muted-foreground">High:</p>
          <p className="text-xs font-mono text-right">{formatIndianCurrency(data.high)}</p>
          
          <p className="text-xs text-muted-foreground">Low:</p>
          <p className="text-xs font-mono text-right">{formatIndianCurrency(data.low)}</p>
          
          <p className="text-xs text-muted-foreground">Close:</p>
          <p className="text-xs font-mono text-right">{formatIndianCurrency(data.close)}</p>
          
          <p className="text-xs text-muted-foreground">Volume:</p>
          <p className="text-xs font-mono text-right">
            {new Intl.NumberFormat('en-IN').format(data.volume)}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default function StockChart({
  data,
  timeframe,
  onTimeframeChange,
  isLoading = false,
  stockName,
  stockSymbol
}: StockChartProps) {
  const [chartType, setChartType] = useState('area');
  const [formattedData, setFormattedData] = useState<StockData[]>([]);

  useEffect(() => {
    // Format dates based on the timeframe
    const formatted = data.map(item => {
      return {
        ...item,
        formattedDate: new Date(item.date).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: timeframe === '1D' || timeframe === '1W' ? undefined : '2-digit'
        })
      };
    });
    
    setFormattedData(formatted);
  }, [data, timeframe]);

  // Get min and max values for the Y-axis
  const minValue = Math.min(...data.map(d => d.low));
  const maxValue = Math.max(...data.map(d => d.high));
  const yDomain = [minValue * 0.99, maxValue * 1.01]; // Add some padding

  return (
    <Card className="w-full shadow-md bg-card/30 backdrop-blur-sm">
      <div className="p-4 flex flex-wrap justify-between items-center border-b">
        <div>
          <h3 className="text-lg font-semibold">{stockName || 'Stock Chart'}</h3>
          {stockSymbol && <p className="text-xs text-muted-foreground">{stockSymbol}</p>}
        </div>
        
        <div className="flex space-x-2">
          <Tabs value={chartType} onValueChange={setChartType} className="w-auto">
            <TabsList className="h-8">
              <TabsTrigger value="area" className="text-xs h-6 px-2">Area</TabsTrigger>
              <TabsTrigger value="bar" className="text-xs h-6 px-2">Volume</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center border rounded-md p-0.5 h-8 bg-background/50">
            {(['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'] as TimeFrame[]).map(tf => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={cn(
                  "px-2 py-0.5 text-xs rounded-sm transition-colors",
                  timeframe === tf
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-muted"
                )}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <CardContent className="p-0 pt-4 h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart
                data={formattedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                <XAxis 
                  dataKey="formattedDate" 
                  tick={{ fontSize: 10 }}
                  tickMargin={10}
                  angle={-45}
                  height={60}
                />
                <YAxis 
                  domain={yDomain}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `₹${Math.round(value)}`}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke="hsl(var(--chart-2))"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            ) : (
              <BarChart
                data={formattedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                <XAxis 
                  dataKey="formattedDate"
                  tick={{ fontSize: 10 }}
                  tickMargin={10}
                  angle={-45}
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="volume" 
                  fill="hsl(var(--chart-1))" 
                  opacity={0.7}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}