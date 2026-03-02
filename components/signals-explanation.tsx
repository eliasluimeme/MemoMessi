import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SignalsExplanation() {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-4xl font-bold">What are Crypto Trade Calls?</h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Trade calls otherwise commonly known as signals are a set of instructions sent to you
              in real time which layout which asset to buy, what price to buy it at, the targets to
              sell it at and most importantly the correct stop loss to ensure if a trade goes in the
              wrong direction the loss is minimal!
            </p>
            <Button variant="outline" size="lg">
              Read FAQ&apos;s
            </Button>
          </div>
          <div className="space-y-6">
            <ExampleSignalCard
              type="AltSignals Bitmex VVIP"
              pair="BTC/USDT"
              entry="48750"
              targets={['49500', '50250', '51000']}
              stopLoss="47500"
              className="bg-white"
            />
            <ExampleSignalCard
              type="AltSignals Masterclass VIP"
              pair="ETH/USDT"
              entry="2850"
              targets={['2900', '2950', '3000']}
              stopLoss="2800"
              className="bg-primary text-primary-foreground"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface ExampleSignalCardProps {
  type: string;
  pair: string;
  entry: string;
  targets: string[];
  stopLoss: string;
  className?: string;
}

function ExampleSignalCard({
  type,
  pair,
  entry,
  targets,
  stopLoss,
  className,
}: ExampleSignalCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{type}</CardTitle>
        <div className="text-blue text-sm">Trading Pair: {pair}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Entry Price:</span>
          <Badge variant="outline">{entry}</Badge>
        </div>
        <div className="space-y-2">
          <span className="font-medium">Targets:</span>
          {targets.map((target, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">Target {index + 1}</span>
              <Badge variant="outline">{target}</Badge>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Stop Loss:</span>
          <Badge variant="destructive">{stopLoss}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
