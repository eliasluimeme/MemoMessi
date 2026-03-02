import { AnalyticsCard as AnalyticsCardType } from '@/types/actions/analytics';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function AnalyticsCard({ title, metric, trend, icon, sideInfo }: AnalyticsCardType) {
  const isPositive = trend.value > 0;
  const Icon = LucideIcons[icon] as LucideIcon;
  return (
    <Card>
      <CardContent className="relative flex h-[140px] flex-col pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <div className="rounded-full bg-primary/5 p-2">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-medium text-muted-foreground sm:text-sm">{title}</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <p className="mt-2 text-3xl font-bold sm:text-4xl">{metric}</p>
          <div className="flex flex-col gap-1 pb-2">
            {sideInfo && (
              <div className="flex items-center gap-2">
                {sideInfo.map((info, index) => {
                  const SideIcon = LucideIcons[info.icon] as LucideIcon;
                  return (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-0.5">
                            <SideIcon
                              className={`h-3 w-3 ${
                                info.color === 'green'
                                  ? 'text-green-500'
                                  : info.color === 'red'
                                    ? 'text-red-500'
                                    : 'text-primary'
                              }`}
                            />
                            <span
                              className={`text-xs font-medium ${
                                info.color === 'green'
                                  ? 'text-green-500'
                                  : info.color === 'red'
                                    ? 'text-red-500'
                                    : 'text-primary'
                              }`}
                            >
                              {info.value}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{info.label} Signals</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            )}
            <p
              className={`flex items-center text-xs ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AnalyticsCardsProps {
  analytics: Record<string, AnalyticsCardType>;
}

export default function AnalyticsCards({ analytics }: AnalyticsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Object.entries(analytics).map(([key, card]) => (
        <AnalyticsCard key={key} {...card} />
      ))}
    </div>
  );
}
