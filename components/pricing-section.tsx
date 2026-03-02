import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const plans = [
  {
    name: 'Free',
    price: '0',
    features: [
      'Trading on 15 exchanges',
      'Stop-limit orders (10)',
      'OCOs (2)',
      'Technical analysis with saving templates',
      'Workspace Templates',
      'Analytical dashboard (30 days)',
      'Demo trading robots (14 days)',
      'BINANCE 2 demo accounts',
    ],
    buttonText: 'Choose plan',
    buttonVariant: 'outline' as const,
  },
  {
    name: 'Basic PRO',
    price: '19',
    features: [
      'Stop-limit orders',
      'OCOs (20)',
      'Multiple accounts',
      'Analytical dashboard',
      'Demo trading robots',
      'Add your strategy: 1 bot',
      'Free package included',
    ],
    buttonText: 'Choose plan',
    buttonVariant: 'default' as const,
    popular: true,
  },
  {
    name: 'Expert PRO',
    price: '99',
    features: [
      '11 trading robots',
      'Multiple accounts',
      'Signal trading and Autofollowing',
      'Copytrading',
      'E-Trade integration',
      'Analytical dashboard',
      'Free package included',
    ],
    buttonText: 'Choose plan',
    buttonVariant: 'default' as const,
  },
  {
    name: 'Signals PRO',
    price: '109',
    features: [
      '15 exchanges',
      'Cryptorobotics Signals channel',
      'Cryptoteks Signals channel',
      'Bitmind Signals channel',
      'AI Alpha Signals channel',
      'E-Trade Signals channel',
      'Flash Signals channel',
    ],
    buttonText: 'Choose plan',
    buttonVariant: 'default' as const,
  },
];

export function PricingSection() {
  return (
    <section className="bg-gradient-to-b from-background to-primary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">Choose Your Plan</h2>
          <p className="text-xl text-muted-foreground">
            Select the perfect plan for your trading needs
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary' : ''}`}>
              {plan.popular && (
                <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price !== '0' && <span className="text-muted-foreground">/month</span>}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.buttonVariant}>
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
