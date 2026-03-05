'use client';

import { useState, useMemo } from 'react';

import Link from 'next/link';

import { SignalWithTargets } from '@/types/signal';
import { formatDistanceToNow } from 'date-fns';
import {
  ExternalLink, Lock, Pencil, Search, Share2,
  ArrowUpDown, X, SlidersHorizontal, TrendingUp, TrendingDown,
} from 'lucide-react';

import { DeleteSignalModal } from '@/components/modals/delete-signal-modal';
import { EditSignalModal } from '@/components/modals/edit-signal-modal';
import { CloseSignalModal } from '@/components/modals/close-signal-modal';
import { TokenImage } from '@/components/token-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import Pagination from '../../users/_components/pagination';
import SignalGains from './SignalGains';
import { SignalDetailsSheet } from './signal-details-sheet';

interface SignalsListProps {
  initialSignals: SignalWithTargets[];
}

const STATUS_LABELS: Record<string, string> = {
  WITHIN_ENTRY_ZONE: 'Within Entry Zone',
  TP1: 'TP1', TP2: 'TP2', TP3: 'TP3', TP4: 'TP4', TP5: 'TP5',
  TP6: 'TP6', TP7: 'TP7', TP8: 'TP8', TP9: 'TP9', TP10: 'TP10',
  CLOSED: 'Closed',
} as const;

type SortKey = 'newest' | 'oldest' | 'entry_asc' | 'entry_desc' | 'gains_desc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest',     label: 'Newest first' },
  { value: 'oldest',     label: 'Oldest first' },
  { value: 'entry_asc',  label: 'Entry ↑' },
  { value: 'entry_desc', label: 'Entry ↓' },
  { value: 'gains_desc', label: 'Gains ↓' },
];

// Status pill groups to avoid listing TP1–TP10 individually
const STATUS_PILL_GROUPS = [
  { key: 'all',               label: 'All' },
  { key: 'WITHIN_ENTRY_ZONE', label: 'Active' },
  { key: 'TP_HIT',            label: 'TP Hit' },
  { key: 'CLOSED',            label: 'Closed' },
];

const NETWORK_OPTIONS = ['all', 'solana', 'base', 'eth', 'ethereum', 'bsc'];
const NETWORK_LABELS: Record<string, string> = {
  all: 'All Networks', solana: 'Solana', base: 'Base',
  eth: 'Ethereum', ethereum: 'Ethereum', bsc: 'BSC',
};

export function SignalsList({ initialSignals }: SignalsListProps) {
  const [signals, setSignals]             = useState<SignalWithTargets[]>(initialSignals);
  const [currentPage, setCurrentPage]     = useState(1);
  const [pageSize, setPageSize]           = useState(10);
  const [searchTerm, setSearchTerm]       = useState('');
  const [statusFilter, setStatusFilter]   = useState<string>('all');
  const [networkFilter, setNetworkFilter] = useState<string>('all');
  const [dirFilter, setDirFilter]         = useState<'all' | 'BUY' | 'SELL'>('all');
  const [sortKey, setSortKey]             = useState<SortKey>('newest');
  const [selectedSignal, setSelectedSignal] = useState<SignalWithTargets | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen]     = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen]   = useState(false);

  // Count helpers (on raw list, before filter)
  const countStatus = (key: string) => {
    if (key === 'all') return signals.length;
    if (key === 'TP_HIT') return signals.filter((s) => s.status.startsWith('TP')).length;
    return signals.filter((s) => s.status === key).length;
  };

  const uniqueNetworks = useMemo(() => {
    const nets = new Set(signals.map((s) => (s.network ?? 'solana').toLowerCase()));
    return NETWORK_OPTIONS.filter((n) => n === 'all' || nets.has(n));
  }, [signals]);

  // Filter + sort
  const filteredSignals = useMemo(() => {
    let list = signals.filter((signal) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        signal.pair.toLowerCase().includes(q) ||
        (signal.contractAddress ?? '').toLowerCase().includes(q) ||
        (signal.network ?? '').toLowerCase().includes(q);

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'TP_HIT' ? signal.status.startsWith('TP') : signal.status === statusFilter);

      const signalNet = (signal.network ?? 'solana').toLowerCase();
      const matchNetwork =
        networkFilter === 'all' ||
        signalNet === networkFilter ||
        (networkFilter === 'eth' && signalNet === 'ethereum') ||
        (networkFilter === 'ethereum' && signalNet === 'eth');

      const matchDir =
        dirFilter === 'all' ||
        (signal.action ?? 'BUY').toUpperCase() === dirFilter;

      return matchSearch && matchStatus && matchNetwork && matchDir;
    });

    // Sort
    switch (sortKey) {
      case 'oldest':     list = [...list].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)); break;
      case 'newest':     list = [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)); break;
      case 'entry_asc':  list = [...list].sort((a, b) => a.entryZone - b.entryZone); break;
      case 'entry_desc': list = [...list].sort((a, b) => b.entryZone - a.entryZone); break;
      case 'gains_desc': list = [...list].sort((a, b) => {
        const g = (s: SignalWithTargets) => s.targets.filter(t => t.hit).reduce((acc, t) => acc + t.gain, 0);
        return g(b) - g(a);
      }); break;
    }
    return list;
  }, [signals, searchTerm, statusFilter, networkFilter, dirFilter, sortKey]);

  const totalPages  = Math.ceil(filteredSignals.length / pageSize);
  const startIndex  = (currentPage - 1) * pageSize;
  const currentSignals = filteredSignals.slice(startIndex, startIndex + pageSize);

  const activeFilterCount = [
    statusFilter !== 'all', networkFilter !== 'all', dirFilter !== 'all', searchTerm !== '',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchTerm(''); setStatusFilter('all');
    setNetworkFilter('all'); setDirFilter('all');
    setSortKey('newest'); setCurrentPage(1);
  };

  const handleDelete = () => setSignals((prev) => prev.filter((s) => s.id !== selectedSignal?.id));
  const handleClose  = () => setSignals((prev) =>
    prev.map((s) => s.id === selectedSignal?.id ? { ...s, status: 'CLOSED', isClosed: true } : s));
  const handleEdit   = (updated: SignalWithTargets) =>
    setSignals((prev) => prev.map((s) => s.id === updated.id ? updated : s));

  return (
    <div className="space-y-4">

      {/* ── Filter bar ─────────────────────────────────────────── */}
      <div className="rounded-2xl border dark:border-white/[0.06] border-border/60 dark:bg-white/[0.015] bg-card/40 backdrop-blur-sm p-4 space-y-4">

        {/* Row 1: search + sort + clear */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              placeholder="Search pair, CA, network…"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 h-9 rounded-xl dark:border-white/[0.08] border-border/60 dark:bg-white/[0.02] bg-background text-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Select value={sortKey} onValueChange={(v) => { setSortKey(v as SortKey); setCurrentPage(1); }}>
              <SelectTrigger className="h-9 w-[145px] rounded-xl dark:border-white/[0.08] border-border/60 dark:bg-white/[0.02] bg-background text-sm gap-1.5">
                <ArrowUpDown className="h-3 w-3 text-muted-foreground/50 flex-shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl dark:border-white/[0.08] border-border/60">
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value} className="text-sm">{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 h-9 px-3 rounded-xl border dark:border-white/[0.08] border-border/60 dark:bg-white/[0.02] bg-background text-[11px] font-semibold text-muted-foreground/70 hover:text-foreground dark:hover:border-white/[0.15] transition-all"
              >
                <X className="h-3 w-3" />
                Clear
                <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center">
                  {activeFilterCount}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Status pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] dark:text-white/20 text-muted-foreground/40 mr-1">
            <SlidersHorizontal className="h-2.5 w-2.5" /> Status
          </span>
          {STATUS_PILL_GROUPS.map((g) => {
            const count = countStatus(g.key);
            const active = statusFilter === g.key;
            return (
              <button
                key={g.key}
                onClick={() => { setStatusFilter(g.key); setCurrentPage(1); }}
                className={cn(
                  'flex items-center gap-1.5 h-7 px-3 rounded-full text-[11px] font-semibold border transition-all',
                  active
                    ? 'dark:bg-primary/15 bg-primary/10 border-primary/40 text-primary'
                    : 'dark:border-white/[0.07] border-border/50 dark:bg-white/[0.02] bg-background dark:text-white/40 text-muted-foreground/60 hover:dark:border-white/[0.14] hover:border-border hover:text-foreground'
                )}
              >
                {g.label}
                <span className={cn(
                  'text-[9px] font-black tabular-nums px-1 rounded',
                  active ? 'dark:bg-primary/20 bg-primary/15 text-primary' : 'dark:bg-white/[0.06] bg-muted/60 dark:text-white/30 text-muted-foreground/50'
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 3: Network + Direction chips */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {/* Network */}
          {uniqueNetworks.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] dark:text-white/20 text-muted-foreground/40">Net</span>
              {uniqueNetworks.map((net) => {
                const active = networkFilter === net;
                const label = net === 'all' ? 'All' : NETWORK_LABELS[net] ?? net;
                return (
                  <button
                    key={net}
                    onClick={() => { setNetworkFilter(net); setCurrentPage(1); }}
                    className={cn(
                      'h-6 px-2.5 rounded-full text-[10px] font-semibold border transition-all',
                      active
                        ? 'dark:bg-violet-500/15 bg-violet-500/10 border-violet-500/40 text-violet-400'
                        : 'dark:border-white/[0.07] border-border/50 dark:bg-white/[0.02] bg-background dark:text-white/35 text-muted-foreground/55 hover:dark:border-white/[0.14] hover:text-foreground'
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Direction */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] dark:text-white/20 text-muted-foreground/40">Dir</span>
            {(['all', 'BUY', 'SELL'] as const).map((d) => {
              const active = dirFilter === d;
              return (
                <button
                  key={d}
                  onClick={() => { setDirFilter(d); setCurrentPage(1); }}
                  className={cn(
                    'flex items-center gap-1 h-6 px-2.5 rounded-full text-[10px] font-semibold border transition-all',
                    active && d === 'BUY'  && 'dark:bg-emerald-500/15 bg-emerald-500/10 border-emerald-500/40 text-emerald-400',
                    active && d === 'SELL' && 'dark:bg-rose-500/15 bg-rose-500/10 border-rose-500/40 text-rose-400',
                    active && d === 'all'  && 'dark:bg-primary/15 bg-primary/10 border-primary/40 text-primary',
                    !active && 'dark:border-white/[0.07] border-border/50 dark:bg-white/[0.02] bg-background dark:text-white/35 text-muted-foreground/55 hover:dark:border-white/[0.14] hover:text-foreground'
                  )}
                >
                  {d === 'BUY' && <TrendingUp className="h-2.5 w-2.5" />}
                  {d === 'SELL' && <TrendingDown className="h-2.5 w-2.5" />}
                  {d === 'all' ? 'All' : d === 'BUY' ? 'Long' : 'Short'}
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <span className="ml-auto text-[10px] dark:text-white/20 text-muted-foreground/40 tabular-nums">
            {filteredSignals.length} result{filteredSignals.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────── */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pair</TableHead>
              <TableHead>Entry Zone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Gains</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSignals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <p className="text-sm text-muted-foreground/50">No signals match the current filters.</p>
                  <button onClick={clearFilters} className="mt-2 text-xs text-primary hover:underline">Clear filters</button>
                </TableCell>
              </TableRow>
            ) : currentSignals.map((signal) => (
              <TableRow key={signal.id}>
                <TableCell className="flex items-center gap-2 font-medium">
                  <TokenImage token={signal.pair.split('/')[0]} />
                  <div>
                    <p>{signal.pair}</p>
                    {signal.network && (
                      <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">{signal.network}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono font-medium">${signal.entryZone}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      signal.status === 'WITHIN_ENTRY_ZONE' ? 'success'
                      : signal.status === 'CLOSED' ? 'destructive'
                      : 'secondary'
                    }
                    className="w-fit text-nowrap text-center"
                  >
                    {STATUS_LABELS[signal.status] ?? signal.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <SignalGains targets={signal.targets} />
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  <div className="flex items-center gap-1.5">
                    {(signal.action ?? 'BUY').toUpperCase() === 'BUY'
                      ? <TrendingUp className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                      : <TrendingDown className="h-3 w-3 text-rose-400 flex-shrink-0" />}
                    {formatDistanceToNow(new Date(signal.createdAt), { addSuffix: true })}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => window.open(`/api/share/${signal.id}`, '_blank')} title="Share">
                      <Share2 className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/signals/${signal.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedSignal(signal); setIsEditModalOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {signal.status !== 'CLOSED' && (
                      <Button variant="ghost" size="sm" title="Close Signal" onClick={() => { setSelectedSignal(signal); setIsCloseModalOpen(true); }}>
                        <Lock className="h-4 w-4 text-amber-500" />
                      </Button>
                    )}
                    <SignalDetailsSheet
                      signal={signal}
                      onEditClick={() => { setSelectedSignal(signal); setIsEditModalOpen(true); }}
                      onDeleteClick={() => { setSelectedSignal(signal); setIsDeleteModalOpen(true); }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={(page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
      />

      {selectedSignal && (
        <>
          <DeleteSignalModal
            isOpen={isDeleteModalOpen}
            onClose={() => { setIsDeleteModalOpen(false); setSelectedSignal(null); }}
            signalId={selectedSignal.id}
            onDelete={handleDelete}
          />
          <EditSignalModal
            signal={selectedSignal}
            isOpen={isEditModalOpen}
            onClose={() => { setIsEditModalOpen(false); setSelectedSignal(null); }}
            onSuccess={handleEdit}
          />
          <CloseSignalModal
            isOpen={isCloseModalOpen}
            onClose={() => { setIsCloseModalOpen(false); setSelectedSignal(null); }}
            signalId={selectedSignal.id}
            onSuccess={handleClose}
          />
        </>
      )}
    </div>
  );
}
