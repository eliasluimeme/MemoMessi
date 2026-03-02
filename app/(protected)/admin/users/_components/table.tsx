'use client';

import { useState } from 'react';

import { PlanType } from '@/types/subscription';
import { TUser } from '@/types/user';
import { $Enums } from '@prisma/client';
const SubscriptionStatus = $Enums.SubscriptionStatus;
type SubscriptionStatus = $Enums.SubscriptionStatus;
import { Search } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

import Pagination from './pagination';
import UsersTableActions, { PlanBadge, UserStatusBadge } from './users-table-actions';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function UsersTable({ users }: { users: TUser[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.subscriptions?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRows = filteredUsers.length;
  const totalPages = Math.ceil(totalRows / pageSize);

  // Calculate pagination indexes
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const getFilterLabel = (filter: string) => {
    switch (filter) {
      case 'all':
        return `All Users (${filteredUsers.length})`;
      case 'ACTIVE':
        return `Active (${users.filter((u) => u.subscriptions?.status === 'ACTIVE').length})`;
      case 'PENDING':
        return `Pending (${users.filter((u) => u.subscriptions?.status === 'PENDING').length})`;
      case 'SUSPENDED':
        return `Suspended (${users.filter((u) => u.subscriptions?.status === 'SUSPENDED').length})`;
      case 'EXPIRED':
        return `Expired (${users.filter((u) => u.subscriptions?.status === 'EXPIRED').length})`;
      default:
        return 'Filter by status';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
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
            <SelectItem value="ACTIVE">{getFilterLabel('ACTIVE')}</SelectItem>
            <SelectItem value="PENDING">{getFilterLabel('PENDING')}</SelectItem>
            <SelectItem value="SUSPENDED">{getFilterLabel('SUSPENDED')}</SelectItem>
            <SelectItem value="EXPIRED">{getFilterLabel('EXPIRED')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-2 font-medium">
                  <Avatar>
                    <AvatarImage src={user.image || ''} alt={user.fullName} />
                    <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                  </Avatar>
                  {user.fullName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>
                  {user.createdAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  <UserStatusBadge status={user.subscriptions?.status as SubscriptionStatus} />
                </TableCell>
                <TableCell>
                  <PlanBadge plan={user.subscriptions?.plan as PlanType} />
                </TableCell>
                <TableCell className="text-right">
                  <UsersTableActions user={user} />
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
    </div>
  );
}
