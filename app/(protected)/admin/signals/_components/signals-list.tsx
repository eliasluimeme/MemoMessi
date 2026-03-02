'use client';

import { useState } from 'react';

import Link from 'next/link';

import { SignalWithTargets } from '@/types/signal';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Pencil, Search, Share2 } from 'lucide-react';

import { DeleteSignalModal } from '@/components/modals/delete-signal-modal';
import { EditSignalModal } from '@/components/modals/edit-signal-modal';
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

import Pagination from '../../users/_components/pagination';
import SignalGains from './SignalGains';
import { SignalDetailsSheet } from './signal-details-sheet';

interface SignalsListProps {
  initialSignals: SignalWithTargets[];
}

const status = {
  WITHIN_ENTRY_ZONE: 'Within Entry Zone',
  TP1: 'TP1',
  TP2: 'TP2',
  TP3: 'TP3',
  TP4: 'TP4',
  TP5: 'TP5',
  TP6: 'TP6',
  TP7: 'TP7',
  TP8: 'TP8',
  TP9: 'TP9',
  TP10: 'TP10',
  CLOSED: 'Closed',
} as const;

export function SignalsList({ initialSignals }: SignalsListProps) {
  const [signals, setSignals] = useState<SignalWithTargets[]>(initialSignals);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSignal, setSelectedSignal] = useState<SignalWithTargets | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter signals
  const filteredSignals = signals.filter((signal) => {
    const matchesSearch = signal.pair.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || signal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRows = filteredSignals.length;
  const totalPages = Math.ceil(totalRows / pageSize);

  // Calculate pagination indexes
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentSignals = filteredSignals.slice(startIndex, endIndex);

  const handleDelete = () => {
    setSignals((prev) => prev.filter((signal) => signal.id !== selectedSignal?.id));
  };

  const getFilterLabel = (filter: string) => {
    switch (filter) {
      case 'all':
        return `All Signals (${filteredSignals.length})`;
      case 'WITHIN_ENTRY_ZONE':
        return `Within Entry Zone (${signals.filter((s) => s.status === 'WITHIN_ENTRY_ZONE').length})`;
      case 'CLOSED':
        return `Closed (${signals.filter((s) => s.status === 'CLOSED').length})`;
      default:
        if (filter.startsWith('TP')) {
          return `${filter} (${signals.filter((s) => s.status === filter).length})`;
        }
        return 'Filter by status';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search signals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{getFilterLabel('all')}</SelectItem>
            <SelectItem value="WITHIN_ENTRY_ZONE">{getFilterLabel('WITHIN_ENTRY_ZONE')}</SelectItem>
            <SelectItem value="TP1">{getFilterLabel('TP1')}</SelectItem>
            <SelectItem value="TP2">{getFilterLabel('TP2')}</SelectItem>
            <SelectItem value="TP3">{getFilterLabel('TP3')}</SelectItem>
            <SelectItem value="TP4">{getFilterLabel('TP4')}</SelectItem>
            <SelectItem value="TP5">{getFilterLabel('TP5')}</SelectItem>
            <SelectItem value="TP6">{getFilterLabel('TP6')}</SelectItem>
            <SelectItem value="TP7">{getFilterLabel('TP7')}</SelectItem>
            <SelectItem value="TP8">{getFilterLabel('TP8')}</SelectItem>
            <SelectItem value="TP9">{getFilterLabel('TP9')}</SelectItem>
            <SelectItem value="TP10">{getFilterLabel('TP10')}</SelectItem>
            <SelectItem value="CLOSED">{getFilterLabel('CLOSED')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
            {currentSignals.map((signal) => (
              <TableRow key={signal.id}>
                <TableCell className="flex items-center gap-2 font-medium">
                  <TokenImage token={signal.pair.split('/')[0]} />
                  {signal.pair}
                </TableCell>
                <TableCell className="font-medium">${signal.entryZone}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      signal.status === 'WITHIN_ENTRY_ZONE'
                        ? 'success'
                        : signal.status === 'CLOSED'
                          ? 'destructive'
                          : 'secondary'
                    }
                    className="w-fit text-nowrap text-center"
                  >
                    {status[signal.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <SignalGains targets={signal.targets} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(signal.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/api/share/${signal.id}`, '_blank')}
                      title="Share Signal Card"
                    >
                      <Share2 className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/signals/${signal.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSignal(signal);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <SignalDetailsSheet
                      signal={signal}
                      onEditClick={() => {
                        setSelectedSignal(signal);
                        setIsEditModalOpen(true);
                      }}
                      onDeleteClick={() => {
                        setSelectedSignal(signal);
                        setIsDeleteModalOpen(true);
                      }}
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
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      {selectedSignal && (
        <>
          <DeleteSignalModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedSignal(null);
            }}
            signalId={selectedSignal.id}
            onDelete={handleDelete}
          />
          <EditSignalModal
            signal={selectedSignal}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedSignal(null);
            }}
          />
        </>
      )}
    </div>
  );
}
