'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type FormData = {
  pair: string;
  action: 'buy' | 'sell';
  entryPrice: string;
  stopLoss: string;
  takeProfit: string;
  timeframe: string;
  description: string;
};

export function SignalManagement() {
  const [formData, setFormData] = useState<FormData>({
    pair: '',
    action: 'buy',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    timeframe: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted signal:', formData);
    // Here you would typically make an API call to create the signal
    // Reset form
    setFormData({
      pair: '',
      action: 'buy',
      entryPrice: '',
      stopLoss: '',
      takeProfit: '',
      timeframe: '',
      description: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: 'buy' | 'sell') => {
    setFormData((prev) => ({ ...prev, action: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signal Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="pair"
            placeholder="Pair (e.g., BTC/USDT)"
            value={formData.pair}
            onChange={handleInputChange}
            required
          />
          <Select value={formData.action} onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="sell">Sell</SelectItem>
            </SelectContent>
          </Select>
          <Input
            name="entryPrice"
            type="number"
            step="0.00000001"
            placeholder="Entry Price"
            value={formData.entryPrice}
            onChange={handleInputChange}
            required
          />
          <Input
            name="stopLoss"
            type="number"
            step="0.00000001"
            placeholder="Stop Loss"
            value={formData.stopLoss}
            onChange={handleInputChange}
            required
          />
          <Input
            name="takeProfit"
            type="number"
            step="0.00000001"
            placeholder="Take Profit"
            value={formData.takeProfit}
            onChange={handleInputChange}
            required
          />
          <Input
            name="timeframe"
            placeholder="Timeframe (e.g., 1h, 4h, 1d)"
            value={formData.timeframe}
            onChange={handleInputChange}
            required
          />
          <Textarea
            name="description"
            placeholder="Signal Description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          <Button type="submit" className="w-full">
            Post Signal
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
