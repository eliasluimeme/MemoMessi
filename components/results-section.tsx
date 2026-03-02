'use client';

import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  stats: {
    signals: number;
    wins: number;
    losses: number;
    total: number;
    winRate: number;
  };
}

function StatsCard({ title, stats }: Omit<StatsCardProps, 'accentColor' | 'buttonColor'>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="text-center text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">SIGNALS</p>
            <motion.p
              className="text-2xl font-bold text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              {stats.signals}
            </motion.p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">WINS</p>
            <motion.p
              className="text-2xl font-bold text-emerald-500"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {stats.wins}
            </motion.p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">LOSSES</p>
            <motion.p
              className="text-2xl font-bold text-rose-500"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {stats.losses}
            </motion.p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">WIN RATE</p>
            <motion.p
              className="text-2xl font-bold text-blue-500"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {stats.winRate}%
            </motion.p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button className="mt-4 w-full bg-primary hover:bg-primary/90">View Report</Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}

export function ResultsSection() {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">Our signals bring results</h2>
          <p className="text-xl text-muted-foreground">
            Check out our latest results and see how we&apos;re performing!
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="SPOT SEPTEMBER 2024"
            stats={{
              signals: 123,
              wins: 96,
              losses: 27,
              total: 1013,
              winRate: 78,
            }}
          />
          <StatsCard
            title="SPOT OCTOBER 2024"
            stats={{
              signals: 2,
              wins: 1,
              losses: 1,
              total: 1,
              winRate: 50,
            }}
          />
          <StatsCard
            title="SPOT NOVEMBER 2024"
            stats={{
              signals: 42,
              wins: 30,
              losses: 12,
              total: 71,
              winRate: 71,
            }}
          />
          <StatsCard
            title="SPOT DECEMBER 2024"
            stats={{
              signals: 44,
              wins: 28,
              losses: 16,
              total: 64,
              winRate: 64,
            }}
          />
        </div>
      </div>
    </section>
  );
}
