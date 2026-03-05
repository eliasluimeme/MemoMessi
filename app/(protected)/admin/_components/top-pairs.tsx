import { prisma } from '@/lib/prisma';
import { Flame, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TokenImage } from '@/components/token-image';
import { cn } from '@/lib/utils';

interface PairRow {
  pair: string;
  total_signals: number;
  wins: number;
  losses: number;
  avg_max_gain: number;
}

export async function TopPairs() {
  const rows = await prisma.$queryRaw<PairRow[]>`
    SELECT
      s.pair,
      CAST(COUNT(*) AS INTEGER)                                                          AS total_signals,
      CAST(COUNT(*) FILTER (WHERE EXISTS (
        SELECT 1 FROM "targets" t WHERE t.signal_id = s.id AND t.hit = true
      )) AS INTEGER)                                                                     AS wins,
      CAST(COUNT(*) FILTER (WHERE NOT EXISTS (
        SELECT 1 FROM "targets" t WHERE t.signal_id = s.id AND t.hit = true
      )) AS INTEGER)                                                                     AS losses,
      COALESCE(AVG((
        SELECT COALESCE(MAX(t.gain), 0) FROM "targets" t WHERE t.signal_id = s.id
      )), 0)                                                                             AS avg_max_gain
    FROM "signals" s
    WHERE s.status = 'CLOSED'
    GROUP BY s.pair
    HAVING COUNT(*) >= 1
    ORDER BY wins DESC, total_signals DESC
    LIMIT 8
  `;

  return (
    <div className="flex flex-col rounded-[24px] border border-border/40 bg-card/40 backdrop-blur-xl p-8 gap-6 group transition-all hover:bg-card/60 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Alpha Pairs
          </span>
          <p className="text-2xl font-light tracking-tight text-foreground">
            Top Performers
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Flame className="h-4 w-4 text-amber-500" />
        </div>
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground/40 uppercase tracking-widest">
          No closed signals yet
        </div>
      ) : (
        <div className="space-y-1 flex-1">
          {/* Column Headers */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-3 pb-2 border-b border-border/40">
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-semibold">Pair</span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-semibold text-center">W/L</span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-semibold text-right">Win%</span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-semibold text-right">Avg Gain</span>
          </div>

          {rows.map((row, i) => {
            const base = row.pair.split('/')[0] ?? row.pair;
            const total = Number(row.total_signals);
            const wins = Number(row.wins);
            const losses = Number(row.losses);
            const winRate = total > 0 ? (wins / total) * 100 : 0;
            const avgGain = Number(row.avg_max_gain);
            const isTop = i < 3;

            return (
              <div
                key={row.pair}
                className={cn(
                  'grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-3 py-2.5 rounded-xl transition-all hover:bg-secondary/30',
                  isTop && 'bg-secondary/10'
                )}
              >
                {/* Pair + token image */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <TokenImage token={base} className="h-7 w-7 rounded-lg flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-foreground truncate">{base}</p>
                    <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider">{total} signals</p>
                  </div>
                  {isTop && (
                    <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider ml-1">
                      #{i + 1}
                    </span>
                  )}
                </div>

                {/* W/L */}
                <div className="flex items-center gap-1 text-[11px] font-semibold">
                  <span className="text-emerald-500">{wins}</span>
                  <span className="text-muted-foreground/30">/</span>
                  <span className="text-rose-500">{losses}</span>
                </div>

                {/* Win rate */}
                <div className="text-right">
                  <span className={cn(
                    'text-[11px] font-bold',
                    winRate >= 70 ? 'text-emerald-500' : winRate >= 50 ? 'text-amber-500' : 'text-rose-500'
                  )}>
                    {winRate.toFixed(0)}%
                  </span>
                </div>

                {/* Avg gain */}
                <div className="flex items-center justify-end gap-1">
                  {avgGain > 0 ? (
                    <TrendingUp className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                  ) : avgGain < 0 ? (
                    <TrendingDown className="h-3 w-3 text-rose-500 flex-shrink-0" />
                  ) : (
                    <Minus className="h-3 w-3 text-muted-foreground/40 flex-shrink-0" />
                  )}
                  <span className={cn(
                    'font-mono text-[11px] font-bold',
                    avgGain > 0 ? 'text-emerald-500' : avgGain < 0 ? 'text-rose-500' : 'text-muted-foreground/40'
                  )}>
                    {avgGain > 0 ? '+' : ''}{avgGain.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
