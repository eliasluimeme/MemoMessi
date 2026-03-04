import { GeneralAnalytics, SignalAnalytics, UserAnalytics } from '@/types/actions/analytics';
import { Plan, Role, Status, SubscriptionStatus } from '@prisma/client';

import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

const SUBSCRIPTION_PRICES = {
  ONE_MONTH: Number(process.env.NEXT_PUBLIC_ONE_MONTH),
  THREE_MONTHS: Number(process.env.NEXT_PUBLIC_THREE_MONTHS),
  SIX_MONTHS: Number(process.env.NEXT_PUBLIC_SIX_MONTHS),
  ONE_YEAR: Number(process.env.NEXT_PUBLIC_ONE_YEAR),
};

export async function getGeneralAnalytics(): Promise<GeneralAnalytics> {
  const session = await getSession();

  if (!session || (session.role !== Role.ADMIN && session.role !== Role.PRIVATE))
    throw new Error('Unauthorized: Admin access required');

  const now = new Date();
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  return await prisma.$transaction(async (tx) => {
    // Get all analytics in parallel
    const [subscriptionStats, signalStats] = await Promise.all([
      tx.$queryRaw<Array<{
        currentRevenue: number,
        lastRevenue: number,
        currentActiveUsers: number,
        lastMonthActiveUsers: number
      }>>`
        SELECT 
          COALESCE(CAST(SUM(CASE 
            WHEN s."created_at" >= ${firstDayCurrentMonth} AND u.role::text = 'USER'
            THEN 
              CASE 
                WHEN s.plan = 'ONE_MONTH' THEN ${SUBSCRIPTION_PRICES.ONE_MONTH}
                WHEN s.plan = 'THREE_MONTHS' THEN ${SUBSCRIPTION_PRICES.THREE_MONTHS}
                WHEN s.plan = 'SIX_MONTHS' THEN ${SUBSCRIPTION_PRICES.SIX_MONTHS}
                WHEN s.plan = 'ONE_YEAR' THEN ${SUBSCRIPTION_PRICES.ONE_YEAR}
                ELSE 0
              END
            ELSE 0 
          END) AS INTEGER), 0) as "currentRevenue",
          COALESCE(CAST(SUM(CASE 
            WHEN s."created_at" >= ${firstDayLastMonth} AND s."created_at" < ${firstDayCurrentMonth} AND u.role::text = 'USER'
            THEN 
              CASE 
                WHEN s.plan = 'ONE_MONTH' THEN ${SUBSCRIPTION_PRICES.ONE_MONTH}
                WHEN s.plan = 'THREE_MONTHS' THEN ${SUBSCRIPTION_PRICES.THREE_MONTHS}
                WHEN s.plan = 'SIX_MONTHS' THEN ${SUBSCRIPTION_PRICES.SIX_MONTHS}
                WHEN s.plan = 'ONE_YEAR' THEN ${SUBSCRIPTION_PRICES.ONE_YEAR}
                ELSE 0
              END
            ELSE 0 
          END) AS INTEGER), 0) as "lastRevenue",
          COALESCE(CAST(COUNT(DISTINCT u.id) FILTER (WHERE s.status::text = 'ACTIVE' AND u.role::text = 'USER') AS INTEGER), 0) as "currentActiveUsers",
          COALESCE(CAST(COUNT(DISTINCT u.id) FILTER (WHERE s.status::text = 'ACTIVE' AND u.role::text = 'USER' AND s."created_at" < ${firstDayCurrentMonth}) AS INTEGER), 0) as "lastMonthActiveUsers"
        FROM "subscriptions" s
        JOIN "profiles" u ON u.id = s."user_id"
      `,
      tx.$queryRaw<Array<{
        activeSignals: number,
        lastMonthActiveSignals: number,
        successfulTargets: number,
        totalTargets: number
      }>>`
        WITH signal_stats AS (
          SELECT 
            COALESCE(CAST(COUNT(*) FILTER (WHERE status::text != 'CLOSED') AS INTEGER), 0) as "activeSignals",
            COALESCE(CAST(COUNT(*) FILTER (WHERE status::text != 'CLOSED' AND "created_at" >= ${firstDayLastMonth} AND "created_at" < ${firstDayCurrentMonth}) AS INTEGER), 0) as "lastMonthActiveSignals",
            COALESCE(CAST(COUNT(*) FILTER (WHERE status::text = 'CLOSED') AS INTEGER), 0) as "closedSignals"
          FROM "signals"
        ),
        target_stats AS (
          SELECT 
            COALESCE(CAST(COUNT(*) FILTER (WHERE t.hit = true) AS INTEGER), 0) as "successfulTargets",
            COALESCE(CAST(COUNT(*) AS INTEGER), 0) as "totalTargets"
          FROM "signals" s
          JOIN "targets" t ON t."signal_id" = s.id
          WHERE s.status::text = 'CLOSED'
        )
        SELECT 
          COALESCE(s."activeSignals", 0) as "activeSignals",
          COALESCE(s."lastMonthActiveSignals", 0) as "lastMonthActiveSignals",
          COALESCE(t."successfulTargets", 0) as "successfulTargets",
          COALESCE(t."totalTargets", 0) as "totalTargets"
        FROM signal_stats s
        CROSS JOIN target_stats t
      `
    ]);

    const { currentRevenue, lastRevenue, currentActiveUsers, lastMonthActiveUsers } = subscriptionStats[0];
    const { activeSignals, lastMonthActiveSignals, successfulTargets, totalTargets } = signalStats[0];

    // Calculate trends
    const revenueTrend = lastRevenue ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 100;
    const usersTrend = lastMonthActiveUsers ? ((currentActiveUsers - lastMonthActiveUsers) / lastMonthActiveUsers) * 100 : 100;
    const activeSignalsTrend = lastMonthActiveSignals ? ((activeSignals - lastMonthActiveSignals) / lastMonthActiveSignals) * 100 : 100;
    const profitMargin = totalTargets > 0 ? (successfulTargets / totalTargets) * 100 : 0;

    return {
      totalRevenue: {
        title: 'Total Revenue',
        metric: (currentRevenue ?? 0).toLocaleString('en-US', {
          style: 'currency',
          currency: 'MAD',
        }),
        trend: { value: Number(revenueTrend.toFixed(1)), label: 'from last month' },
        icon: 'DollarSign',
      },
      activeUsers: {
        title: 'Active Users',
        metric: `+${currentActiveUsers ?? 0}`,
        trend: { value: Number((usersTrend ?? 0).toFixed(1)), label: 'from last month' },
        icon: 'Users',
      },
      activeSignals: {
        title: 'Active Signals',
        metric: `+${activeSignals ?? 0}`,
        trend: { value: Number((activeSignalsTrend ?? 0).toFixed(1)), label: 'from last month' },
        icon: 'Signal',
      },
      profitMargin: {
        title: 'Profit Margin',
        metric: `${(profitMargin ?? 0).toFixed(1)}%`,
        trend: {
          value: Number((profitMargin ?? 0).toFixed(1)),
          label: 'success rate',
        },
        icon: 'Percent',
      },
    };
  });
}

export async function getSignalAnalytics(): Promise<SignalAnalytics> {
  const session = await getSession();

  if (!session || (session.role !== Role.ADMIN && session.role !== Role.PRIVATE))
    throw new Error('Unauthorized: Admin access required');

  const now = new Date();
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  try {
    return await prisma.$transaction(
      async (tx) => {
        const [signalStats] = await Promise.all([
          tx.$queryRaw<Array<{
            totalSignals: number,
            lastMonthTotalSignals: number,
            activeSignals: number,
            lastMonthActiveSignals: number,
            closedSignals: number,
            lastMonthClosedSignals: number,
            successfulSignals: number,
            failedSignals: number,
            lastMonthSuccessfulSignals: number,
            lastMonthFailedSignals: number
          }>>`
            WITH signal_counts AS (
              SELECT 
                COALESCE(CAST(COUNT(*) AS INTEGER), 0) as "totalSignals",
                COALESCE(CAST(COUNT(*) FILTER (WHERE "created_at" >= ${firstDayLastMonth} AND "created_at" < ${firstDayCurrentMonth}) AS INTEGER), 0) as "lastMonthTotalSignals",
                COALESCE(CAST(COUNT(*) FILTER (WHERE status::text != ${Status.CLOSED}::text) AS INTEGER), 0) as "activeSignals",
                COALESCE(CAST(COUNT(*) FILTER (WHERE status::text != ${Status.CLOSED}::text AND "created_at" >= ${firstDayLastMonth} AND "created_at" < ${firstDayCurrentMonth}) AS INTEGER), 0) as "lastMonthActiveSignals",
                COALESCE(CAST(COUNT(*) FILTER (WHERE status::text = ${Status.CLOSED}::text) AS INTEGER), 0) as "closedSignals",
                COALESCE(CAST(COUNT(*) FILTER (WHERE status::text = ${Status.CLOSED}::text AND "created_at" >= ${firstDayLastMonth} AND "created_at" < ${firstDayCurrentMonth}) AS INTEGER), 0) as "lastMonthClosedSignals"
              FROM "signals"
            ),
            pnl_stats AS (
              SELECT
                COALESCE(CAST(COUNT(*) FILTER (
                  WHERE s.status::text = ${Status.CLOSED}::text 
                  AND NOT EXISTS (
                    SELECT 1 FROM "targets" t2 
                    WHERE t2."signal_id" = s.id 
                    AND t2.hit = false
                  )
                  AND EXISTS (
                    SELECT 1 FROM "targets" t3 
                    WHERE t3."signal_id" = s.id
                  )
                ) AS INTEGER), 0) as "successfulSignals",
                COALESCE(CAST(COUNT(*) FILTER (
                  WHERE s.status::text = ${Status.CLOSED}::text 
                  AND NOT EXISTS (
                    SELECT 1 FROM "targets" t2 
                    WHERE t2."signal_id" = s.id 
                    AND t2.hit = true
                  )
                ) AS INTEGER), 0) as "failedSignals",
                COALESCE(CAST(COUNT(*) FILTER (
                  WHERE s.status::text = ${Status.CLOSED}::text 
                  AND s."created_at" >= ${firstDayLastMonth} 
                  AND s."created_at" < ${firstDayCurrentMonth}
                  AND NOT EXISTS (
                    SELECT 1 FROM "targets" t2 
                    WHERE t2."signal_id" = s.id 
                    AND t2.hit = false
                  )
                  AND EXISTS (
                    SELECT 1 FROM "targets" t3 
                    WHERE t3."signal_id" = s.id
                  )
                ) AS INTEGER), 0) as "lastMonthSuccessfulSignals",
                COALESCE(CAST(COUNT(*) FILTER (
                  WHERE s.status::text = ${Status.CLOSED}::text 
                  AND s."created_at" >= ${firstDayLastMonth} 
                  AND s."created_at" < ${firstDayCurrentMonth}
                  AND NOT EXISTS (
                    SELECT 1 FROM "targets" t2 
                    WHERE t2."signal_id" = s.id 
                    AND t2.hit = true
                  )
                ) AS INTEGER), 0) as "lastMonthFailedSignals"
              FROM "signals" s
            )
            SELECT 
              COALESCE(sc."totalSignals", 0) as "totalSignals",
              COALESCE(sc."lastMonthTotalSignals", 0) as "lastMonthTotalSignals",
              COALESCE(sc."activeSignals", 0) as "activeSignals",
              COALESCE(sc."lastMonthActiveSignals", 0) as "lastMonthActiveSignals",
              COALESCE(sc."closedSignals", 0) as "closedSignals",
              COALESCE(sc."lastMonthClosedSignals", 0) as "lastMonthClosedSignals",
              COALESCE(ps."successfulSignals", 0) as "successfulSignals",
              COALESCE(ps."failedSignals", 0) as "failedSignals",
              COALESCE(ps."lastMonthSuccessfulSignals", 0) as "lastMonthSuccessfulSignals",
              COALESCE(ps."lastMonthFailedSignals", 0) as "lastMonthFailedSignals"
            FROM signal_counts sc
            CROSS JOIN pnl_stats ps
          `
        ]);

        const stats = signalStats[0];

        // Calculate trends and averages
        const totalSignalsTrend = stats.lastMonthTotalSignals
          ? ((stats.totalSignals - stats.lastMonthTotalSignals) / stats.lastMonthTotalSignals) * 100
          : 100;

        const activeSignalsTrend = stats.lastMonthActiveSignals
          ? ((stats.activeSignals - stats.lastMonthActiveSignals) / stats.lastMonthActiveSignals) * 100
          : 100;

        const closedSignalsTrend = stats.lastMonthClosedSignals
          ? ((stats.closedSignals - stats.lastMonthClosedSignals) / stats.lastMonthClosedSignals) * 100
          : 100;

        const currentPnL = stats.successfulSignals + stats.failedSignals > 0
          ? (stats.successfulSignals / (stats.successfulSignals + stats.failedSignals)) * 100
          : 0;

        const lastMonthPnL = stats.lastMonthSuccessfulSignals + stats.lastMonthFailedSignals > 0
          ? (stats.lastMonthSuccessfulSignals / (stats.lastMonthSuccessfulSignals + stats.lastMonthFailedSignals)) * 100
          : 0;

        const pnlTrend = lastMonthPnL
          ? currentPnL - lastMonthPnL
          : 0;

        return {
          totalSignals: {
            title: 'Total Signals',
            metric: stats.totalSignals.toString(),
            trend: { value: Number(totalSignalsTrend.toFixed(1)), label: 'from last month' },
            icon: 'Activity',
          },
          activeSignals: {
            title: 'Active Signals',
            metric: stats.activeSignals.toString(),
            trend: { value: Number(activeSignalsTrend.toFixed(1)), label: 'from last month' },
            icon: 'Activity',
          },
          closedSignals: {
            title: 'Closed Signals',
            metric: stats.closedSignals.toString(),
            trend: { value: Number(closedSignalsTrend.toFixed(1)), label: 'from last month' },
            icon: 'CheckCircle2',
          },
          pnl: {
            title: 'Profit Ratio',
            metric: `${currentPnL.toFixed(1)}%`,
            trend: { value: Number(pnlTrend.toFixed(1)), label: 'from last month' },
            icon: 'TrendingUp',
            sideInfo: [
              {
                label: 'Profit',
                value: stats.successfulSignals,
                icon: 'ArrowUpCircle',
                color: 'green'
              },
              {
                label: 'Active',
                value: stats.activeSignals,
                icon: 'Activity',
                color: 'neutral'
              },
              {
                label: 'Loss',
                value: stats.failedSignals,
                icon: 'ArrowDownCircle',
                color: 'red'
              }
            ]
          },
        };
      },
      {
        maxWait: 10000, // maximum time to wait for transaction to start
        timeout: 15000, // maximum time for the transaction to finish
        isolationLevel: 'ReadCommitted', // since we're only reading data
      }
    );
  } catch (error) {
    console.error('Error in getSignalAnalytics:', error);
    throw new Error('Failed to fetch signal analytics');
  }
}

export async function getUserAnalytics(): Promise<UserAnalytics> {
  const session = await getSession();

  if (!session || (session.role !== Role.ADMIN && session.role !== Role.PRIVATE))
    throw new Error('Unauthorized: Admin access required');

  const now = new Date();
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  return await prisma.$transaction(async (tx) => {
    const [queryResult] = await Promise.all([
      tx.$queryRaw<Array<{
        totalUsers: number,
        lastMonthUsers: number,
        activeUsers: number,
        lastMonthActiveUsers: number,
        expiredUsers: number,
        lastMonthExpiredUsers: number,
        newUsers: number,
        lastMonthNewUsers: number
      }>>`
        SELECT
          COALESCE(CAST(COUNT(DISTINCT u.id) FILTER (WHERE u.role::text = ${Role.USER}::text) AS INTEGER), 0) as "totalUsers",
          COALESCE(CAST(COUNT(DISTINCT u.id) FILTER (WHERE u.role::text = ${Role.USER}::text AND u."created_at" < ${firstDayCurrentMonth}) AS INTEGER), 0) as "lastMonthUsers",
          COALESCE(CAST(COUNT(DISTINCT u.id) FILTER (WHERE u.role::text = ${Role.USER}::text AND s.status::text = ${SubscriptionStatus.ACTIVE}::text) AS INTEGER), 0) as "activeUsers",
          COALESCE(CAST(COUNT(DISTINCT u.id) FILTER (WHERE u.role::text = ${Role.USER}::text AND s.status::text = ${SubscriptionStatus.ACTIVE}::text AND s."created_at" < ${firstDayCurrentMonth}) AS INTEGER), 0) as "lastMonthActiveUsers",
          COALESCE(CAST(COUNT(DISTINCT u.id) FILTER (WHERE u.role::text = ${Role.USER}::text AND s.status::text = ${SubscriptionStatus.EXPIRED}::text) AS INTEGER), 0) as "expiredUsers",
          COALESCE(CAST(COUNT(DISTINCT u.id) FILTER (WHERE u.role::text = ${Role.USER}::text AND s.status::text = ${SubscriptionStatus.EXPIRED}::text AND s."created_at" < ${firstDayCurrentMonth}) AS INTEGER), 0) as "lastMonthExpiredUsers",
          COALESCE(CAST(COUNT(DISTINCT u.id) FILTER (WHERE u.role::text = ${Role.USER}::text AND u."created_at" >= ${firstDayCurrentMonth}) AS INTEGER), 0) as "newUsers",
          COALESCE(CAST(COUNT(DISTINCT u.id) FILTER (WHERE u.role::text = ${Role.USER}::text AND u."created_at" >= ${firstDayLastMonth} AND u."created_at" < ${firstDayCurrentMonth}) AS INTEGER), 0) as "lastMonthNewUsers"
        FROM "profiles" u
        LEFT JOIN "subscriptions" s ON u.id = s."user_id"
      `
    ]);

    const {
      totalUsers,
      lastMonthUsers,
      activeUsers,
      lastMonthActiveUsers,
      expiredUsers,
      lastMonthExpiredUsers,
      newUsers,
      lastMonthNewUsers
    } = queryResult[0];

    // Calculate trends
    const usersTrend = lastMonthUsers ? ((totalUsers - lastMonthUsers) / lastMonthUsers) * 100 : 100;
    const activeUsersTrend = lastMonthActiveUsers ? ((activeUsers - lastMonthActiveUsers) / lastMonthActiveUsers) * 100 : 100;
    const expiredUsersTrend = lastMonthExpiredUsers ? ((expiredUsers - lastMonthExpiredUsers) / lastMonthExpiredUsers) * 100 : 100;
    const newUsersTrend = lastMonthNewUsers ? ((newUsers - lastMonthNewUsers) / lastMonthNewUsers) * 100 : 100;

    return {
      totalUsers: {
        title: 'Total Users',
        metric: (totalUsers ?? 0).toString(),
        trend: { value: Number((usersTrend ?? 0).toFixed(1)), label: 'from last month' },
        icon: 'Users',
      },
      activeUsers: {
        title: 'Active Users',
        metric: (activeUsers ?? 0).toString(),
        trend: { value: Number((activeUsersTrend ?? 0).toFixed(1)), label: 'from last month' },
        icon: 'UserCheck',
      },
      expiredUsers: {
        title: 'Expired Users',
        metric: (expiredUsers ?? 0).toString(),
        trend: { value: Number((expiredUsersTrend ?? 0).toFixed(1)), label: 'from last month' },
        icon: 'UserX',
      },
      newUsers: {
        title: 'New Users',
        metric: `+${newUsers ?? 0}`,
        trend: { value: Number((newUsersTrend ?? 0).toFixed(1)), label: 'from last month' },
        icon: 'UserPlus',
      },
    };
  });
}

export async function getTelegramAnalytics(): Promise<GeneralAnalytics> {
  const session = await getSession();

  if (!session || (session.role !== Role.ADMIN && session.role !== Role.PRIVATE))
    throw new Error('Unauthorized: Admin access required');

  const now = new Date();
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  return await prisma.$transaction(async (tx) => {
    const [telegramStats] = await Promise.all([
      tx.$queryRaw<Array<{
        totalLinkedUsers: number,
        lastMonthLinkedUsers: number,
        activeLinkedUsers: number,
        lastMonthActiveLinkedUsers: number,
        unlinkedUsers: number,
        lastMonthUnlinkedUsers: number
      }>>`
        SELECT
          COALESCE(CAST(COUNT(DISTINCT u.id) FILTER (WHERE u.role::text = ${Role.USER}::text AND u."telegram_chat_id" IS NOT NULL) AS INTEGER), 0) as "totalLinkedUsers",
          COALESCE(CAST(COUNT(DISTINCT u.id) FILTER (WHERE u.role::text = ${Role.USER}::text AND u."telegram_chat_id" IS NOT NULL AND u."created_at" < ${firstDayCurrentMonth}) AS INTEGER), 0) as "lastMonthLinkedUsers",
          COALESCE(CAST(COUNT(DISTINCT u.id) FILTER (WHERE u.role::text = ${Role.USER}::text AND u."telegram_chat_id" IS NOT NULL AND s.status::text = ${SubscriptionStatus.ACTIVE}::text) AS INTEGER), 0) as "activeLinkedUsers",
          COALESCE(CAST(COUNT(DISTINCT u.id) FILTER (WHERE u.role::text = ${Role.USER}::text AND u."telegram_chat_id" IS NOT NULL AND s.status::text = ${SubscriptionStatus.ACTIVE}::text AND s."created_at" < ${firstDayCurrentMonth}) AS INTEGER), 0) as "lastMonthActiveLinkedUsers",
          COALESCE(CAST(COUNT(DISTINCT u.id) FILTER (WHERE u.role::text = ${Role.USER}::text AND u."telegram_chat_id" IS NULL) AS INTEGER), 0) as "unlinkedUsers",
          COALESCE(CAST(COUNT(DISTINCT u.id) FILTER (WHERE u.role::text = ${Role.USER}::text AND u."telegram_chat_id" IS NULL AND u."created_at" < ${firstDayCurrentMonth}) AS INTEGER), 0) as "lastMonthUnlinkedUsers"
        FROM "profiles" u
        LEFT JOIN "subscriptions" s ON u.id = s."user_id"
      `
    ]);

    const {
      totalLinkedUsers,
      lastMonthLinkedUsers,
      activeLinkedUsers,
      lastMonthActiveLinkedUsers,
      unlinkedUsers,
      lastMonthUnlinkedUsers
    } = telegramStats[0];

    // Calculate trends
    const linkedUsersTrend = lastMonthLinkedUsers ? ((totalLinkedUsers - lastMonthLinkedUsers) / lastMonthLinkedUsers) * 100 : 100;
    const activeLinkedUsersTrend = lastMonthActiveLinkedUsers ? ((activeLinkedUsers - lastMonthActiveLinkedUsers) / lastMonthActiveLinkedUsers) * 100 : 100;
    const unlinkedUsersTrend = lastMonthUnlinkedUsers ? ((unlinkedUsers - lastMonthUnlinkedUsers) / lastMonthUnlinkedUsers) * 100 : 100;
    const linkRatio = totalLinkedUsers + unlinkedUsers > 0 ? (totalLinkedUsers / (totalLinkedUsers + unlinkedUsers)) * 100 : 0;

    return {
      totalLinkedUsers: {
        title: 'Total Linked Users',
        metric: (totalLinkedUsers ?? 0).toString(),
        trend: { value: Number((linkedUsersTrend ?? 0).toFixed(1)), label: 'from last month' },
        icon: 'Users',
      },
      activeLinkedUsers: {
        title: 'Active Linked Users',
        metric: (activeLinkedUsers ?? 0).toString(),
        trend: { value: Number((activeLinkedUsersTrend ?? 0).toFixed(1)), label: 'from last month' },
        icon: 'UserCheck',
      },
      unlinkedUsers: {
        title: 'Unlinked Users',
        metric: (unlinkedUsers ?? 0).toString(),
        trend: { value: Number((unlinkedUsersTrend ?? 0).toFixed(1)), label: 'from last month' },
        icon: 'UserX',
      },
      linkRatio: {
        title: 'Link Ratio',
        metric: `${(linkRatio ?? 0).toFixed(1)}%`,
        trend: { value: Number((linkRatio ?? 0).toFixed(1)), label: 'of total users' },
        icon: 'Percent',
      },
    };
  });
}