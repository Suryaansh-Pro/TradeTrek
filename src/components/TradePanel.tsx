import React, { useState } from 'react';
import { useMarket } from '@/context/MarketContext';
import { usePortfolio } from '@/context/PortfolioContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Order } from '@/types/market';
import { WatchIcon as StopwatchIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from 'lucide-react';

export default function TradePanel() {
  const { selectedStock } = useMarket();
  const { portfolio, placeOrder, isLoading } = usePortfolio();
  
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState<number>(1);
  const [limitPrice, setLimitPrice] = useState<number>(selectedStock?.lastPrice || 0);
  const [stopLoss, setStopLoss] = useState<boolean>(false);
  const [stopPrice, setStopPrice] = useState<number>(
    orderSide === 'BUY'
      ? (selectedStock?.lastPrice || 0) * 1.05
      : (selectedStock?.lastPrice || 0) * 0.95
  );
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  
  const maxQuantity = orderSide === 'BUY'
    ? Math.floor(portfolio.balance / (limitPrice || selectedStock?.lastPrice || 1))
    : getMaxSellQuantity();
    
  function getMaxSellQuantity(): number {
    if (!selectedStock) return 0;
    
    const holding = portfolio.holdings.find(h => h.symbol === selectedStock.symbol);
    return holding?.quantity || 0;
  }
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (value > maxQuantity) {
      setQuantity(maxQuantity);
    } else {
      setQuantity(value);
    }
  };

  const handleQuantitySlider = (value: number[]) => {
    setQuantity(Math.floor(value[0]));
  };
  
  const handleLimitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    
    if (isNaN(value) || value <= 0) {
      setLimitPrice(0.01);
    } else {
      setLimitPrice(value);
    }
  };
  
  const handleStopPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    
    if (isNaN(value) || value <= 0) {
      setStopPrice(0.01);
    } else {
      setStopPrice(value);
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedStock) return;
    
    const order: Order = {
      symbol: selectedStock.symbol,
      quantity,
      type: orderSide,
      orderType,
      price: orderType === 'LIMIT' ? limitPrice : undefined
    };
    
    await placeOrder(order);
    
    // Reset form
    setQuantity(1);
  };
  
  const estimatedValue = quantity * (orderType === 'MARKET' 
    ? (selectedStock?.lastPrice || 0) 
    : limitPrice
  );
  
  const isValidOrder = () => {
    if (!selectedStock) return false;
    if (quantity <= 0) return false;
    if (orderType === 'LIMIT' && limitPrice <= 0) return false;
    if (orderSide === 'BUY' && estimatedValue > portfolio.balance) return false;
    if (orderSide === 'SELL' && getMaxSellQuantity() < quantity) return false;
    
    return true;
  };

  if (!selectedStock) {
    return (
      <Card className="shadow-md bg-card/30 backdrop-blur-sm">
        <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
          <p className="text-muted-foreground">Select a stock to trade</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md bg-card/30 backdrop-blur-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Place Order</span>
          <span className="text-sm font-medium">
            {selectedStock.symbol} • <span className={selectedStock.change >= 0 ? "text-green-500" : "text-red-500"}>
              ₹{selectedStock.lastPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={orderSide} onValueChange={(value) => setOrderSide(value as 'BUY' | 'SELL')}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="BUY" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <ArrowUpCircleIcon className="h-4 w-4 mr-1" />
              Buy
            </TabsTrigger>
            <TabsTrigger value="SELL" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <ArrowDownCircleIcon className="h-4 w-4 mr-1" />
              Sell
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="orderType">Order Type</Label>
            <Select 
              value={orderType} 
              onValueChange={(value) => setOrderType(value as 'MARKET' | 'LIMIT')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Order Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MARKET">Market</SelectItem>
                <SelectItem value="LIMIT">Limit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={maxQuantity}
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
            
            {orderType === 'LIMIT' && (
              <div>
                <Label htmlFor="limitPrice">Limit Price (₹)</Label>
                <Input
                  id="limitPrice"
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={limitPrice}
                  onChange={handleLimitPriceChange}
                />
              </div>
            )}
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground">Quantity</Label>
            <Slider
              value={[quantity]}
              min={1}
              max={maxQuantity || 100}
              step={1}
              onValueChange={handleQuantitySlider}
              disabled={maxQuantity <= 0}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1</span>
              <span>Max: {maxQuantity}</span>
            </div>
          </div>
          
          {showAdvanced && (
            <div className="pt-2">
              <Separator className="mb-2" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="stopLoss" className="cursor-pointer">Stop Loss</Label>
                  <Switch
                    id="stopLoss"
                    checked={stopLoss}
                    onCheckedChange={setStopLoss}
                  />
                </div>
                
                {stopLoss && (
                  <div>
                    <Label htmlFor="stopPrice">Stop Price (₹)</Label>
                    <Input
                      id="stopPrice"
                      type="number"
                      min={0.01}
                      step={0.01}
                      value={stopPrice}
                      onChange={handleStopPriceChange}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2 text-sm">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Hide Advanced" : "Show Advanced"}
            </Button>
            
            <div className="text-right">
              <div className="text-muted-foreground">Estimated Value</div>
              <div className="font-mono font-medium">
                ₹{estimatedValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className={`w-full ${orderSide === 'BUY' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
          disabled={!isValidOrder() || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? (
            <StopwatchIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              {orderSide === 'BUY' ? 'Buy' : 'Sell'} {quantity} {selectedStock.symbol}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}