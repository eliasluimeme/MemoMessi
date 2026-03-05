import { prisma } from '@/lib/prisma';
import { AlertTriangle, Clock, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';

const PLAN_SHORT: Record<string, string> = {
  ONE_MONTH: '1M',
  THREE_MONTHS: '3M',
  SIX_MONTHS: '6M',
  ONE_YEAR: '1Y',
};

interface ExpiringRow {
  full_name: string;
  email: string;
  expires_at: Date;
  plan: string;
}

export async function ExpiringUsers() {
  const rows = await prisma.$queryRaw<ExpiringRow[]>`
    SELECT
      u.full_name,
      u.email,
      s.expires_at,
      s.plan::text as plan
    FROM "subscriptions" s
    JOIN "profiles" u ON u.id = s.user_id
    WHERE s.status = 'ACTIVE'
      AND s.expires_at > NOW()
      AND s.expires_at <= NOW() + INTERVAL '30 days'
      AND u.role = 'USER'
    ORDER BY s.expires_at ASC
    LIMIT 8
  `;

  const urgentCount = rows.filter(r => differenceInDays(new Date(r.expires_at), new Date()) <= 7).length;

  return (
    <div className="flex flex-col rounded-[24px] border border-border/40 bg-card/40 backdrop-blur-xl p-8 gap-6 group transition-all hover:bg-card/60 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Churn Prevention
          </span>
          <p className="text-2xl font-light tracking-tight text-foreground">
            At-Risk Degens
          </p>
        </div>
        <div className={cn(
          'w-10 h-10 rounded-2xl flex items-center justify-center border',
          urgentCount > 0
            ? 'bg-rose-500/10 border-rose-500/20'
            : 'bg-primary/10 border-primary/20'
        )}>
          {urgentCount > 0
            ? <AlertTriangle className="h-4 w-4 text-rose-500" />
            : <Clock className="h-4 w-4 text-primary" />
          }
        </div>
      </div>

      {/* Urgent badge */}
      {urgentCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse flex-shrink-0" />
          <p className="text-xs text-rose-400 font-medium">
            <span className="font-bold text-rose-300">{urgentCount}</span> subscriber{urgentCount !== 1 ? 's' : ''} expiring within 7 days
          </p>
        </div>
      )}

      {/* List */}
      {rows.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
          <UserX className="h-8 w-8 text-muted-foreground/20" />
          <p className="text-xs text-muted-foreground/40 uppercase tracking-widest">
            No expirations in next 30 days
          </p>
        </div>
      ) : (
        <div className="space-y-1 flex-1 overflow-hidden">
          {rows.map((row, i) => {
            const expiresAt = new Date(row.expires_at);
            const daysLeft = differenceInDays(expiresAt, new Date());
            const isUrgent = daysLeft <= 7;
            const isWarning = daysLeft <= 14 && daysLeft > 7;
            const initials = row.full_name
              .split(' ')
              .slice(0, 2)
              .map(n => n[0])
              .join('')
              .toUpperCase();

            return (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-secondary/30',
                  isUrgent && 'bg-rose-500/5 border border-rose-500/10',
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold flex-shrink-0',
                  isUrgent ? 'bg-rose-500/15 text-rose-400' : 'bg-secondary/50 text-muted-foreground'
                )}>
                  {initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-foreground truncate">{row.full_name}</p>
                  <p className="text-[10px] text-muted-foreground/50 truncate">{row.email}</p>
                </div>

                {/* Plan + days */}
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60 bg-secondary/60 px-1.5 py-0.5 rounded-md">
                    {PLAN_SHORT[row.plan] ?? row.plan}
                  </span>
                  <span className={cn(
                    'text-[10px] font-bold',
                    isUrgent ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-muted-foreground/60'
                  )}>
                    {daysLeft}d left
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-4 border-t border-border/40 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">
          Next 30 Days
        </span>
        <span className="text-xs font-bold text-foreground">{rows.length} expiring</span>
      </div>
    </div>
  );
}
