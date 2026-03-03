'use client';

import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  Building2,
  GanttChartSquare,
  HardDriveDownload,
  LineChart,
  ShieldCheck,
} from 'lucide-react';

import { Card } from '@/components/ui/card';

const services = [
  {
    title: 'Alpha Signals',
    description: 'High-conviction memecoin calls before they hit the mainstream consciousness.',
    icon: LineChart,
  },
  {
    title: 'Rug Check',
    description: 'Automated security analysis to identify honeypots and malicious contracts.',
    icon: ShieldCheck,
  },
  {
    title: 'Instant Swap',
    description:
      'Integrated Jupiter and Uniswap terminals for the fastest execution in the market.',
    icon: HardDriveDownload,
  },
  {
    title: 'Whale Tracker',
    description:
      'Real-time alerts on smart money movements and insider wallet accumulations.',
    icon: GanttChartSquare,
  },
  {
    title: 'Risk Analytics',
    description: 'Advanced metrics on liquidity, volume, and market cap to manage your exposure.',
    icon: BarChart3,
  },
  {
    title: 'Market Mastery',
    description: 'Daily breakdowns of narrative shifts, from AI agents to cultural cult coins.',
    icon: BrainCircuit,
  },
  {
    title: 'Portfolio Alpha',
    description:
      'Live tracking of your signal performance with real-time PnL visualizations.',
    icon: Building2,
  },
  {
    title: 'Degen Education',
    description: 'Master the art of on-chain trading and learn how to spot 100x gems early.',
    icon: BookOpen,
  },
];

export function FeatureCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <Card
            key={index}
            className="group relative overflow-hidden rounded-[24px] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.04]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            <div className="relative space-y-5">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-zinc-300 transition-colors group-hover:bg-white/10">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-medium tracking-tight text-white">{service.title}</h2>
              <p className="text-sm font-light tracking-wide leading-relaxed text-zinc-400">{service.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
