export type PlanType = 'ONE_MONTH' | 'THREE_MONTHS' | 'SIX_MONTHS' | 'ONE_YEAR';

export interface Subscription {
  id: string;
  userId: string;
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'SUSPENDED' | 'PRIVATE';
  plan: PlanType;
  startDate: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
