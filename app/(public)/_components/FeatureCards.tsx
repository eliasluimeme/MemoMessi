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
    title: 'Investment Advisory',
    description: 'Offering personalized advice on how to invest in cryptocurrencies.',
    icon: LineChart,
  },
  {
    title: 'Market Analysis',
    description: 'Preparing regular reports on market performance and providing signals.',
    icon: BarChart3,
  },
  {
    title: 'Education and Training',
    description:
      'Conducting training sessions and educational content on cryptocurrency basics and trading.',
    icon: BookOpen,
  },
  {
    title: 'Portfolio Management',
    description:
      'Analyzing clients portfolios and recommending improvements to achieve optimal returns.',
    icon: GanttChartSquare,
  },
  {
    title: 'Mining Assistance',
    description: 'Helping clients understand the mechanics of cryptocurrency mining.',
    icon: HardDriveDownload,
  },
  {
    title: 'Risk Management',
    description: 'Developing strategies to minimize risks in cryptocurrency trading.',
    icon: ShieldCheck,
  },
  {
    title: 'Legal Compliance',
    description:
      'Explaining local and international regulations related to cryptocurrencies and offering advice on tax and financial compliance.',
    icon: Building2,
  },
  {
    title: 'Blockchain Development',
    description: 'Assisting businesses or individuals in launching their own blockchain projects.',
    icon: BrainCircuit,
  },
];

export function FeatureCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <Card
            key={index}
            className="group relative overflow-hidden rounded-[24px] border-0 bg-white/5 p-6 backdrop-blur-2xl transition-all duration-300 hover:bg-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-blue-500/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            <div className="relative space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-500/20">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-white">{service.title}</h2>
              <p className="text-sm leading-relaxed text-gray-300">{service.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
