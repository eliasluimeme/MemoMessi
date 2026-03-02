import * as LucideIcons from 'lucide-react';

interface SideInfo {
  label: string;
  value: number;
  icon: keyof typeof LucideIcons;
  color: 'green' | 'red' | 'neutral';
}

export interface AnalyticsCard {
  title: string;
  metric: string;
  trend: { value: number; label: string };
  icon: keyof typeof LucideIcons;
  sideInfo?: SideInfo[];
}

export type GeneralAnalytics = Record<string, AnalyticsCard>;
export type UserAnalytics = Record<string, AnalyticsCard>;
export type SignalAnalytics = Record<string, AnalyticsCard>;
