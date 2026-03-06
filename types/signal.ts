import { Favorite, Prisma } from '@prisma/client';

export enum Status {
  WITHIN_ENTRY_ZONE,
  TP1,
  TP2,
  TP3,
  TP4,
  TP5,
  TP6,
  CLOSED,
}

export interface Target {
  id: string;
  number: number;
  price: number;
  hit: boolean;
  signalId: string;
  gain: number;
}

export interface Signal {
  id: string;
  pair: string;
  market: string;
  action: string;
  entryZone: number;
  targets: Target[];
  stopLoss?: number;
  status: string;
  note?: string;
  imageUrl?: string;
  contractAddress?: string;
  network?: string;
  isVip?: boolean;
  isLocked?: boolean;
  createdAt: Date;
  updatedAt: Date;
  favorites?: Favorite[];
}

export type SignalWithTargets = Prisma.SignalGetPayload<{
  include: {
    targets: true;
    favorites: true;
  };
}> & { isLocked?: boolean; isFavorite?: boolean };
