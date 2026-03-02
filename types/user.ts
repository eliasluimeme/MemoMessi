import { Prisma } from '@prisma/client';

import { Subscription } from './subscription';

export interface User {
  id: string;
  fullName: string;
  email: string;
  emailVerified?: boolean;
  phoneNumber: string;
  // password: string;
  image?: string;
  role: 'ADMIN' | 'USER';
  verified: boolean;
  subscriptions?: Subscription;
  createdAt: Date;
  updatedAt: Date;
}

export type TUser = Prisma.UserGetPayload<{
  include: {
    subscriptions: true;
  };
}>;
