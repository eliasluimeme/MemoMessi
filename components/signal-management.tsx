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

export function SignalManagement() {
  const [cryptocurrency, setCryptocurrency] = useState('');
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', { cryptocurrency, action, price: parseFloat(price) });
    // Reset form
    setCryptocurrency('');
    setAction('buy');
    setPrice('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signal Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Cryptocurrency"
            value={cryptocurrency}
            onChange={(e) => setCryptocurrency(e.target.value)}
          />
          <Select value={action} onValueChange={(value: 'buy' | 'sell') => setAction(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="sell">Sell</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Create Signal
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
