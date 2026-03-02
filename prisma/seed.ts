import { Plan, PrismaClient, Role, Status, SubscriptionStatus } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Helper functions
  function getRandomExpiryDate() {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 365) + 1;
    return new Date(today.getTime() + randomDays * 24 * 60 * 60 * 1000);
  }

  function getRandomClosedDate() {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 30);
    return new Date(today.getTime() - randomDays * 24 * 60 * 60 * 1000);
  }

  // 1. Create Users with Subscriptions
  const users = [
    {
      fullName: 'Admin User',
      email: 'admin@signals.com',
      phoneNumber: '+1234567890',
      role: 'ADMIN' as Role,
      plan: 'ONE_YEAR' as Plan,
      status: 'ACTIVE' as SubscriptionStatus,
    },
    {
      fullName: 'Private Trader',
      email: 'private@signals.com',
      phoneNumber: '+1987654321',
      role: 'PRIVATE' as Role,
      plan: 'ONE_YEAR' as Plan,
      status: 'PRIVATE' as SubscriptionStatus,
    },
    {
      fullName: 'John Smith',
      email: 'john.smith@gmail.com',
      phoneNumber: '+1122334455',
      role: 'USER' as Role,
      plan: 'THREE_MONTHS' as Plan,
      status: 'ACTIVE' as SubscriptionStatus,
    },
    {
      fullName: 'Sarah Johnson',
      email: 'sarah.j@yahoo.com',
      phoneNumber: '+1234098765',
      role: 'USER' as Role,
      plan: 'SIX_MONTHS' as Plan,
      status: 'ACTIVE' as SubscriptionStatus,
    },
    {
      fullName: 'Michael Chen',
      email: 'm.chen@outlook.com',
      phoneNumber: '+1445566778',
      role: 'USER' as Role,
      plan: 'ONE_MONTH' as Plan,
      status: 'ACTIVE' as SubscriptionStatus,
    },
    {
      fullName: 'Emma Wilson',
      email: 'emma.w@hotmail.com',
      phoneNumber: '+1556677889',
      role: 'USER' as Role,
      plan: 'ONE_YEAR' as Plan,
      status: 'ACTIVE' as SubscriptionStatus,
    },
    {
      fullName: 'Alex Rodriguez',
      email: 'alex.r@gmail.com',
      phoneNumber: '+1667788990',
      role: 'USER' as Role,
      plan: 'THREE_MONTHS' as Plan,
      status: 'EXPIRED' as SubscriptionStatus,
    },
    {
      fullName: 'Lisa Thompson',
      email: 'lisa.t@yahoo.com',
      phoneNumber: '+1778899001',
      role: 'USER' as Role,
      plan: 'SIX_MONTHS' as Plan,
      status: 'SUSPENDED' as SubscriptionStatus,
    },
    {
      fullName: 'David Brown',
      email: 'david.b@gmail.com',
      phoneNumber: '+1889900112',
      role: 'USER' as Role,
      plan: 'ONE_MONTH' as Plan,
      status: 'PENDING' as SubscriptionStatus,
    },
    {
      fullName: 'Maria Garcia',
      email: 'maria.g@outlook.com',
      phoneNumber: '+1990011223',
      role: 'USER' as Role,
      plan: 'ONE_YEAR' as Plan,
      status: 'ACTIVE' as SubscriptionStatus,
    },
  ];

  const createdUsers = [];
  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        verified: true,
        subscriptions: {
          create: {
            status: user.status,
            plan: user.plan,
            expiresAt: getRandomExpiryDate(),
          },
        },
      },
    });
    createdUsers.push(createdUser);
  }

  // 2. Create Signals with Targets
  const signals = [
    {
      pair: 'BTC/USDT',
      market: 'SPOT',
      action: 'BUY',
      entryZone: 67500.0,
      stopLoss: 65800.0,
      note: 'Strong bullish momentum after golden cross. Watch for a potential breakout above $68K.',
      takeProfit: [
        { price: 69200.0, gain: 2.52 },
        { price: 71500.0, gain: 5.93 },
        { price: 73800.0, gain: 9.33 },
      ],
    },
    {
      pair: 'ETH/USDT',
      market: 'SPOT',
      action: 'BUY',
      entryZone: 3850.0,
      stopLoss: 3720.0,
      note: 'ETH showing strength near ATH. Multiple technical indicators suggest continued upward movement.',
      takeProfit: [
        { price: 3950.0, gain: 2.6 },
        { price: 4100.0, gain: 6.49 },
        { price: 4250.0, gain: 10.39 },
      ],
    },
    {
      pair: 'SOL/USDT',
      market: 'SPOT',
      action: 'BUY',
      entryZone: 125.5,
      stopLoss: 118.2,
      status: 'TP2' as Status,
      note: 'SOL breaking out of consolidation pattern. Volume increasing significantly.',
      takeProfit: [
        { price: 132.0, gain: 5.18 },
        { price: 138.5, gain: 10.36 },
        { price: 145.0, gain: 15.54 },
      ],
    },
    {
      pair: 'XRP/USDT',
      market: 'SPOT',
      action: 'BUY',
      entryZone: 0.62,
      stopLoss: 0.58,
      status: 'TP1' as Status,
      note: 'XRP forming ascending triangle pattern. Watch for breakout confirmation.',
      takeProfit: [
        { price: 0.65, gain: 4.84 },
        { price: 0.68, gain: 9.68 },
        { price: 0.72, gain: 16.13 },
      ],
    },
    {
      pair: 'ADA/USDT',
      market: 'SPOT',
      action: 'BUY',
      entryZone: 0.72,
      stopLoss: 0.68,
      note: 'ADA showing strong support at current levels. RSI indicates oversold conditions.',
      takeProfit: [
        { price: 0.76, gain: 5.56 },
        { price: 0.8, gain: 11.11 },
        { price: 0.85, gain: 18.06 },
      ],
    },
    {
      pair: 'AVAX/USDT',
      market: 'SPOT',
      action: 'BUY',
      entryZone: 45.8,
      stopLoss: 43.5,
      status: 'CLOSED' as Status,
      note: 'AVAX breaking key resistance. High volume supporting the move.',
      takeProfit: [
        { price: 48.0, gain: 4.8 },
        { price: 50.5, gain: 10.26 },
        { price: 53.0, gain: 15.72 },
      ],
    },
    {
      pair: 'MATIC/USDT',
      market: 'SPOT',
      action: 'BUY',
      entryZone: 0.95,
      stopLoss: 0.91,
      note: 'MATIC forming bullish divergence on 4H timeframe. Entry near strong support.',
      takeProfit: [
        { price: 0.99, gain: 4.21 },
        { price: 1.03, gain: 8.42 },
        { price: 1.08, gain: 13.68 },
      ],
    },
    {
      pair: 'DOT/USDT',
      market: 'SPOT',
      action: 'BUY',
      entryZone: 8.85,
      stopLoss: 8.45,
      status: 'TP3' as Status,
      note: 'DOT showing strong momentum after breaking resistance. Volume confirming breakout.',
      takeProfit: [
        { price: 9.2, gain: 3.95 },
        { price: 9.6, gain: 8.47 },
        { price: 10.0, gain: 12.99 },
      ],
    },
    {
      pair: 'LINK/USDT',
      market: 'SPOT',
      action: 'BUY',
      entryZone: 18.5,
      stopLoss: 17.8,
      note: 'LINK retesting previous resistance as support. Strong buying pressure observed.',
      takeProfit: [
        { price: 19.2, gain: 3.78 },
        { price: 20.0, gain: 8.11 },
        { price: 21.0, gain: 13.51 },
      ],
    },
    {
      pair: 'UNI/USDT',
      market: 'SPOT',
      action: 'BUY',
      entryZone: 12.2,
      stopLoss: 11.6,
      status: 'TP1' as Status,
      note: 'UNI forming cup and handle pattern. Watch for volume confirmation.',
      takeProfit: [
        { price: 12.8, gain: 4.92 },
        { price: 13.4, gain: 9.84 },
        { price: 14.0, gain: 14.75 },
      ],
    },
  ];

  const createdSignals = [];
  for (const signal of signals) {
    const createdSignal = await prisma.signal.create({
      data: {
        pair: signal.pair,
        market: signal.market,
        action: signal.action,
        entryZone: signal.entryZone,
        stopLoss: signal.stopLoss,
        note: signal.note,
        status: signal.status || 'WITHIN_ENTRY_ZONE',
        isClosed: signal.status === 'CLOSED',
        closedAt: signal.status === 'CLOSED' ? getRandomClosedDate() : null,
        targets: {
          create: signal.takeProfit.map((target, index) => ({
            number: index + 1,
            price: target.price,
            hit:
              signal.status === 'CLOSED'
                ? true
                : signal.status === 'TP3' && index <= 2
                  ? true
                  : signal.status === 'TP2' && index <= 1
                    ? true
                    : signal.status === 'TP1' && index === 0
                      ? true
                      : false,
            gain: target.gain,
          })),
        },
      },
    });
    createdSignals.push(createdSignal);
  }

  // 3. Create Favorites (Each user will favorite some random signals)
  const activeUsers = createdUsers.filter(
    (user) => user.role !== 'ADMIN' && user.role !== 'PRIVATE',
  );

  for (const user of activeUsers) {
    // Each user will favorite 3-7 random signals
    const numberOfFavorites = Math.floor(Math.random() * 5) + 3;
    const shuffledSignals = [...createdSignals].sort(() => Math.random() - 0.5);
    const selectedSignals = shuffledSignals.slice(0, numberOfFavorites);

    for (const signal of selectedSignals) {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          signalId: signal.id,
        },
      });
    }
  }

  // Log summary
  console.log('Seeding completed successfully!');
  console.log(`Created ${createdUsers.length} users`);
  console.log(`Created ${createdSignals.length} signals`);
  const favoritesCount = await prisma.favorite.count();
  console.log(`Created ${favoritesCount} favorites`);
  const targetsCount = await prisma.target.count();
  console.log(`Created ${targetsCount} targets`);
  const subscriptionsCount = await prisma.subscription.count();
  console.log(`Created ${subscriptionsCount} subscriptions`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// add rows with this command: npx prisma db seed
